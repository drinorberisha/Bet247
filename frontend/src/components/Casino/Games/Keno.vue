<template>
  <div class="keno-game">
    <div class="game-header">
      <div class="stats-container">
        <div class="stat-box">
          <span class="stat-label">Selected</span>
          <span class="stat-value">{{ selectedNumbers.length }}/10</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Matches</span>
          <span class="stat-value">{{ matches.length }}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Win Amount</span>
          <span class="stat-value">{{ winAmount.toFixed(2) }}€</span>
        </div>
      </div>
    </div>

    <div class="keno-grid">
      <button
        v-for="number in 40"
        :key="number"
        :class="[
          'number-tile',
          { selected: selectedNumbers.includes(number) },
          { 'drawn-match': matches.includes(number) },
          {
            'drawn-miss':
              drawnNumbers.includes(number) && !matches.includes(number),
          },
        ]"
        @click="selectNumber(number)"
        :disabled="
          isGameActive ||
          (selectedNumbers.length >= 10 && !selectedNumbers.includes(number))
        "
      >
        {{ number }}
      </button>
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
      </div>

      <div class="button-group">
        <button
          class="action-button clear-button"
          :disabled="isGameActive || selectedNumbers.length === 0"
          @click="clearSelections"
        >
          Clear
        </button>
        <button class="action-button" :disabled="!canPlay" @click="startGame">
          Play Game
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const selectedNumbers = ref<number[]>([]);
const drawnNumbers = ref<number[]>([]);
const matches = ref<number[]>([]);
const betAmount = ref(1);
const isGameActive = ref(false);
const winAmount = ref(0);

const canPlay = computed(() => {
  return selectedNumbers.value.length === 10 && !isGameActive.value;
});

function selectNumber(number: number) {
  if (isGameActive.value) return;

  const index = selectedNumbers.value.indexOf(number);
  if (index === -1 && selectedNumbers.value.length < 10) {
    selectedNumbers.value.push(number);
  } else if (index !== -1) {
    selectedNumbers.value.splice(index, 1);
  }
}

async function drawNumber(): Promise<number> {
  let randomNum;
  do {
    randomNum = Math.floor(Math.random() * 40) + 1;
  } while (drawnNumbers.value.includes(randomNum));

  drawnNumbers.value.push(randomNum);
  if (selectedNumbers.value.includes(randomNum)) {
    matches.value.push(randomNum);
  }
  return randomNum;
}

async function startGame() {
  if (!canPlay.value) return;

  isGameActive.value = true;
  drawnNumbers.value = [];
  matches.value = [];
  winAmount.value = 0;

  // Draw numbers one by one with delay
  for (let i = 0; i < 10; i++) {
    await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay between numbers
    await drawNumber();
  }

  // Calculate winnings based on matches
  calculateWinnings();

  // Reset game after delay
  setTimeout(() => {
    isGameActive.value = false;
  }, 1500);
}

function calculateWinnings() {
  const matchCount = matches.value.length;
  const multipliers = {
    10: 10000,
    9: 4000,
    8: 500,
    7: 100,
    6: 20,
    5: 5,
    4: 2,
    3: 1,
  };

  winAmount.value =
    betAmount.value *
    (multipliers[matchCount as keyof typeof multipliers] || 0);
}

function clearSelections() {
  if (!isGameActive.value) {
    selectedNumbers.value = [];
    drawnNumbers.value = [];
    matches.value = [];
    winAmount.value = 0;
  }
}
</script>

<style scoped>
.keno-game {
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

.keno-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 12px;
  margin: 2rem 0;
  padding: 1.5rem;
  background: var(--subheader);
  border-radius: 16px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.number-tile {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, var(--pointbox) 0%, var(--header) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: var(--white);
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: perspective(1000px) rotateX(10deg) rotateY(0deg);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22),
    inset 0 -2px 5px rgba(0, 0, 0, 0.2);
  position: relative;
}

.number-tile:hover {
  transform: perspective(1000px) rotateX(5deg) rotateY(5deg) translateZ(10px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4), 0 20px 15px rgba(0, 0, 0, 0.25),
    inset 0 -3px 6px rgba(0, 0, 0, 0.3);
}

.number-tile:active {
  transform: perspective(1000px) rotateX(15deg) rotateY(0deg) translateZ(-5px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), 0 8px 6px rgba(0, 0, 0, 0.2),
    inset 0 -1px 3px rgba(0, 0, 0, 0.2);
}
.number-tile:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.number-tile:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.number-tile.selected {
  background: var(
    --primary-color,
    #2196f3
  ); /* Blue color for initial selection */
  color: var(--white);
  transform: perspective(1000px) rotateX(10deg) rotateY(0deg);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22),
    inset 0 -2px 5px rgba(0, 0, 0, 0.2);
}

.number-tile.selected:hover {
  transform: perspective(1000px) rotateX(5deg) rotateY(5deg) translateZ(10px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4), 0 20px 15px rgba(0, 0, 0, 0.25),
    inset 0 -3px 6px rgba(0, 0, 0, 0.3);
}

.number-tile.drawn-match {
  background: rgb(32, 233, 32); /* Change to red for drawn matches */
  color: var(--white);
  animation: pulse 0.5s ease;
  transform: perspective(1000px) rotateX(10deg) rotateY(0deg);
  box-shadow: 0 5px 15px rgba(32, 233, 32, 0.3),
    0 15px 12px rgba(32, 233, 32, 0.22), inset 0 -2px 5px rgba(0, 0, 0, 0.2);
}

.number-tile.drawn-miss {
  background: var(--danger); /* Keep red for misses */
  color: rgba(220, 53, 69, 0.3);
  animation: shake 0.5s ease;
  transition: background-color 0.3s ease;
  transform: perspective(1000px) rotateX(10deg) rotateY(0deg);
  box-shadow: 0 5px 15px rgba(220, 53, 69, 0.3),
    0 15px 12px rgba(220, 53, 69, 0.22), inset 0 -2px 5px rgba(0, 0, 0, 0.2);
}

.game-controls {
  margin-top: 2rem;
}

.bet-controls {
  margin-bottom: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group input {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--border);
  background: var(--subheader);
  color: var(--white);
}

.button-group {
  display: flex;
  gap: 1rem;
}

.clear-button {
  background: var(--danger);
  flex: 0 0 auto;
  width: auto;
  min-width: 120px;
}

.action-button {
  flex: 1;
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  border: none;
  background: var(--active-color);
  color: var(--white);
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

@media (max-width: 768px) {
  .keno-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
