// User related interfaces
interface User {
  _id: string;
  username: string;
  email: string;
  balance: number;
  role: 'user' | 'admin' | 'superuser';
}

// Match related interfaces
interface Odds {
  homeWin: number;
  draw?: number;
  awayWin: number;
  lastUpdate?: string;
}

interface Market {
  key: string;
  outcomes: Array<{
    name: string;
    price: number;
    point?: number;
  }>;
}

interface Match {
  _id: string;
  sportKey: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: string;
  odds: Odds;
  markets?: Market[];
  status: 'upcoming' | 'live' | 'ended';
  result?: {
    homeScore?: number;
    awayScore?: number;
    winner?: string;
  };
  league?: string;
  lastUpdate: string;
}

// Betting related interfaces
interface Selection {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  type: string;
  odds: number;
  sportKey: string;
  market: string;
  status: string;
  event: string;
  commenceTime: string;
}

interface Bet {
  _id?: string;
  id?: string;
  betType: "single" | "multiple";
  selections: Selection[];
  totalOdds: number;
  potentialWin: number;
  status?: string;
  createdAt?: Date;
  settledAt?: Date;
  cashoutAmount?: number;
  amount: number;
  stake?: number;
  homeTeam?: string;
  awayTeam?: string;
}

// Transaction related interfaces
interface Transaction {
  _id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'bet' | 'win' | 'bonus';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  reference?: string;
  createdAt: string;
  updatedAt: string;
}

// Notification interface
interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  title?: string;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

// Sport configuration interfaces
interface LeagueNames {
  [key: string]: string;
}

interface SportConfig {
  [key: string]: string[];
}

// Response interfaces
interface PlaceBetResponse {
  success: boolean;
  newBalance: number;
  message?: string;
}

export type {
  User,
  Match,
  Odds,
  Market,
  Selection,
  Bet,
  Transaction,
  Notification,
  LeagueNames,
  SportConfig,
  PlaceBetResponse
};