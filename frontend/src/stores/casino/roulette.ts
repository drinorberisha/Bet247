import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from '../auth';
import { useNotification } from '@kyvg/vue3-notification';

const API_URL = import.meta.env.VITE_API_URL;

interface Bet {
  type: string;
  numbers: number[];
  amount: number;
}

interface RouletteState {
  betAmount: number;
  currentBets: Bet[];
  isGameActive: boolean;
  loading: boolean;
  error: string | null;
  currentGameId: string | null;
  lastNumber: number | null;
  history: number[];
  totalBet: number;
  potentialWin: number;
  spinDuration: number;
  isSpinning: boolean;
  data: {
    items: any[];
    targetIndex: number;
  };
}

export const useRouletteStore = defineStore('roulette', {
  state: (): RouletteState => ({
    betAmount: 1,
    currentBets: [],
    isGameActive: false,
    loading: false,
    error: null,
    currentGameId: null,
    lastNumber: null,
    history: [],
    totalBet: 0,
    potentialWin: 0,
    spinDuration: 4000,
    isSpinning: false,
    data: {
      items: [],
      targetIndex: 0
    }
  }),

  actions: {
    initializeWheel(items: any[]) {
      this.data.items = items;
    },

    async startGame() {
      const authStore = useAuthStore();
      
      console.log('[ROULETTE-DEBUG] Starting game with state:', {
        currentBets: this.currentBets,
        totalBet: this.totalBet,
        currentGameId: this.currentGameId,
        isGameActive: this.isGameActive
      });
      
      if (!authStore.token) {
        console.log('[ROULETTE-DEBUG] No auth token found');
        this.error = 'Please login to play';
        return false;
      }

      if (this.currentBets.length === 0) {
        console.log('[ROULETTE-DEBUG] No bets placed');
        this.error = 'Please place at least one bet';
        return false;
      }

      this.totalBet = this.calculateTotalBet();
      console.log('[ROULETTE-DEBUG] Calculated total bet:', this.totalBet);

      try {
        const response = await axios.post(
          `${API_URL}/casino/roulette/start`,
          { totalBet: this.totalBet },
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`
            }
          }
        );

        console.log('[ROULETTE-DEBUG] Start game response:', response.data);

        if (response.data.success) {
          this.currentGameId = response.data.gameId;
          console.log('[ROULETTE-DEBUG] Game started successfully:', {
            gameId: this.currentGameId,
            totalBet: this.totalBet,
            isGameActive: this.isGameActive
          });
          this.isGameActive = true;
          authStore.updateBalance(response.data.newBalance);
          return true;
        }
      } catch (error: any) {
        console.error('[ROULETTE-DEBUG] Start game error:', error);
        this.error = error.response?.data?.message || 'Failed to start game';
      }
      return false;
    },

    async spinWheel() {
      console.log('[ROULETTE-DEBUG] Store spinWheel called');
      
      if (!this.currentGameId) {
        console.log('[ROULETTE-DEBUG] No game ID, starting new game');
        const success = await this.startGame();
        if (!success) {
          console.error('[ROULETTE-DEBUG] Failed to start game');
          return;
        }
      }

      if (this.currentGameId) {
        console.log('[ROULETTE-DEBUG] Starting spin with gameId:', this.currentGameId);
        this.isSpinning = true;
        const number = Math.floor(Math.random() * 37);
        
        // Wait for wheel animation to complete
        await new Promise(resolve => setTimeout(resolve, this.spinDuration));
        
        // Process result
        const winAmount = await this.processResult(number);
        
        // Set spinning to false
        this.isSpinning = false;
        
        // Reset game state
        this.resetGame();
        
        // Show notification after a small delay
        setTimeout(() => {
          this.showResultNotification(winAmount);
        }, 1000);
      }
    },

    calculateWinAmount(number: number): number {
      let totalWin = 0;
      
      this.currentBets.forEach(bet => {
        if (bet.numbers.includes(number)) {
          const multiplier = this.getBetMultiplier(bet.type);
          totalWin += bet.amount * multiplier;
        }
      });

      return totalWin;
    },

    addBet(type: string, numbers: number[], amount: number) {
      if (this.isGameActive || this.loading) return;

      // Check for existing bet of same type
      const existingBetIndex = this.currentBets.findIndex(
        bet => bet.type === type && JSON.stringify(bet.numbers) === JSON.stringify(numbers)
      );

      if (existingBetIndex !== -1) {
        // Update existing bet amount
        this.currentBets[existingBetIndex].amount += amount;
      } else {
        // Add new bet
        this.currentBets.push({ type, numbers, amount });
      }

      this.calculatePotentialWin();
      this.totalBet = this.calculateTotalBet();
    },

    removeBet(index: number) {
      if (this.isGameActive || this.loading) return;
      
      this.currentBets.splice(index, 1);
      this.calculatePotentialWin();
      this.totalBet = this.calculateTotalBet();
    },

    calculateTotalBet(): number {
      return this.currentBets.reduce((total, bet) => total + bet.amount, 0);
    },

    calculatePotentialWin() {
      this.potentialWin = this.currentBets.reduce((total, bet) => {
        const multiplier = this.getBetMultiplier(bet.type);
        return total + (bet.amount * multiplier);
      }, 0);
    },

    getBetMultiplier(betType: string): number {
      const multipliers: Record<string, number> = {
        'straight': 35,
        'split': 17,
        'street': 11,
        'corner': 8,
        'line': 5,
        'column': 2,
        'dozen': 2,
        'red': 1,
        'black': 1,
        'even': 1,
        'odd': 1,
        '1to18': 1,
        '19to36': 1
      };
      return multipliers[betType] || 0;
    },

    resetGame() {
      this.currentBets = [];
      this.currentGameId = null;
      this.potentialWin = 0;
      this.totalBet = 0;
      this.isGameActive = false;
    },

    showResultNotification(winAmount: number) {
      const { notify } = useNotification();
      
      if (winAmount > 0) {
        notify({
          title: 'Winner!',
          text: `Congratulations! You won ${winAmount.toFixed(2)} €!`,
          type: 'success',
          duration: 3000
        });
      } else {
        notify({
          title: 'Better luck next time!',
          text: 'Try again for another chance to win!',
          type: 'error',
          duration: 3000
        });
      }
    },

    async processResult(number: number) {
      this.lastNumber = number;
      const winAmount = this.calculateWinAmount(number);
      
      if (winAmount > 0) {
        await this.processPayout(winAmount);
      }
      
      // Add to history only after spin animation completes
      this.addToHistory({
        number,
        color: this.getNumberColor(number),
        timestamp: new Date()
      });

      this.currentGameId = null;
      this.currentBets = [];
      
      return winAmount;
    },

    getNumberColor(number: number): string {
      if (number === 0) return 'green';
      const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
      return redNumbers.includes(number) ? 'red' : 'black';
    },

    async processPayout(amount: number) {
      const authStore = useAuthStore();
      
      try {
        console.log('[ROULETTE] Processing win:', {
          gameId: this.currentGameId,
          amount
        });

        if (!this.currentGameId) {
          console.error('[ROULETTE] No game ID found when processing win');
          return;
        }

        const response = await axios.post(
          `${API_URL}/casino/roulette/processWin`,
          {
            gameId: this.currentGameId,
            winAmount: amount
          },
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`
            }
          }
        );

        if (response.data.success) {
          authStore.updateBalance(response.data.newBalance);
        }
      } catch (error: any) {
        console.error('[ROULETTE] Error processing win:', error);
        this.error = error.response?.data?.message || 'Failed to process win';
      }
    },

    addToHistory(result: { number: number; color: string; timestamp: Date }) {
      this.history.unshift(result.number);
    }
  }
}); 