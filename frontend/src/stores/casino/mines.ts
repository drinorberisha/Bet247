import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from '../auth';

const API_URL = import.meta.env.VITE_API_URL;

interface MinesState {
  betAmount: number;
  minesCount: number;
  currentMultiplier: number;
  currentProfit: number;
  tiles: Array<{ position: number; isMine: boolean; revealed: boolean }>;
  isGameActive: boolean;
  loading: boolean;
  error: string | null;
  canCashout: boolean;
}

export const useMinesStore = defineStore('mines', {
  state: (): MinesState => ({
    betAmount: 1,
    minesCount: 5,
    currentMultiplier: 1,
    currentProfit: 0,
    tiles: Array(25).fill(null).map((_, index) => ({
      position: index,
      isMine: false,
      revealed: false
    })),
    isGameActive: false,
    loading: false,
    error: null,
    canCashout: false
  }),

  actions: {
    async startGame() {
      const authStore = useAuthStore();
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post(
          `${API_URL}/casino/mines/start`,
          {
            betAmount: this.betAmount,
            minesCount: this.minesCount
          },
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`
            }
          }
        );

        if (response.data.success) {
          this.isGameActive = true;
          this.canCashout = false;
          this.currentMultiplier = 1;
          this.currentProfit = 0;
          // Reset tiles
          this.tiles = Array(25).fill(null).map((_, index) => ({
            position: index,
            isMine: false,
            revealed: false
          }));
          // Update user's balance
          authStore.updateBalance(response.data.newBalance);
        }

      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to start game';
        console.error('Error starting mines game:', error);
      } finally {
        this.loading = false;
      }
    },

    async cashout() {
      if (!this.canCashout) return;

      const authStore = useAuthStore();
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post(
          `${API_URL}/casino/mines/cashout`,
          {
            winAmount: this.currentProfit
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
        console.error('Error processing mines cashout:', error);
      } finally {
        this.loading = false;
      }
    },

    resetGame() {
      this.isGameActive = false;
      this.canCashout = false;
      this.currentMultiplier = 1;
      this.currentProfit = 0;
      this.tiles.forEach(tile => {
        tile.revealed = false;
        tile.isMine = false;
      });
    },

    updateMultiplier() {
      // Calculate new multiplier based on revealed tiles and mines count
      const revealedCount = this.tiles.filter(t => t.revealed).length;
      const safeSpots = 25 - this.minesCount;
      this.currentMultiplier = (1 / (safeSpots - revealedCount)) * safeSpots;
      this.currentProfit = this.betAmount * this.currentMultiplier;
      this.canCashout = revealedCount > 0;
    }
  }
}); 