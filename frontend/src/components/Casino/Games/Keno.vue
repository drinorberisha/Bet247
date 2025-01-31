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

    <div class="potential-wins">
      <h3>Potential Wins</h3>
      <div class="win-table">
        <div
          v-for="matches in getPotentialWins"
          :key="matches.count"
          class="win-row"
        >
          <span>Match {{ matches.count }}:</span>
          <span class="win-value">{{ matches.amount.toFixed(2) }}€</span>
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
          (selectedNumbers.length >= maxSelections &&
            !selectedNumbers.includes(number))
        "
      >
        {{ number }}
      </button>
    </div>

    <div class="game-controls">
      <div class="bet-controls">
        <div class="input-group">
          <label>Bet Amount</label>
          <input type="number" v-model="betAmount" :disabled="isGameActive" />
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
    <Transition name="modal">
      <div v-if="showWinModal" class="win-modal">
        <div class="modal-content">
          <h2>WIN!</h2>
          <div class="win-amount">{{ winAmount.toFixed(2) }}€</div>
          <div class="multiplier">x{{ currentMultiplier }}</div>
        </div>
      </div>
    </Transition>
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
const showWinModal = ref(false);
const currentMultiplier = ref(0);
const maxSelections = 10;

const canPlay = computed(() => {
  return (
    selectedNumbers.value.length > 0 &&
    selectedNumbers.value.length <= maxSelections &&
    !isGameActive.value
  );
});

const getPotentialWins = computed(() => {
  const selections = selectedNumbers.value.length;
  if (selections === 0) return [];

  const multiplierTable = {
    10: { 10: 10000, 9: 4000, 8: 500, 7: 100, 6: 20, 5: 5, 4: 2, 3: 1 },
    9: { 9: 4000, 8: 500, 7: 100, 6: 20, 5: 5, 4: 2, 3: 1 },
    8: { 8: 500, 7: 100, 6: 20, 5: 5, 4: 2, 3: 1 },
    7: { 7: 100, 6: 20, 5: 5, 4: 2, 3: 1 },
    6: { 6: 20, 5: 5, 4: 2, 3: 1 },
    5: { 5: 5, 4: 2, 3: 1 },
    4: { 4: 2, 3: 1 },
    3: { 3: 1 },
    2: { 2: 1 },
    1: { 1: 1 },
  };

  const possibleWins = [];
  const currentMultipliers =
    multiplierTable[selections as keyof typeof multiplierTable] || {};

  for (const [matches, multiplier] of Object.entries(currentMultipliers)) {
    possibleWins.push({
      count: matches,
      amount: betAmount.value * multiplier,
    });
  }

  return possibleWins.sort((a, b) => Number(b.count) - Number(a.count));
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
  const selections = selectedNumbers.value.length;

  // Multiplier table based on selections and matches
  const multiplierTable: { [key: number]: { [key: number]: number } } = {
    10: { 10: 10000, 9: 4000, 8: 500, 7: 100, 6: 20, 5: 5, 4: 2, 3: 1 },
    9: { 9: 4000, 8: 500, 7: 100, 6: 20, 5: 5, 4: 2, 3: 1 },
    8: { 8: 500, 7: 100, 6: 20, 5: 5, 4: 2, 3: 1 },
    7: { 7: 100, 6: 20, 5: 5, 4: 2, 3: 1 },
    6: { 6: 20, 5: 5, 4: 2, 3: 1 },
    5: { 5: 5, 4: 2, 3: 1 },
    4: { 4: 2, 3: 1 },
    3: { 3: 1 },
    2: { 2: 1 },
    1: { 1: 1 },
  };

  const multiplier = multiplierTable[selections]?.[matchCount] || 0;
  currentMultiplier.value = multiplier;
  winAmount.value = betAmount.value * multiplier;

  if (multiplier > 0) {
    showWinModal.value = true;
    setTimeout(() => {
      showWinModal.value = false;
    }, 3000);
  }
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

.potential-wins {
  background: var(--subheader);
  border-radius: 12px;
  padding: 1rem;
  margin: 1rem 0;
}

.potential-wins h3 {
  color: white;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.win-table {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.5rem;
  justify-content: center;
  max-width: 600px;
  margin: 0 auto;
}

.win-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  padding: 0.5rem 1rem;
  background: var(--header);
  border-radius: 6px;
  font-size: 0.9rem;
  height: 40px;
  width: 100%;
  margin: 0 auto;
}

.win-row:not(:nth-child(-n + 4)) {
  /* Targets all rows except first 4 */
  width: 80%;
  justify-content: center;
  gap: 1rem;
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
  background: linear-gradient(
    145deg,
    #7b1fa2 0%,
    #4a148c 100%
  ); /* Purple gradient */
  color: var(--white);
  transform: perspective(1000px) rotateX(10deg) rotateY(0deg);
  box-shadow: 0 5px 15px rgba(123, 31, 162, 0.3),
    /* Purple glow */ 0 15px 12px rgba(0, 0, 0, 0.22),
    inset 0 -2px 5px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(123, 31, 162, 0.5); /* Purple border */
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
  background: var(--danger);
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
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;

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

.modal-content h2 {
  color: var(--success);
  font-size: 2rem; /* Reduced from 3rem */
  margin: 0 0 0.5rem 0; /* Reduced margin */
  text-shadow: 0 0 10px rgba(32, 233, 32, 0.5);
}

.win-amount {
  font-size: 1.8rem; /* Reduced from 2.5rem */
  font-weight: bold;
  color: var(--white);
  margin-bottom: 0.3rem; /* Reduced margin */
}

.multiplier {
  font-size: 1.2rem; /* Reduced from 1.5rem */
  color: var(--text-secondary);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
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

@media (max-width: 768px) {
  .keno-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
