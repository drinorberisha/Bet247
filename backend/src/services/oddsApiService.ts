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
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = 'https://api.the-odds-api.com/v4';
    this.apiKey = config.oddsApiKey || '';
    
    if (!this.apiKey) {
      throw new Error('ODDS_API_KEY environment variable is not set');
    }
  }

  async getSupportedSports(all: boolean = false): Promise<Sport[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/sports`, {
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

  async getMatches(sportKey: string): Promise<IMatch[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/sports/${sportKey}/odds`, {
        params: {
          apiKey: this.apiKey,
          regions: 'us,uk,eu',
          markets: 'h2h,spreads,totals',
          oddsFormat: 'decimal'
        }
      });

      // Log the raw API response
      console.log('Raw API response:', JSON.stringify(response.data[0], null, 2));

      // Transform the API response to match our schema
      const matches = response.data.map((match: any) => {
        const bookmaker = match.bookmakers?.[0];
        const h2hMarket = bookmaker?.markets?.find((m: any) => m.key === 'h2h');
        const spreadsMarket = bookmaker?.markets?.find((m: any) => m.key === 'spreads');
        const totalsMarket = bookmaker?.markets?.find((m: any) => m.key === 'totals');

        return {
          externalId: match.id,
          sportKey: match.sport_key,
          sportTitle: match.sport_title,
          homeTeam: match.home_team,
          awayTeam: match.away_team,
          commenceTime: new Date(match.commence_time),
          odds: {
            homeWin: h2hMarket?.outcomes?.find((o: any) => o.name === match.home_team)?.price || null,
            draw: h2hMarket?.outcomes?.find((o: any) => o.name === 'Draw')?.price || null,
            awayWin: h2hMarket?.outcomes?.find((o: any) => o.name === match.away_team)?.price || null
          },
          spreads: spreadsMarket?.outcomes?.map((o: any) => ({
            name: o.name,
            price: o.price,
            point: o.point
          })) || [],
          totals: totalsMarket?.outcomes?.map((o: any) => ({
            name: o.name,
            price: o.price,
            point: o.point
          })) || [],
          bookmaker: bookmaker ? {
            key: bookmaker.key,
            title: bookmaker.title,
            lastUpdate: new Date(bookmaker.last_update)
          } : null,
          status: 'upcoming',
          tier: 'high', // You might want to determine this based on the league/tournament
          lastUpdated: new Date()
        };
      });

      // Log the transformed match
      console.log('Transformed match:', JSON.stringify(matches[0], null, 2));

      return matches;
    } catch (error) {
      console.error('Error fetching matches:', error);
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

  async getMatchResult(sportKey: string, matchId: string) {
    try {
      // First try to get the scores endpoint
      const scoresUrl = `${this.baseUrl}/sports/${sportKey}/scores/`;
      const response = await axios.get(scoresUrl, {
        params: {
          apiKey: this.apiKey,
          daysFrom: 1 // Look back 1 day for recent results
        }
      });

      if (response.data && Array.isArray(response.data)) {
        const match = response.data.find((m: any) => m.id === matchId);
        
        if (match && match.completed && match.scores) {
          console.log('Found completed match with scores:', match);
          return match;
        }
      }

      // If no scores found, try the events endpoint
      const eventsUrl = `${this.baseUrl}/sports/${sportKey}/events/${matchId}`;
      const eventResponse = await axios.get(eventsUrl, {
        params: {
          apiKey: this.apiKey
        }
      });

      if (eventResponse.data && eventResponse.data.completed) {
        console.log('Found completed match from events:', eventResponse.data);
        return eventResponse.data;
      }

      console.log('Match not completed or no scores available');
      return null;

    } catch (error) {
      console.error('Error fetching match result:', error);
      throw error;
    }
  }
} 