<template>
  <div class="slots-game">
    <!-- Game Header Stats -->
    <div class="game-header">
      <div class="stats-container">
        <div class="stat-box">
          <span class="stat-label">Last Win</span>
          <span class="stat-value">{{ slotStore.lastWin.toFixed(2) }}€</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Total Win</span>
          <span class="stat-value">{{ slotStore.totalWin.toFixed(2) }}€</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Multiplier</span>
          <span class="stat-value">{{ slotStore.multiplier }}x</span>
        </div>
      </div>
    </div>

    <!-- Slot Machine -->
    <div class="slot-machine">
      <!-- Updated Reels Container -->
      <div class="reels-container" :class="{ spinning: slotStore.isSpinning }">
        <div
          v-for="(reel, reelIndex) in slotStore.reels"
          :key="reelIndex"
          class="reel"
          :style="{ animationDelay: `${reelIndex * 0.2}s` }"
        >
          <!-- Static Symbols -->
          <div
            v-for="(symbol, symbolIndex) in reel"
            :key="symbolIndex"
            class="symbol"
            :class="{ winning: isWinningSymbol(reelIndex, symbolIndex) }"
          >
            <div class="symbol-inner">
              <span class="symbol-emoji">{{
                getSymbolEmoji(symbol?.name)
              }}</span>
            </div>
          </div>
          <!-- Spinning Animation Symbols -->
          <div v-if="slotStore.isSpinning" class="spinning-symbols">
            <div v-for="n in 20" :key="n" class="symbol">
              <div class="symbol-inner">
                <span class="symbol-emoji">{{ getRandomEmoji() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Only show paylines after spinning stops and there are winning lines -->
      <div
        class="paylines-overlay"
        v-if="!slotStore.isSpinning && slotStore.winningLines.length > 0"
      >
        <svg class="paylines" preserveAspectRatio="none">
          <path
            v-for="(line, index) in slotStore.winningLines"
            :key="index"
            :d="getPaylinePath(line)"
            class="payline"
            :class="`payline-${index}`"
          />
        </svg>
      </div>
    </div>

    <!-- Game Controls -->
    <div class="game-controls">
      <div class="bet-controls">
        <div class="bet-amount">
          <label class="control-label">Bet Amount</label>
          <div class="bet-input">
            <input
              type="number"
              v-model="slotStore.betAmount"
              :disabled="slotStore.isSpinning"
              min="1"
              step="1"
            />
            <div class="quick-amounts">
              <button
                v-for="amount in [1, 5, 10, 25, 100]"
                :key="amount"
                @click="setBetAmount(amount)"
                :disabled="slotStore.isSpinning"
              >
                {{ amount }}
              </button>
            </div>
          </div>
        </div>

        <div class="auto-play">
          <label class="control-label">Auto Spins</label>
          <div class="auto-spins">
            <button
              v-for="count in [10, 20, 50, 100]"
              :key="count"
              @click="setAutoPlay(count)"
              :class="{ active: slotStore.autoPlayCount === count }"
              :disabled="slotStore.isSpinning"
            >
              {{ count }}
            </button>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button
          class="stop-auto"
          v-if="slotStore.autoPlay"
          @click="stopAutoPlay"
          :disabled="slotStore.isSpinning"
        >
          Stop Auto
        </button>
        <button
          class="spin-button"
          @click="handleSpin"
          :disabled="slotStore.isSpinning"
        >
          {{ spinButtonText }}
        </button>
      </div>
    </div>

    <!-- Win Popup -->
    <Transition name="fade">
      <div v-if="showWinPopup" class="win-popup">
        <div class="win-content">
          <h2>Big Win!</h2>
          <div class="win-amount">{{ slotStore.lastWin.toFixed(2) }}€</div>
          <div class="win-multiplier">x{{ slotStore.multiplier }}</div>
        </div>
      </div>
    </Transition>

    <!-- Win Notifications System -->
    <Transition-group
      name="notification"
      tag="div"
      class="notifications-container"
    >
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification"
        :class="notification.type"
      >
        <div class="notification-content">
          <div class="notification-icon">
            {{ getNotificationIcon(notification.type) }}
          </div>
          <div class="notification-text">
            <h3>{{ notification.title }}</h3>
            <p>{{ notification.message }}</p>
          </div>
        </div>
      </div>
    </Transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useSlotStore } from "../../../stores/casino/slots";
import { storeToRefs } from "pinia";

const slotStore = useSlotStore();
const showWinPopup = ref(false);
let spinningInterval: ReturnType<typeof setInterval> | null = null;

const spinButtonText = computed(() => {
  if (slotStore.isSpinning) return "Spinning...";
  if (slotStore.autoPlay) return `Auto (${slotStore.autoPlayCount})`;
  return "Spin";
});

// Watch for wins
watch(
  () => slotStore.lastWin,
  (newWin) => {
    if (newWin > 0) {
      showWinPopup.value = true;
      setTimeout(() => {
        showWinPopup.value = false;
      }, 3000);
    }
  }
);

// Update the emoji list and remove question mark fallback
const allEmojis = ["7️⃣", "🎰", "🔔", "🍒", "🍋", "🍊", "🫐", "🍇"];

// Update getSymbolEmoji to use random emoji if no symbol name
const getSymbolEmoji = (symbolName: string) => {
  const emojis = {
    SEVEN: "7️⃣",
    BAR: "🎰",
    BELL: "🔔",
    CHERRY: "🍒",
    LEMON: "🍋",
    ORANGE: "🍊",
    PLUM: "🫐",
    GRAPE: "🍇",
  };
  return emojis[symbolName as keyof typeof emojis] || getRandomEmoji();
};

// Enhanced random emoji generation
const getRandomEmoji = () => {
  return allEmojis[Math.floor(Math.random() * allEmojis.length)];
};

// Update spin handling
const handleSpin = async () => {
  if (spinningInterval) {
    clearInterval(spinningInterval);
  }

  await slotStore.spin();

  if (slotStore.autoPlay && slotStore.autoPlayCount > 0) {
    slotStore.autoPlayCount--;
    if (slotStore.autoPlayCount > 0) {
      setTimeout(handleSpin, 1000);
    } else {
      slotStore.setAutoPlay(0);
    }
  }
};

const setBetAmount = (amount: number) => {
  if (!slotStore.isSpinning) {
    slotStore.setBetAmount(amount);
  }
};

const setAutoPlay = (count: number) => {
  slotStore.setAutoPlay(count);
  if (!slotStore.isSpinning) {
    handleSpin();
  }
};

const stopAutoPlay = () => {
  slotStore.setAutoPlay(0);
};

const isWinningSymbol = (reelIndex: number, symbolIndex: number) => {
  if (slotStore.isSpinning) return false;
  return slotStore.winningLines.some((lineIndex) => {
    const pattern = paylinePatterns[lineIndex];
    return pattern && pattern[reelIndex] === symbolIndex;
  });
};

// Updated payline paths function
const getPaylinePath = (lineIndex: number) => {
  // Get the actual dimensions of the reels container
  const reelContainer = document.querySelector(".reels-container");
  if (!reelContainer) return "";

  const containerRect = reelContainer.getBoundingClientRect();
  const reelWidth = containerRect.width / 5; // 5 reels
  const symbolHeight = containerRect.height / 3; // 3 symbols per reel

  // Define payline patterns (0 = top, 1 = middle, 2 = bottom)
  const paylinePatterns = [
    [1, 1, 1, 1, 1], // Middle horizontal
    [0, 0, 0, 0, 0], // Top horizontal
    [2, 2, 2, 2, 2], // Bottom horizontal
    [0, 1, 2, 1, 0], // V shape
    [2, 1, 0, 1, 2], // Inverted V
    [1, 0, 0, 0, 1], // Top curve
    [1, 2, 2, 2, 1], // Bottom curve
    [0, 1, 1, 1, 0], // Top small V
    [2, 1, 1, 1, 2], // Bottom small V
  ];

  const pattern = paylinePatterns[lineIndex] || paylinePatterns[0];

  // Calculate points with actual dimensions
  const points = pattern.map((pos, i) => {
    const x = i * reelWidth + reelWidth / 2;
    const y = pos * symbolHeight + symbolHeight / 2;
    return `${x},${y}`;
  });

  // Create smooth curve
  let path = `M ${points[0]}`;

  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i].split(",").map(Number);
    const [x2, y2] = points[i + 1].split(",").map(Number);

    const cp1x = x1 + (x2 - x1) / 3;
    const cp1y = y1;
    const cp2x = x2 - (x2 - x1) / 3;
    const cp2y = y2;

    path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`;
  }

  return path;
};

interface Notification {
  id: number;
  type: "win" | "bigWin" | "megaWin";
  title: string;
  message: string;
}

const notifications = ref<Notification[]>([]);
let notificationId = 0;

const getNotificationIcon = (type: string) => {
  const icons = {
    win: "🎉",
    bigWin: "💰",
    megaWin: "🔥",
  };
  return icons[type as keyof typeof icons] || "✨";
};

const addNotification = (
  type: "win" | "bigWin" | "megaWin",
  amount: number
) => {
  const titles = {
    win: "Nice Win!",
    bigWin: "Big Win!",
    megaWin: "Mega Win!",
  };

  const notification: Notification = {
    id: notificationId++,
    type,
    title: titles[type],
    message: `You won ${amount.toFixed(2)}€!`,
  };

  notifications.value.push(notification);

  // Remove notification after animation
  setTimeout(() => {
    notifications.value = notifications.value.filter(
      (n) => n.id !== notification.id
    );
  }, 4000);
};

// Watch for wins and trigger notifications
watch(
  () => slotStore.lastWin,
  (newWin) => {
    if (newWin > 0) {
      if (newWin >= slotStore.betAmount * 50) {
        addNotification("megaWin", newWin);
      } else if (newWin >= slotStore.betAmount * 20) {
        addNotification("bigWin", newWin);
      } else {
        addNotification("win", newWin);
      }
    }
  }
);
</script>

<style scoped>
.slots-game {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.stats-container {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.stat-box {
  flex: 1;
  padding: 1.5rem;
  background: linear-gradient(145deg, var(--subheader) 0%, var(--header) 100%);
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.stat-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.3);
}

.stat-label {
  display: block;
  font-size: 1rem;
  color: var(--white);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--white);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.slot-machine {
  position: relative;
  background: linear-gradient(145deg, var(--header) 0%, var(--background) 100%);
  border-radius: 24px;
  padding: 3rem;
  margin: 2rem 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.reels-container {
  display: flex;
  gap: 0.3rem;
  justify-content: center;
  perspective: 1000px;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.5rem;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.reel {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
  max-width: 80px; /* Mobile-first size */
}

.symbol {
  aspect-ratio: 1;
  background: linear-gradient(145deg, var(--subheader) 0%, var(--header) 100%);
  border-radius: 8px;
  padding: 0.25rem;
  position: relative;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.symbol-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  overflow: hidden;
}

.symbol-emoji {
  font-size: 1.5rem; /* Mobile-first size */
  line-height: 1;
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.2));
  transition: all 0.3s ease;
}

/* Spinning Animation Styles */
.spinning-symbols {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  animation: spinReel 0.5s linear infinite;
}

.reel.spinning .symbol {
  transform: scale(0.95);
}

@keyframes spinReel {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-50%);
  }
}

/* Winning Symbol Animation */
.symbol.winning {
  background: linear-gradient(
    145deg,
    var(--active-color) 0%,
    var(--header) 100%
  );
  box-shadow: 0 0 15px rgba(var(--active-color-rgb), 0.5);
  transform: scale(1.05);
  z-index: 1;
}

.symbol.winning .symbol-emoji {
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
  animation: winPulse 1s infinite;
}

@keyframes winPulse {
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

/* Tablet and up */
@media (min-width: 768px) {
  .reels-container {
    gap: 0.5rem;
    padding: 1rem;
    border-radius: 16px;
  }
  .control-label {
    color: var(--white);
  }
  .reel {
    gap: 0.5rem;
    max-width: 120px;
  }

  .symbol {
    border-radius: 12px;
    padding: 0.5rem;
  }

  .symbol-inner {
    border-radius: 8px;
  }

  .symbol-emoji {
    font-size: 2.5rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .slots-game {
    padding: 2rem;
    max-width: 1200px;
  }

  .stats-container {
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .stat-box {
    padding: 1.5rem 2rem;
    min-width: 200px;
  }

  .stat-label {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }

  .stat-value {
    font-size: 2rem;
  }

  .slot-machine {
    padding: 2.5rem;
    margin: 2rem auto;
    max-width: 900px;
    border-radius: 30px;
  }

  .reels-container {
    gap: 1rem;
    padding: 1.5rem;
    max-width: 800px;
    margin: 0 auto;
  }

  .reel {
    max-width: 140px;
    gap: 0.8rem;
  }

  .symbol {
    padding: 0.5rem;
    border-radius: 12px;
  }

  .symbol-emoji {
    font-size: 3.5rem;
  }

  /* Game controls for laptop */
  .game-controls {
    max-width: 900px;
    margin: 2rem auto;
    padding: 2rem;
    border-radius: 24px;
  }

  .bet-controls {
    gap: 3rem;
    margin-bottom: 2rem;
  }

  .bet-input,
  .auto-spins {
    padding: 2rem;
    border-radius: 20px;
  }

  .quick-amounts,
  .auto-spins {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1rem;
  }

  .quick-amounts button,
  .auto-spins button {
    padding: 1rem 1.5rem;
    font-size: 1.2rem;
    border-radius: 12px;
  }

  .spin-button {
    padding: 1.5rem 3rem;
    font-size: 1.5rem;
    border-radius: 16px;
  }

  /* Win popup for laptop */
  .win-popup .win-content {
    padding: 3rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .win-content h2 {
    font-size: 2.5rem;
  }

  .win-amount {
    font-size: 3.5rem;
  }

  .win-multiplier {
    font-size: 1.8rem;
  }

  /* Notifications for laptop */
  .notifications-container {
    right: 2rem;
    bottom: 2rem;
    max-width: 400px;
  }

  .notification {
    padding: 1.5rem;
    margin-bottom: 1rem;
  }

  .notification-icon {
    font-size: 2rem;
    min-width: 40px;
    height: 40px;
  }

  .notification-text h3 {
    font-size: 1.3rem;
  }

  .notification-text p {
    font-size: 1.1rem;
  }
}

/* Large laptop and desktop (1440px and up) */
@media (min-width: 1440px) {
  .slots-game {
    padding: 3rem;
  }

  .slot-machine {
    max-width: 1000px;
  }

  .reel {
    max-width: 160px;
  }

  .symbol-emoji {
    font-size: 4rem;
  }

  .game-controls {
    max-width: 1000px;
  }
}

/* Updated spinning animation with enhanced slowdown effect */
.spinning .reel {
  animation: smoothSpinSlowdown 4s cubic-bezier(0.3, 0.1, 0.3, 1) forwards;
}

@keyframes smoothSpinSlowdown {
  0% {
    transform: translateY(0);
  }
  10% {
    /* Quick start */
    transform: translateY(-10%);
    animation-timing-function: linear;
  }
  40% {
    /* Full speed */
    transform: translateY(-60%);
    animation-timing-function: linear;
  }
  65% {
    /* Initial slowdown */
    transform: translateY(-80%);
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  80% {
    /* Slower */
    transform: translateY(-90%);
    animation-timing-function: cubic-bezier(0.6, 0, 0.3, 1);
  }
  85% {
    /* Slower */
    transform: translateY(-94%);
    animation-timing-function: cubic-bezier(0.6, 0, 0.3, 1);
  }
  90% {
    /* Very slow */
    transform: translateY(-97%);
    animation-timing-function: cubic-bezier(0.8, 0, 0.2, 1);
  }
  95% {
    /* Final approach */
    transform: translateY(-99%);
    animation-timing-function: cubic-bezier(0.9, 0, 0.1, 1);
  }
  100% {
    /* Settle into position */
    transform: translateY(-100%);
  }
}

/* Updated delays for more dramatic cascade effect */
.spinning .reel:nth-child(1) {
  animation-delay: 0s;
}
.spinning .reel:nth-child(2) {
  animation-delay: 0.3s;
}
.spinning .reel:nth-child(3) {
  animation-delay: 0.6s;
}
.spinning .reel:nth-child(4) {
  animation-delay: 0.9s;
}
.spinning .reel:nth-child(5) {
  animation-delay: 1.2s;
}
.spinning .reel:nth-child(6) {
  animation-delay: 1.5s;
}

/* Enhanced blur effect matching the new slowdown */
.spinning .symbol-emoji {
  animation: blurSpinSlowdown 4s linear forwards;
}

@keyframes blurSpinSlowdown {
  0% {
    filter: blur(0);
  }
  10% {
    /* Start of spin */
    filter: blur(2px);
  }
  40% {
    /* Full speed */
    filter: blur(3px);
  }
  65% {
    /* Initial slowdown */
    filter: blur(2px);
  }
  80% {
    /* Slower */
    filter: blur(1.5px);
  }
  90% {
    /* Very slow */
    filter: blur(1px);
  }
  95% {
    /* Final approach */
    filter: blur(0.5px);
  }
  100% {
    /* Stopped */
    filter: blur(0);
  }
}

/* Add a subtle bounce at the end of each reel */
.spinning .reel {
  animation: smoothSpinSlowdown 4s cubic-bezier(0.3, 0.1, 0.3, 1) forwards,
    subtleBounce 0.3s ease-out;
  animation-delay: var(--reel-delay), calc(var(--reel-delay) + 3.7s);
}

@keyframes subtleBounce {
  0% {
    transform: translateY(-100%);
  }
  50% {
    transform: translateY(-101%);
  }
  100% {
    transform: translateY(-100%);
  }
}

/* Handle landscape orientation */
@media (max-height: 600px) and (orientation: landscape) {
  .reels-container {
    padding: 0.5rem;
  }

  .reel {
    max-width: 100px;
  }

  .symbol-emoji {
    font-size: 2rem;
  }
}

/* Updated Payline Styles */
.paylines-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
  overflow: visible;
}

.paylines {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.payline {
  fill: none;
  stroke-width: 4px;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: drop-shadow(0 0 8px currentColor);
  opacity: 0;
  animation: paylineShow 2s ease-in-out infinite;
}

/* Different colors for different paylines */
.payline-0 {
  stroke: #ff4081;
  animation-delay: 0s;
}
.payline-1 {
  stroke: #40c4ff;
  animation-delay: 0.2s;
}
.payline-2 {
  stroke: #7c4dff;
  animation-delay: 0.4s;
}
.payline-3 {
  stroke: #ffeb3b;
  animation-delay: 0.6s;
}
.payline-4 {
  stroke: #76ff03;
  animation-delay: 0.8s;
}
.payline-5 {
  stroke: #ff9100;
  animation-delay: 1s;
}
.payline-6 {
  stroke: #00e5ff;
  animation-delay: 1.2s;
}
.payline-7 {
  stroke: #ff1744;
  animation-delay: 1.4s;
}
.payline-8 {
  stroke: #64ffda;
  animation-delay: 1.6s;
}

@keyframes paylineShow {
  0%,
  5% {
    opacity: 0;
    stroke-dasharray: 0, 1500;
    stroke-dashoffset: 1500;
  }
  20% {
    opacity: 1;
  }
  45% {
    stroke-dasharray: 1500, 0;
    stroke-dashoffset: 0;
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  95%,
  100% {
    opacity: 0;
    stroke-dasharray: 1500, 0;
    stroke-dashoffset: -1500;
  }
}

/* Responsive adjustments for paylines */
@media (max-width: 768px) {
  .payline {
    stroke-width: 3px;
  }
}

@media (max-width: 480px) {
  .payline {
    stroke-width: 2px;
  }
}

/* Laptop optimization for paylines */
@media (min-width: 1024px) {
  .payline {
    stroke-width: 5px;
  }
}

.game-controls {
  margin-top: 3rem;
  background: linear-gradient(145deg, var(--subheader) 0%, var(--header) 100%);
  border-radius: 20px;
  padding: 2rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.bet-controls {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.bet-amount,
.auto-play {
  flex: 1;
}

.bet-input,
.auto-spins {
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.bet-input input {
  width: 100%;
  padding: 0.75rem;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--white);
  font-size: 1rem;
  margin-bottom: 0.75rem;
}

.quick-amounts button,
.auto-spins button {
  background: linear-gradient(145deg, var(--background) 0%, var(--header) 100%);
  border: 2px solid rgba(255, 255, 255, 0.1);
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.quick-amounts button:hover,
.auto-spins button:hover {
  background: var(--active-color);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(var(--active-color-rgb), 0.3);
}

.spin-button {
  background: linear-gradient(
    145deg,
    var(--active-color) 0%,
    var(--header) 100%
  );
  padding: 1.25rem;
  font-size: 1.3rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(var(--active-color-rgb), 0.3);
  transition: all 0.3s ease;
}

.spin-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 20px rgba(var(--active-color-rgb), 0.4);
}

.spin-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.win-popup {
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
}

.win-content {
  background: linear-gradient(145deg, var(--header) 0%, var(--background) 100%);
  padding: 3rem;
  border-radius: 24px;
  border: 2px solid var(--active-color);
  box-shadow: 0 0 50px rgba(var(--active-color-rgb), 0.3);
}

.win-content h2 {
  color: var(--gold);
  font-size: 2rem;
  margin-bottom: 1rem;
}

.win-amount {
  font-size: 3rem;
  font-weight: bold;
  color: var(--white);
  margin-bottom: 0.5rem;
}

.win-multiplier {
  font-size: 1.5rem;
  color: var(--text-secondary);
}

@media (max-width: 1024px) {
  .slots-game {
    padding: 1rem;
  }

  .stats-container {
    gap: 1rem;
  }

  .stat-box {
    padding: 1rem;
  }

  .stat-label {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .slot-machine {
    padding: 1.5rem;
    margin: 1rem 0;
  }

  .reels-container {
    padding: 1rem;
    gap: 0.5rem;
  }

  .symbol-emoji {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .slots-game {
    padding: 0.5rem;
  }

  .stats-container {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
  }

  .stat-box {
    flex: 0 1 calc(33.33% - 0.75rem);
    min-width: 100px;
    padding: 0.75rem;
  }

  .slot-machine {
    padding: 1rem;
    border-radius: 16px;
  }

  .reels-container {
    padding: 0.75rem;
    gap: 0.4rem;
  }

  .reel {
    gap: 0.4rem;
  }

  .symbol {
    padding: 0.25rem;
    border-radius: 8px;
  }

  .symbol-emoji {
    font-size: 2rem;
  }

  .game-controls {
    margin-top: 1.5rem;
    padding: 1rem;
    border-radius: 16px;
  }

  .bet-controls {
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .bet-amount,
  .auto-play {
    width: 100%;
  }

  .control-label {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    color: var(--white);
  }

  .bet-input,
  .auto-spins {
    padding: 0.75rem;
  }

  .quick-amounts,
  .auto-spins {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .quick-amounts button,
  .auto-spins button {
    padding: 0.5rem;
    font-size: 0.9rem;
  }

  .action-buttons {
    gap: 0.5rem;
  }

  .spin-button {
    padding: 0.75rem;
    font-size: 1rem;
  }

  .notifications-container {
    left: 10px;
    right: 10px;
    bottom: 10px;
  }

  .notification {
    padding: 0.75rem;
    border-radius: 8px;
  }

  .notification-icon {
    font-size: 1.5rem;
    min-width: 30px;
    height: 30px;
  }

  .notification-text h3 {
    font-size: 1rem;
  }

  .notification-text p {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .slots-game {
    padding: 0.25rem;
  }

  .stats-container {
    gap: 0.5rem;
  }

  .stat-box {
    flex: 1 1 calc(50% - 0.5rem);
    padding: 0.5rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }

  .stat-value {
    font-size: 1.2rem;
  }

  .slot-machine {
    padding: 0.5rem;
    border-radius: 12px;
  }

  .reels-container {
    padding: 0.5rem;
    gap: 0.3rem;
  }

  .symbol {
    border-radius: 6px;
  }

  .symbol-emoji {
    font-size: 1.5rem;
  }

  .game-controls {
    margin-top: 1rem;
    padding: 0.75rem;
  }

  .quick-amounts,
  .auto-spins {
    grid-template-columns: repeat(2, 1fr);
  }

  .quick-amounts button,
  .auto-spins button {
    padding: 0.4rem;
    font-size: 0.8rem;
  }

  .spin-button {
    padding: 0.6rem;
    font-size: 0.9rem;
  }

  .win-popup .win-content {
    padding: 1.5rem;
  }

  .win-content h2 {
    font-size: 1.5rem;
  }

  .win-amount {
    font-size: 2rem;
  }

  .win-multiplier {
    font-size: 1.2rem;
  }
}

@media (max-height: 600px) and (orientation: landscape) {
  .slots-game {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1rem;
    padding: 0.5rem;
  }

  .game-header {
    grid-column: 1 / -1;
  }

  .slot-machine {
    margin: 0;
  }

  .game-controls {
    margin-top: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .stats-container {
    flex-direction: row;
    flex-wrap: nowrap;
  }

  .symbol-emoji {
    font-size: 1.8rem;
  }
}
</style>
