import { WebSocketServer } from 'ws';
import { Server } from 'http';
import MinesGame from '../../games/mines/MinesGame';
import { verifyToken } from '../../middleware/auth';
import { WebSocketMessage, WebSocketClient } from '../../types/websocket';
import { DatabaseService } from '../../services/DatabaseService';
import { WebSocketHandler } from './WebSocketHandler';

interface MinesGameSession {
  userId: string;
  game: MinesGame;
}

export class MinesController {
  private games: Map<string, MinesGameSession>;
  private db: DatabaseService;

  constructor(wsHandler: WebSocketHandler, server: Server, db: DatabaseService) {
    this.games = new Map();
    this.db = db;

    // Use getWss() instead of getServer()
    const wss = wsHandler.getWss();
    
    wss.on('connection', (ws: WebSocketClient) => {
      // Only handle messages if the connection is authenticated
      if (!ws.isAuthenticated) return;

      ws.on('message', async (message: string) => {
        try {
          const data: WebSocketMessage = JSON.parse(message);
          await this.handleMessage(ws, data);
        } catch (error) {
          this.sendError(ws, 'Invalid message format');
        }
      });
    });
  }

  private async handleMessage(ws: WebSocketClient, data: WebSocketMessage) {
    if (!ws.userId) return;

    console.log('Received WebSocket message:', {
      action: data.action,
      userId: ws.userId,
      data: data.data
    });

    switch (data.action) {
      case 'mines:start':
        await this.handleGameStart(ws, data.data);
        break;
      case 'mines:reveal':
        await this.handleRevealTile(ws, data.data);
        break;
      case 'mines:cashout':
        await this.handleCashout(ws, data.data);
        break;
      default:
        console.log('Unknown action received:', data.action);
        this.sendError(ws, 'Unknown action');
    }
  }

  private async handleGameStart(ws: WebSocketClient, data: any) {
    try {
      console.log('Starting game with data:', data);
      const { betAmount, minesCount } = data;

      // Validate bet amount and mines count
      if (!this.validateGameParams(betAmount, minesCount)) {
        throw new Error('Invalid game parameters');
      }

      // Check user balance
      const user = await this.db.users.findById(ws.userId);
      if (!user || user.balance < betAmount) {
        throw new Error('Insufficient balance');
      }

      // Create new game session
      const gameId = this.generateGameId();
      const game = new MinesGame(gameId, betAmount, minesCount);
      
      // Store game session
      this.games.set(gameId, {
        userId: ws.userId,
        game
      });

      // Deduct bet amount from user balance
      await this.db.users.updateBalance(ws.userId, -betAmount);

      const response = {
        type: 'mines:start',
        success: true,
        data: {
          gameId,
          betAmount,
          minesCount,
          message: 'Game started successfully'
        }
      };

      console.log('Sending response to client:', response);
      ws.send(JSON.stringify(response));

    } catch (error: any) {
      console.error('Error in handleGameStart:', error);
      this.sendError(ws, error.message);
    }
  }

  private async handleRevealTile(ws: WebSocketClient, data: any) {
    try {
      const { gameId, tileIndex } = data;
      const session = this.games.get(gameId);

      if (!session || session.userId !== ws.userId) {
        throw new Error('Invalid game session');
      }

      // Get the result of revealing this tile
      const result = session.game.revealTile(tileIndex);

      // Send the immediate result for this tile
      ws.send(JSON.stringify({
        type: 'mines:reveal',
        success: true,
        data: {
          tileIndex,
          isMine: result.isMine,
          currentMultiplier: result.currentMultiplier,
          currentProfit: result.currentProfit
        }
      }));

      // If it was a mine, game is over - reveal all tiles and cleanup
      if (result.isMine) {
        const gameState = session.game.getState();
        
        // Send full grid reveal
        ws.send(JSON.stringify({
          type: 'mines:gameover',
          data: {
            minePositions: gameState.minePositions,
            revealedPositions: gameState.revealedPositions
          }
        }));

        // Cleanup and save game history
        this.games.delete(gameId);
        await this.saveGameHistory(ws.userId, gameId, 'loss', 0);
      }

    } catch (error: any) {
      this.sendError(ws, error.message);
    }
  }

  private async handleCashout(ws: WebSocketClient, data: any) {
    try {
      const { gameId } = data;
      const session = this.games.get(gameId);

      if (!session || session.userId !== ws.userId) {
        throw new Error('Invalid game session');
      }

      const winAmount = session.game.cashout();
      
      // Update user balance
      await this.db.users.updateBalance(ws.userId, winAmount);
      
      // Save game history
      await this.saveGameHistory(ws.userId, gameId, 'win', winAmount);

      // Cleanup game session
      this.games.delete(gameId);

      const user = await this.db.users.findById(ws.userId);

      ws.send(JSON.stringify({
        type: 'mines:cashout',
        success: true,
        data: {
          winAmount,
          newBalance: user?.balance
        }
      }));

    } catch (error: any) {
      this.sendError(ws, error.message);
    }
  }

  private sendError(ws: WebSocketClient, message: string) {
    const errorResponse = {
      type: 'error',
      success: false,
      message
    };
    console.log('Sending error to client:', errorResponse);
    ws.send(JSON.stringify(errorResponse));
  }

  private validateGameParams(betAmount: number, minesCount: number): boolean {
    return (
      typeof betAmount === 'number' &&
      typeof minesCount === 'number' &&
      betAmount > 0 &&
      minesCount >= 1 &&
      minesCount <= 24
    );
  }

  private generateGameId(): string {
    return `mines_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async saveGameHistory(
    userId: string,
    gameId: string,
    result: 'win' | 'loss',
    amount: number
  ) {
    await this.db.gameHistory.create({
      userId,
      gameId,
      gameType: 'mines',
      result,
      amount,
      timestamp: new Date()
    });
  }
} 