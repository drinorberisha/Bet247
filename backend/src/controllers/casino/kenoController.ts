import { Request, Response } from 'express';
import { DatabaseService } from '../../services/DatabaseService';
import CasinoGame from '../../models/CasinoGame';

const dbService = new DatabaseService();

export const startGame = async (req: Request, res: Response) => {
  try {
    const { betAmount } = req.body;
    const userId = req.user?.id;

    // Validate user and bet amount
    const user = await dbService.users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.balance < betAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Create a new game record
    const gameId = `keno_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const game = await CasinoGame.create({
      gameId,
      userId,
      gameType: 'keno',
      betAmount,
      status: 'active',
      createdAt: new Date(),
      gameData: {
        initialBet: betAmount,
      }
    });

    // Deduct bet amount from user balance
    await dbService.users.updateBalance(userId, -betAmount);
    
    res.json({ 
      success: true,
      gameId: game.gameId,
      newBalance: user.balance - betAmount
    });

  } catch (error) {
    console.error('Error starting keno game:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error starting game' 
    });
  }
};

export const cashoutGame = async (req: Request, res: Response) => {
  try {
    const { gameId, winAmount } = req.body;
    const userId = req.user?.id;

    // Validate the game exists and belongs to the user
    const game = await CasinoGame.findOne({ gameId, userId });
    if (!game) {
      return res.status(404).json({ 
        success: false,
        message: 'Game not found' 
      });
    }

    if (game.status !== 'active') {
      return res.status(400).json({ 
        success: false,
        message: 'Game is not active' 
      });
    }

    // Update game status
    game.status = 'completed';
    game.result = winAmount > game.betAmount ? 'win' : 'loss';
    game.winAmount = winAmount;
    game.completedAt = new Date();
    await game.save();

    // Update user balance with winnings
    const user = await dbService.users.updateBalance(userId, winAmount);
    
    res.json({ 
      success: true,
      newBalance: user?.balance,
      gameResult: {
        gameId: game.gameId,
        betAmount: game.betAmount,
        winAmount,
        profit: winAmount - game.betAmount,
        result: game.result
      }
    });

  } catch (error) {
    console.error('Error processing keno cashout:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error processing cashout' 
    });
  }
};

export const getGameHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const games = await CasinoGame.find({ 
      userId, 
      gameType: 'keno' 
    })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

    const total = await CasinoGame.countDocuments({ 
      userId, 
      gameType: 'keno' 
    });

    res.json({
      success: true,
      games,
      pagination: {
        current: page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching keno history:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching game history' 
    });
  }
}; 