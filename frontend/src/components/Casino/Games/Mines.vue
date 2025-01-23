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

    <div class="game-controls">
      <div class="bet-controls">
        <div class="input-group">
          <label>Bet Amount</label>
          <div class="amount-input">
            <input 
              type="number" 
              v-model="betAmount" 
              :disabled="gameStarted"
              min="0.1" 
              step="0.1"
            />
            <span class="currency">€</span>
          </div>
        </div>
        <div class="input-group">
          <label>Number of Mines</label>
          <div class="amount-input">
            <input 
              type="number" 
              v-model="minesCount" 
              :disabled="gameStarted"
              min="1" 
              max="24" 
            />
            <i class="fas fa-bomb"></i>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button 
          class="game-button start-button" 
          @click="startGame" 
          :disabled="gameStarted"
        >
          <i class="fas fa-play"></i>
          Start Game
        </button>
        <button 
          class="game-button cashout-button" 
          @click="cashout" 
          :disabled="!gameStarted || !canCashout"
        >
          <i class="fas fa-coins"></i>
          Cashout {{ currentProfit }}€
        </button>
      </div>
    </div>

    <div class="mines-grid">
      <div 
        v-for="(tile, index) in tiles" 
        :key="index"
        class="mine-tile"
        :class="{
          'revealed': tile.revealed,
          'gem': tile.revealed && !tile.isMine,
          'mine': tile.revealed && tile.isMine,
          'clickable': !tile.revealed && gameStarted
        }"
        @click="revealTile(index)"
      >
        <template v-if="tile.revealed">
          <i v-if="tile.isMine" class="fas fa-bomb"></i>
          <i v-else class="fas fa-gem"></i>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMinesStore } from '../../../stores/games/mines';
import { storeToRefs } from 'pinia';

const minesStore = useMinesStore();
const { 
  tiles, 
  betAmount, 
  minesCount, 
  isGameActive, 
  currentMultiplier, 
  currentProfit, 
  loading, 
  canCashout 
} = storeToRefs(minesStore);

// Use store actions directly
const startGame = () => minesStore.startGame();
const revealTile = (index: number) => minesStore.revealTile(index);
const cashout = () => minesStore.cashout();

const gameStarted = ref(false);

const nextProfit = computed(() => {
  return (betAmount.value * currentMultiplier.value).toFixed(2);
});

const resetGrid = () => {
  tiles.value = Array(25).fill(null).map(() => ({
    revealed: false,
    isMine: false
  }));
  currentProfit.value = 0;
};
</script>

<style scoped>
.mines-game {
  padding: 2rem;
  background: var(--header);
  border-radius: 12px;
  color: var(--white);
}

.game-header {
  margin-bottom: 2rem;
}

.stats-container {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.stat-box {
  background: var(--surface-color);
  padding: 1rem 1.5rem;
  border-radius: 8px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border: 1px solid var(--leftpreborder);
}

.stat-label {
  color: var(--textcolor);
  font-size: 0.875rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--white);
}

.game-controls {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.bet-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  color: var(--textcolor);
  font-size: 0.875rem;
}

.amount-input {
  position: relative;
  display: flex;
  align-items: center;
}

.amount-input input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--surface-color);
  border: 1px solid var(--leftpreborder);
  border-radius: 8px;
  color: var(--white);
  font-size: 1rem;
}

.amount-input .currency,
.amount-input i {
  position: absolute;
  right: 1rem;
  color: var(--textcolor);
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.game-button {
  padding: 1rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.start-button {
  background: var(--active-color);
  color: var(--white);
}

.start-button:hover:not(:disabled) {
  background: var(--active-hover);
}

.cashout-button {
  background: var(--success);
  color: var(--white);
}

.cashout-button:hover:not(:disabled) {
  filter: brightness(1.1);
}

.game-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mines-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
  padding: 1rem;
  background: var(--surface-color);
  border-radius: 12px;
  border: 1px solid var(--leftpreborder);
}

.mine-tile {
  aspect-ratio: 1;
  background: var(--header);
  border: 1px solid var(--leftpreborder);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.2s ease;
}

.mine-tile.clickable:hover {
  background: var(--active-color);
  cursor: pointer;
}

.mine-tile.revealed.gem {
  background: var(--success);
  border-color: var(--success);
}

.mine-tile.revealed.mine {
  background: var(--error);
  border-color: var(--error);
}

.mine-tile i {
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.2s ease;
}

.mine-tile.revealed i {
  opacity: 1;
  transform: scale(1);
}
</style> 