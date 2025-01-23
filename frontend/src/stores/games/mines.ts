import { defineStore } from 'pinia';
import { wsService } from '../../services/websocket';
import { useAuthStore } from '../auth';
import { useNotificationStore } from '../notification';

interface Tile {
  revealed: boolean;
  isMine: boolean;
}

interface MinesState {
  tiles: Tile[];
  gameId: string | null;
  betAmount: number;
  minesCount: number;
  currentMultiplier: number;
  currentProfit: number;
  isGameActive: boolean;
  loading: boolean;
  canCashout: boolean;
}

export const useMinesStore = defineStore('mines', {
  state: (): MinesState => ({
    tiles: Array(25).fill(null).map(() => ({
      revealed: false,
      isMine: false
    })),
    gameId: null,
    betAmount: 5,
    minesCount: 3,
    currentMultiplier: 1,
    currentProfit: 0,
    isGameActive: false,
    loading: false,
    canCashout: false
  }),

  actions: {
    setupWebSocketListeners() {
      console.log('Setting up WebSocket listeners');
      
      wsService.on('mines:start', (data) => {
        console.log('Received start response:', data);
        if (data.success) {
          this.gameId = data.data.gameId;
          this.isGameActive = true;
          this.loading = false;
          
          const notificationStore = useNotificationStore();
          notificationStore.show({
            type: 'success',
            message: 'Game started! Click tiles to reveal them.',
            duration: 3000
          });
        }
      });

      wsService.on('mines:reveal', (data) => {
        console.log('Received reveal response:', data);
        if (data.success) {
          const { tileIndex, isMine, currentMultiplier, currentProfit } = data.data;
          
          // Update tile state
          this.tiles[tileIndex] = {
            revealed: true,
            isMine: isMine
          };

          if (isMine) {
            this.gameOver(false);
          } else {
            this.currentMultiplier = currentMultiplier;
            this.currentProfit = currentProfit;
            this.canCashout = true;
          }
        }
        this.loading = false;
      });

      wsService.on('mines:cashout', (data) => {
        console.log('Received cashout response:', data);
        if (data.success) {
          const authStore = useAuthStore();
          authStore.updateBalance(data.data.newBalance);
          this.gameOver(true);
        }
        this.loading = false;
      });
    },

    async startGame() {
      if (this.loading || this.isGameActive) return;

      try {
        this.loading = true;
        
        // Reset game state
        this.tiles = Array(25).fill(null).map(() => ({
          revealed: false,
          isMine: false
        }));
        this.currentMultiplier = 1;
        this.currentProfit = 0;
        this.canCashout = false;
        this.gameId = null;

        console.log('Sending start game request:', {
          betAmount: this.betAmount,
          minesCount: this.minesCount
        });

        wsService.send('mines:start', {
          betAmount: this.betAmount,
          minesCount: this.minesCount
        });

      } catch (error: any) {
        this.loading = false;
        const notificationStore = useNotificationStore();
        notificationStore.show({
          type: 'error',
          message: error.message || 'Failed to start game',
          duration: 3000
        });
      }
    },

    async revealTile(index: number) {
      if (!this.isGameActive || this.tiles[index].revealed || this.loading) {
        console.log('Cannot reveal tile:', { 
          isGameActive: this.isGameActive, 
          isRevealed: this.tiles[index].revealed, 
          isLoading: this.loading 
        });
        return;
      }

      try {
        this.loading = true;
        console.log('Sending reveal request:', {
          gameId: this.gameId,
          tileIndex: index
        });

        wsService.send('mines:reveal', {
          gameId: this.gameId,
          tileIndex: index
        });

      } catch (error: any) {
        this.loading = false;
        const notificationStore = useNotificationStore();
        notificationStore.show({
          type: 'error',
          message: error.message || 'Failed to reveal tile',
          duration: 3000
        });
      }
    },

    async cashout() {
      if (!this.canCashout || this.loading) return;

      try {
        this.loading = true;
        console.log('Sending cashout request:', {
          gameId: this.gameId
        });

        wsService.send('mines:cashout', {
          gameId: this.gameId
        });

      } catch (error: any) {
        this.loading = false;
        const notificationStore = useNotificationStore();
        notificationStore.show({
          type: 'error',
          message: error.message || 'Failed to cashout',
          duration: 3000
        });
      }
    },

    gameOver(won: boolean) {
      this.isGameActive = false;
      this.canCashout = false;
      this.gameId = null;
      
      const notificationStore = useNotificationStore();
      if (won) {
        notificationStore.show({
          type: 'success',
          message: `Won ${this.currentProfit.toFixed(2)}€!`,
          duration: 3000
        });
      } else {
        notificationStore.show({
          type: 'error',
          message: 'Game Over! Hit a mine!',
          duration: 3000
        });
      }
    },

    resetGrid() {
      this.tiles = Array(25).fill(null).map(() => ({
        revealed: false,
        isMine: false
      }));
      this.currentMultiplier = 1;
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