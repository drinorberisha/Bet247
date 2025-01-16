<template>
  <div 
    class="betslip-container" 
    :class="{ 'expanded': isExpanded, 'closed': isClosed }"
    ref="betslipContainer"
  >
    <!-- Move swipe handle outside main content -->
    <div class="swipe-handle" @touchstart="handleTouchStart" @touchmove="handleTouchMove">
      <div class="handle-indicator"></div>
    </div>

    <div class="betslip-wrapper">
      <!-- Rest of the content -->
      <div class="betslip-header">
        <div class="header-tabs">
          <button 
            v-for="mode in ['single', 'multi']" 
            :key="mode"
            :class="['tab-button', { active: bettingStore.activeMode === mode }]"
            @click="bettingStore.setMode(mode)"
          >
            {{ mode.charAt(0).toUpperCase() + mode.slice(1) }}
            <span class="bet-count" v-if="getBetCount(mode)">
              {{ getBetCount(mode) }}
            </span>
          </button>
        </div>
        <button class="clear-all" @click="bettingStore.clearAllBets" v-if="bets.length">
          <i class="icon-trash"></i>
        </button>
      </div>

      <div class="betslip-content" :class="{ empty: !bets.length }">
        <div v-if="!bets.length" class="empty-state">
          <i class="icon-ticket"></i>
          <p>Your bet slip is empty</p>
          <span>Select some odds to start betting</span>
        </div>

        <template v-else>
          <!-- Single Mode -->
          <div v-if="bettingStore.activeMode === 'single'" class="bet-list">
            <div v-for="bet in bets" :key="bet.id" class="bet-card">
              <div class="bet-header">
                <div class="bet-teams">
                  <span class="team home">{{ bet.homeTeam }}</span>
                  <span class="vs">vs</span>
                  <span class="team away">{{ bet.awayTeam }}</span>
                </div>
                <button class="remove-bet" @click="bettingStore.removeBet(bet.id)">
                  <i class="icon-close"></i>
                </button>
              </div>

              <div class="selections-list">
                <div v-for="(selection, index) in bet.selections" 
                     :key="index" 
                     class="selection-item">
                  <span class="selection-type">{{ selection.type }}</span>
                  <span class="selection-odds">{{ formatOdds(selection.odds) }}</span>
                </div>
              </div>

              <div class="stake-container">
                <div class="stake-header">
                  <label>Stake</label>
                  <button class="clear-stake" @click="clearSingleStake(bet.id)">
                    <i class="icon-trash-2"></i>
                  </button>
                </div>
                <div class="stake-input">
                  <input 
                    type="number" 
                    v-model="bet.stake"
                    placeholder="Enter stake"
                    @input="updateSingleStake($event, bet.id)"
                  >
                  <span class="currency">$</span>
                </div>
              </div>

              <div class="potential-win" v-if="bet.stake">
                Potential Win: ${{ calculateSingleWin(bet) }}
              </div>
            </div>
            <div class="single-summary" v-if="bets.length">
    <div class="summary-row">
      <span class="summary-label">Total Stake</span>
      <span class="summary-value">${{ formatOdds(getTotalSingleStake) }}</span>
    </div>
    <div class="summary-row">
      <span class="summary-label">Total Potential Win</span>
      <span class="summary-value">${{ formatOdds(getTotalSinglePotentialWin) }}</span>
    </div>
  </div>
          </div>

          <!-- Multi Mode -->
          <div v-else class="multi-bet">
            <div class="bet-list">
              <div v-for="bet in bets" :key="bet.id" class="bet-card">
                <div class="bet-header">
                  <div class="bet-teams">
                    <span class="team home">{{ bet.homeTeam }}</span>
                    <span class="vs">vs</span>
                    <span class="team away">{{ bet.awayTeam }}</span>
                  </div>
                  <button class="remove-bet" @click="bettingStore.removeBet(bet.id)">
                    <i class="icon-close"></i>
                  </button>
                </div>
                <div class="selection-item">
                  <span class="selection-type">{{ bet.selections[0]?.type }}</span>
                  <span class="selection-odds">{{ formatOdds(bet.selections[0]?.odds) }}</span>
                </div>
              </div>
            </div>

            <div class="multi-stake-container">
              <div class="stake-header">
                <label>Total Stake</label>
                <button class="clear-stake" @click="clearMultiStake">
                  <i class="icon-close"></i>
                </button>
              </div>
              <div class="stake-input">
                <input 
                  type="number" 
                  v-model="bettingStore.multiStake"
                  placeholder="Enter stake"
                  @input="updateMultiStake"
                >
                <span class="currency">$</span>
              </div>
            </div>

            <div class="multi-summary">
              <div class="summary-row">
                <span class="summary-label">Total Odds</span>
                <span class="summary-value">{{ formatOdds(bettingStore.multiOdds) }}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Potential Win</span>
                <span class="summary-value">${{ formatOdds(bettingStore.potentialMultiWin) }}</span>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Move place bet button outside scrollable content -->
      <div class="place-bet-wrapper" v-if="bets.length">
        <div v-if="betError" class="bet-error">
          {{ betError }}
        </div>
        <button 
          class="place-bet-button"
          :disabled="!canPlaceBet || isPlacingBet"
          @click="placeBet"
        >
          <span v-if="isPlacingBet">Placing Bet...</span>
          <span v-else>
            Place {{ bettingStore.activeMode === 'multi' ? 'Multi' : 'Single' }} Bet
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useBettingStore } from '../../stores/betting';
import { useNotificationStore } from '../../stores/notification';

