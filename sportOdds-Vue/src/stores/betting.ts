import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './auth';

const API_URL = import.meta.env.VITE_API_URL;

interface PlaceBetResponse {
  success: boolean;
  newBalance: number;
  message?: string;
}

interface Bet {
  id: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  selections: {
    type: string;
    odds: number;
  }[];
  stake: number;
  sportKey: string;
}

export const useBettingStore = defineStore('betting', {
  state: () => ({
    bets: [] as Bet[],
    activeMode: 'single' as 'single' | 'multi',
    multiStake: 0,
    loading: false,
    error: null as string | null,
    isBetslipExpanded: false,
    isBetslipClosed: false,
    isMobile: false,
  }),

  getters: {
    totalSingleStake: (state) => {
      return state.bets.reduce((sum, bet) => sum + (bet.stake || 0), 0);
    },
    
    multiOdds: (state) => {
      return state.bets.reduce((total, bet) => {
        // In multi mode, take the first selection of each match
        return total * (bet.selections[0]?.odds || 1);
      }, 1);
    },

    potentialMultiWin: (state) => {
      return state.multiStake * state.multiOdds;
    }
  },

  actions: {
    addSelection(matchData: {
      matchId: string;
      homeTeam: string;
      awayTeam: string;
      type: string;
      odds: number;
      sportKey: string;
    }) {
      if (this.activeMode === 'single') {
        // For single mode, we can have multiple selections for the same match
        let bet = this.bets.find(b => b.matchId === matchData.matchId);
        
        if (bet) {
          // Check if selection type already exists
          const existingSelectionIndex = bet.selections.findIndex(s => s.type === matchData.type);
          
          if (existingSelectionIndex >= 0) {
            // Remove the selection if it exists
            bet.selections.splice(existingSelectionIndex, 1);
            if (bet.selections.length === 0) {
              // Remove the bet if no selections left
              this.removeBet(bet.id);
            }
          } else {
            // Add new selection
            bet.selections.push({
              type: matchData.type,
              odds: matchData.odds
            });
          }
        } else {
          // Create new bet with first selection
          this.bets.push({
            id: crypto.randomUUID(),
            matchId: matchData.matchId,
            homeTeam: matchData.homeTeam,
            awayTeam: matchData.awayTeam,
            selections: [{
              type: matchData.type,
              odds: matchData.odds
            }],
            stake: 0,
            sportKey: matchData.sportKey
          });
        }
      } else {
        // For multi mode, only one selection per match
        const existingBetIndex = this.bets.findIndex(b => b.matchId === matchData.matchId);
        
        if (existingBetIndex >= 0) {
          // Replace existing selection
          if (this.bets[existingBetIndex].selections[0]?.type === matchData.type) {
            // Remove bet if same selection clicked
            this.bets.splice(existingBetIndex, 1);
          } else {
            this.bets[existingBetIndex].selections = [{
              type: matchData.type,
              odds: matchData.odds
            }];
          }
        } else {
          // Add new bet with single selection
          this.bets.push({
            id: crypto.randomUUID(),
            matchId: matchData.matchId,
            homeTeam: matchData.homeTeam,
            awayTeam: matchData.awayTeam,
            selections: [{
              type: matchData.type,
              odds: matchData.odds
            }],
            stake: 0,
            sportKey: matchData.sportKey
          });
        }
      }
    },

    setMode(mode: 'single' | 'multi') {
      this.activeMode = mode;
      
      if (mode === 'multi') {
        this.bets = this.bets.map(bet => ({
          ...bet,
          selections: [bet.selections[0]],
          stake: 0
        }));
      }
      
      this.multiStake = 0;
    },

    updateStake(betId: string, stake: number) {
      const bet = this.bets.find(b => b.id === betId);
      if (bet) {
        bet.stake = stake;
      }
    },

    updateMultiStake(stake: number) {
      this.multiStake = stake;
    },

    removeBet(betId: string) {
      const index = this.bets.findIndex(bet => bet.id === betId);
      if (index !== -1) {
        this.bets.splice(index, 1);
      }
    },

    clearAllBets() {
      this.bets = [];
      this.multiStake = 0;
    },

    expandBetslip() {
      this.isBetslipExpanded = true;
      this.isBetslipClosed = false;
    },

    collapseBetslip() {
      this.isBetslipExpanded = false;
    },

    closeBetslip() {
      this.isBetslipClosed = true;
      this.isBetslipExpanded = false;
    },

    reopenBetslip() {
      this.isBetslipClosed = false;
      this.isBetslipExpanded = false;
    },

    setMobileState(isMobile: boolean) {
      this.isMobile = isMobile;
    },

    validateBet(): { valid: boolean; message?: string } {
      const authStore = useAuthStore();
      const userBalance = authStore.getUserBalance();
      const totalStake = this.activeMode === 'multi' 
        ? this.multiStake 
        : this.bets.reduce((sum, bet) => sum + (bet.stake || 0), 0);

      // Check if user is authenticated
      if (!authStore.isAuthenticated) {
        return { 
          valid: false, 
          message: 'Please login to place bets' 
        };
      }

      // Check if user has enough balance
      if (totalStake > userBalance) {
        return { 
          valid: false, 
          message: 'Insufficient balance' 
        };
      }

      // Check if all required fields are filled
      if (this.activeMode === 'multi') {
        if (this.bets.length < 2) {
          return { 
            valid: false, 
            message: 'Multi bet requires at least 2 selections' 
          };
        }
        if (!this.multiStake) {
          return { 
            valid: false, 
            message: 'Please enter stake amount' 
          };
        }
      } else {
        if (!this.bets.some(bet => bet.stake > 0)) {
          return { 
            valid: false, 
            message: 'Please enter stake amount' 
          };
        }
      }

      return { valid: true };
    },

    async placeBet(): Promise<PlaceBetResponse> {
      const authStore = useAuthStore();
      
      if (!authStore.token) {
        throw new Error('Authentication required');
      }

      // Add debug logging
      console.log('Auth token:', authStore.token);

      this.loading = true;
      this.error = null;

      try {
        // Calculate total odds
        const totalOdds = this.activeMode === 'multi' 
          ? this.multiOdds 
          : this.bets[0]?.selections[0]?.odds || 0;

        // Calculate amount and potential win
        const amount = this.activeMode === 'multi' 
          ? this.multiStake 
          : this.bets.reduce((sum, bet) => sum + (bet.stake || 0), 0);
        
        const potentialWin = amount * totalOdds;

        const payload = {
          betType: this.activeMode === 'multi' ? 'multiple' : 'single',
          amount,
          totalOdds,
          potentialWin,
          selections: this.bets.flatMap(bet => 
            bet.selections.map(selection => ({
              matchId: bet.matchId,
              selection: selection.type,
              odds: selection.odds,
              sportKey: bet.sportKey,
              event: `${bet.homeTeam} vs ${bet.awayTeam}`,
              market: this.getMarketType(selection.type),
              sport: bet.sportKey.split(':')[0],
              homeTeam: bet.homeTeam,
              awayTeam: bet.awayTeam
            }))
          )
        };

        console.log('Placing bet with payload:', payload); // Debug log

        const response = await axios.post<PlaceBetResponse>(
          `${API_URL}/bets/place`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Bet placement response:', response.data); // Debug log

        if (response.data.success) {
          authStore.updateBalance(response.data.newBalance);
          this.clearAllBets();
        }

        return response.data;

      } catch (error: any) {
        console.error('Bet placement error:', error.response?.data || error);
        this.error = error.response?.data?.message || 'Failed to place bet';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    getMarketType(selectionType: string): string {
      if (selectionType === 'home') return 'Match Winner';
      if (selectionType === 'away') return 'Match Winner';
      if (selectionType === 'draw') return 'Match Winner';
      // Add more market types as needed
      return 'Match Winner'; // Default
    }
  }
});