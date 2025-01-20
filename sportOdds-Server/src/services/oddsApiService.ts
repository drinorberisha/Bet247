import axios from 'axios';
import config from '../config/config';

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
  private apiKey: string;

  constructor() {
    this.apiKey = config.oddsApiKey || '';
    

    if (!this.apiKey) {
      throw new Error('ODDS_API_KEY environment variable is not set');
    }
  }

  async getSupportedSports(all: boolean = false): Promise<Sport[]> {
    try {
      const response = await axios.get(`${ODDS_API_HOST}/sports`, {
        params: {
          apiKey: this.apiKey,
          all: all
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching sports:', error);
      throw error;
    }
  }

  async getMatches(sportKey: string, params: OddsParams = {}): Promise<Match[]> {
    try {
      const defaultParams = {
        regions: 'eu',
        markets: 'h2h',
        oddsFormat: 'decimal',
        dateFormat: 'iso'
      };

      const queryParams = {
        apiKey: this.apiKey,
        ...defaultParams,
        ...params
      };

      console.log('Making API request with params:', {
        url: `${ODDS_API_HOST}/sports/${sportKey}/odds`,
        apiKeyPresent: !!this.apiKey,
        sport: sportKey,
        ...defaultParams
      });

      const response = await axios.get(`${ODDS_API_HOST}/sports/${sportKey}/odds`, {
        params: queryParams
      });

      console.log('API Response headers:', {
        remaining: response.headers['x-requests-remaining'],
        used: response.headers['x-requests-used']
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('API Error Details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers
        });
      }
      throw error;
    }
  }

  async getUpcomingMatches(sportKey: string): Promise<Match[]> {
    return this.getMatches(sportKey, {
      regions: 'eu',
      markets: 'h2h,spreads,totals',
      oddsFormat: 'decimal'
    });
  }

  async getLiveMatches(sportKey: string): Promise<Match[]> {
    return this.getMatches(sportKey, {
      regions: 'eu',
      markets: 'h2h',
      oddsFormat: 'decimal'
    });
  }
} 