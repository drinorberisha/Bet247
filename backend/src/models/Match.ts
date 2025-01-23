import mongoose, { Schema, Document } from 'mongoose';

export interface IMatch extends Document {
  externalId: string;
  sportKey: string;
  sportTitle: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: Date;
  odds: {
    homeWin: number | null;
    draw: number | null;
    awayWin: number | null;
  };
  spreads: Array<{
    name: string;
    price: number;
    point: number;
  }> | null;
  totals: Array<{
    name: string;
    price: number;
    point: number;
  }> | null;
  bookmaker: {
    key: string;
    title: string;
    lastUpdate: Date;
  } | null;
  status: 'upcoming' | 'live' | 'ended';
  tier: 'high' | 'medium' | 'low';
  lastUpdated: Date;
  title?: string;
  formattedCommenceTime?: string;
  result?: '1' | 'X' | '2';
  scores?: {
    home: number;
    away: number;
  };
  settled?: boolean;
}

const matchSchema = new Schema<IMatch>({
  externalId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  sportKey: { 
    type: String, 
    required: true,
    index: true 
  },
  sportTitle: { 
    type: String, 
    required: true 
  },
  homeTeam: { 
    type: String, 
    required: true 
  },
  awayTeam: { 
    type: String, 
    required: true 
  },
  commenceTime: { 
    type: Date, 
    required: true,
    index: true 
  },
  odds: {
    homeWin: { type: Number, default: null },
    draw: { type: Number, default: null },
    awayWin: { type: Number, default: null }
  },
  spreads: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    point: { type: Number, required: true }
  }],
  totals: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    point: { type: Number, required: true }
  }],
  bookmaker: {
    key: { type: String, required: true },
    title: { type: String, required: true },
    lastUpdate: { type: Date, required: true }
  },
  status: {
    type: String,
    enum: ['upcoming', 'live', 'ended'],
    default: 'upcoming',
    index: true
  },
  tier: { 
    type: String, 
    required: true, 
    enum: ['high', 'medium', 'low'],
    index: true 
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now,
    index: true 
  },
  result: {
    type: String,
    enum: ['1', 'X', '2'],
    default: null
  },
  scores: {
    home: Number,
    away: Number
  },
  settled: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for querying matches by sport and status
matchSchema.index({ sportKey: 1, status: 1 });

// Index for querying upcoming matches
matchSchema.index({ status: 1, commenceTime: 1 });
matchSchema.index({ tier: 1, lastUpdated: 1 });

// Methods
matchSchema.methods.isStale = function(): boolean {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return this.lastUpdated < fiveMinutesAgo;
};

// Virtual for match title
matchSchema.virtual('title').get(function() {
  return `${this.homeTeam} vs ${this.awayTeam}`;
});

// Virtual for formatted commence time
matchSchema.virtual('formattedCommenceTime').get(function() {
  return this.commenceTime.toLocaleString();
});

// Ensure virtuals are included in JSON
matchSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

export const Match = mongoose.model<IMatch>('Match', matchSchema);