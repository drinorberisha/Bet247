import { Request, Response } from 'express';
import {Match} from '../models/Match';
import { OddsApiService } from '../services/oddsApiService';
import { MatchService } from '../services/matchService';

const oddsApiService = new OddsApiService();
const matchService = new MatchService();

// Get all supported sports
export const getSports = async (req: Request, res: Response) => {
  try {
    const { all = false } = req.query;
    const sports = await oddsApiService.getSupportedSports(all === 'true');
    res.json(sports);
  } catch (error) {
    console.error('Error fetching sports:', error);
    res.status(500).json({ message: 'Error fetching sports' });
  }
};

// Get matches with filters
export const getMatches = async (req: Request, res: Response) => {
  try {
    const { 
      sport = 'soccer_epl',
      status = 'upcoming'
    } = req.query;

    console.log('Match request params:', {
      sport,
      status,
      user: req.user
    });

    // First try to get matches from database
    let matches = await Match.find({
      sportKey: { $regex: new RegExp(`^${sport}`) },
      status: status
    });

    console.log('Found matches in DB:', {
      count: matches.length,
      sample: matches[0],
      sportKeys: matches.map(m => m.sportKey),
      statuses: matches.map(m => m.status)
    });

    // If no matches found or matches are stale, fetch from API
    if (matches.length === 0 || matches.some(match => isOddsStale(match))) {
      console.log('No matches found or stale data, fetching from API...');
      
      try {
        const apiMatches = await matchService.getMatches(sport as string);
        console.log('API matches fetched:', {
          count: apiMatches.length,
          sample: apiMatches[0]
        });

        const transformedMatches = apiMatches
          .map(match => transformMatchData(match))
          .filter(match => match !== null);

        console.log('Transformed matches:', {
          count: transformedMatches.length,
          sample: transformedMatches[0]
        });

        // Bulk update matches
        await Promise.all(transformedMatches.map(matchData => 
          Match.findOneAndUpdate(
            { externalId: matchData.externalId },
            matchData,
            { upsert: true, new: true }
          )
        ));

        // Get updated matches from database
        matches = await Match.find({
          sportKey: { $regex: new RegExp(`^${sport}`) },
          status: status
        });
      } catch (apiError) {
        console.error('Error fetching from API:', apiError);
        // Continue with existing matches if API fetch fails
      }
    }

    console.log('Sending matches to client:', {
      count: matches.length,
      sample: matches[0]
    });

    res.json(matches);
  } catch (error) {
    console.error('Error in getMatches:', error);
    res.status(500).json({ message: 'Error fetching matches' });
  }
};

// Get specific match by ID
export const getMatchById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const match = await Match.findById(id);
    
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // If match is found but might be stale, refresh its odds
    if (isOddsStale(match)) {
      const freshMatches = await matchService.getMatches(match.sportKey);
      const updatedMatch = freshMatches.find(m => m.id === match.externalId);
      
      if (updatedMatch) {
        const transformedMatch = transformMatchData(updatedMatch);
        await Match.findByIdAndUpdate(id, transformedMatch, { new: true });
        return res.json(transformedMatch);
      }
    }
    
    res.json(match);
  } catch (error) {
    console.error('Error fetching match:', error);
    res.status(500).json({ message: 'Error fetching match' });
  }
};

// Manual refresh of odds
export const refreshOdds = async (req: Request, res: Response) => {
  try {
    const { sport = 'soccer_epl' } = req.query;
    
    const matches = await matchService.getMatches(sport as string);
    const transformedMatches = matches.map(match => transformMatchData(match));

    // Bulk update matches
    await Promise.all(transformedMatches.map(matchData => 
      Match.findOneAndUpdate(
        { externalId: matchData.externalId },
        matchData,
        { upsert: true, new: true }
      )
    ));

    res.json({ 
      message: 'Odds refreshed successfully',
      matchesUpdated: transformedMatches.length 
    });
  } catch (error) {
    console.error('Error refreshing odds:', error);
    res.status(500).json({ message: 'Error refreshing odds' });
  }
};

