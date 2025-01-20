import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './auth'; // Import auth store

const API_URL = import.meta.env.VITE_API_URL;

interface Match {
  _id: string;
  externalId: string;
  sportKey: string;
  sportTitle: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: string;
  odds: {
    homeWin: number;
    draw?: number;
    awayWin: number;
  };
  status: 'upcoming' | 'live' | 'ended';
  title: string;
}

export const useMatchesStore = defineStore('matches', {
  state: () => ({
    matches: [] as Match[],
    loading: false,
    error: null as string | null
  }),

  getters: {
    getMatchesBySport: (state) => (sportKey: string) => {
      console.log('Getting matches for sport:', sportKey);
      return state.matches.filter(match => {
        const matchSportKey = match?.sportKey?.toLowerCase() || '';
        const searchKey = sportKey.toLowerCase();
        
        // Handle special cases for tennis and other sports
        if (searchKey === 'tennis') {
          return matchSportKey.includes('tennis');
        }
        if (searchKey === 'icehockey') {
          return matchSportKey.includes('icehockey') || matchSportKey.includes('hockey');
        }
        
        return matchSportKey === searchKey || 
               matchSportKey.startsWith(`${searchKey}_`) || 
               matchSportKey.includes(searchKey);
      });
    },
    getLiveMatches: (state) => {
      return state.matches.filter(match => 
        match && 
        match.status === 'live'
      );
    },
    getUpcomingMatches: (state) => {
      return state.matches.filter(match => 
        match && 
        match.status === 'upcoming'
      );
    }
  },

  actions: {
    async fetchMatches(sportKey: string, status: string = 'upcoming') {
      const authStore = useAuthStore();
      
      try {
        this.loading = true;
        this.error = null;
        
        console.log(`Fetching ${status} matches for ${sportKey}`);
        console.log('Auth token:', authStore.token); // Debug log
        
        const response = await axios.get(`${API_URL}/matches/matches`, {
          params: {
            sport: sportKey,
            status
          },
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        });

        // Debug logs to inspect the data
        console.log('Raw API Response:', response);
        console.log('Response data structure:', {
          dataType: typeof response.data,
          isArray: Array.isArray(response.data),
          length: response.data?.length,
          firstItem: response.data[0]
        });
        
        // Validate and transform matches with detailed logging
        const validMatches = response.data.filter((match: any) => {
          console.log('Validating match:', match);
          console.log('Match properties:', {
            hasExternalId: !!match?.externalId,
            hasSportKey: !!match?.sportKey,
            hasStatus: !!match?.status,
            sportKey: match?.sportKey,
            status: match?.status
          });

          const isValid = match && 
                         match.externalId && 
                         match.sportKey && 
                         match.status;
          
          if (!isValid) {
            console.warn('Invalid match data:', {
              match,
              reason: {
                noMatch: !match,
                noExternalId: !match?.externalId,
                noSportKey: !match?.sportKey,
                noStatus: !match?.status
              }
            });
          }
          
          return isValid;
        });

        console.log('Valid matches:', validMatches);
        
        // Merge new matches with existing ones, avoiding duplicates
        const existingIds = new Set(this.matches.map(m => m.externalId));
        const uniqueNewMatches = validMatches.filter((m: Match) => !existingIds.has(m.externalId));
        
        this.matches = [...this.matches, ...uniqueNewMatches];
        console.log('Updated matches state:', this.matches);
      } catch (error: any) {
        console.error('Error fetching matches:', error);
        if (error.response?.status === 401) {
          this.error = 'Please log in to view matches';
          authStore.logout();
        } else {
          this.error = error.message || 'Failed to load matches';
        }
      } finally {
        this.loading = false;
      }
    },

    clearMatches() {
      this.matches = [];
      this.error = null;
    }
  }
}); 