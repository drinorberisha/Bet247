import { Match, IMatch } from '../models/Match';
import { OddsApiService } from './oddsApiService';

export class MatchService {
  private oddsApiService: OddsApiService;
  private cache: Map<string, {data: IMatch[], timestamp: number}> = new Map();
  private CACHE_DURATION = {
    high: 30 * 1000,    // 30 seconds
    medium: 5 * 60 * 1000,  // 5 minutes
    low: 60 * 60 * 1000     // 1 hour
  };
  private requestQueue: Map<string, Promise<void>> = new Map();
  private rateLimitDelay = 1000; // 1 second between requests

  constructor() {
    this.oddsApiService = new OddsApiService();
  }

  async getMatches(sportKey: string): Promise<IMatch[]> {
    try {
      const matches = await this.oddsApiService.getMatches(sportKey);
      return matches;
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  }

  private determineTier(match: IMatch): 'high' | 'medium' | 'low' {
    const now = new Date();
    const matchTime = new Date(match.commenceTime);
    const diffInHours = (matchTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (match.status === 'live' || diffInHours <= 0.5) return 'high';
    if (diffInHours <= 24) return 'medium';
    return 'low';
  }

  async getMatchesBySport(sportKey: string): Promise<IMatch[]> {
    return Match.find({ sportKey }).sort({ commenceTime: 1 });
  }

  async getLiveMatches() {
    return Match.find({ status: 'live' }).sort({ lastUpdated: -1 });
  }


  async getUpcomingMatches(): Promise<IMatch[]> {
    const now = new Date();
    return Match.find({
      status: 'upcoming',
      commenceTime: { $gt: now }
    }).sort({ commenceTime: 1 });
  }

  private async retryOperation<T>(
    operation: () => Promise<T>,
    retries = 3,
    delay = 1000
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryOperation(operation, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  async updateMatches(sportKey: string): Promise<void> {
    await this.retryOperation(async () => {
      const matches = await this.oddsApiService.getMatches(sportKey);
      
      for (const match of matches) {
        const matchData = {
          externalId: match.id,
          sportKey: match.sport_key,
          sportTitle: match.sport_title,
          homeTeam: match.home_team,
          awayTeam: match.away_team,
          commenceTime: new Date(match.commence_time),
          // ... other match data transformation
          status: this.determineStatus(match.commence_time),
          tier: this.determineTier(match as any),
          lastUpdated: new Date()
        };

        await Match.findOneAndUpdate(
          { externalId: matchData.externalId },
          matchData,
          { upsert: true, new: true }
        );
      }
    });
  }

  private determineStatus(commenceTime: string): 'upcoming' | 'live' | 'ended' {
    const now = new Date();
    const matchTime = new Date(commenceTime);
    
    if (matchTime > now) return 'upcoming';
    if (matchTime <= now && now <= new Date(matchTime.getTime() + 3 * 60 * 60 * 1000)) {
      return 'live';
    }
    return 'ended';
  }

  async cleanupOldMatches() {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await Match.deleteMany({
      status: 'ended',
      commenceTime: { $lt: twentyFourHoursAgo }
    });
  }

  async getMatchesWithCache(sportKey: string): Promise<IMatch[]> {
    const cached = this.cache.get(sportKey);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < this.CACHE_DURATION[this.determineTier(cached.data[0])]) {
      return cached.data;
    }

    const matches = await this.getMatches(sportKey);
    this.cache.set(sportKey, { data: matches, timestamp: now });
    return matches;
  }

  async queueMatchUpdate(sportKey: string): Promise<void> {
    if (this.requestQueue.has(sportKey)) {
      await this.requestQueue.get(sportKey);
      return;
    }

    const updatePromise = (async () => {
      try {
        await this.updateMatches(sportKey);
      } finally {
        this.requestQueue.delete(sportKey);
        await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay));
      }
    })();

    this.requestQueue.set(sportKey, updatePromise);
    await updatePromise;
  }
} 