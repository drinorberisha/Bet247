import { defineStore } from 'pinia';
import axios from '../../utils/axios';
import { useAuthStore } from '../auth';
import { PAYLINE_PATTERNS } from '../../constants/slots';

const API_URL = import.meta.env.VITE_API_URL;

interface Symbol {
  id: number;
  name: string;
  value: number;
  image: string;
}

interface SlotState {
  reels: Symbol[][];
  betAmount: number;
  isSpinning: boolean;
  autoPlay: boolean;
  autoPlayCount: number;
  lastWin: number;
  totalWin: number;
  balance: number;
  loading: boolean;
  error: string | null;
  currentGameId: string | null;
  paylines: number[][];
  winningLines: number[];
  multiplier: number;
}

export const useSlotStore = defineStore('slots', {
  state: (): SlotState => ({
    reels: Array(5).fill([]).map(() => Array(3).fill(null)),
    betAmount: 1,
    isSpinning: false,
    autoPlay: false,
    autoPlayCount: 0,
    lastWin: 0,
    totalWin: 0,
    balance: 0,
    loading: false,
    error: null,
    currentGameId: null,
    paylines: PAYLINE_PATTERNS,
    winningLines: [],
    multiplier: 1
  }),

  actions: {
    async spin() {
      const authStore = useAuthStore();
      
      if (!authStore.token) {
        this.error = 'Please login to play';
        return;
      }

      if (this.isSpinning) return;

      const currentBalance = authStore.userBalance;
      if (currentBalance < this.betAmount) {
        this.error = 'Insufficient balance';
        return;
      }

      // Reset state before spin
      this.isSpinning = true;
      this.loading = true;
      this.error = null;
      this.lastWin = 0;
      this.winningLines = [];
      this.multiplier = 1;

      try {
        // Get spin outcome from server
        const response = await axios.post(
          `${API_URL}/casino/slots/spin`,
          { betAmount: this.betAmount },
          {
            headers: {
              'Authorization': `Bearer ${authStore.token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success) {
          // Store the outcome but don't display yet
          const outcome = {
            gameId: response.data.gameId,
            reels: response.data.reels,
            winningLines: response.data.winningLines,
            winAmount: response.data.winAmount,
            multiplier: response.data.multiplier
          };

          // Wait for animation
          await this.animateSpin();

          // Update state with outcome
          this.currentGameId = outcome.gameId;
          this.reels = outcome.reels;
          this.lastWin = outcome.winAmount;
          this.totalWin += outcome.winAmount;
          this.winningLines = outcome.winningLines;
          this.multiplier = outcome.multiplier;

          // Update balance
          authStore.updateBalance(response.data.newBalance);
        }
      } catch (error: any) {
        console.error('[SLOTS] Error spinning:', error);
        this.error = error.response?.data?.message || 'Failed to spin';
      } finally {
        this.isSpinning = false;
        this.loading = false;
      }
    },

    async animateSpin() {
      return new Promise(resolve => {
        setTimeout(resolve, 4000); // Match the total animation time of reels
      });
    },

    setAutoPlay(count: number) {
      this.autoPlay = count > 0;
      this.autoPlayCount = count;
    },

    setBetAmount(amount: number) {
      if (!this.isSpinning) {
        this.betAmount = amount;
      }
    },

    resetGame() {
      this.isSpinning = false;
      this.autoPlay = false;
      this.autoPlayCount = 0;
      this.lastWin = 0;
      this.totalWin = 0;
      this.error = null;
      this.currentGameId = null;
      this.winningLines = [];
      this.multiplier = 1;
    }
  }
}); 