import { Request, Response, NextFunction } from 'express';

const VALIDATION_RULES = {
  single: {
    minAmount: 1,
    maxAmount: 1000,
    minOdds: 1.01,
    maxOdds: 1000,
    maxPotentialWin: 10000
  },
  multiple: {
    minAmount: 1,
    maxAmount: 500,
    minOdds: 1.01,
    maxOdds: 2000,
    maxSelections: 10,
    maxPotentialWin: 20000
  },
  cashout: {
    minWonSelections: 1,
    minPendingSelections: 1,
    minTimeBeforeMatch: 5, // minutes
  }
};

export const validateBet = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { betType, selections, amount } = req.body;

    if (!['single', 'multiple'].includes(betType)) {
      return res.status(400).json({
        message: 'Invalid bet type'
      });
    }

    const rules = VALIDATION_RULES[betType as keyof typeof VALIDATION_RULES];

    // Validate amount
    if (amount < rules.minAmount || amount > rules.maxAmount) {
      return res.status(400).json({
        message: `Bet amount must be between ${rules.minAmount} and ${rules.maxAmount}`
      });
    }

    // Validate selections
    if (!Array.isArray(selections)) {
      return res.status(400).json({
        message: 'Invalid selections format'
      });
    }

    if (betType === 'multiple' && selections.length > rules.maxSelections) {
      return res.status(400).json({
        message: `Maximum ${rules.maxSelections} selections allowed for multiple bets`
      });
    }

    // Validate odds for each selection
    for (const selection of selections) {
      if (selection.odds < rules.minOdds || selection.odds > rules.maxOdds) {
        return res.status(400).json({
          message: `Odds must be between ${rules.minOdds} and ${rules.maxOdds}`
        });
      }
    }

    // Calculate and validate potential win
    const totalOdds = selections.reduce((acc, sel) => acc * sel.odds, 1);
    const potentialWin = amount * totalOdds;

    if (potentialWin > rules.maxPotentialWin) {
      return res.status(400).json({
        message: `Maximum potential win cannot exceed ${rules.maxPotentialWin}`
      });
    }

    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid bet data' });
  }
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

    // Basic validation passed, proceed to controller
    next();
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Validation error'
    });
  }
}; 