const bettingStore = useBettingStore();
const notificationStore = useNotificationStore();

const bets = computed(() => bettingStore.bets);

const getBetCount = (mode: string) => {
  if (mode === 'multi' && bets.value.length > 1) {
    return 1;
  }
  return mode === 'single' ? bets.value.length : 0;
};

const formatOdds = (odds: number) => (odds || 0).toFixed(2);

const calculateSingleWin = (bet: any) => {
  return (bet.stake * bet.selections.reduce((total: number, s: any) => total * s.odds, 1)).toFixed(2);
};

const updateSingleStake = (event: Event, betId: string) => {
  const value = (event.target as HTMLInputElement).value;
  bettingStore.updateStake(betId, Number(value));
};

const updateMultiStake = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  bettingStore.updateMultiStake(Number(value));
};

const canPlaceBet = computed(() => {
  if (bettingStore.activeMode === 'single') {
    return bets.value.some(bet => bet.stake > 0);
  } else {
    return bets.value.length > 1 && bettingStore.multiStake > 0;
  }
});

const isPlacingBet = ref(false);
const betError = ref('');

const placeBet = async () => {
  if (!canPlaceBet.value) return;

  // Validate bet before making API call
  const validation = bettingStore.validateBet();
  if (!validation.valid) {
    betError.value = validation.message || 'Invalid bet';
    return;
  }

  try {
    isPlacingBet.value = true;
    betError.value = '';
    
    await bettingStore.placeBet();
    
    // Show success notification
    notificationStore.show({
      type: 'success',
      title: 'Bet Placed Successfully',
      message: bettingStore.activeMode === 'multi' 
        ? 'Your multi bet has been placed successfully!'
        : 'Your single bet has been placed successfully!',
      duration: 5000,
      position: 'top-right'
    });
    
  } catch (error: any) {
    betError.value = error.response?.data?.message || 'Failed to place bet';
    
    // Show error notification
    notificationStore.show({
      type: 'error',
      title: 'Bet Placement Failed',
      message: error.response?.data?.message || 'Failed to place bet. Please try again.',
      duration: 5000,
      position: 'top-right'
    });
  } finally {
    isPlacingBet.value = false;
  }
};

const clearMultiStake = () => {
  bettingStore.updateMultiStake(0);
};

const isExpanded = ref(false);
const isClosed = ref(false);
const touchStart = ref(0);
const betslipContainer = ref<HTMLElement | null>(null);

const clearSingleStake = (betId: string) => {
  bettingStore.updateStake(betId, 0);
};

const handleTouchStart = (e: TouchEvent) => {
  touchStart.value = e.touches[0].clientY;
};

const handleTouchMove = (e: TouchEvent) => {
  if (!betslipContainer.value) return;
  
  const touchMove = e.touches[0].clientY;
  const delta = touchStart.value - touchMove;

  // Swipe up to expand
  if (delta > 50 && !isExpanded.value) {
    isExpanded.value = true;
    isClosed.value = false;
  }
  // Swipe down to collapse or close
  else if (delta < -50) {
    if (isExpanded.value) {
      isExpanded.value = false;
    } else {
      isClosed.value = true;
      // Reset after animation
      setTimeout(() => {
        isClosed.value = false;
      }, 300);
    }
  }
};


