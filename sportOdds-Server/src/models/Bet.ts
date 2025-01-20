import mongoose, { Document } from 'mongoose';

export interface IBet extends Document {
  user: mongoose.Types.ObjectId;
  betType: 'single' | 'multiple';
  selections: mongoose.Types.ObjectId[];
  amount: number;
  totalOdds: number;
  potentialWin: number;
  status: 'pending' | 'won' | 'lost' | 'cancelled';
  createdAt: Date;
  settledAt?: Date;
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
    enum: ['pending', 'won', 'lost', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  settledAt: Date
});

export default mongoose.model<IBet>('Bet', betSchema); 