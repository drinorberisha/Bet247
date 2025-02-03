import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from '../auth';

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
    paylines: [
      [0,0,0,0,0], // horizontal lines
      [1,1,1,1,1],
      [2,2,2,2,2],
      // Add more paylines as needed
    ],
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

      this.isSpinning = true;
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post(
          `${API_URL}/casino/slots/spin`,
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
          this.currentGameId = response.data.gameId;
          this.reels = response.data.reels;
          this.lastWin = response.data.winAmount;
          this.totalWin += response.data.winAmount;
          this.winningLines = response.data.winningLines;
          this.multiplier = response.data.multiplier;
          authStore.updateBalance(response.data.newBalance);
          
          await this.animateSpin();
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
      // Implement spinning animation logic
      return new Promise(resolve => {
        setTimeout(resolve, 3000); // Basic delay for now
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