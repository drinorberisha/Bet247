<template>
  <div class="slot-game">
    <div class="game-title">
      <span class="title-decoration">⭐</span>
      <h1>Lucky Stars Slot</h1>
      <span class="title-decoration">⭐</span>
    </div>

    <div class="stats-container">
      <div class="stat-box">
        <span class="stat-label">Bet Amount</span>
        <input
          type="number"
          v-model="betAmount"
          :disabled="isSpinning"
          min="1"
          step="1"
        />
      </div>
      <div class="stat-box">
        <span class="stat-label">Win Amount</span>
        <span class="stat-value">{{ winAmount.toFixed(2) }}€</span>
      </div>
    </div>

    <div class="slot-machine-frame">
      <div class="frame-decoration top"></div>
      <div class="slot-grid">
        <div v-for="row in 4" :key="`row-${row}`" class="slot-row">
          <div
            v-for="col in 5"
            :key="`${row}-${col}`"
            class="slot-cell"
            :class="{
              'winning-cell': winningPositions.includes(
                `${row - 1}-${col - 1}`
              ),
              'active-column': isSpinning && currentColumn === col - 1,
            }"
            :data-col="col - 1"
          >
            <div
              class="symbol"
              :class="{
                spinning: isSpinning && currentColumn === col - 1,
                revealed: revealedColumns[col - 1],
              }"
            >
              {{ grid[row - 1][col - 1] }}
            </div>
          </div>
        </div>
      </div>
      <div class="frame-decoration bottom"></div>
    </div>

    <div class="control-panel">
      <button
        class="spin-button"
        @click="spin"
        :disabled="isSpinning || betAmount <= 0"
      >
        <span class="button-glow"></span>
        {{ isSpinning ? "SPINNING..." : "SPIN" }}
      </button>
    </div>

    <Transition name="fade">
      <div v-if="showWinModal" class="win-modal">
        <div class="modal-content">
          <h2>WIN!</h2>
          <div class="win-amount">{{ winAmount.toFixed(2) }}€</div>
          <div class="matches">{{ matchCount }} MATCHING SYMBOLS!</div>
          <div class="multiplier">x{{ currentMultiplier }}</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const symbols = ["🌎", "⭐", "🌙", "🌞", "☄️", "🌟", "🌍"];
const multipliers = {
  5: 2, // 5 matches = 2x
  6: 3, // 6 matches = 3x
  7: 5, // 7 matches = 5x
  8: 8, // 8 matches = 8x
  9: 10, // 9 matches = 10x
  10: 15, // 10+ matches = 15x
};

const grid = ref(
  Array(4)
    .fill(null)
    .map(() => Array(5).fill("🎰"))
);
const isSpinning = ref(false);
const betAmount = ref(1);
const winAmount = ref(0);
const showWinModal = ref(false);
const winningPositions = ref<string[]>([]);
const matchCount = ref(0);
const currentMultiplier = ref(0);
const currentColumn = ref(-1);
const revealedColumns = ref(Array(5).fill(false));
const finalGrid = ref<string[][]>([]);

function checkWins() {
  const counts = new Map<string, { count: number; positions: string[] }>();

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 5; col++) {
      const symbol = grid.value[row][col];
      if (!counts.has(symbol)) {
        counts.set(symbol, { count: 0, positions: [] });
      }
      const data = counts.get(symbol)!;
      data.count++;
      data.positions.push(`${row}-${col}`);
    }
  }

  let bestMatch = { symbol: "", count: 0, positions: [] as string[] };

  counts.forEach((data, symbol) => {
    if (data.count >= 5 && data.count > bestMatch.count) {
      bestMatch = { symbol, count: data.count, positions: data.positions };
    }
  });

  if (bestMatch.count >= 5) {
    winningPositions.value = bestMatch.positions;
    matchCount.value = bestMatch.count;
    currentMultiplier.value =
      multipliers[Math.min(bestMatch.count, 10) as keyof typeof multipliers] ||
      15;
    return currentMultiplier.value;
  }

  return 0;
}

function getRandomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

function spin() {
  if (isSpinning.value || betAmount.value <= 0) return;

  isSpinning.value = true;
  showWinModal.value = false;
  winAmount.value = 0;
  winningPositions.value = [];
  revealedColumns.value = Array(5).fill(false);

  // Generate final grid state immediately
  finalGrid.value = Array(4)
    .fill(null)
    .map(() =>
      Array(5)
        .fill(null)
        .map(() => getRandomSymbol())
    );

  // Reveal columns one by one
  for (let col = 0; col < 5; col++) {
    setTimeout(() => {
      currentColumn.value = col;

      // Spin animation for current column
      setTimeout(() => {
        // Update only this column with pre-generated symbols
        for (let row = 0; row < 4; row++) {
          grid.value[row][col] = finalGrid.value[row][col];
        }
        revealedColumns.value[col] = true;

        // Check for wins after last column
        if (col === 4) {
          const multiplier = checkWins();
          winAmount.value = betAmount.value * multiplier;

          if (multiplier > 0) {
            showWinModal.value = true;
          }

          currentColumn.value = -1;
          isSpinning.value = false;
        }
      }, 800); // Column spin duration
    }, col * 1000); // Delay between columns
  }
}
</script>

