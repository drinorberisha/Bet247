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
  currentGameId: string | null;
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
    currentMultiplier: 1,
    currentGameId: null
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

      const currentBalance = authStore.userBalance;
      console.log('[KENO] Starting new game', {
        betAmount: this.betAmount,
        selectedNumbers: this.selectedNumbers,
        currentBalance
      });

      // Validate balance
      if (currentBalance < this.betAmount) {
        this.error = 'Insufficient balance';
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post(
          `${API_URL}/casino/keno/start`,
          {
            betAmount: this.betAmount
          },
          {
            headers: {
              'Authorization': `Bearer ${authStore.token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success) {
          // Update balance after bet is placed
          const newBalance = currentBalance - this.betAmount;
          console.log('[KENO] Game started successfully', {
            gameId: response.data.gameId,
            previousBalance: currentBalance,
            deductedAmount: this.betAmount,
            newBalance,
            betAmount: this.betAmount
          });
          
          this.currentGameId = response.data.gameId;
          this.isGameActive = true;
          authStore.updateBalance(newBalance);
          
          // Draw numbers and calculate winnings
          await this.drawNumbers();
          await this.calculateWinnings();
        }

      } catch (error: any) {
        console.error('[KENO] Error starting game:', {
          error: error.response?.data || error,
          betAmount: this.betAmount,
          selectedNumbers: this.selectedNumbers
        });
        this.error = error.response?.data?.message || 'Failed to start game';
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
        numbers.add(Math.floor(Math.random() * 40) + 1);
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

    async calculateWinnings() {
      const matchCount = this.matches.length;
      const selectionCount = this.selectedNumbers.length;
      const authStore = useAuthStore();
      const currentBalance = authStore.userBalance;
      
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

      console.log('[KENO] Game Result:', {
        selectedNumbers: this.selectedNumbers,
        drawnNumbers: this.drawnNumbers,
        matches: this.matches,
        matchCount,
        multiplier: this.currentMultiplier,
        betAmount: this.betAmount,
        winAmount: this.winAmount
      });

      // If there's a win, process it immediately
      if (this.winAmount > 0) {
        this.loading = true;
        this.error = null;

        console.log('[KENO] Processing win...', {
          gameId: this.currentGameId,
          winAmount: this.winAmount,
          currentBalance
        });

        try {
          const response = await axios.post(
            `${API_URL}/casino/keno/cashout`,
            {
              gameId: this.currentGameId,
              winAmount: this.winAmount
            },
            {
              headers: {
                Authorization: `Bearer ${authStore.token}`
              }
            }
          );

          if (response.data.success) {
            const newBalance = currentBalance + this.winAmount;
            console.log('[KENO] Win processed successfully!', {
              previousBalance: currentBalance,
              winAmount: this.winAmount,
              newBalance,
              profit: this.winAmount
            });
            authStore.updateBalance(newBalance);
          }
        } catch (error: any) {
          console.error('[KENO] Error processing win:', {
            error: error.response?.data || error,
            gameId: this.currentGameId,
            winAmount: this.winAmount
          });
          this.error = error.response?.data?.message || 'Failed to process win';
        } finally {
          this.loading = false;
          this.resetGame();
        }
      } else {
        console.log('[KENO] No win this round', {
          selectedNumbers: this.selectedNumbers,
          drawnNumbers: this.drawnNumbers,
          matches: this.matches,
          betAmount: this.betAmount,
          currentBalance
        });
        this.resetGame();
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
      this.currentGameId = null;
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