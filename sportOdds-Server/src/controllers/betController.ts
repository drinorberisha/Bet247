import { Request, Response } from 'express';
import Bet from '../models/Bet';
import Selection from '../models/Selection';
import User from '../models/User';
import mongoose from 'mongoose';

export const placeBet = async (req: Request, res: Response) => {
  try {
    const { betType, amount, selections, totalOdds, potentialWin } = req.body;
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Find the user again to ensure we have a fresh Mongoose document
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // First create the selections and get their IDs
    const createdSelections = await Selection.create(selections);
    
    // Get the ObjectIds from the created selections
    const selectionIds = Array.isArray(createdSelections) 
      ? createdSelections.map(s => s._id)
      : [createdSelections._id];

    // Create the bet with selection references
    const bet = await Bet.create({
      user: user._id,
      betType,
      amount,
      totalOdds,
      potentialWin,
      selections: selectionIds,
      status: 'pending'
    });

    // Update user balance
    user.balance -= amount;
    await user.save();

    // Populate bet data for response
    const populatedBet = await Bet.findById(bet._id).populate('selections');

    res.status(201).json({
      success: true,
      message: 'Bet placed successfully',
      bet: populatedBet,
      newBalance: user.balance
    });

  } catch (error: any) {
    console.error('Bet placement error:', error);
    res.status(400).json({ 
      success: false,
      message: error.message || 'Error placing bet' 
    });
  }
};

export const getUserBets = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.userId;
    
    const bets = await Bet.find({ user: userId })
      .populate('selections')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(bets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bets' });
  }
};

export const getAllBets = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const bets = await Bet.find()
      .populate('user', 'username')
      .populate('selections')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Bet.countDocuments();

    res.json({
      bets,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all bets' });
  }
};

export const getBetDetails = async (req: Request, res: Response) => {
  try {
    const { betId } = req.params;
    // @ts-ignore
    const userId = req.user.userId;

    const bet = await Bet.findOne({ 
      _id: betId, 
      user: userId 
    });

    if (!bet) {
      return res.status(404).json({ message: 'Bet not found' });
    }

    res.json(bet);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bet details' });
  }
};

export const settleBet = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { betId } = req.params;
    const { selectionResults } = req.body;

    const bet = await Bet.findById(betId).populate('selections');
    if (!bet) {
      throw new Error('Bet not found');
    }

    // Update each selection
    for (const result of selectionResults) {
      const selection = await Selection.findById(result.selectionId);
      if (selection) {
        selection.status = result.status;
        selection.result = result.result;
        selection.settledAt = new Date();
        await selection.save({ session });
      }
    }

    // Determine overall bet status for multiple bets
    if (bet.betType === 'multiple') {
      const allSelections = await Selection.find({ _id: { $in: bet.selections } });
      const hasLost = allSelections.some(s => s.status === 'lost');
      const allWon = allSelections.every(s => s.status === 'won');
      const allSettled = allSelections.every(s => s.status !== 'pending');

      if (allSettled) {
        bet.status = hasLost ? 'lost' : (allWon ? 'won' : 'cancelled');
        bet.settledAt = new Date();

        // Update user balance if bet is won
        if (bet.status === 'won') {
          const user = await User.findById(bet.user);
          if (user) {
            user.balance += bet.potentialWin;
            await user.save({ session });
          }
        }
      }
    }

    await bet.save({ session });
    await session.commitTransaction();

    res.json({
      message: 'Bet settled successfully',
      bet
    });

  } catch (error: any) {
    await session.abortTransaction();
    res.status(400).json({ 
      message: error.message || 'Error settling bet' 
    });
  } finally {
    session.endSession();
  }
};

export const getBetStats = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.userId;

    const stats = await Bet.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { 
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          totalWinnings: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'won'] },
                '$potentialWin',
                0
              ]
            }
          }
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bet statistics' });
  }
};

export default {
  placeBet,
  getUserBets,
  getAllBets,
  getBetDetails,
  settleBet,
  getBetStats
}; 