import { WebSocketServer } from 'ws';
import { Server } from 'http';
import MinesGame from '../../games/mines/MinesGame';
import { verifyToken } from '../../middleware/auth';
import { WebSocketMessage, WebSocketClient } from '../../types/websocket';
import { DatabaseService } from '../../services/DatabaseService';

interface MinesGameSession {
  userId: string;
  game: MinesGame;
}

class MinesController {
  private games: Map<string, MinesGameSession>;
  private db: DatabaseService;

  constructor(wss: WebSocketServer, server: Server, db: DatabaseService) {
    this.games = new Map();
    this.db = db;

    wss.on('connection', async (ws: WebSocketClient, request) => {
      try {
        // Verify token from request headers
        const token = request.headers['authorization']?.split(' ')[1];
        if (!token) {
          ws.close(4001, 'Unauthorized');
          return;
        }

        const user = await verifyToken(token);
        if (!user) {
          ws.close(4001, 'Unauthorized');
          return;
        }

        ws.userId = user.id;

        ws.on('message', async (message: string) => {
          try {
            const data: WebSocketMessage = JSON.parse(message);
            await this.handleMessage(ws, data);
          } catch (error) {
            this.sendError(ws, 'Invalid message format');
          }
        });

      } catch (error) {
        ws.close(4001, 'Unauthorized');
      }
    });
  }

  private async handleMessage(ws: WebSocketClient, message: WebSocketMessage) {
    switch (message.action) {
      case 'mines:start':
        await this.handleGameStart(ws, message.data);
        break;
      case 'mines:reveal':
        await this.handleRevealTile(ws, message.data);
        break;
      case 'mines:cashout':
        await this.handleCashout(ws, message.data);
        break;
      default:
        this.sendError(ws, 'Unknown action');
    }
  }

  private async handleGameStart(ws: WebSocketClient, data: any) {
    try {
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

      // Send success response
      ws.send(JSON.stringify({
        type: 'mines:start',
        success: true,
        data: {
          gameId,
          betAmount,
          minesCount,
          newBalance: user.balance - betAmount
        }
      }));

    } catch (error: any) {
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

      const result = session.game.revealTile(tileIndex);

      ws.send(JSON.stringify({
        type: 'mines:reveal',
        success: true,
        data: {
          tileIndex,
          ...result
        }
      }));

      if (result.isMine) {
        // Game over - cleanup
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
    ws.send(JSON.stringify({
      type: 'error',
      message
    }));
  }

  private validateGameParams(betAmount: number, minesCount: number): boolean {
    return (
      typeof betAmount === 'number' &&
      typeof minesCount === 'number' &&
      betAmount >= 0.1 &&
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

export default MinesController; 