<style scoped>
.slot-game {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  background: linear-gradient(45deg, #2b3dbb, #4657e8);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(70, 87, 232, 0.3),
    inset 0 0 80px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.game-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.game-title h1 {
  color: white;
  font-size: 2.5rem;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  margin: 0;
}

.title-decoration {
  font-size: 2rem;
  animation: starTwinkle 1.5s infinite alternate;
}

.stats-container {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  justify-content: center;
}

.stat-box {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  border-radius: 8px;
  min-width: 150px;
}

.slot-machine-frame {
  position: relative;
  padding: 2rem;
  background: linear-gradient(135deg, #1a237e, #283593);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.frame-decoration {
  height: 20px;
  background: linear-gradient(90deg, #4a148c, #7b1fa2, #4a148c);
  position: absolute;
  left: 0;
  right: 0;
}

.frame-decoration.top {
  top: 0;
  border-radius: 20px 20px 0 0;
}

.frame-decoration.bottom {
  bottom: 0;
  border-radius: 0 0 20px 20px;
}

.slot-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 2rem auto;
  background: linear-gradient(to bottom, #3347d1, #2636b3);
  padding: 1.5rem;
  border-radius: 12px;
  width: fit-content;
  box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.1);
}

.slot-row {
  display: flex;
  gap: 0.5rem;
}

.slot-cell {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #4c63ff, #3347d1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  border: 2px solid #6b78ff;
  box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.slot-cell::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
}

.winning-cell {
  background: linear-gradient(135deg, #00c9ff, #00a2ff);
  animation: pulse 1.5s infinite;
  border-color: #92e8ff;
}

.winning-cell::after {
  content: "";
  position: absolute;
  top: -100%;
  left: -100%;
  width: 300%;
  height: 300%;
  background: linear-gradient(
    45deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 45%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0.1) 55%,
    transparent 100%
  );
  animation: shine 2s infinite;
}

.symbol {
  transition: transform 0.3s ease-out, filter 0.3s ease-out;
  backface-visibility: hidden;
  transform-origin: center center;
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.3s ease;
}

.symbol.revealed {
  opacity: 1;
  transform: scale(1);
}

.symbol.spinning {
  animation: spinSymbol 0.15s linear infinite;
  filter: blur(1px);
}

.control-panel {
  margin-top: 2rem;
  padding: 1rem;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.1)
  );
  border-radius: 12px;
}

.spin-button {
  background: linear-gradient(to bottom, #00c9ff, #00a2ff);
  color: white;
  border: none;
  padding: 1rem 3rem;
  font-size: 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  box-shadow: 0 4px 15px rgba(0, 201, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.button-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0) 70%
  );
  animation: buttonGlow 3s infinite;
}

.spin-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spin-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 201, 255, 0.4);
}

.win-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(
    135deg,
    rgba(43, 61, 187, 0.95),
    rgba(70, 87, 232, 0.95)
  );
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  animation: dropIn 0.5s ease-out;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

input {
  background: var(--header);
  border: 1px solid var(--border);
  color: white;
  padding: 0.5rem;
  border-radius: 4px;
  width: 100px;
  text-align: center;
}

@keyframes spin {
  0% {
    transform: translateY(-2px);
  }
  50% {
    transform: translateY(2px);
  }
  100% {
    transform: translateY(-2px);
  }
}

@keyframes spinSymbol {
  0% {
    transform: translateY(-100%);
    opacity: 0.5;
  }
  100% {
    transform: translateY(100%);
    opacity: 0.5;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1) hue-rotate(0deg);
  }
  50% {
    transform: scale(1.05) rotate(2deg);
    filter: brightness(1.3) hue-rotate(-10deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1) hue-rotate(0deg);
  }
}

@keyframes dropIn {
  0% {
    transform: translate(-50%, -150%);
    opacity: 0;
  }
  70% {
    transform: translate(-50%, -45%);
  }
  100% {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.spinning-column {
  animation: columnShake 0.1s linear infinite;
}

@keyframes columnShake {
  0% {
    transform: translateX(-1px);
  }
  10% {
    transform: translateX(1px);
  }
  25% {
    transform: translateX(0px);
  }
  50% {
    transform: translateX(1px);
  }
  75% {
    transform: translateX(0px);
  }
  100% {
    transform: translateX(-1px);
  }
}

.active-column {
  box-shadow: 0 0 15px #00c9ff;
  border: 2px solid #00c9ff;
  animation: columnPulse 0.5s ease-in-out infinite;
}

@keyframes columnPulse {
  0% {
    box-shadow: 0 0 15px #00c9ff;
  }
  50% {
    box-shadow: 0 0 25px #92e8ff;
  }
  100% {
    box-shadow: 0 0 15px #00c9ff;
  }
}

@keyframes spinReveal {
  0% {
    transform: translateY(-100%) scale(0.5);
    opacity: 0;
  }
  50% {
    transform: translateY(0) scale(1.2);
    opacity: 0.5;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes starTwinkle {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.2);
    opacity: 1;
  }
}

@keyframes buttonGlow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes shine {
  0% {
    transform: rotate(0deg) translate(-50%, -50%);
  }
  100% {
    transform: rotate(360deg) translate(-50%, -50%);
  }
}
</style>
