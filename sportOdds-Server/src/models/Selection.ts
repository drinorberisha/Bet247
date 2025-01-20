import mongoose, { Document } from 'mongoose';

export interface ISelection extends Document {
  sport: string;
  event: string;
  market: string;
  selection: string;
  odds: number;
  status: 'pending' | 'won' | 'lost' | 'cancelled';
  result?: string;
  settledAt?: Date;
}

const selectionSchema = new mongoose.Schema({
  sport: {
    type: String,
    required: true
  },
  event: {
    type: String,
    required: true
  },
  market: {
    type: String,
    required: true
  },
  selection: {
    type: String,
    required: true
  },
  odds: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'won', 'lost', 'cancelled'],
    default: 'pending'
  },
  result: String,
  settledAt: Date
});

export default mongoose.model<ISelection>('Selection', selectionSchema); 