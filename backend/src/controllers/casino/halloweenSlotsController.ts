import { Request, Response } from 'express';
import { DatabaseService } from '../../services/DatabaseService';
import CasinoGame from '../../models/CasinoGame';

const dbService = new DatabaseService();
export const startGame = async (req: Request, res: Response) => {
  try {
    const { betAmount } = req.body;
    // @ts-ignore - add type ignore since we know the middleware adds this
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: 'User not authenticated' 
      });
    }

    console.log('[HALLOWEEN-SLOTS] Starting game:', {
      userId,
      betAmount,
      betAmountType: typeof betAmount
    });

    // Validate user and bet amount
    const user = await dbService.users.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    if (user.balance < betAmount) {
      return res.status(400).json({ 
        success: false,
        message: 'Insufficient balance' 
      });
    }

    // Create a new game record
    const gameId = `halloween_slots_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const game = await CasinoGame.create({
      gameId,
      userId,
      gameType: 'halloween_slots',
      betAmount,
      status: 'active',
      createdAt: new Date()
    });

    // Deduct bet amount from user balance
    const updatedUser = await dbService.users.updateBalance(userId, -betAmount);

    console.log('[HALLOWEEN-SLOTS] Game started:', {
      gameId,
      previousBalance: user.balance,
      newBalance: updatedUser?.balance,
      betAmount
    });
    
    res.json({ 
      success: true,
      gameId: game.gameId,
      newBalance: updatedUser?.balance
    });

  } catch (error) {
    console.error('[HALLOWEEN-SLOTS] Error starting game:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const processWin = async (req: Request, res: Response) => {
  try {
    const { gameId, winAmount } = req.body;
    // @ts-ignore
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    console.log('[HALLOWEEN-SLOTS] Processing win:', {
      gameId,
      userId,
      winAmount
    });

    // Validate game exists and belongs to user
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
        message: 'Game already completed'
      });
    }

    // Update game status
    game.status = 'completed';
    game.winAmount = winAmount;
    game.completedAt = new Date();
    await game.save();

    // Update user balance
    const updatedUser = await dbService.users.updateBalance(userId, winAmount);

    console.log('[HALLOWEEN-SLOTS] Win processed:', {
      gameId,
      userId,
      winAmount,
      newBalance: updatedUser?.balance
    });

    res.json({
      success: true,
      newBalance: updatedUser?.balance
    });

  } catch (error) {
    console.error('[HALLOWEEN-SLOTS] Error processing win:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}; 