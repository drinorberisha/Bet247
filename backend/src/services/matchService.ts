import { Match, IMatch } from '../models/Match';
import { OddsApiService } from './oddsApiService';
import mongoose from 'mongoose';
import { eventEmitter } from '../utils/eventEmitter';
import { LockService } from './lockService';

export class MatchService {
  private oddsApiService: OddsApiService;
  private cache: Map<string, {data: IMatch[], timestamp: number}> = new Map();
  private CACHE_DURATION = {
    high: 5 * 60 * 1000,     // 5 minutes
    medium: 15 * 60 * 1000,  // 15 minutes
    low: 60 * 60 * 1000      // 1 hour
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

  async getMatchesBySport(sportKey: string): Promise<IMatch[]> {
    // First try to get from cache
    const cached = this.cache.get(sportKey);
    const now = Date.now();

    if (cached && now - cached.timestamp < this.CACHE_DURATION.high) {
      return cached.data;
    }

    // If not in cache, try to get from database
    let matches = await Match.find({ 
      sportKey,
      commenceTime: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    // If matches found in DB and not stale, use them
    if (matches.length > 0 && !matches.some(m => m.isStale())) {
      this.cache.set(sportKey, { data: matches, timestamp: now });
      return matches;
    }

    // If no matches in DB or stale, fetch from API
    try {
      matches = await this.debouncedRequest(sportKey);
      await this.updateMatchesInDb(matches, sportKey);
      return matches;
    } catch (error) {
      console.error('Error fetching matches:', error);
      return matches; // Return whatever we have from DB
    }
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
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxRetries) throw error;
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
    throw new Error('Operation failed after all retries');
  }

  private async queueMatchUpdate(sportKey: string): Promise<void> {
    const queueKey = `match_update_${sportKey}`;
    
    if (!await LockService.acquireLock(queueKey, 30000)) { // 30 second lock
      console.log(`Update for ${sportKey} already in progress, skipping`);
      return;
    }

    try {
      await this.updateMatches(sportKey);
    } finally {
      await LockService.releaseLock(queueKey);
    }
  }

  async updateMatches(sportKey: string, session?: mongoose.ClientSession) {
    return this.retryOperation(async () => {
      const matches = await this.oddsApiService.getMatches(sportKey);
      // ... rest of your update logic ...
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

  async checkAndUpdateMatchResults(matches: IMatch[]): Promise<IMatch[]> {
    const updatedMatches: IMatch[] = [];

    for (const match of matches) {
      try {
        if (!match.sportKey) {
          console.error(`Match ${match._id} missing sportKey, skipping`);
          continue;
        }

        const apiMatch = await this.oddsApiService.getMatchResult(match.sportKey, match.externalId);
        
        if (apiMatch && apiMatch.scores) {
          const result = this.determineResult(apiMatch.scores);
          
          if (result) {
            const updatedMatch = await Match.findByIdAndUpdate(
              match._id,
              {
                status: 'ended',
                result: result,
                scores: apiMatch.scores,
                lastUpdated: new Date()
              },
              { new: true }
            );

            if (updatedMatch) {
              updatedMatches.push(updatedMatch);
            }
          }
        }
      } catch (error) {
        console.error(`Error updating match ${match._id}:`, error);
      }
    }

    return updatedMatches;
  }

  async settleMatches(session?: mongoose.ClientSession): Promise<IMatch[]> {
    const unsettledMatches = await Match.find({
      status: 'ended',
      result: { $exists: true },
      settled: { $ne: true }
    }).session(session);

    const settledMatches: IMatch[] = [];

    for (const match of unsettledMatches) {
      try {
        // Verify match can be settled
        if (!this.verifyMatchSettlement(match)) {
          console.error(`Match ${match._id} failed settlement verification`);
          continue;
        }

        match.settled = true;
        await match.save({ session });
        settledMatches.push(match);

        // Emit event for bet settlement
        await this.emitMatchSettled(match);
      } catch (error) {
        console.error(`Error settling match ${match._id}:`, error);
      }
    }

    return settledMatches;
  }

  private verifyMatchSettlement(match: IMatch): boolean {
    // Ensure all required fields are present
    if (!match.scores?.home || !match.scores?.away || !match.result) {
      console.error(`Match ${match._id} missing required settlement data`);
      return false;
    }

    // Verify result matches scores
    const calculatedResult = this.determineResult(match.scores);
    if (calculatedResult !== match.result) {
      console.error(`Match ${match._id} result mismatch: stored=${match.result}, calculated=${calculatedResult}`);
      return false;
    }

    return true;
  }

  private determineResult(scores: { home: number; away: number }): '1' | 'X' | '2' | null {
    // Validate score object structure
    if (!scores || typeof scores.home !== 'number' || typeof scores.away !== 'number') {
      console.error('Invalid scores format:', scores);
      return null;
    }

    // Validate score values
    if (scores.home < 0 || scores.away < 0) {
      console.error('Invalid negative scores:', scores);
      return null;
    }

    if (scores.home > scores.away) return '1';
    if (scores.home < scores.away) return '2';
    if (scores.home === scores.away) return 'X';
    
    console.error('Unexpected score values:', scores);
    return null;
  }

  private async emitMatchSettled(match: IMatch): Promise<void> {
    try {
      // Emit event for bet settlement processing
      await eventEmitter.emit('matchSettled', {
        matchId: match._id,
        result: match.result,
        scores: match.scores,
        settledAt: new Date()
      });
    } catch (error) {
      console.error(`Error emitting matchSettled event for ${match._id}:`, error);
    }
  }

  private async debouncedRequest(sportKey: string): Promise<IMatch[]> {
    // Wait for any existing request for this sport to complete
    const existingRequest = this.requestQueue.get(sportKey);
    if (existingRequest) {
      await existingRequest;
    }

    // Create new request promise
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

  async checkOldMatches(matches: IMatch[]): Promise<IMatch[]> {
    const updatedMatches: IMatch[] = [];
    
    for (const match of matches) {
      try {
        if (Date.now() - match.commenceTime.getTime() > 3 * 60 * 60 * 1000) {
          const scores = await this.oddsApiService.getMatchResult(match.sportKey, match.externalId);
          if (scores) {
            const updatedMatch = await Match.findByIdAndUpdate(
              match._id,
              {
                status: 'ended',
                scores: scores,
                lastUpdated: new Date()
              },
              { new: true }
            );
            if (updatedMatch) {
              updatedMatches.push(updatedMatch);
            }
          }
        }
      } catch (error) {
        console.error(`Error updating old match ${match._id}:`, error);
      }
    }
    
    return updatedMatches;
  }
} 