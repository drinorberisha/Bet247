import { Request, Response } from 'express';
import { DatabaseService } from '../../services/DatabaseService';
import CasinoGame from '../../models/CasinoGame';

const dbService = new DatabaseService();

// Define slot symbols and their properties
const SLOT_SYMBOLS = [
  { id: 1, name: 'SEVEN', value: 50, image: '/images/slots/seven.png' },
  { id: 2, name: 'BAR', value: 20, image: '/images/slots/bar.png' },
  { id: 3, name: 'BELL', value: 15, image: '/images/slots/bell.png' },
  { id: 4, name: 'CHERRY', value: 10, image: '/images/slots/cherry.png' },
  { id: 5, name: 'LEMON', value: 5, image: '/images/slots/lemon.png' },
  { id: 6, name: 'ORANGE', value: 5, image: '/images/slots/orange.png' },
  { id: 7, name: 'PLUM', value: 5, image: '/images/slots/plum.png' },
  { id: 8, name: 'GRAPE', value: 5, image: '/images/slots/grape.png' },
];

// Define winning paylines
const PAYLINES = [
  [1, 1, 1, 1, 1], // Middle horizontal
  [0, 0, 0, 0, 0], // Top horizontal
  [2, 2, 2, 2, 2], // Bottom horizontal
  [0, 1, 2, 1, 0], // V shape
  [2, 1, 0, 1, 2], // Inverted V shape
  // Add more paylines as needed
];

export const spin = async (req: Request, res: Response) => {
  try {
    const { betAmount } = req.body;
    // @ts-ignore - user added by auth middleware
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    console.log('[SLOTS-CONTROLLER] Processing spin:', {
      userId,
      betAmount
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

    // Generate random reels
    const reels = Array(5).fill(null).map(() => 
      Array(3).fill(null).map(() => 
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]
      )
    );

    // Calculate wins
    const { winAmount, winningLines, multiplier } = calculateWin(reels, betAmount);

    // Create game record
    const gameId = `slots_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const game = await CasinoGame.create({
      gameId,
      userId,
      gameType: 'slots',
      betAmount,
      winAmount,
      status: 'completed',
      result: winAmount > 0 ? 'win' : 'loss',
      createdAt: new Date(),
      completedAt: new Date()
    });

    // Update user balance
    const balanceChange = winAmount - betAmount;
    const updatedUser = await dbService.users.updateBalance(userId, balanceChange);

    console.log('[SLOTS-CONTROLLER] Spin completed:', {
      gameId,
      previousBalance: user.balance,
      newBalance: updatedUser?.balance,
      betAmount,
      winAmount,
      multiplier
    });

    res.json({
      success: true,
      gameId: game.gameId,
      reels,
      winAmount,
      winningLines,
      multiplier,
      newBalance: updatedUser?.balance
    });

  } catch (error) {
    console.error('[SLOTS-CONTROLLER] Error processing spin:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing spin'
    });
  }
};

function calculateWin(reels: any[][], betAmount: number) {
  let totalWin = 0;
  let winningLines: number[] = [];
  let maxMultiplier = 1;

  // Check each payline
  PAYLINES.forEach((payline, index) => {
    const symbols = payline.map((row, col) => reels[col][row]);
    const firstSymbol = symbols[0];
    
    // Count matching symbols from left to right
    let matchCount = 1;
    for (let i = 1; i < symbols.length; i++) {
      if (symbols[i].id === firstSymbol.id) {
        matchCount++;
      } else {
        break;
      }
    }

    // Calculate win for this line
    if (matchCount >= 3) {
      const lineMultiplier = calculateLineMultiplier(matchCount);
      const lineWin = betAmount * lineMultiplier * firstSymbol.value;
      
      if (lineWin > 0) {
        totalWin += lineWin;
        winningLines.push(index);
        maxMultiplier = Math.max(maxMultiplier, lineMultiplier);
      }
    }
  });

  return {
    winAmount: totalWin,
    winningLines,
    multiplier: maxMultiplier
  };
}

function calculateLineMultiplier(matchCount: number): number {
  switch (matchCount) {
    case 3: return 2;
    case 4: return 5;
    case 5: return 10;
    default: return 1;
  }
} 