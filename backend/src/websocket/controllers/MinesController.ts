import { Server } from 'http';
import { WebSocketServer } from 'ws';
import { WebSocketHandler } from '../index';
import { DatabaseService } from '../../services/DatabaseService';
import MinesGame from '../../games/mines/MinesGame';
import { authenticateToken } from '../../middleware/auth';
import { WebSocketMessage, WebSocketClient } from '../../types/websocket';

interface MinesGameSession {
  userId: string;
  game: MinesGame;
}

export class MinesController {
  private activeSessions: Map<string, MinesGameSession>;
  private wsHandler: WebSocketHandler;
  private dbService: DatabaseService;
  private wss: WebSocketServer;

  constructor(
    wsHandler: WebSocketHandler,
    server: Server,
    dbService: DatabaseService
  ) {
    this.activeSessions = new Map();
    this.wsHandler = wsHandler;
    this.dbService = dbService;
    this.wss = this.wsHandler.getWss();
    this.initialize();
  }

  private initialize() {
    this.wss.on('connection', (ws: WebSocketClient, request) => {
      // Handle new connections
      ws.on('message', async (message: string) => {
        try {
          const parsedMessage: WebSocketMessage = JSON.parse(message);
          await this.handleMessage(ws, parsedMessage);
        } catch (error) {
          console.error('Error handling message:', error);
          ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
        }
      });

      ws.on('close', () => {
        // Cleanup when connection closes
        this.handleDisconnect(ws);
      });
    });
  }

  private async handleMessage(ws: WebSocketClient, message: WebSocketMessage) {
    if (!ws.userId) {
      ws.send(JSON.stringify({ type: 'error', message: 'Not authenticated' }));
      return;
    }

    switch (message.action) {
      case 'start_game':
        await this.handleStartGame(ws, message.data);
        break;
      case 'reveal_tile':
        await this.handleRevealTile(ws, message.data);
        break;
      case 'cashout':
        await this.handleCashout(ws, message.data);
        break;
      default:
        ws.send(JSON.stringify({ 
          type: 'error', 
          message: `Unknown action: ${message.action}` 
        }));
    }
  }

  private handleDisconnect(ws: WebSocketClient) {
    if (ws.userId) {
      // Cleanup any active game session
      this.activeSessions.delete(ws.userId);
    }
  }

  private async handleStartGame(ws: WebSocketClient, data: any) {
    try {
      console.log('Starting game with data:', data);
      const { betAmount, minesCount } = data;

      // Validate bet amount and mines count
      if (!this.validateGameParams(betAmount, minesCount)) {
        throw new Error('Invalid game parameters');
      }

      // Check user balance
      const user = await this.dbService.users.findById(ws.userId);
      if (!user || user.balance < betAmount) {
        throw new Error('Insufficient balance');
      }

      // Create new game session
      const gameId = this.generateGameId();
      const game = new MinesGame(gameId, betAmount, minesCount);
      
      // Store game session
      this.activeSessions.set(gameId, {
        userId: ws.userId,
        game
      });

      // Deduct bet amount from user balance
      await this.dbService.users.updateBalance(ws.userId, -betAmount);

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
      const session = this.activeSessions.get(gameId);

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
        this.activeSessions.delete(gameId);
        await this.saveGameHistory(ws.userId, gameId, 'loss', 0);
      }

    } catch (error: any) {
      this.sendError(ws, error.message);
    }
  }

  private async handleCashout(ws: WebSocketClient, data: any) {
    try {
      const { gameId } = data;
      const session = this.activeSessions.get(gameId);

      if (!session || session.userId !== ws.userId) {
        throw new Error('Invalid game session');
      }

      const winAmount = session.game.cashout();
      
      // Update user balance
      await this.dbService.users.updateBalance(ws.userId, winAmount);
      
      // Save game history
      await this.saveGameHistory(ws.userId, gameId, 'win', winAmount);

      // Cleanup game session
      this.activeSessions.delete(gameId);

      const user = await this.dbService.users.findById(ws.userId);

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
    await this.dbService.gameHistory.create({
      userId,
      gameId,
      gameType: 'mines',
      result,
      amount,
      timestamp: new Date()
    });
  }
} 