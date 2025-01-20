import { CronJob } from 'cron';
import { MatchService } from './matchService';

export class SchedulerService {
  private matchService: MatchService;
  private supportedSports = [
    'soccer_epl',           // English Premier League
    'soccer_spain_la_liga', // La Liga
    'soccer_germany_bundesliga1', // Bundesliga
    'soccer_italy_serie_a', // Serie A
    'soccer_france_ligue_one', // Ligue 1
    'basketball_nba',       // NBA
    'basketball_euroleague', // EuroLeague
    'tennis_atp_singles',   // ATP Tennis
    'tennis_wta_singles',   // WTA Tennis
    'handball_germany_bundesliga1' // Handball Bundesliga
  ];

  constructor() {
    this.matchService = new MatchService();
  }

  initializeSchedulers() {
    // High-frequency tier (30 seconds) - Live matches
    new CronJob('*/30 * * * * *', async () => {
      try {
        const matches = await this.matchService.getLiveMatches();
        const sportsToUpdate = new Set(matches.map(m => m.sportKey));
        
        for (const sportKey of sportsToUpdate) {
          if (this.supportedSports.includes(sportKey)) {
            await this.matchService.updateMatches(sportKey);
          }
        }
      } catch (error) {
        console.error('Error in high-frequency update:', error);
      }
    }).start();

    // Medium-frequency tier (5 minutes) - Upcoming matches within 24 hours
    new CronJob('*/5 * * * *', async () => {
      try {
        const matches = await this.matchService.getUpcomingMatches();
        const sportsToUpdate = new Set(
          matches
            .filter(m => {
              const hours = (new Date(m.commenceTime).getTime() - Date.now()) / (1000 * 60 * 60);
              return hours <= 24;
            })
            .map(m => m.sportKey)
        );
        
        for (const sportKey of sportsToUpdate) {
          if (this.supportedSports.includes(sportKey)) {
            await this.matchService.updateMatches(sportKey);
          }
        }
      } catch (error) {
        console.error('Error in medium-frequency update:', error);
      }
    }).start();

    // Low-frequency tier (1 hour) - All supported sports
    new CronJob('0 * * * *', async () => {
      try {
        // Update all supported sports
        for (const sportKey of this.supportedSports) {
          await this.matchService.updateMatches(sportKey);
        }
      } catch (error) {
        console.error('Error in low-frequency update:', error);
      }
    }).start();
  }
} 