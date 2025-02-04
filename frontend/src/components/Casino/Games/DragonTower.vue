<template>
  <div class="dragon-tower-game">
    <div class="game-header">
      <div class="stats-container">
        <div class="stat-box">
          <span class="stat-label">Next Profit</span>
          <span class="stat-value"
            >{{ dragonTowerStore.currentProfit.toFixed(2) }}€</span
          >
        </div>
        <div class="stat-box">
          <span class="stat-label">Multiplier</span>
          <span class="stat-value"
            >{{ dragonTowerStore.currentMultiplier }}x</span
          >
        </div>
        <div class="stat-box">
          <span class="stat-label">Dragons Per Row</span>
          <span class="stat-value">{{ dragonTowerStore.dragonsPerRow }}</span>
        </div>
      </div>
    </div>

    <div class="tower-container">
      <div
        v-for="(row, rowIndex) in reversedRows"
        :key="rowIndex"
        class="tower-row"
        :class="{
          'active-row': isActiveRow(rowIndex),
          'completed-row': isCompletedRow(rowIndex),
        }"
      >
        <div
          v-for="(tile, tileIndex) in row.tiles.slice(
            0,
            DIFFICULTY_CONFIGS[dragonTowerStore.difficulty].columns
          )"
          :key="tileIndex"
          class="tile"
          :class="{
            revealed: tile.revealed,
            dragon: tile.revealed && tile.isDragon,
            'dragon-clicked':
              tile.revealed &&
              tile.isDragon &&
              9 - rowIndex === dragonTowerStore.currentRow,
            'dragon-revealed':
              tile.revealed &&
              tile.isDragon &&
              9 - rowIndex !== dragonTowerStore.currentRow,
            safe: tile.revealed && !tile.isDragon,
            'revealed-dragon':
              !tile.revealed && tile.isDragon && !dragonTowerStore.isGameActive,
          }"
          @click="handleTileClick(9 - rowIndex, tileIndex)"
        >
          <span
            v-if="tile.revealed && !tile.isDragon"
            class="safe-emoji glow-effect"
            >🥚</span
          >
          <span v-if="tile.revealed && tile.isDragon" class="dragon-emoji"
            >🐉</span
          >
          <span
            v-if="
              !tile.revealed && tile.isDragon && !dragonTowerStore.isGameActive
            "
            class="revealed-dragon-emoji"
            >��</span
          >
        </div>
      </div>
    </div>

    <div class="game-controls">
      <div class="bet-controls">
        <label class="control-label">Bet Amount</label>
        <div class="bet-input-container">
          <input
            type="number"
            v-model="dragonTowerStore.betAmount"
            :disabled="dragonTowerStore.isGameActive"
            min="1"
            step="1"
            class="bet-amount-input"
          />
          <div class="quick-amounts">
            <button
              v-for="amount in [1, 5, 10, 25]"
              :key="amount"
              @click="setBetAmount(amount)"
              class="quick-amount-btn"
              :disabled="dragonTowerStore.isGameActive"
            >
              {{ amount }}
            </button>
          </div>
        </div>
      </div>

      <div class="difficulty-controls">
        <label>Difficulty</label>
        <select
          v-model="dragonTowerStore.difficulty"
          :disabled="dragonTowerStore.isGameActive"
          class="difficulty-select"
        >
          <option value="EASY">Easy (4 rows, 1 dragon per row)</option>
          <option value="MEDIUM">Medium (3 rows, 1 dragon per row)</option>
          <option value="HARD">Hard (2 rows, 1 dragon per row)</option>
          <option value="EXPERT">Expert (3 rows, 2 dragons per row)</option>
          <option value="MASTER">Master (4 rows, 3 dragons per row)</option>
        </select>
      </div>

      <div class="action-buttons">
        <button
          v-if="!dragonTowerStore.isGameActive"
          class="main-btn"
          @click="handleGameAction"
          :disabled="dragonTowerStore.loading"
        >
          {{ gameActionText }}
        </button>
        <button
          v-else
          class="cashout-btn"
          @click="dragonTowerStore.cashout"
          :disabled="!dragonTowerStore.canCashout || dragonTowerStore.loading"
        >
          Cashout ({{ dragonTowerStore.currentMultiplier }}x)
        </button>
        <button
          class="clear-btn"
          @click="dragonTowerStore.resetTower"
          :disabled="dragonTowerStore.isGameActive"
        >
          Clear
        </button>
      </div>
    </div>

    <Transition name="modal">
      <div v-if="showWinModal" class="win-modal">
        <div class="modal-content">
          <h2>WIN!</h2>
          <div class="win-amount">
            {{
              (
                dragonTowerStore.betAmount * dragonTowerStore.currentMultiplier
              ).toFixed(2)
            }}€
          </div>
          <div class="multiplier">
            x{{ dragonTowerStore.currentMultiplier }}
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  useDragonTowerStore,
  DIFFICULTY_CONFIGS,
} from "../../../stores/casino/dragonTower";
import { storeToRefs } from "pinia";

const dragonTowerStore = useDragonTowerStore();
const { loading, isGameActive, currentMultiplier, currentProfit } =
  storeToRefs(dragonTowerStore);

const reversedRows = computed(() => [...dragonTowerStore.rows].reverse());

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
  if (loading.value) return "Processing...";
  return "Play";
});

const handleGameAction = async () => {
  await dragonTowerStore.startGame();
};

