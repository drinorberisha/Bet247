import axios from 'axios';
import config from '../config/config';
import { IMatch, Match } from '../models/Match';

const ODDS_API_HOST = 'https://api.the-odds-api.com/v4';

export interface Sport {
  key: string;
  group: string;
  title: string;
  description: string;
  active: boolean;
  has_outrights: boolean;
}

export interface Outcome {
  name: string;
  price: number;
}

export interface Market {
  key: string;
  outcomes: Outcome[];
}

export interface Bookmaker {
  key: string;
  title: string;
  last_update: string;
  markets: Market[];
}

export interface Match {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
}

interface OddsParams {
  regions?: string;
  markets?: string;
  oddsFormat?: 'decimal' | 'american';
  dateFormat?: 'iso' | 'unix';
}

export class OddsApiService {
  private API_KEY: string;
  private BASE_URL = 'https://api.the-odds-api.com/v4';

  constructor() {
    this.API_KEY = process.env.ODDS_API_KEY || '';
    if (!this.API_KEY) {
      console.error('ODDS_API_KEY is not set in environment variables');
    }
  }

  async getSupportedSports(all: boolean = false): Promise<Sport[]> {
    try {
      const response = await axios.get(`${this.BASE_URL}/sports`, {
        params: {
          apiKey: this.API_KEY,
          all: all
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching sports:', error);
      throw error;
    }
  }

  async getMatches(sportKey: string, options?: any): Promise<IMatch[]> {
    if (!this.API_KEY) {
      throw new Error('ODDS_API_KEY is not configured');
    }

    try {
      const queryParams = new URLSearchParams({
        apiKey: this.API_KEY,
        ...(options || {})
      });

      const response = await fetch(
        `${this.BASE_URL}/sports/${sportKey}/scores/?${queryParams}`
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        console.error('Invalid API response format:', data);
        return [];
      }
      
      return this.transformMatches(data);
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  }

  async getUpcomingMatches(sportKey: string): Promise<IMatch[]> {
    const matches = await this.getMatches(sportKey, {
      regions: 'eu',
      markets: 'h2h,spreads,totals',
      oddsFormat: 'decimal'
    });
    return matches;
  }

  async getLiveMatches(sportKey: string): Promise<IMatch[]> {
    const matches = await this.getMatches(sportKey, {
      regions: 'eu',
      markets: 'h2h',
      oddsFormat: 'decimal'
    });
    return matches;
  }

  async getMatchResult(sportKey: string, matchId: string): Promise<{ home: number; away: number } | null> {
    if (!this.API_KEY) {
      throw new Error('ODDS_API_KEY is not configured');
    }

    try {
      const response = await fetch(
        `${this.BASE_URL}/sports/${sportKey}/scores/${matchId}?apiKey=${this.API_KEY}`
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      return this.transformScores(data);
    } catch (error) {
      console.error('Error fetching match result:', error);
      return null;
    }
  }

  private transformMatches(apiMatches: any[]): IMatch[] {
    return apiMatches.map(match => {
      const matchData = {
        externalId: match.id,
        sportKey: match.sport_key,
        sportTitle: match.sport_title,
        homeTeam: match.home_team,
        awayTeam: match.away_team,
        commenceTime: new Date(match.commence_time),
        status: this.determineMatchStatus(match.commence_time),
        scores: match.scores ? {
          home: Number(match.scores.home),
          away: Number(match.scores.away)
        } : undefined,
        odds: match.bookmakers?.[0]?.markets?.[0]?.outcomes ? {
          homeWin: Number(match.bookmakers[0].markets[0].outcomes[0].price),
          awayWin: Number(match.bookmakers[0].markets[0].outcomes[1].price),
          draw: match.bookmakers[0].markets[0].outcomes[2] ? 
            Number(match.bookmakers[0].markets[0].outcomes[2].price) : undefined
        } : undefined,
        tier: 'medium', // or implement determineTier logic
        result: null,
        lastUpdated: new Date()
      };

      // Create a new document without saving it
      return Match.create(matchData) as unknown as IMatch;
    });
  }

  private transformScores(matchData: any): { home: number; away: number } | null {
    if (!matchData.scores) return null;
    return {
      home: Number(matchData.scores.home),
      away: Number(matchData.scores.away)
    };
  }

  private determineMatchStatus(match: any): 'upcoming' | 'live' | 'ended' {
    if (match.completed) return 'ended';
    if (match.in_play) return 'live';
    return 'upcoming';
  }

  private determineTier(match: any): string | null {
    // Implementation of determineTier method
    return null;
  }
} 