// Helper function to safely parse date
const parseSafeDate = (dateString: string): Date => {
  const parsed = new Date(dateString);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

// Helper function to transform API match data to our schema
const transformMatchData = (match: any) => {
  if (!match) {
    console.warn('Received empty match data');
    return null;
  }

  try {
    const bestBookmaker = getBestBookmaker(match.bookmakers);
    const markets = bestBookmaker?.markets || [];
    
    // Get h2h market for main odds
    const h2hMarket = markets.find(m => m.key === 'h2h');
    const homeTeamOdds = getOutcomePrice(h2hMarket?.outcomes || [], match.home_team);
    const awayTeamOdds = getOutcomePrice(h2hMarket?.outcomes || [], match.away_team);
    const drawOdds = getOutcomePrice(h2hMarket?.outcomes || [], 'Draw');

    console.log('Transforming odds:', {
      match: `${match.home_team} vs ${match.away_team}`,
      homeTeamOdds,
      drawOdds,
      awayTeamOdds
    });

    return {
      externalId: match.id,
      sportKey: match.sport_key,
      sportTitle: match.sport_title,
      homeTeam: match.home_team,
      awayTeam: match.away_team,
      commenceTime: new Date(match.commence_time),
      odds: {
        homeWin: normalizeOdds(homeTeamOdds),
        draw: normalizeOdds(drawOdds),
        awayWin: normalizeOdds(awayTeamOdds)
      },
      bookmaker: bestBookmaker ? {
        key: bestBookmaker.key,
        title: bestBookmaker.title,
        lastUpdate: new Date(bestBookmaker.last_update)
      } : null,
      status: determineMatchStatus(match.commence_time),
      lastUpdated: new Date()
    };
  } catch (error) {
    console.error('Error transforming match data:', error, 'Match:', match);
    return null;
  }
};

// Helper function to get the best bookmaker (most markets or most recent update)
const getBestBookmaker = (bookmakers: any[] | undefined) => {
  if (!bookmakers || bookmakers.length === 0) {
    return null;
  }

  return bookmakers.sort((a, b) => {
    // First, compare by number of markets
    const marketDiff = (b.markets?.length || 0) - (a.markets?.length || 0);
    if (marketDiff !== 0) return marketDiff;
    
    // If equal markets, compare by last update time
    return new Date(b.last_update || 0).getTime() - new Date(a.last_update || 0).getTime();
  })[0];
};

// Helper function to get outcome price with proper type checking
const getOutcomePrice = (outcomes: any[], name: string): number | null => {
  const outcome = outcomes.find(o => o?.name === name);
  return outcome?.price || null;
};

// Helper function to normalize odds to a reasonable format
const normalizeOdds = (odds: number | null): number => {
  if (!odds) return 0;
  
  // Convert American odds to decimal if needed
  if (odds > 100 || odds < -100) {
    return odds > 0 
      ? Number(((odds / 100) + 1).toFixed(2))
      : Number((100 / Math.abs(odds) + 1).toFixed(2));
  }
  
  // Round decimal odds to 2 decimal places
  return Number(odds.toFixed(2));
};

// Helper function to determine if odds are stale (older than 5 minutes)
const isOddsStale = (match: any) => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return new Date(match.lastUpdated) < fiveMinutesAgo;
};

// Helper function to get spread market data with null checks
const getSpreadMarket = (markets: any[]) => {
  if (!markets || !Array.isArray(markets)) return null;
  
  const spreadMarket = markets.find(m => m?.key === 'spreads');
  if (!spreadMarket || !spreadMarket.outcomes) return null;
  
  return spreadMarket.outcomes.map((o: any) => ({
    name: o.name || '',
    price: o.price || 0,
    point: o.point || 0
  }));
};

// Helper function to get totals market data with null checks
const getTotalsMarket = (markets: any[]) => {
  if (!markets || !Array.isArray(markets)) return null;
  
  const totalsMarket = markets.find(m => m?.key === 'totals');
  if (!totalsMarket || !totalsMarket.outcomes) return null;
  
  return totalsMarket.outcomes.map((o: any) => ({
    name: o.name || '',
    price: o.price || 0,
    point: o.point || 0
  }));
};

// Helper function to determine match status
const determineMatchStatus = (commenceTime: string): 'upcoming' | 'live' | 'ended' => {
  const now = new Date();
  const matchTime = new Date(commenceTime);
  
  if (matchTime > now) return 'upcoming';
  if (matchTime <= now && now <= new Date(matchTime.getTime() + 3 * 60 * 60 * 1000)) {
    return 'live';
  }
  return 'ended';
}; 