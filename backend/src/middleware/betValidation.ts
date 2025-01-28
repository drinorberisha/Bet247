import { Request, Response, NextFunction } from 'express';
import { BET_LIMITS, BetType } from '../config/constants';

interface BetSelection {
  odds: number;
  // add other selection properties as needed
}

interface BetRequest {
  type: BetType;
  amount: number;
  selections: BetSelection[];
}

export const validateBet = (req: Request<{}, {}, BetRequest>, res: Response, next: NextFunction) => {
  const { type, amount, selections } = req.body;

  // Validate selections array first
  if (!Array.isArray(selections) || selections.length === 0) {
    return res.status(400).json({ message: 'At least one selection is required' });
  }

  const limits = BET_LIMITS[type];

  // Type-specific validations
  if (type === 'SINGLE' || type === 'MULTIPLE') {
    // Validate amount
    if (amount < limits.minAmount || amount > limits.maxAmount) {
      return res.status(400).json({
        message: `Amount must be between ${limits.minAmount} and ${limits.maxAmount}`
      });
    }

    // Validate selections count for multiple bets
    if (type === 'MULTIPLE' && 'maxSelections' in limits) {
      if (selections.length > limits.maxSelections) {
        return res.status(400).json({
          message: `Maximum ${limits.maxSelections} selections allowed for multiple bets`
        });
      }
    }
  }

  next();
};

export const validateCashout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { betId } = req.params;
    
    if (!betId) {
      return res.status(400).json({
        success: false,
        message: 'Bet ID is required'
      });
    }

    next();
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Validation error'
    });
  }
}; 