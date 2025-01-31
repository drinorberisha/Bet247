import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from '../auth';

const API_URL = import.meta.env.VITE_API_URL;

interface KenoState {
  betAmount: number;
  selectedNumbers: number[];
  drawnNumbers: number[];
  matches: number[];
  winAmount: number;
  isGameActive: boolean;
  loading: boolean;
  error: string | null;
  currentMultiplier: number;
}

export const useKenoStore = defineStore('keno', {
  state: (): KenoState => ({
    betAmount: 1,
    selectedNumbers: [],
    drawnNumbers: [],
    matches: [],
    winAmount: 0,
    isGameActive: false,
    loading: false,
    error: null,
    currentMultiplier: 1
  }),

  actions: {
    async startGame() {
      if (this.selectedNumbers.length === 0) {
        this.error = 'Please select numbers first';
        return;
      }

      const authStore = useAuthStore();
      
      if (!authStore.token) {
        this.error = 'Please login to play';
        return;
      }

      this.loading = true;
      this.error = null;

      console.log('[KENO-STORE] Starting game with bet:', this.betAmount);
      console.log('[KENO-STORE] Auth token:', authStore.token ? 'Present' : 'Missing');

      try {
        const response = await axios.post(
          `${API_URL}/casino/keno/start`,
          {
            betAmount: this.betAmount,
          },
          {
            headers: {
              'Authorization': `Bearer ${authStore.token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('[KENO-STORE] Game started:', response.data);
        if (response.data.success) {
          this.isGameActive = true;
          // Draw numbers animation
          await this.drawNumbers();
          // Calculate winnings
          this.calculateWinnings();
          // Update user's balance
          authStore.updateBalance(response.data.newBalance);
        }

      } catch (error: any) {
        console.error('Error starting keno game:', error.response?.data || error);
        this.error = error.response?.data?.message || 'Failed to start game';
        if (error.response?.status === 401) {
          authStore.logout();
        }
      } finally {
        this.loading = false;
      }
    },

    async drawNumbers() {
      // Clear previous drawn numbers
      this.drawnNumbers = [];
      this.matches = [];
      
      // Generate 20 unique random numbers between 1 and 80
      const numbers = new Set<number>();
      while (numbers.size < 20) {
        numbers.add(Math.floor(Math.random() * 80) + 1);
      }
      
      // Animate drawing numbers
      for (const number of Array.from(numbers)) {
        this.drawnNumbers.push(number);
        // Check if it's a match
        if (this.selectedNumbers.includes(number)) {
          this.matches.push(number);
        }
        // Add delay for animation
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    },

    calculateWinnings() {
      const matchCount = this.matches.length;
      const selectionCount = this.selectedNumbers.length;
      
      // Multiplier table based on selections and matches
      const multiplierTable = {
        10: { 10: 1000, 9: 400, 8: 50, 7: 10, 6: 5, 5: 2, 4: 1, 3: 0.5 },
        9:  { 9: 400, 8: 50, 7: 10, 6: 5, 5: 2, 4: 1, 3: 0.5 },
        8:  { 8: 50, 7: 10, 6: 5, 5: 2, 4: 1, 3: 0.5 },
        7:  { 7: 10, 6: 5, 5: 2, 4: 1, 3: 0.5 },
        6:  { 6: 5, 5: 2, 4: 1, 3: 0.5 },
        5:  { 5: 2, 4: 1, 3: 0.5 },
        4:  { 4: 1, 3: 0.5 },
        3:  { 3: 0.5 },
        2:  { 2: 0.5 },
        1:  { 1: 0.5 }
      };

      const multipliers = multiplierTable[selectionCount as keyof typeof multiplierTable] || {};
      this.currentMultiplier = multipliers[matchCount as keyof typeof multipliers] || 0;
      this.winAmount = this.betAmount * this.currentMultiplier;
    },

    async cashoutGame() {
      if (!this.isGameActive || this.winAmount <= 0) return;

      const authStore = useAuthStore();
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post(
          `${API_URL}/casino/keno/cashout`,
          {
            winAmount: this.winAmount
          },
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`
            }
          }
        );

        if (response.data.success) {
          // Update user's balance
          authStore.updateBalance(response.data.newBalance);
          this.resetGame();
        }

      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to cashout';
        console.error('Error processing keno cashout:', error);
      } finally {
        this.loading = false;
      }
    },

    selectNumber(number: number) {
      const index = this.selectedNumbers.indexOf(number);
      if (index === -1 && this.selectedNumbers.length < 10) {
        this.selectedNumbers.push(number);
      } else if (index !== -1) {
        this.selectedNumbers.splice(index, 1);
      }
    },

    clearSelections() {
      this.selectedNumbers = [];
      this.resetGame();
    },

    resetGame() {
      this.isGameActive = false;
      this.drawnNumbers = [];
      this.matches = [];
      this.winAmount = 0;
      this.currentMultiplier = 1;
      this.error = null;
    }
  },

  getters: {
    canPlay: (state) => {
      return state.selectedNumbers.length > 0 && 
             state.selectedNumbers.length <= 10 && 
             !state.isGameActive;
    },

    potentialWins: (state) => {
      const selections = state.selectedNumbers.length;
      if (selections === 0) return [];

      const multiplierTable = {
        10: { 10: 1000, 9: 400, 8: 50, 7: 10, 6: 5, 5: 2, 4: 1, 3: 0.5 },
        9:  { 9: 400, 8: 50, 7: 10, 6: 5, 5: 2, 4: 1, 3: 0.5 },
        8:  { 8: 50, 7: 10, 6: 5, 5: 2, 4: 1, 3: 0.5 },
        7:  { 7: 10, 6: 5, 5: 2, 4: 1, 3: 0.5 },
        6:  { 6: 5, 5: 2, 4: 1, 3: 0.5 },
        5:  { 5: 2, 4: 1, 3: 0.5 },
        4:  { 4: 1, 3: 0.5 },
        3:  { 3: 0.5 },
        2:  { 2: 0.5 },
        1:  { 1: 0.5 }
      };

      const possibleWins = [];
      const currentMultipliers = multiplierTable[selections as keyof typeof multiplierTable] || {};

      for (const [matches, multiplier] of Object.entries(currentMultipliers)) {
        possibleWins.push({
          count: parseInt(matches),
          amount: state.betAmount * multiplier
        });
      }

      return possibleWins.sort((a, b) => b.count - a.count);
    }
  }
}); 