const getTotalSingleStake = computed(() => {
  return bets.value.reduce((total, bet) => total + (bet.stake || 0), 0);
});

const getTotalSinglePotentialWin = computed(() => {
  return bets.value.reduce((total, bet) => {
    const betWin = bet.stake * bet.selections.reduce((odds, s) => odds * s.odds, 1);
    return total + (betWin || 0);
  }, 0);
});
</script>

<style scoped>

.single-summary {
  background: var(--signbet);
  padding: 1.2rem;
  border-radius: 6px;
  margin-top: 1.5rem;
}

/* Reuse the same styles as multi-summary */
.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0;
}

.summary-row:not(:last-child) {
  border-bottom: 1px solid var(--leftpreborder);
  margin-bottom: 0.5rem;
}

.summary-label {
  color: var(--textcolor);
  font-size: 0.9rem;
}

.summary-value {
  color: var(--active-color);
  font-weight: 600;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .single-summary {
    padding: 1rem;
    margin-top: 1rem;
  }
}

.betslip-container {
  background: var(--subheader);
  border-radius: 8px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.betslip-header {
  background: var(--header);
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--active-color);
}

.header-tabs {
  display: flex;
  gap: 1rem;
}

.tab-button {
  background: none;
  border: none;
  color: var(--textcolor);
  padding: 0.5rem 1rem;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.tab-button.active {
  color: var(--active-color);
}

.tab-button .bet-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--active-color);
  color: var(--black);
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
}

.clear-all {
  background: none;
  border: none;
  color: var(--button-one);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.clear-all:hover {
  color: var(--active-color);
}

.betslip-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--textcolor);
  text-align: center;
}

.empty-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--active-color);
}

.bet-card {
  background: var(--signbet);
  border: 1px solid var(--leftpreborder);
  border-radius: 6px;
  padding: 0.8rem;
  margin-bottom: 0.8rem;
}

.bet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.6rem;
}

