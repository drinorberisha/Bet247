import { defineStore } from 'pinia';
import axios from '../../utils/axios';
import { useAuthStore } from '../auth';

const API_URL = import.meta.env.VITE_API_URL;

interface Symbol {
  id: number;
  name: string;
  image: string;
  value: number;
}

interface GameState {
  balance: number;
  betAmount: number;
  lastWin: number;
  totalWin: number;
  isSpinning: boolean;
  symbols: Symbol[];
  reels: Symbol[][];
  winningLines: number[];
  multiplier: number;
  loading: boolean;
  error: string | null;
  currentGameId: string | null;
  canCashout: boolean;
}

const getInitialReels = (symbols: Symbol[]): Symbol[][] => {
  return Array(3).fill(null).map(() => 
    Array(3).fill(null).map(() => 
      ({ ...symbols[Math.floor(Math.random() * symbols.length)] })
    )
  );
};

export const useHalloweenSlotsStore = defineStore('halloweenSlots', {
  state: (): GameState => {
    const symbols = [
      { id: 1, name: 'Pumpkin', image: '/img/pumpkin.png', value: 5 },
      { id: 2, name: 'Ghost', image: '/img/ghost.png', value: 10 },
      { id: 3, name: 'Hand', image: '/img/hand.png', value: 15 },
      { id: 4, name: 'Bats', image: '/img/bats.png', value: 20 },
      { id: 5, name: 'Hat', image: '/img/hat.png', value: 25 }
    ];
    
    return {
      balance: 0,
      betAmount: 1,
      lastWin: 0,
      totalWin: 0,
      isSpinning: false,
      loading: false,
      error: null,
      currentGameId: null,
      canCashout: false,
      multiplier: 1,
      symbols,
      reels: getInitialReels(symbols),
      winningLines: []
    };
  },

  getters: {
    canSpin: (state): boolean => {
      const authStore = useAuthStore();
      return authStore.userBalance >= state.betAmount && !state.isSpinning;
    },

    currentPayout: (state): number => {
      return state.lastWin * state.multiplier;
    },

    formattedBet: (state): string => {
      return `${state.betAmount.toFixed(2)}€`;
    },

    formattedLastWin: (state): string => {
      return `${state.lastWin.toFixed(2)}€`;
    }
  },

  actions: {
    async startGame() {
      const authStore = useAuthStore();
      
      if (!authStore.token) {
        this.error = 'Please login to play';
        return;
      }

      if (authStore.userBalance < this.betAmount) {
        this.error = 'Insufficient balance';
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post(
          `${API_URL}/casino/halloween-slots/start`,
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
          this.isSpinning = true;
          this.canCashout = false;
          authStore.updateBalance(response.data.newBalance);
          await this.spin();
        }
      } catch (error: any) {
        console.error('[HALLOWEEN-SLOTS] Error starting game:', error);
        this.error = error.response?.data?.message || 'Failed to start game';
      } finally {
        this.loading = false;
      }
    },

    async spin() {
      // Simulate spinning animation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate random results
      this.reels = this.reels.map(() => 
        Array(3).fill(null).map(() => 
          this.symbols[Math.floor(Math.random() * this.symbols.length)]
        )
      );

      // Calculate wins
      this.calculateWins();
    },

    calculateWins() {
      const authStore = useAuthStore();
      let totalWin = 0;
      const winningLines: number[] = [];

      // Check horizontal lines
      for (let row = 0; row < 3; row++) {
        const symbols = this.reels.map(reel => reel[row]);
        const firstSymbol = symbols[0];
        
        if (symbols.every(symbol => symbol.id === firstSymbol.id)) {
          totalWin += firstSymbol.value * this.betAmount;
          winningLines.push(row);
        }
      }

      this.lastWin = totalWin;
      this.winningLines = winningLines;
      this.isSpinning = false;

      if (totalWin > 0) {
        this.processWin(totalWin);
      }
    },

    async processWin(winAmount: number) {
      const authStore = useAuthStore();
      
      try {
        const response = await axios.post(
          `${API_URL}/casino/halloween-slots/win`,
          {
            gameId: this.currentGameId,
            winAmount
          },
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`
            }
          }
        );

        if (response.data.success) {
          authStore.updateBalance(response.data.newBalance);
          this.totalWin += winAmount;
        }
      } catch (error: any) {
        console.error('[HALLOWEEN-SLOTS] Error processing win:', error);
        this.error = error.response?.data?.message || 'Failed to process win';
      }
    },

    resetGame() {
      this.isSpinning = false;
      this.lastWin = 0;
      this.totalWin = 0;
      this.error = null;
      this.currentGameId = null;
      this.winningLines = [];
      this.multiplier = 1;
      this.reels = [[], [], []];
    },

    increaseBet() {
      const maxBet = 100; // Set your maximum bet limit
      if (this.betAmount < maxBet) {
        this.betAmount = Math.min(this.betAmount + 1, maxBet);
      }
    },

    decreaseBet() {
      const minBet = 1; // Set your minimum bet limit
      if (this.betAmount > minBet) {
        this.betAmount = Math.max(this.betAmount - 1, minBet);
      }
    }
  }
}); 