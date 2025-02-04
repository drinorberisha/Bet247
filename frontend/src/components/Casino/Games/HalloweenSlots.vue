<template>
  <div class="halloween-slots">
    <!-- Game Stats Header -->
    <div class="game-stats">
      <div class="stat-box">
        <span class="stat-label">Bet Amount</span>
        <span class="stat-value">{{ formatCurrency(betAmount) }}</span>
      </div>
      <div class="stat-box">
        <span class="stat-label">Last Win</span>
        <span class="stat-value">{{ formatCurrency(lastWin) }}</span>
      </div>
    </div>

    <!-- Slot Machine -->
    <div class="slot-container">
      <div class="reels-container">
        <div v-for="(reel, reelIndex) in reels" 
             :key="reelIndex" 
             class="reel"
             :class="{ spinning: isSpinning }"
             :style="{ '--reel-delay': `${reelIndex * 0.5}s` }">
          <div class="reel-viewport">
            <div class="reel-strip" :class="{ 'spin-animation': isSpinning }">
              <div v-for="i in 10" :key="i" class="symbol">
                <img 
                  :src="reel[i % reel.length]?.image"
                  :alt="reel[i % reel.length]?.name"
                  width="40"
                  height="40"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Game Controls -->
    <div class="game-controls">
      <div class="bet-controls">
        <button 
          class="control-btn decrease" 
          @click="handleBetChange('decrease')"
          :disabled="isSpinning"
        >
          -
        </button>
        <span class="bet-amount">{{ formatCurrency(betAmount) }}</span>
        <button 
          class="control-btn increase" 
          @click="handleBetChange('increase')"
          :disabled="isSpinning"
        >
          +
        </button>
      </div>
      
      <button 
        class="spin-btn" 
        :disabled="!canSpin || isSpinning" 
        @click="handleSpin"
      >
        SPIN
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useHalloweenSlotsStore } from '../../../stores/casino/halloweenSlots';
import { storeToRefs } from 'pinia';

const slotStore = useHalloweenSlotsStore();
const { 
  betAmount, 
  lastWin, 
  isSpinning, 
  reels, 
  canSpin 
} = storeToRefs(slotStore);

// Format currency utility function
const formatCurrency = (amount: number): string => {
  return `${amount.toFixed(2)}€`;
};

// Audio setup
const audio = {
  spin: new Audio('/sounds/spin.mp3'),
  win: new Audio('/sounds/win.mp3'),
  bigWin: new Audio('/sounds/big_win.mp3'),
  insertCoin: new Audio('/sounds/insert_coin.mp3')
};

// Methods
const handleSpin = async () => {
  if (!canSpin.value) return;
  
  audio.spin.currentTime = 0;
  audio.spin.play();
  
  await slotStore.startGame();
  
  if (lastWin.value > 0) {
    if (lastWin.value >= betAmount.value * 10) {
      audio.bigWin.play();
    } else {
      audio.win.play();
    }
  }
};

const handleBetChange = (direction: 'increase' | 'decrease') => {
  if (direction === 'increase') {
    slotStore.increaseBet();
  } else {
    slotStore.decreaseBet();
  }
};

// Keyboard controls
const handleKeydown = (e: KeyboardEvent) => {
  if (e.code === 'Space') {
    e.preventDefault();
    handleSpin();
  }
};

// Initialize reels on mount
onMounted(() => {
  slotStore.$patch({
    reels: [
      Array(3).fill(null).map(() => ({ ...slotStore.symbols[Math.floor(Math.random() * slotStore.symbols.length)] })),
      Array(3).fill(null).map(() => ({ ...slotStore.symbols[Math.floor(Math.random() * slotStore.symbols.length)] })),
      Array(3).fill(null).map(() => ({ ...slotStore.symbols[Math.floor(Math.random() * slotStore.symbols.length)] }))
    ]
  });
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  slotStore.resetGame();
});
</script>

<style scoped>
.halloween-slots {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  background: var(--header);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.game-stats {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
}

.stat-box {
  background: var(--subheader);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  flex: 1;
}

.stat-label {
  display: block;
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--white);
}

.slot-container {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 1rem;
  margin: 1rem 0;
}

.reels-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  background: #000;
  padding: 8px;
  border-radius: 8px;
}

.reel {
  position: relative;
  height: 120px; /* Height for 3 symbols */
  overflow: hidden;
  background: #1a1a1a;
  border-radius: 4px;
}

.reel-viewport {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.reel-strip {
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.1s linear;
}

.symbol {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.symbol img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.spin-animation {
  animation: spin 3s cubic-bezier(0.3, 0.1, 0.3, 1) forwards;
  animation-delay: var(--reel-delay);
}

@keyframes spin {
  0% {
    transform: translateY(0);
  }
  20% {
    transform: translateY(-100%);
  }
  40% {
    transform: translateY(-200%);
  }
  60% {
    transform: translateY(-300%);
  }
  80% {
    transform: translateY(-380%);
  }
  100% {
    transform: translateY(-400%);
  }
}

.game-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.bet-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.control-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: var(--active-color);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.bet-amount {
  font-size: 1.2rem;
  color: white;
  min-width: 80px;
  text-align: center;
}

.spin-btn {
  background: var(--active-color);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.spin-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spin-btn:hover:not(:disabled) {
  background: var(--active-hover);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .halloween-slots {
    padding: 0.5rem;
  }

  .game-stats {
    flex-direction: row;
  }

  .stat-box {
    padding: 0.75rem;
  }

  .reels-container {
    min-height: 250px;
  }

  .symbol {
    padding: 0.25rem;
  }
}
</style> 