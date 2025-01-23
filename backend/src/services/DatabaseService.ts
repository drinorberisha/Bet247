import User from '../models/User';
import CasinoGame from '../models/CasinoGame';
import MinesGame from '../models/MinesGame';

class DatabaseService {
  users = {
    findById: async (userId: string) => {
      return await User.findById(userId);
    },
    updateBalance: async (userId: string, amount: number) => {
      return await User.findByIdAndUpdate(
        userId,
        { $inc: { balance: amount } },
        { new: true }
      );
    }
  };

  gameHistory = {
    create: async (data: {
      userId: string;
      gameId: string;
      gameType: string;
      result: 'win' | 'loss';
      amount: number;
      timestamp: Date;
    }) => {
      return await CasinoGame.create({
        userId: data.userId,
        gameId: data.gameId,
        gameType: data.gameType,
        betAmount: data.amount,
        status: 'completed',
        result: data.result,
        winAmount: data.result === 'win' ? data.amount : 0,
        createdAt: data.timestamp,
        completedAt: data.timestamp
      });
    }
  };

  minesGame = {
    create: async (data: {
      gameId: string;
      userId: string;
      betAmount: number;
      minesCount: number;
      grid: Array<{
        position: number;
        isMine: boolean;
        revealed: boolean;
      }>;
    }) => {
      return await MinesGame.create(data);
    }
  };
}

export { DatabaseService }; 