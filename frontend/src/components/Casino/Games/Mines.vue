<template>
  <div class="mines-game">
    <div class="game-header">
      <div class="stats-container">
        <div class="stat-box">
          <span class="stat-label">Next Profit</span>
          <span class="stat-value">{{ minesStore.currentProfit.toFixed(2) }}€</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Multiplier</span>
          <span class="stat-value">{{ minesStore.currentMultiplier }}x</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Mines</span>
          <span class="stat-value">{{ minesStore.minesCount }}</span>
        </div>
      </div>
    </div>

    <div class="mines-grid">
      <button
        v-for="(tile, index) in minesStore.tiles"
        :key="index"
        :class="[
          'tile',
          { revealed: tile.revealed },
          { mine: tile.revealed && tile.isMine },
          { diamond: tile.revealed && !tile.isMine },
          { 'tile-hover': minesStore.isGameActive && !tile.revealed }
        ]"
        @click="handleTileClick(index)"
        :disabled="!minesStore.isGameActive || minesStore.loading || tile.revealed"
      >
        <div class="tile-content">
          <div class="tile-front">
            <i class="fas fa-question"></i>
          </div>
          <div class="tile-back">
            <template v-if="tile.revealed">
              <i v-if="tile.isMine" class="fas fa-bomb bomb-icon"></i>
              <i v-else class="fas fa-gem gem-icon"></i>
            </template>
          </div>
        </div>
      </button>
    </div>

    <div class="game-controls">
      <div class="bet-controls">
        <label>Bet Amount</label>
        <div class="bet-input">
          <input 
            type="number" 
            v-model="minesStore.betAmount"
            :disabled="minesStore.isGameActive"
            min="1"
            step="1"
          />
          <div class="quick-amounts">
            <button @click="setBetAmount(1)">1</button>
            <button @click="setBetAmount(5)">5</button>
            <button @click="setBetAmount(10)">10</button>
            <button @click="setBetAmount(25)">25</button>
          </div>
        </div>

        <label>Mines Count</label>
        <div class="mines-input">
          <input 
            type="number" 
            v-model="minesStore.minesCount"
            :disabled="minesStore.isGameActive"
            min="1"
            max="24"
            step="1"
          />
          <div class="quick-mines">
            <button @click="setMinesCount(3)">3</button>
            <button @click="setMinesCount(5)">5</button>
            <button @click="setMinesCount(10)">10</button>
            <button @click="setMinesCount(15)">15</button>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button 
          v-if="!minesStore.isGameActive"
          class="main-btn"
          @click="handleGameAction"
          :disabled="minesStore.loading"
        >
          {{ gameActionText }}
        </button>
        <button 
          v-else
          class="cashout-btn"
          @click="minesStore.cashout"
          :disabled="!minesStore.canCashout || minesStore.loading"
        >
          Cashout ({{ minesStore.currentMultiplier }}x)
        </button>
      </div>
    </div>

    <Transition name="modal">
      <div v-if="showWinModal" class="win-modal">
        <div class="modal-content">
          <h2>WIN!</h2>
          <div class="win-amount">{{ (minesStore.betAmount * minesStore.currentMultiplier).toFixed(2) }}€</div>
          <div class="multiplier">x{{ minesStore.currentMultiplier }}</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useMinesStore } from '../../../stores/casino/mines';
import { storeToRefs } from 'pinia';

const minesStore = useMinesStore();
const { loading, isGameActive, currentMultiplier, currentProfit } = storeToRefs(minesStore);

const showWinModal = ref(false);

// Watch for wins
watch(currentProfit, (newProfit) => {
  if (newProfit > 0 && !isGameActive.value) {
    showWinModal.value = true;
    setTimeout(() => {
      showWinModal.value = false;
    }, 3000);
  }
});

const gameActionText = computed(() => {
  if (loading.value) return 'Processing...';
  return 'Play';
});

const handleGameAction = async () => {
  await minesStore.startGame();
};

const handleTileClick = (index: number) => {
  if (minesStore.isGameActive && !minesStore.loading) {
    const tile = document.querySelectorAll('.tile')[index];
    tile.style.setProperty('--index', index.toString());
    minesStore.revealTile(index);
  }
};

const setBetAmount = (amount: number) => {
  if (!isGameActive.value) {
    minesStore.betAmount = amount;
  }
};

const setMinesCount = (count: number) => {
  if (!isGameActive.value) {
    minesStore.minesCount = count;
  }
};
</script>

<style scoped>
.mines-game {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--header);
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.stats-container {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-box {
  flex: 1;
  padding: 1.25rem;
  background: var(--subheader);
  border-radius: 12px;
  text-align: center;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-label {
  display: block;
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: bold;
  color: var(--white);
}

.mines-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin: 2rem 0;
  padding: 1.5rem;
  background: var(--subheader);
  border-radius: 16px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  perspective: 1000px;
}

.tile {
  position: relative;
  aspect-ratio: 1;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tile-content {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.tile-front,
.tile-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 1.3rem;
}

.tile-front {
  background: linear-gradient(145deg, var(--pointbox) 0%, var(--header) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
}

.tile-back {
  transform: rotateY(180deg);
}

.tile.revealed {
  transform: rotateY(180deg);
}

.tile.mine .tile-back {
  background: linear-gradient(145deg, #dc3545 0%, #9e1c28 100%);
  border: 1px solid rgba(220, 53, 69, 0.5);
}

.tile.diamond .tile-back {
  background: linear-gradient(145deg, #20e920 0%, #15a815 100%);
  border: 1px solid rgba(32, 233, 32, 0.5);
}

.bomb-icon {
  color: #fff;
  animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both;
}

.gem-icon {
  color: #fff;
  animation: shine 0.4s ease-in-out;
}

.tile-hover:not(:disabled):hover {
  transform: translateZ(20px);
  filter: brightness(1.2);
}

.tile-hover:not(:disabled):hover .tile-front {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

@keyframes shine {
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.2); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

/* Reveal animation for game over */
.tile.revealed {
  animation: reveal 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes reveal {
  0% {
    transform: rotateY(0) scale(1);
  }
  100% {
    transform: rotateY(180deg) scale(1);
  }
}

/* Stagger the reveal animation for each tile */
.mines-grid .tile.revealed {
  animation-delay: calc(var(--index) * 20ms);
}

.game-controls {
  margin-top: 2rem;
}

.bet-controls {
  margin-bottom: 1rem;
}

.bet-input, .mines-input {
  margin-bottom: 1rem;
}

.quick-amounts, .quick-mines {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.quick-amounts button, .quick-mines button {
  flex: 1;
  padding: 0.5rem;
  background: var(--subheader);
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--white);
  cursor: pointer;
}

.main-btn, .cashout-btn {
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  border: none;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.main-btn {
  background: var(--active-color);
  color: var(--white);
}

.cashout-btn {
  background: #20e920;
  color: var(--white);
}

.win-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
}

.modal-content {
  background: var(--header);
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  width: 200px;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
  animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes bounceIn {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.1); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); opacity: 1; }
}

@media (max-width: 768px) {
  .mines-grid {
    gap: 8px;
    padding: 1rem;
  }
  
  .tile-front,
  .tile-back {
    font-size: 1rem;
  }
}
</style> 