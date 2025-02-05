<template>
    <MainLayout>
      <div class="game-container">
  
        <div class="slot-machine">
          <!-- <button class="paytable-button" @click="showPaytable = true">
            <span class="icon">📋</span>
            Paytable
          </button> -->
  
          <div class="result-message" v-if="showResult">
            <div :class="['message', { win: isWin, lose: !isWin }]">
              {{ resultMessage }}
            </div>
          </div>
          <div class="reels-container">
            <div v-for="(reel, reelIndex) in reels" :key="reelIndex" class="reel">
              <div
                class="reel-strip"
                :class="{ spinning: isSpinning }"
                :style="{
                  '--delay': `${reelIndex * 0.5}s`,
                  '--duration': `${2 + reelIndex * 0.5}s`,
                }"
              >
                <div
                  v-for="(symbol, index) in getReelSymbols(reel)"
                  :key="index"
                  class="symbol"
                >
                  {{ symbol }}
                </div>
              </div>
            </div>
          </div>
          <div class="controls">
            <button @click="spin" :disabled="isSpinning">SPIN</button>
          </div>
        </div>
  
        <!-- Paytable Modal -->
        <!-- <Transition name="modal">
          <div
            v-if="showPaytable"
            class="modal-overlay"
            @click="showPaytable = false"
          >
            <div class="modal-content" @click.stop>
              <button class="close-button" @click="showPaytable = false">
                ×
              </button>
              <h2>Paytable</h2>
              <div class="paytable-grid">
                <div
                  v-for="(combo, index) in paytableConfig"
                  :key="index"
                  class="paytable-row"
                >
                  <div class="symbol-group">
                    <span v-for="n in 3" :key="n" class="paytable-symbol">{{
                      combo.symbol
                    }}</span>
                  </div>
                  <div class="prize-info">
                    <div class="multiplier">{{ combo.multiplier }}x</div>
                    <div class="prize-example">
                      Win {{ (combo.multiplier * betAmount).toFixed(2) }}€
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition> -->
      </div>
    </MainLayout>
  </template>
  
  <script setup>
  import MainLayout from "../../../Layouts/MainLayout.vue";
  import { ref, reactive } from "vue";
  
  // Define paytable configuration
  const paytableConfig = [
    { symbol: "7️⃣", multiplier: 50, name: "SEVEN" },
    { symbol: "🎰", multiplier: 25, name: "BAR" },
    { symbol: "🔔", multiplier: 15, name: "BELL" },
    { symbol: "🍒", multiplier: 10, name: "CHERRY" },
    { symbol: "🍋", multiplier: 8, name: "LEMON" },
    { symbol: "🍊", multiplier: 6, name: "ORANGE" },
    { symbol: "🫐", multiplier: 4, name: "PLUM" },
    { symbol: "🍇", multiplier: 3, name: "GRAPE" },
  ];
  
  // Update symbols array to use paytable symbols
  const symbols = paytableConfig.map((config) => config.symbol);
  
  const reels = reactive([
    [...symbols].sort(() => Math.random() - 0.5),
    [...symbols].sort(() => Math.random() - 0.5),
    [...symbols].sort(() => Math.random() - 0.5),
  ]);
  
  const isSpinning = ref(false);
  const showResult = ref(false);
  const isWin = ref(false);
  const resultMessage = ref("");
  const showPaytable = ref(false);
  const betAmount = ref(1); // Add this or use your existing bet amount state
  
  const getReelSymbols = (reel) => {
    // Duplicate symbols to create seamless loop
    return [...reel, ...reel, ...reel];
  };
  
  const spin = async () => {
    if (isSpinning.value) return;
  
    showResult.value = false;
    isSpinning.value = true;
  
    const reelElements = document.querySelectorAll(".reel-strip");
  
    // Reset positions and prepare for spinning
    reelElements.forEach((el) => {
      el.style.transition = "none";
      el.style.transform = "translateY(0)";
    });
  
    void document.body.offsetHeight;
  
    // Improved spinning animation
    reelElements.forEach((el, index) => {
      setTimeout(() => {
        el.style.transition = `transform ${
          3 + index * 0.5
        }s cubic-bezier(0.1, 0.3, 0.3, 1)`;
        el.style.transform = "translateY(-100%)";
        el.classList.add("spinning");
  
        const animate = () => {
          if (!el.classList.contains("spinning")) return;
          requestAnimationFrame(() => {
            el.style.transition = "none";
            el.style.transform = "translateY(0)";
            void el.offsetHeight;
            el.style.transition = "transform 1s cubic-bezier(0.1, 0.3, 0.3, 1)";
            el.style.transform = "translateY(-100%)";
          });
        };
  
        el.addEventListener("transitionend", animate);
        el._animationHandler = animate;
      }, index * 300);
    });
  
    // Randomize the reels
    reels.forEach((reel, index) => {
      const newSymbols = [...symbols].sort(() => Math.random() - 0.5);
      reels[index] = newSymbols;
    });
  
    // Sequential stop
    for (let i = 0; i < reelElements.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const el = reelElements[i];
  
      // Remove the continuous animation
      el.removeEventListener("transitionend", el._animationHandler);
      delete el._animationHandler;
  
      el.classList.remove("spinning");
      el.classList.add("stopping");
  
      // Calculate final position based on symbol height
      const symbolHeight = el.children[0].offsetHeight;
      const finalOffset = -symbolHeight; // Align to first symbol
  
      el.style.transition = "transform 0.5s cubic-bezier(0.5, 0, 0.5, 1)";
      el.style.transform = `translateY(${finalOffset}px)`;
    }
  
    // Final cleanup
    setTimeout(() => {
      reelElements.forEach((el) => {
        el.classList.remove("spinning", "stopping");
      });
      isSpinning.value = false;
      checkWin();
    }, 1000);
  };
  
  // Function to calculate win amount based on symbol combinations
  const calculateWinAmount = (combination) => {
    const symbolCount = {};
    combination.forEach((symbol) => {
      symbolCount[symbol] = (symbolCount[symbol] || 0) + 1;
    });
  
    let highestWin = 0;
    for (const [symbol, count] of Object.entries(symbolCount)) {
      if (count >= 3) {
        const payConfig = paytableConfig.find(
          (config) => config.symbol === symbol
        );
        if (payConfig) {
          const winAmount = payConfig.multiplier * Number(slotStore.betAmount);
          highestWin = Math.max(highestWin, winAmount);
        }
      }
    }
    return highestWin;
  };
  
  // Update checkWin function
  const checkWin = () => {
    const result = reels.map((reel) => reel[0]);
    const winAmount = calculateWinAmount(result);
    const isMatch = winAmount > 0;
  
    showResult.value = true;
    isWin.value = isMatch;
  
    if (isMatch) {
      resultMessage.value = `🎉 YOU WIN ${winAmount}€! 🎉`;
      // You might want to update the player's balance here
    } else {
      resultMessage.value = "Try Again!";
    }
  
    setTimeout(() => {
      showResult.value = false;
    }, 3000);
  };
  </script>
  
  <style scoped>
  .game-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 100px);
    padding: 20px;
    width: 100%;
  }
  
  .slot-machine {
    max-width: 1400px;
    width: 95%;
    background: #2c3e50;
    padding: 40px;
    border-radius: 15px;
    position: relative;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  }
  
  .reels-container {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin: 40px auto;
    max-width: 1200px;
    perspective: 1000px;
  }
  
  .reel {
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.3),
      rgba(0, 0, 0, 0) 15%,
      rgba(0, 0, 0, 0) 85%,
      rgba(0, 0, 0, 0.3)
    );
    height: 450px;
    width: 250px;
    overflow: hidden;
    border: 8px solid gold;
    border-radius: 20px;
    box-shadow: inset 0 0 25px rgba(0, 0, 0, 0.2);
    position: relative;
  }
  
  .reel::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 150px;
    transform: translateY(-50%);
    background: rgba(255, 215, 0, 0.1);
    border-top: 2px solid rgba(255, 215, 0, 0.5);
    border-bottom: 2px solid rgba(255, 215, 0, 0.5);
    z-index: 1;
    pointer-events: none;
  }
  
  .reel-strip {
    position: relative;
    transform: translateY(0);
    will-change: transform;
    backface-visibility: hidden;
  }
  
  .spinning {
    animation: smoothSpin 1s linear infinite;
  }
  
  @keyframes smoothSpin {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(-100%);
    }
  }
  
  .stopping {
    animation: none;
    transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1) !important;
  }
  
  .symbol {
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 80px;
    backface-visibility: hidden;
    -webkit-font-smoothing: antialiased;
    transform-style: preserve-3d;
  }
  
  .controls {
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: center;
  }
  
  button {
    padding: 10px 20px;
    border-radius: 5px;
    background: #42b983;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  button:disabled {
    background: #999;
    cursor: not-allowed;
  }
  
  .result-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
    background: rgba(0, 0, 0, 0.8);
    padding: 20px;
    border-radius: 10px;
    text-align: center;
  }
  
  .message {
    font-size: 24px;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
  
  .win {
    color: #4caf50;
  }
  
  .lose {
    color: #f44336;
  }
  
  @media (max-width: 1024px) {
    .slot-machine {
      max-width: 1000px;
    }
  
    .reel {
      height: 360px;
    }
  
    .symbol {
      height: 120px;
      font-size: 60px;
    }
  
    .reel-strip {
      transform: translateY(-120px);
    }
  }
  
  @media (max-width: 768px) {
    .game-container {
      padding: 10px;
      min-height: calc(100vh - 80px);
    }
  
    .slot-machine {
      padding: 20px;
      max-width: 700px;
    }
  
    .reel {
      height: 270px;
      width: 150px;
    }
  
    .symbol {
      height: 90px;
      font-size: 45px;
    }
  
    .reel-strip {
      transform: translateY(-90px);
    }
  }
  
  @media (max-width: 480px) {
    .slot-machine {
      padding: 10px;
      width: 98%;
    }
  
    .reel {
      height: 180px;
      width: 100px;
    }
  
    .symbol {
      height: 60px;
      font-size: 30px;
    }
  
    .reel-strip {
      transform: translateY(-60px);
    }
  
    .reels-container {
      gap: 10px;
    }
  
    .paytable {
      font-size: 0.8em;
    }
  }
  
  .game-title {
    color: var(--white);
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 2rem;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  
  .paytable-button {
    position: absolute;
    top: 80px;
    right: 20px;
    padding: 10px 20px;
    background: linear-gradient(145deg, var(--header) 0%, var(--background) 100%);
    border: 2px solid rgba(255, 215, 0, 0.3);
    border-radius: 8px;
    color: var(--white);
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 10;
    transition: all 0.3s ease;
  }
  
  .paytable-button:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 215, 0, 0.6);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .paytable-button .icon {
    font-size: 1.2rem;
  }
  
  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(5px);
  }
  
  .modal-content {
    background: linear-gradient(145deg, var(--header) 0%, var(--background) 100%);
    border-radius: 16px;
    padding: 2rem;
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    border: 2px solid rgba(255, 215, 0, 0.3);
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  }
  
  .close-button {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    color: var(--white);
    font-size: 24px;
    cursor: pointer;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
  }
  
  .close-button:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .modal-content h2 {
    color: var(--white);
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  
  .paytable-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    padding: 1rem;
  }
  
  .paytable-row {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s ease;
  }
  
  .paytable-row:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
  }
  
  .prize-info {
    text-align: right;
    color: var(--white);
  }
  
  .prize-example {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin-top: 4px;
  }
  
  /* Modal Animation */
  .modal-enter-active,
  .modal-leave-active {
    transition: all 0.3s ease;
  }
  
  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
    transform: scale(0.9);
  }
  
  /* Responsive Styles */
  @media (max-width: 768px) {
    .paytable-button {
      top: 10px;
      right: 10px;
      padding: 8px 16px;
      font-size: 0.9rem;
    }
  
    .modal-content {
      padding: 1.5rem;
      width: 95%;
    }
  
    .paytable-grid {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }
  
    .paytable-row {
      padding: 0.75rem;
    }
  
    .modal-content h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
  }
  </style>
  