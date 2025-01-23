import mongoose, { Document } from 'mongoose';

export interface IBet extends Document {
  user: mongoose.Types.ObjectId;
  betType: 'single' | 'multiple';
  selections: mongoose.Types.ObjectId[];
  amount: number;
  totalOdds: number;
  potentialWin: number;
  status: 'pending' | 'won' | 'lost' | 'cancelled' | 'cashed_out';
  createdAt: Date;
  settledAt?: Date;
  cashedOut?: {
    amount: number;
    timestamp: Date;
    wonSelections: mongoose.Types.ObjectId[];
    remainingSelections: mongoose.Types.ObjectId[];
    partialOdds: number;
  };
}

const betSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  betType: {
    type: String,
    enum: ['single', 'multiple'],
    required: true
  },
  selections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Selection',
    required: true
  }],
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  totalOdds: {
    type: Number,
    required: true
  },
  potentialWin: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'won', 'lost', 'cancelled', 'cashed_out'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  settledAt: Date,
  cashedOut: {
    amount: Number,
    timestamp: Date,
    wonSelections: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Selection'
    }],
    remainingSelections: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Selection'
    }],
    partialOdds: Number
  }
});

betSchema.methods.isEligibleForCashout = async function() {
  const CASHOUT_CUTOFF_MINUTES = 5;
  
  const populatedBet = await this.populate('selections');
  
  const selectionsByStatus = populatedBet.selections.reduce((acc: any, selection: any) => {
    if (!acc[selection.status]) {
      acc[selection.status] = [];
    }
    acc[selection.status].push(selection);
    return acc;
  }, {});
// Conditions for cashout eligibility:
  // 1. Bet must be pending
  // 2. Must have at least one won selection
  // 3. All remaining selections must not have started yet
  // 4. Must be more than CASHOUT_CUTOFF_MINUTES before next match
  const isEligible = 
    this.status === 'pending' &&
    selectionsByStatus['won']?.length > 0 &&
    selectionsByStatus['pending']?.length > 0 &&
    selectionsByStatus['pending'].every((selection: any) => {
      const timeUntilMatch = (new Date(selection.matchTime).getTime() - Date.now()) / (1000 * 60);
      return timeUntilMatch > CASHOUT_CUTOFF_MINUTES;
    });

  return {
    isEligible,
    wonSelections: selectionsByStatus['won'] || [],
    pendingSelections: selectionsByStatus['pending'] || []
  };
};

betSchema.methods.calculateCashoutAmount = function(wonSelections: any[]) {
  const CASHOUT_FEE_PERCENTAGE = 0.05;
  
  const partialOdds = wonSelections.reduce((total, selection) => total * selection.odds, 1);
  
  const rawAmount = this.amount * partialOdds;
  
  const feeAmount = rawAmount * CASHOUT_FEE_PERCENTAGE;
  const finalAmount = rawAmount - feeAmount;
  
  return {
    rawAmount,
    feeAmount,
    finalAmount,
    partialOdds
  };
};

export default mongoose.model<IBet>('Bet', betSchema); 