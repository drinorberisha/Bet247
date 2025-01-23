import { defineStore } from 'pinia';
import { useAuthStore } from '../auth';
import { useNotificationStore } from '../notification';
import { wsService } from '../../services/websocket';

interface MinesTile {
  revealed: boolean;
  isMine: boolean;
}

interface MinesState {
  gameId: string | null;
  tiles: MinesTile[];
  betAmount: number;
  minesCount: number;
  isGameActive: boolean;
  currentMultiplier: number;
  currentProfit: number;
  loading: boolean;
  error: string | null;
  canCashout: boolean;
}

export const useMinesStore = defineStore('mines', {
  state: (): MinesState => ({
    gameId: null,
    tiles: Array(25).fill(null).map(() => ({
      revealed: false,
      isMine: false
    })),
    betAmount: 1.00,
    minesCount: 3,
    isGameActive: false,
    currentMultiplier: 1.00,
    currentProfit: 0,
    loading: false,
    error: null,
    canCashout: false
  }),

  actions: {
    async startGame() {
      const authStore = useAuthStore();
      const notificationStore = useNotificationStore();

      if (!authStore.isAuthenticated) {
        notificationStore.show({
          type: 'error',
          message: 'Please login to play'
        });
        return;
      }

      try {
        this.loading = true;
        wsService.send('mines:start', {
          betAmount: this.betAmount,
          minesCount: this.minesCount
        });

        // Handle response
        wsService.on('mines:start', (data) => {
          this.gameId = data.gameId;
          this.isGameActive = true;
          this.canCashout = false;
          this.resetGrid();
          
          // Update user balance
          authStore.updateBalance(data.newBalance);
        });

      } catch (error: any) {
        this.handleError(error);
      } finally {
        this.loading = false;
      }
    },

    async revealTile(index: number) {
      if (!this.isGameActive || this.tiles[index].revealed) return;

      const authStore = useAuthStore();
      const notificationStore = useNotificationStore();

      try {
        this.loading = true;
        wsService.send('mines:reveal', {
          gameId: this.gameId,
          tileIndex: index
        });

        // Handle response
        wsService.on('mines:reveal', (data) => {
          // Update tile state
          this.tiles[index] = {
            revealed: true,
            isMine: data.isMine
          };

          if (data.isMine) {
            this.gameOver(false);
          } else {
            this.currentMultiplier = data.multiplier;
            this.currentProfit = data.currentProfit;
            this.canCashout = true;
          }
        });

      } catch (error: any) {
        this.handleError(error);
      } finally {
        this.loading = false;
      }
    },

    async cashout() {
      if (!this.canCashout) return;

      const authStore = useAuthStore();
      const notificationStore = useNotificationStore();

      try {
        this.loading = true;
        wsService.send('mines:cashout', {
          gameId: this.gameId
        });

        // Handle response
        wsService.on('mines:cashout', (data) => {
          // Update user balance
          authStore.updateBalance(data.newBalance);

          // Show success notification
          notificationStore.show({
            type: 'success',
            message: `Successfully cashed out ${this.currentProfit.toFixed(2)}!`,
            duration: 3000
          });

          this.gameOver(true);
        });

      } catch (error: any) {
        this.handleError(error);
      } finally {
        this.loading = false;
      }
    },

    gameOver(success: boolean) {
      this.isGameActive = false;
      this.canCashout = false;
      
      const notificationStore = useNotificationStore();
      if (!success) {
        notificationStore.show({
          type: 'error',
          message: 'Game Over! You hit a mine!',
          duration: 3000
        });
      }
    },

    resetGrid() {
      this.tiles = Array(25).fill(null).map(() => ({
        revealed: false,
        isMine: false
      }));
      this.currentMultiplier = 1.00;
      this.currentProfit = 0;
    },

    updateBetAmount(amount: number) {
      this.betAmount = amount;
    },

    updateMinesCount(count: number) {
      this.minesCount = count;
    },

    handleError(error: any) {
      this.error = error.message;
      const notificationStore = useNotificationStore();
      notificationStore.show({
        type: 'error',
        message: error.message,
        duration: 3000
      });
    }
  },

  getters: {
    revealedCount: (state) => {
      return state.tiles.filter(tile => tile.revealed).length;
    },
    
    nextMultiplier: (state) => {
      // Calculate the next potential multiplier based on revealed tiles and mines count
      const revealed = state.tiles.filter(tile => tile.revealed).length;
      const remaining = 25 - revealed;
      const safeSpots = remaining - state.minesCount;
      return safeSpots > 0 ? (25 / safeSpots) : 1;
    }
  }
}); 