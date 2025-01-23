import { CronJob } from 'cron';
import { MatchService } from '../services/matchService';
import { Match } from '../models/Match';

const matchService = new MatchService();

// Run every 5 minutes
const matchResultsJob = new CronJob('*/5 * * * *', async () => {
  try {
    console.log('Running match results check...', new Date());
    
    // Find matches that are:
    // 1. Still marked as upcoming or live
    // 2. Have a commence time in the past
    // 3. Are within the last 48 hours (to avoid checking very old matches)
    const pendingMatches = await Match.find({
      status: { $in: ['live', 'upcoming'] },
      commenceTime: { 
        $lt: new Date(),
        $gt: new Date(Date.now() - 48 * 60 * 60 * 1000) // last 48 hours
      }
    });

    console.log('Pending matches found:', pendingMatches.map(m => ({
      id: m._id,
      match: `${m.homeTeam} vs ${m.awayTeam}`,
      status: m.status,
      commenceTime: m.commenceTime,
      sportKey: m.sportKey,
      timeSinceCommence: Math.round((Date.now() - m.commenceTime.getTime()) / (60 * 1000)) + ' minutes'
    })));

    if (pendingMatches.length > 0) {
      console.log(`Checking results for ${pendingMatches.length} pending matches...`);
      
      // Use the new method from MatchService
      const forceUpdatedMatches = await matchService.checkOldMatches(pendingMatches);
      if (forceUpdatedMatches.length > 0) {
        console.log('Force updated matches:', forceUpdatedMatches.map(m => ({
          id: m._id,
          match: `${m.homeTeam} vs ${m.awayTeam}`,
          status: m.status,
          scores: m.scores
        })));
      }

      const updatedMatches = await matchService.checkAndUpdateMatchResults(pendingMatches);
      console.log('Updated matches:', updatedMatches.map(m => ({
        id: m._id,
        match: `${m.homeTeam} vs ${m.awayTeam}`,
        status: m.status,
        result: m.result,
        scores: m.scores
      })));
      
      if (updatedMatches.length > 0) {
        const settledMatches = await matchService.settleMatches();
        console.log('Settled matches:', settledMatches);
      }
    }
  } catch (error) {
    console.error('Error in match results job:', error);
  }
});

// Make sure the job is started
matchResultsJob.start();

export default matchResultsJob; 