.bet-teams {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.team {
  color: var(--white);
}

.vs {
  color: var(--textcolor);
  font-size: 0.8rem;
  margin: 0 0.3rem;
}

.remove-bet {
  background: none;
  border: none;
  color: var(--textcolor);
  padding: 0.3rem;
  cursor: pointer;
  transition: color 0.2s ease;
}

.remove-bet:hover {
  color: var(--button-one);
}

.selection-item {
  background: var(--body-color);
  border: 1px solid var(--leftpreborder);
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.selection-type {
  color: var(--white);
  font-size: 0.9rem;
  margin-right: 0.5rem;
}

.selection-odds {
  color: var(--active-color);
  font-weight: bold;
  font-size: 0.9rem;
}

.stake-container {
  background: var(--signbet);
  border-radius: 6px;
  padding: 0.8rem;
  margin-top: 0.5rem;
}

.stake-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.stake-header label {
  color: var(--textcolor);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stake-input {
  position: relative;
  width: 100%;
}

.stake-input input {
  width: 100%;
  background: var(--body-color);
  border: 2px solid var(--leftpreborder);
  color: var(--white);
  padding: 0.8rem;
  border-radius: 6px;
  font-size: 1rem;
  text-align: right;
  padding-right: 2rem;
  transition: all 0.3s ease;
}

.stake-input input:hover {
  border-color: var(--active-color);
}

.stake-input input:focus {
  border-color: var(--active-color);
  outline: none;
  box-shadow: 0 0 0 2px var(--preactive);
}

.stake-input .currency {
  position: absolute;
  right: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--active-color);
  font-weight: bold;
}

.potential-win {
  text-align: right;
  color: var(--active-color);
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 0.8rem;
}

/* Multi bet specific overrides */
.multi-bet .bet-card {
  padding: 0.8rem;
}

.multi-bet .selection-item {
  margin-bottom: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .bet-card {
    padding: 0.7rem;
  }

  .bet-teams {
    font-size: 0.85rem;
  }

  .selection-item {
    padding: 0.4rem 0.6rem;
  }

  .stake-container {
    padding: 0.7rem;
  }
}

@media (max-width: 480px) {
  .bet-teams {
    font-size: 0.8rem;
  }

  .selection-type,
  .selection-odds {
    font-size: 0.85rem;
  }
}

.place-bet-button {
  width: 100%;
  background: var(--active-color);
  color: var(--black);
  border: none;
  padding: 1rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.place-bet-button:hover:not(:disabled) {
  background: var(--active-two);
  transform: translateY(-1px);
}

.place-bet-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .betslip-container {
    border-radius: 0;
    height: auto;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    max-height: 80vh;
  }

  .bet-details {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  .bet-amount input {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .header-tabs {
    gap: 0.5rem;
  }

  .tab-button {
    padding: 0.5rem;
    font-size: 0.9rem;
  }

  .bet-card {
    padding: 0.8rem;
  }
}

.swipe-handle {
  display: none;
  height: 20px;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  cursor: grab;
}

.handle-indicator {
  width: 40px;
  height: 4px;
  background: var(--leftpreborder);
  border-radius: 2px;
}

.stake-container {
  background: var(--signbet);
  border-radius: 6px;
  padding: 1rem;
  margin: 1rem 0;
}

/* Updated mobile styles */
@media (max-width: 768px) {
  .betslip-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    height: 60vh;
    transition: all 0.3s ease;
    z-index: 1000;
    border-radius: 12px 12px 0 0;
  }

  .betslip-container.expanded {
    height: 95vh;
  }

  .betslip-container.closed {
    transform: translateY(100%);
  }

  /* Add transition for smooth animation */
  .betslip-container {
    transition: transform 0.3s ease, height 0.3s ease;
  }

  .swipe-handle {
    display: flex;
    height: 24px;
    width: 100%;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
    cursor: grab;
    background: var(--header);
    border-radius: 12px 12px 0 0;
    position: sticky;
    top: 0;
    z-index: 3;
  }

  .handle-indicator {
    width: 40px;
    height: 4px;
    background: var(--leftpreborder);
    border-radius: 2px;
  }

  .betslip-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  .betslip-content {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 1rem;
    padding-bottom: 80px; /* Space for place bet button */
  }

  .place-bet-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1rem;
    background: var(--body-color);
    border-top: 1px solid var(--leftpreborder);
    z-index: 2;
  }

  .place-bet-button {
    width: 100%;
    margin: 0;
    border-radius: 6px;
  }
}

/* Safe area support */
@supports (padding: max(0px)) {
  @media (max-width: 768px) {
    .betslip-container {
      padding-bottom: max(0px, env(safe-area-inset-bottom));
    }

    .place-bet-wrapper {
      padding-bottom: max(1rem, env(safe-area-inset-bottom) + 1rem);
    }
  }
}

/* Improved clear button */
.clear-stake {
  background: none;
  border: none;
  color: var(--textcolor);
  padding: 0.4rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-stake:hover {
  color: var(--button-one);
  background: var(--body-color);
}

.clear-stake i {
  font-size: 1.1rem;
}

/* Safe area support for modern iOS devices */
@supports (padding: max(0px)) {
  @media (max-width: 768px) {
    .betslip-container {
      padding-bottom: max(80px, env(safe-area-inset-bottom) + 80px);
    }
  }
}

/* Multi bet specific input styles */
.multi-stake-container {
  background: var(--signbet);
  border-radius: 6px;
  padding: 1rem;
  margin: 1rem 0;
}

.multi-bet .stake-input input {
  background: var(--body-color);
  font-weight: 500;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .stake-input input {
    font-size: 1.1rem;
    padding: 1rem;
    padding-right: 2.2rem;
  }

  .stake-input .currency {
    font-size: 1.1rem;
    right: 1rem;
  }
}

@media (max-width: 480px) {
  .stake-container,
  .multi-stake-container {
    padding: 0.7rem;
  }

  .stake-input input {
    padding: 0.9rem;
    padding-right: 2rem;
  }
}

.multi-summary {
  background: var(--signbet);
  padding: 1.2rem;
  border-radius: 6px;
  margin-top: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0;
}

.summary-row:not(:last-child) {
  border-bottom: 1px solid var(--leftpreborder);
  margin-bottom: 0.5rem;
}

.summary-label {
  color: var(--textcolor);
  font-size: 0.9rem;
}

.summary-value {
  color: var(--active-color);
  font-weight: 600;
  font-size: 1.1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .multi-summary {
    padding: 1rem;
    margin-top: 1rem;
  }
}

.bet-error {
  color: var(--button-one);
  text-align: center;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}
</style>
