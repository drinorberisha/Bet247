<template>
  <div class="mines-game">
    <div class="game-header">
      <div class="stats-container">
        <div class="stat-box">
          <span class="stat-label">Next Profit</span>
          <span class="stat-value">{{ nextProfit }}€</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Multiplier</span>
          <span class="stat-value">{{ currentMultiplier }}x</span>
        </div>
      </div>
    </div>

    <div class="game-grid">
      <div 
        v-for="(tile, index) in tiles" 
        :key="index"
        :class="[
          'tile',
          { 'revealed': tile.revealed },
          { 'mine': tile.revealed && tile.isMine },
          { 'diamond': tile.revealed && !tile.isMine }
        ]"
        @click="handleTileClick(index)"
      >
        <template v-if="tile.revealed">
          <i v-if="tile.isMine" class="fas fa-bomb"></i>
          <i v-else class="fas fa-gem"></i>
        </template>
      </div>
    </div>

    <div class="game-info">
      <div class="multiplier">
        Multiplier: {{ currentMultiplier }}x
      </div>
      <div class="profit">
        Profit: {{ currentProfit.toFixed(2) }}€
      </div>
    </div>

    <div class="game-controls">
      <div class="bet-controls">
        <div class="input-group">
          <label>Bet Amount</label>
          <input 
            type="number" 
            v-model="betAmount" 
            :disabled="isGameActive"
            min="0.1" 
            step="0.1"
          />
        </div>
        <div class="input-group">
          <label>Mines Count</label>
          <input 
            type="number" 
            v-model="minesCount" 
            :disabled="isGameActive"
            min="1" 
            max="24"
          />
        </div>
      </div>

      <button 
        :class="['action-button', { 'cashout': isGameActive }]"
        :disabled="loading || (isGameActive && !canCashout)"
        @click="handleGameAction"
      >
        <i :class="isGameActive ? 'fas fa-coins' : 'fas fa-play'"></i>
        {{ isGameActive ? 'Cashout' : 'Start Game' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useMinesStore } from '../../../stores/games/mines';

const minesStore = useMinesStore();
const { 
  tiles, 
  betAmount, 
  minesCount, 
  currentMultiplier, 
  currentProfit,
  loading, 
  canCashout,
  isGameActive 
} = storeToRefs(minesStore);

// Initialize WebSocket listeners when component mounts
onMounted(() => {
  minesStore.setupWebSocketListeners();
});

// Handle tile click
const handleTileClick = (index: number) => {
  console.log('Tile clicked:', {
    index,
    isGameActive: isGameActive.value,
    isRevealed: tiles.value[index].revealed
  });
  if (isGameActive.value && !tiles.value[index].revealed && !loading.value) {
    minesStore.revealTile(index);
  }
};

// Handle game action (start/cashout)
const handleGameAction = () => {
  if (isGameActive.value) {
    minesStore.cashout();
  } else {
    minesStore.startGame();
  }
};

// Calculate next profit
const nextProfit = computed(() => {
  return (betAmount.value * currentMultiplier.value).toFixed(2);
});
</script>

<style scoped>
.mines-game {
  max-width: 600px;
  margin: 0 auto;
  padding: 1.5rem;
  background: #1a1d24;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin: 1.5rem 0;
  padding: 1rem;
  background: #242830;
  border-radius: 12px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.tile {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2d3139;
  border: 2px solid #363a47;
  border-radius: 8px;
  font-size: 1.4rem;
  transition: all 0.2s ease;
  color: #8a8d94;
  cursor: pointer;
}

.tile:hover:not(.revealed) {
  background: #3a3f4c;
  transform: translateY(-2px);
  cursor: pointer;
  border-color: #4a4f5c;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.tile.revealed {
  cursor: default;
}

.tile.mine {
  background: #e74c3c;
  border-color: #c0392b;
  color: white;
  animation: reveal 0.3s ease-out;
}

.tile.diamond {
  background: #2ecc71;
  border-color: #27ae60;
  color: white;
  animation: reveal 0.3s ease-out;
}

.stats-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-box {
  flex: 1;
  padding: 1rem;
  background: #242830;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-label {
  display: block;
  font-size: 0.9rem;
  color: #8a8d94;
  margin-bottom: 0.3rem;
}

.stat-value {
  display: block;
  font-size: 1.4rem;
  font-weight: bold;
  color: #ffffff;
}

.game-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.game-controls {
  margin-top: 1.5rem;
}

.bet-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.input-group {
  flex: 1;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #8a8d94;
  font-size: 0.9rem;
}

.input-group input {
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #363a47;
  background: transparent;
  color: white;
  width: 100%;
  outline: none;
}

.action-button {
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  border: none;
  background: #3498db;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-button.cashout {
  background: #2ecc71;
}

@keyframes reveal {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style> 