const handleTileClick = (rowIndex: number, tileIndex: number) => {
  // Only allow clicking tiles in the current active row
  if (
    dragonTowerStore.isGameActive &&
    !dragonTowerStore.loading &&
    rowIndex === dragonTowerStore.currentRow
  ) {
    dragonTowerStore.revealTile(rowIndex, tileIndex);
  }
};

const setBetAmount = (amount: number) => {
  if (!isGameActive.value) {
    dragonTowerStore.betAmount = amount;
  }
};

const isActiveRow = (rowIndex: number) => {
  return 9 - rowIndex === dragonTowerStore.currentRow;
};

const isCompletedRow = (rowIndex: number) => {
  return 9 - rowIndex < dragonTowerStore.currentRow;
};

// Add this after the existing watch
watch(
  () => dragonTowerStore.difficulty,
  (newDifficulty) => {
    if (!dragonTowerStore.isGameActive) {
      const config = DIFFICULTY_CONFIGS[newDifficulty];
      dragonTowerStore.maxColumns = config.columns;
      dragonTowerStore.dragonsPerRow = config.dragonsPerRow;
      dragonTowerStore.baseMultiplier = config.baseMultiplier;
    }
  }
);
</script>

<style scoped>
.dragon-tower-game {
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
  color: #fff;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: bold;
  color: var(--white);
}

.tower-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 2rem;
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.tower-row {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  width: 100%;
}

.tile {
  flex: 1;
  aspect-ratio: 1;
  min-width: 40px;
  max-width: 80px;
  background: var(--subheader);
  border: 2px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

/* Unrevealed tile hover effect */
.tile:not(.revealed):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-color: var(--active-color);
}

/* Safe tile with diamond */
.tile.safe {
  background: linear-gradient(145deg, #2ecc71 0%, #27ae60 100%);
  border-color: #2ecc71;
  box-shadow: 0 0 15px rgba(46, 204, 113, 0.3);
  position: relative;
  overflow: visible; /* Allow glow to extend outside tile */
}

.safe-emoji,
.dragon-emoji,
.revealed-dragon-emoji {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
}

/* Add new styles for the glowing effect */
.glow-effect {
  animation: glow 2s ease-in-out infinite;
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.7))
    drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
}

@keyframes glow {
  0% {
    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.7))
      drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
  }
  50% {
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.9))
      drop-shadow(0 0 20px rgba(255, 215, 0, 0.7))
      drop-shadow(0 0 25px rgba(255, 215, 0, 0.5));
  }
  100% {
    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.7))
      drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
  }
}

/* Dragon tile styling */
.tile.dragon {
  background: linear-gradient(145deg, #ff4444 0%, #cc0000 100%);
  border-color: #ff4444;
  box-shadow: 0 0 15px rgba(255, 68, 68, 0.3);
}

/* Dragon tile that was clicked (causing loss) */
.tile.dragon-clicked {
  background: linear-gradient(145deg, #ff4444 0%, #cc0000 100%);
  border-color: #ff4444;
  box-shadow: 0 0 15px rgba(255, 68, 68, 0.3);
}

/* Other revealed dragon tiles */
.tile.dragon-revealed {
  background: linear-gradient(
    145deg,
    rgba(255, 68, 68, 0.5),
    rgba(204, 0, 0, 0.5)
  );
  border-color: rgba(255, 68, 68, 0.5);
  opacity: 0.6;
}

/* Dragons revealed after game end */
.revealed-dragon {
  background: rgba(255, 68, 68, 0.3);
  border-color: rgba(255, 68, 68, 0.3);
}

.revealed-dragon-emoji {
  opacity: 0.5;
}

/* Active row highlighting */
.active-row .tile:not(.revealed) {
  border-color: var(--active-color);
  box-shadow: 0 0 10px rgba(var(--active-color-rgb), 0.2);
}

/* Completed row styling */
.completed-row .tile:not(.revealed) {
  opacity: 0.7;
}

.game-controls {
  margin-top: 2rem;
}

.bet-controls {
  background: var(--subheader);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.control-label {
  display: block;
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.bet-input-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.bet-amount-input {
  width: 100%;
  padding: 0.75rem;
  background: var(--header);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--white);
  font-size: 1.1rem;
  text-align: center;
}

.bet-amount-input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.quick-amounts {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.quick-amount-btn {
  padding: 0.75rem;
  background: var(--header);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--white);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-amount-btn:hover:not(:disabled) {
  background: var(--active-color);
  border-color: var(--active-color);
}

.quick-amount-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.main-btn,
.cashout-btn,
.clear-btn {
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

.clear-btn {
  background: var(--subheader);
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.clear-btn:hover:not(:disabled) {
  background: var(--header);
  color: var(--white);
}

.main-btn:disabled,
.cashout-btn:disabled,
.clear-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.difficulty-controls {
  margin-bottom: 1rem;
}

.difficulty-select {
  width: 100%;
  padding: 0.75rem;
  background: var(--subheader);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--white);
  font-size: 1rem;
  cursor: pointer;
}

.difficulty-select:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.difficulty-select option {
  background: var(--header);
  color: var(--white);
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .tower-container {
    padding: 0 1rem;
  }

  .tile {
    min-width: 30px;
    max-width: 60px;
  }

  .tile.revealed.dragon::after {
    font-size: 1.2rem;
  }

  .action-buttons {
    grid-template-columns: 1fr;
  }

  .bet-controls {
    padding: 1rem;
  }

  .glow-effect {
    animation: glow 2s ease-in-out infinite;
    filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.7))
      drop-shadow(0 0 6px rgba(255, 215, 0, 0.5));
  }
}
</style>
