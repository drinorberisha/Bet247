import { Request, Response } from 'express';
import { Match } from '../models/Match';
import User from '../models/User';
import Bet from '../models/Bet';
import Selection from '../models/Selection';
import mongoose from 'mongoose';

const calculateCashoutAmount = (bet: any) => {
  const selections = bet.selections;
  const wonSelections = selections.filter((s: any) => s.status === 'won');
  const pendingSelections = selections.filter((s: any) => s.status === 'pending');
  const lostSelections = selections.filter((s: any) => s.status === 'lost');

  // If any selection is lost, no cashout possible
  if (lostSelections.length > 0) {
    throw new Error('Bet contains lost selections');
  }

  // Calculate partial odds based on won selections
  const partialOdds = wonSelections.reduce((acc: number, selection: any) => {
    return acc * selection.odds;
  }, 1);

  return {
    wonSelections,
    pendingSelections,
    partialOdds
  };
};

const calculateFinalCashoutAmount = (stake: number, partialOdds: number): number => {
  // Basic cashout calculation
  // You can make this more sophisticated by adding margin, time factors, etc.
  const baseAmount = stake * partialOdds;
  const cashoutPercentage = 0.75; // Offering 75% of potential win for cashout
  return Number((baseAmount * cashoutPercentage).toFixed(2));
};

export const placeBet = async (req: Request, res: Response) => {
  try {
    const { betType, amount, selections, totalOdds, potentialWin } = req.body;
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Find the user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has enough balance
    if (user.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Fetch match times for each selection
    const selectionsWithMatchTime = await Promise.all(selections.map(async (selection) => {
      // Extract match identifier from the event string
      const [homeTeam, awayTeam] = selection.event.split(' vs ');
      
      // Find the corresponding match
      const match = await Match.findOne({
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        sportKey: selection.sportKey
      });

      console.log('Found match:', match); // Debug log

      return {
        sportKey: selection.sportKey,
        event: selection.event,
        market: selection.market,
        selection: selection.selection,
        odds: selection.odds,
        status: 'pending',
        matchTime: match?.commenceTime || new Date(selection.commenceTime),
        commenceTime: match?.commenceTime || new Date(selection.commenceTime)
      };
    }));

    // Create the selections
    const createdSelections = await Selection.create(selectionsWithMatchTime);
    
    // Get the selection IDs
    const selectionIds = Array.isArray(createdSelections) 
      ? createdSelections.map(s => s._id)
      : [createdSelections._id];

    // Create the bet
    const bet = await Bet.create({
      user: user._id,
      betType,
      selections: selectionIds,
      amount,
      totalOdds,
      potentialWin,
      status: 'pending',
      cashedOut: {
        wonSelections: [],
        remainingSelections: []
      }
    });

    // Update user balance
    user.balance -= amount;
    await user.save();

    // Populate the selections in the response
    const populatedBet = await bet.populate('selections');

    res.status(201).json({
      success: true,
      message: 'Bet placed successfully',
      bet: populatedBet,
      newBalance: user.balance
    });

  } catch (error: any) {
    console.error('Error placing bet:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error placing bet'
    });
  }
};

export const getUserBets = async (req: Request, res: Response) => {
  try {
    const bets = await Bet.find({ user: req.user._id })
      .populate('selections')
      .sort({ createdAt: -1 });
    
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

export const cashoutBet = async (req: Request, res: Response) => {
  try {
    const { betId } = req.params;
    const userId = req.user?._id;

    // Validate user and bet ID
    if (!userId || !betId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request parameters'
      });
    }

    // Find the bet and user
    const bet = await Bet.findById(betId).populate('selections');
    const user = await User.findById(userId);

    if (!bet || !user) {
      return res.status(404).json({
        success: false,
        message: 'Bet or user not found'
      });
    }

    // Verify bet belongs to user
    if (bet.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to bet'
      });
    }

    // Check if bet is eligible for cashout
    if (bet.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Bet is not eligible for cashout'
      });
    }

    // Calculate cashout amount
    const { wonSelections, pendingSelections, partialOdds } = calculateCashoutAmount(bet);
    const finalAmount = calculateFinalCashoutAmount(bet.amount, partialOdds);

    // Update bet status and details
    bet.status = 'cashed_out';
    bet.cashoutAmount = finalAmount;
    bet.cashoutTime = new Date();
    bet.cashoutDetails = {
      timestamp: new Date(),
      wonSelections: wonSelections.map(s => s._id),
      remainingSelections: pendingSelections.map(s => s._id),
      partialOdds
    };

    // Update user balance
    user.balance += finalAmount;

    // Save changes
    await bet.save();
    await user.save();

    // Populate bet data for response
    const populatedBet = await bet.populate('selections');

    res.status(200).json({
      success: true,
      message: 'Bet cashed out successfully',
      bet: populatedBet,
      cashoutAmount: finalAmount,
      newBalance: user.balance
    });

  } catch (error: any) {
    console.error('Cashout error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error processing cashout'
    });
  }
};

export const debugSettleBets = async (req: Request, res: Response) => {
  try {
    console.log('Starting manual bet settlement...');
    
    // Get all pending bets
    const pendingBets = await Bet.find({ status: 'pending' })
      .populate('selections');
    
    console.log(`Found ${pendingBets.length} pending bets`);

    for (const bet of pendingBets) {
      console.log(`Checking bet ${bet._id}:`);
      console.log('Selections:', bet.selections);
      
      // Check if all selections have results
      const allSelectionsSettled = bet.selections.every((selection: any) => 
        selection.status === 'won' || selection.status === 'lost'
      );

      console.log('All selections settled:', allSelectionsSettled);
      
      if (allSelectionsSettled) {
        // Calculate if bet is won (all selections won)
        const betWon = bet.selections.every((selection: any) => selection.status === 'won');
        
        // Update bet status
        bet.status = betWon ? 'won' : 'lost';
        await bet.save();
        
        console.log(`Bet ${bet._id} settled as ${bet.status}`);
      }
    }

    res.json({
      message: 'Manual bet settlement completed',
      processedBets: pendingBets.length
    });
  } catch (error) {
    console.error('Error in debug settle bets:', error);
    res.status(500).json({ message: 'Error settling bets' });
  }
};

export default {
  placeBet,
  getUserBets,
  getAllBets,
  getBetDetails,
  settleBet,
  getBetStats,
  cashoutBet,
  debugSettleBets
}; 