import { CronJob } from 'cron';
import { MatchService } from '../services/matchService';
import { SUPPORTED_SPORTS } from '../config/constants';

const matchService = new MatchService();

// Update upcoming matches less frequently
const upcomingMatchesJob = new CronJob('0 */30 * * * *', async () => { // Every 30 minutes
  for (const sportKey of SUPPORTED_SPORTS) {
    try {
      await matchService.queueMatchUpdate(sportKey);
      // Add delay between sports to prevent API rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Error updating upcoming matches for ${sportKey}:`, error);
    }
  }
});

// Update live matches more frequently
const liveMatchesJob = new CronJob('*/2 * * * *', async () => { // Every 2 minutes
  try {
    const liveMatches = await matchService.getLiveMatches();
    const sportKeys = [...new Set(liveMatches.map(m => m.sportKey))];

    for (const sportKey of sportKeys) {
      await matchService.queueMatchUpdate(sportKey);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error('Error updating live matches:', error);
  }
});

// Cleanup old matches daily
const cleanupJob = new CronJob('0 0 * * *', async () => { // Once per day at midnight
  try {
    await matchService.cleanupOldMatches();
  } catch (error) {
    console.error('Error cleaning up old matches:', error);
  }
});

export const startMatchUpdateJobs = () => {
  upcomingMatchesJob.start();
  liveMatchesJob.start();
  cleanupJob.start();
};
