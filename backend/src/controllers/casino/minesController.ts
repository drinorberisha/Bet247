import { Request, Response } from 'express';
import { DatabaseService } from '../../services/DatabaseService';

const dbService = new DatabaseService();

export const startGame = async (req: Request, res: Response) => {
  try {
    const { betAmount } = req.body;
    const userId = req.user?.id;

    // Validate user and bet amount
    const user = await dbService.users.findById(userId);
    if (!user || user.balance < betAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Deduct bet amount
    await dbService.users.updateBalance(userId, -betAmount);
    
    res.json({ 
      success: true,
      newBalance: user.balance - betAmount
    });

  } catch (error) {
    console.error('Error starting game:', error);
    res.status(500).json({ message: 'Error starting game' });
  }
};

export const cashoutGame = async (req: Request, res: Response) => {
  try {
    const { winAmount } = req.body;
    const userId = req.user?.id;

    // Update user balance with winnings
    const user = await dbService.users.updateBalance(userId, winAmount);
    
    res.json({ 
      success: true,
      newBalance: user?.balance
    });

  } catch (error) {
    console.error('Error processing cashout:', error);
    res.status(500).json({ message: 'Error processing cashout' });
  }
}; 