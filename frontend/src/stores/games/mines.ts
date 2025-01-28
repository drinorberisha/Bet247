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
      
      wsService.on('connect', () => {
        console.log('WebSocket connected successfully');
      });

      wsService.on('disconnect', () => {
        console.log('WebSocket disconnected');
        this.isGameActive = false;
      });
      
      wsService.on('error', (error) => {
        console.log('WebSocket error:', error);
        const notificationStore = useNotificationStore();
        const authStore = useAuthStore();
        
        if (error.message?.includes('jwt')) {
          // Handle authentication error
          authStore.logout();
          notificationStore.show({
            type: 'error',
            message: 'Session expired. Please login again.',
            duration: 3000
          });
        }
      });

      wsService.on('mines:start', (data) => {
        console.log('Received start response:', data);
        if (data.success) {
          this.gameId = data.data.gameId;
          this.isGameActive = true;
          this.loading = false;
          
          console.log('Game state after start:', {
            gameId: this.gameId,
            isGameActive: this.isGameActive,
            loading: this.loading
          });

          const notificationStore = useNotificationStore();
          notificationStore.show({
            type: 'success',
            message: data.data.message || 'Game started! Click tiles to reveal them.',
            duration: 3000
          });
        } else {
          this.loading = false;
          const notificationStore = useNotificationStore();
          notificationStore.show({
            type: 'error',
            message: data.message || 'Failed to start game',
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

          if (!isMine) {
            this.currentMultiplier = currentMultiplier;
            this.currentProfit = currentProfit;
            this.canCashout = true;
          }
        }
        this.loading = false;
      });

      // Add handler for game over event
      wsService.on('mines:gameover', (data) => {
        console.log('Received game over response:', data);
        const { minePositions, revealedPositions } = data.data;
        
        // Reveal all mines
        minePositions.forEach((position: number) => {
          this.tiles[position] = {
            revealed: true,
            isMine: true
          };
        });
        
        // Reveal all previously revealed safe tiles
        revealedPositions.forEach((position: number) => {
          if (!minePositions.includes(position)) {
            this.tiles[position] = {
              revealed: true,
              isMine: false
            };
          }
        });
        
        // Reset game state
        this.isGameActive = false;
        this.canCashout = false;
        this.loading = false;
        
        // Show game over notification
        const notificationStore = useNotificationStore();
        notificationStore.show({
          type: 'error',
          message: 'Game Over - You hit a mine!',
          duration: 3000
        });
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
        console.log('Starting game - initial state:', {
          loading: this.loading,
          isGameActive: this.isGameActive
        });
        
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

        // Modified to match backend's expected format
        wsService.send('mines:start', {
          action: 'mines:start',
          data: {
            betAmount: this.betAmount,
            minesCount: this.minesCount
          }
        });

      } catch (error: any) {
        console.error('Error starting game:', error);
        this.loading = false;
        this.isGameActive = false;
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