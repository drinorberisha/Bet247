import { Match, IMatch } from '../models/Match';
import { OddsApiService } from './oddsApiService';
import { eventEmitter } from '../utils/eventEmitter';
import mongoose from 'mongoose';
import { retry } from 'async';

export class UnifiedMatchService {
  private oddsApiService: OddsApiService;
  private cache: Map<string, {data: IMatch[], timestamp: number}> = new Map();
  private requestQueue: Map<string, Promise<void>> = new Map();
  private rateLimitDelay = 1000; // 1 second between requests

  constructor() {
    this.oddsApiService = new OddsApiService();
  }

  private async updateMatchesInDb(matches: IMatch[], sportKey: string) {
    for (const match of matches) {
      if (!this.validateMatch(match)) {
        console.error(`Skipping invalid match:`, match);
        continue;
      }

      try {
        await Match.findOneAndUpdate(
          { externalId: match.externalId },
          match,
          { 
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
          }
        );
      } catch (error) {
        console.error(`Error saving match to DB:`, error);
      }
    }
  }

  private validateMatch(match: any): boolean {
    const requiredFields = [
      'externalId',
      'sportKey',
      'sportTitle',
      'homeTeam',
      'awayTeam',
      'commenceTime'
    ];

    const missingFields = requiredFields.filter(field => !match[field]);
    
    if (missingFields.length > 0) {
      console.error(`Match validation failed. Missing fields: ${missingFields.join(', ')}`, match);
      return false;
    }

    return true;
  }

  private async debouncedRequest(sportKey: string): Promise<IMatch[]> {
    const existingRequest = this.requestQueue.get(sportKey);
    if (existingRequest) {
      await existingRequest;
    }

    const requestPromise = new Promise<void>(async (resolve) => {
      try {
        // Add rate limiting delay
        await new Promise(r => setTimeout(r, this.rateLimitDelay));
        const matches = await this.oddsApiService.getMatches(sportKey);
        this.cache.set(sportKey, {
          data: matches,
          timestamp: Date.now()
        });
      } finally {
        resolve();
      }
    });

    this.requestQueue.set(sportKey, requestPromise);
    await requestPromise;
    this.requestQueue.delete(sportKey);

    return this.cache.get(sportKey)?.data || [];
  }

  async getMatchesBySport(sportKey: string): Promise<IMatch[]> {
    const cached = this.cache.get(sportKey);
    const now = Date.now();

    if (cached && now - cached.timestamp < 5 * 60 * 1000) { // 5 minutes cache
      return cached.data;
    }

    let matches = await Match.find({ 
      sportKey,
      commenceTime: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    if (matches.length > 0) {
      this.cache.set(sportKey, { data: matches, timestamp: now });
      return matches;
    }

    try {
      matches = await this.debouncedRequest(sportKey);
      await this.updateMatchesInDb(matches, sportKey);
      return matches;
    } catch (error) {
      console.error('Error fetching matches:', error);
      return matches; // Return whatever we have from DB
    }
  }

  async getLiveMatches(): Promise<IMatch[]> {
    return Match.find({ status: 'live' }).sort({ lastUpdated: -1 });
  }

  async getUpcomingMatches(): Promise<IMatch[]> {
    const now = new Date();
    return Match.find({
      status: 'upcoming',
      commenceTime: { $gt: now }
    }).sort({ commenceTime: 1 });
  }

  async updateMatches(sportKey: string, session?: mongoose.ClientSession) {
    const retryOptions = {
      times: 3,
      interval: 1000,
      errorFilter: (err: any) => {
        // Retry only on specific errors, like network issues
        return !err.response || err.response.status >= 500;
      }
    };

    try {
      return await retry(retryOptions, async () => {
        const matches = await this.oddsApiService.getMatches(sportKey);
        const updatedMatches: IMatch[] = [];
        const settledMatches: IMatch[] = [];

        for (const match of matches) {
          if (this.validateMatch(match)) {
            const updatedMatch = await Match.findOneAndUpdate(
              { externalId: match.externalId },
              match,
              { 
                upsert: true, 
                new: true, 
                session,
                setDefaultsOnInsert: true 
              }
            );
            updatedMatches.push(updatedMatch);
          }
        }

        return { updatedMatches, settledMatches };
      });
    } catch (error) {
      console.error('Error updating matches:', error);
      throw error;
    }
  }
} 