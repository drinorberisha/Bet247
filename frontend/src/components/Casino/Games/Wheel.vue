<template>
  <div class="wheel-game">
    <div class="stats-container">
      <div class="stat-box">
        <span class="stat-label">Bet Amount</span>
        <input type="number" v-model="betAmount" :disabled="isSpinning" />
      </div>
      <div class="stat-box">
        <span class="stat-label">Win Amount</span>
        <span class="stat-value">{{ winAmount.toFixed(2) }}€</span>
      </div>
    </div>

    <div class="wheel-container">
      <div class="wheel" :style="{ transform: `rotate(${rotation}deg)` }">
        <div
          v-for="(segment, index) in segments"
          :key="index"
          class="segment"
          :class="{ 'current-segment': isCurrentSegment(index) }"
          :style="{
            transform: `rotate(${(360 / segments.length) * index}deg)`,
            backgroundColor: segment.color,
          }"
        >
          <span class="multiplier" :style="{ transform: 'rotate(90deg)' }">
            {{ segment.multiplier }}x
          </span>
        </div>
      </div>
      <div class="pointer"></div>
      <div class="cursor-line"></div>
      <div class="current-multiplier">{{ currentSegmentMultiplier }}x</div>
    </div>

    <button
      class="spin-button"
      @click="spinWheel"
      :disabled="isSpinning || betAmount <= 0"
    >
      SPIN
    </button>

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
import { ref } from "vue";

const segments = [
  { multiplier: 10, color: "#e65100" },
  { multiplier: 0, color: "#263238" },
  { multiplier: 5, color: "#2e7d32" },
  { multiplier: 0, color: "#263238" },
  { multiplier: 2, color: "#1565c0" },
  { multiplier: 0, color: "#263238" },
  { multiplier: 10, color: "#e65100" },
  { multiplier: 0, color: "#263238" },
  { multiplier: 5, color: "#2e7d32" },
  { multiplier: 0, color: "#263238" },
  { multiplier: 2, color: "#1565c0" },
  { multiplier: 0, color: "#263238" },
];

const rotation = ref(0);
const isSpinning = ref(false);
const betAmount = ref(1);
const winAmount = ref(0);
const showWinModal = ref(false);
const currentMultiplier = ref(0);
const currentSegmentMultiplier = ref(0);

function isCurrentSegment(index: number) {
  const currentRotation = rotation.value % 360;
  const segmentAngle = 360 / segments.length;
  const normalizedRotation = (360 - currentRotation) % 360;
  const currentIndex = Math.floor(normalizedRotation / segmentAngle);
  return currentIndex === index;
}

function updateCurrentMultiplier() {
  const currentRotation = rotation.value % 360;
  const segmentAngle = 360 / segments.length;
  const normalizedRotation = (360 - currentRotation) % 360;
  const currentIndex = Math.floor(normalizedRotation / segmentAngle);
  currentSegmentMultiplier.value = segments[currentIndex].multiplier;
}

function spinWheel() {
  if (isSpinning.value || betAmount.value <= 0) return;

  isSpinning.value = true;
  showWinModal.value = false;
  winAmount.value = 0;

  // Calculate random stopping position
  const extraSpins = 5; // Number of full rotations
  const segmentAngle = 360 / segments.length;
  const randomSegment = Math.floor(Math.random() * segments.length);
  const targetRotation = extraSpins * 360 + randomSegment * segmentAngle;

  // Animate the wheel
  rotation.value = targetRotation;

  // Add rotation transition end handler
  const wheel = document.querySelector(".wheel");
  wheel?.addEventListener(
    "transitionend",
    () => {
      updateCurrentMultiplier();
    },
    { once: true }
  );

  // Calculate result after spin
  setTimeout(() => {
    const landedSegment = segments[randomSegment];
    currentMultiplier.value = landedSegment.multiplier;
    winAmount.value = betAmount.value * landedSegment.multiplier;

    if (landedSegment.multiplier > 0) {
      showWinModal.value = true;
    }

    isSpinning.value = false;
  }, 5000);
}

// Initialize current multiplier
updateCurrentMultiplier();
</script>

<style scoped>
.wheel-game {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.stats-container {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  justify-content: center;
}

.stat-box {
  background: var(--subheader);
  padding: 1rem;
  border-radius: 8px;
  min-width: 150px;
}

.wheel-container {
  position: relative;
  width: 400px;
  height: 400px;
  margin: 2rem auto;
}

.wheel {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transition: transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99);
  transform-origin: center;
  border: 4px solid var(--border);
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.segment {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-origin: center;
  clip-path: polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 50% 100%);
}

.multiplier {
  position: absolute;
  left: 75%;
  top: 50%;
  transform: translate(-50%, -50%) rotate(90deg);
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.pointer {
  position: absolute;
  top: 50%;
  right: -20px;
  width: 40px;
  height: 20px;
  background: var(--danger);
  clip-path: polygon(100% 50%, 0 0, 0 100%);
  transform: translateY(-50%);
  z-index: 1;
}

.spin-button {
  background: var(--active-color);
  color: white;
  border: none;
  padding: 1rem 3rem;
  font-size: 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.spin-button:disabled {
  opacity: 0.5;
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

input {
  background: var(--header);
  border: 1px solid var(--border);
  color: white;
  padding: 0.5rem;
  border-radius: 4px;
  width: 100px;
  text-align: center;
}

.stat-label {
  color: #fff;
  display: block;
  margin-bottom: 0.5rem;
}

.stat-value {
  color: var(--white);
  font-size: 1.2rem;
  font-weight: bold;
}

.cursor-line {
  position: absolute;
  top: 50%;
  right: 0;
  width: 50px;
  height: 2px;
  background: var(--white);
  transform: translateY(-50%);
  z-index: 2;
}

.current-multiplier {
  position: absolute;
  top: 50%;
  right: -60px;
  transform: translateY(-50%);
  color: var(--white);
  font-weight: bold;
  font-size: 1.2rem;
  background: var(--header);
  padding: 0.5rem;
  border-radius: 4px;
  min-width: 50px;
  text-align: center;
}

.current-segment {
  filter: brightness(1.2);
}
</style>
