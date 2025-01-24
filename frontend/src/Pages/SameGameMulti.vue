<template>
  <Header />

  <div class="home-container">
    <!-- Main Content -->
    <div class="main-content">
      <div class="same-game-multi-content">
        <div class="match-header">
          <h2>Same Game Multi</h2>
          <div class="teams">
            <span class="team home">{{ homeTeam }}</span>
            <span class="vs">vs</span>
            <span class="team away">{{ awayTeam }}</span>
          </div>
        </div>

        <div class="betting-options">
          <div class="market-section">
            <h3>Match Result</h3>
            <div class="odds-grid">
              <button
                class="odd-btn"
                :class="{
                  selected: isOddSelected(matchId, 'match_result', '1'),
                  disabled: isDisabled('match_result', '1'),
                }"
                :disabled="isDisabled('match_result', '1')"
                @click="
                  handleOddSelection(
                    'match_result',
                    '1',
                    2.1,
                    'Match Result',
                    'Home Win'
                  )
                "
              >
                <span>{{ homeTeam }}</span>
                <span class="odd-value">2.10</span>
              </button>
              <button
                class="odd-btn"
                :class="{
                  selected: isOddSelected(matchId, 'match_result', 'X'),
                  disabled: isDisabled('match_result', 'X'),
                }"
                :disabled="isDisabled('match_result', 'X')"
                @click="
                  handleOddSelection(
                    'match_result',
                    'X',
                    3.4,
                    'Match Result',
                    'Draw'
                  )
                "
              >
                <span>Draw</span>
                <span class="odd-value">3.40</span>
              </button>
              <button
                class="odd-btn"
                :class="{
                  selected: isOddSelected(matchId, 'match_result', '2'),
                  disabled: isDisabled('match_result', '2'),
                }"
                :disabled="isDisabled('match_result', '2')"
                @click="
                  handleOddSelection(
                    'match_result',
                    '2',
                    3.2,
                    'Match Result',
                    'Away Win'
                  )
                "
              >
                <span>{{ awayTeam }}</span>
                <span class="odd-value">3.20</span>
              </button>
            </div>
          </div>

          <div class="market-section">
            <h3>Both Teams to Score</h3>
            <div class="odds-grid">
              <button
                class="odd-btn"
                :class="{
                  selected: isOddSelected(matchId, 'btts', 'yes'),
                  disabled: isDisabled('btts', 'yes'),
                }"
                :disabled="isDisabled('btts', 'yes')"
                @click="
                  handleOddSelection(
                    'btts',
                    'yes',
                    1.85,
                    'Both Teams to Score',
                    'Yes'
                  )
                "
              >
                <span>Yes</span>
                <span class="odd-value">1.85</span>
              </button>
              <button
                class="odd-btn"
                :class="{
                  selected: isOddSelected(matchId, 'btts', 'no'),
                  disabled: isDisabled('btts', 'no'),
                }"
                :disabled="isDisabled('btts', 'no')"
                @click="
                  handleOddSelection(
                    'btts',
                    'no',
                    1.95,
                    'Both Teams to Score',
                    'No'
                  )
                "
              >
                <span>No</span>
                <span class="odd-value">1.95</span>
              </button>
            </div>
          </div>

          <div class="market-section">
            <h3>Total Goals</h3>
            <div class="odds-grid">
              <button
                class="odd-btn"
                :class="{
                  selected: isOddSelected(matchId, 'total_goals', 'over_2.5'),
                }"
                @click="
                  handleOddSelection(
                    'total_goals',
                    'over_2.5',
                    1.75,
                    'Total Goals',
                    'Over 2.5'
                  )
                "
              >
                <span>Over 2.5</span>
                <span class="odd-value">1.75</span>
              </button>
              <button
                class="odd-btn"
                :class="{
                  selected: isOddSelected(matchId, 'total_goals', 'under_2.5'),
                }"
                @click="
                  handleOddSelection(
                    'total_goals',
                    'under_2.5',
                    2.05,
                    'Total Goals',
                    'Under 2.5'
                  )
                "
              >
                <span>Under 2.5</span>
                <span class="odd-value">2.05</span>
              </button>
            </div>
          </div>

          <div class="market-section">
            <h3>First Goalscorer</h3>
            <div class="odds-grid">
              <button
                class="odd-btn"
                :class="{
                  selected: isOddSelected(
                    matchId,
                    'first_goalscorer',
                    'no_goal'
                  ),
                }"
                @click="
                  handleOddSelection(
                    'first_goalscorer',
                    'no_goal',
                    12.0,
                    'First Goalscorer',
                    'No Goalscorer'
                  )
                "
              >
                <span>No Goalscorer</span>
                <span class="odd-value">12.00</span>
              </button>
              <button
                class="odd-btn"
                :class="{
                  selected: isOddSelected(matchId, 'first_goalscorer', 'home'),
                }"
                @click="
                  handleOddSelection(
                    'first_goalscorer',
                    'home',
                    2.2,
                    'First Goalscorer',
                    `${homeTeam} First`
                  )
                "
              >
                <span>{{ homeTeam }} First</span>
                <span class="odd-value">2.20</span>
              </button>
              <button
                class="odd-btn"
                :class="{
                  selected: isOddSelected(matchId, 'first_goalscorer', 'away'),
                }"
                @click="
                  handleOddSelection(
                    'first_goalscorer',
                    'away',
                    2.5,
                    'First Goalscorer',
                    `${awayTeam} First`
                  )
                "
              >
                <span>{{ awayTeam }} First</span>
                <span class="odd-value">2.50</span>
              </button>
            </div>
          </div>

          <div class="market-section">
            <h3>Half Time Result</h3>
            <div class="odds-grid">
              <button
                class="odd-btn"
                :class="{ selected: isOddSelected(matchId, 'half_time', '1') }"
                @click="
                  handleOddSelection(
                    'half_time',
                    '1',
                    2.75,
                    'Half Time Result',
                    'Home Win'
                  )
                "
              >
                <span>{{ homeTeam }}</span>
                <span class="odd-value">2.75</span>
              </button>
              <button
                class="odd-btn"
                :class="{ selected: isOddSelected(matchId, 'half_time', 'X') }"
                @click="
                  handleOddSelection(
                    'half_time',
                    'X',
                    2.1,
                    'Half Time Result',
                    'Draw'
                  )
                "
              >
                <span>Draw</span>
                <span class="odd-value">2.10</span>
              </button>
              <button
                class="odd-btn"
                :class="{ selected: isOddSelected(matchId, 'half_time', '2') }"
                @click="
                  handleOddSelection(
                    'half_time',
                    '2',
                    3.8,
                    'Half Time Result',
                    'Away Win'
                  )
                "
              >
                <span>{{ awayTeam }}</span>
                <span class="odd-value">3.80</span>
              </button>
            </div>
          </div>

          <div class="market-section">
            <h3>Correct Score</h3>
            <div class="odds-grid">
              <button
                v-for="(score, index) in correctScores"
                :key="index"
                class="odd-btn"
                :class="{
                  selected: isOddSelected(matchId, 'correct_score', score.type),
                }"
                @click="
                  handleOddSelection(
                    'correct_score',
                    score.type,
                    score.odds,
                    'Correct Score',
                    score.label
                  )
                "
              >
                <span>{{ score.label }}</span>
                <span class="odd-value">{{ formatOdd(score.odds) }}</span>
              </button>
            </div>
          </div>

          <div class="market-section">
            <h3>Total Corners</h3>
            <div class="odds-grid">
              <button
                class="odd-btn"
                :class="{
                  selected: isOddSelected(matchId, 'corners', 'over_9.5'),
                }"
                @click="
                  handleOddSelection(
                    'corners',
                    'over_9.5',
                    1.85,
                    'Total Corners',
                    'Over 9.5'
                  )
                "
              >
                <span>Over 9.5</span>
                <span class="odd-value">1.85</span>
              </button>
              <button
                class="odd-btn"
                :class="{
                  selected: isOddSelected(matchId, 'corners', 'under_9.5'),
                }"
                @click="
                  handleOddSelection(
                    'corners',
                    'under_9.5',
                    1.95,
                    'Total Corners',
                    'Under 9.5'
                  )
                "
              >
                <span>Under 9.5</span>
                <span class="odd-value">1.95</span>
              </button>
            </div>
          </div>

          <div class="market-section">
            <h3>Cards</h3>
            <div class="odds-grid">
              <button
                class="odd-btn"
                :class="{
                  selected: isOddSelected(matchId, 'cards', 'over_3.5'),
                }"
                @click="
                  handleOddSelection(
                    'cards',
                    'over_3.5',
                    1.9,
                    'Total Cards',
                    'Over 3.5'
                  )
                "
              >
                <span>Over 3.5 Cards</span>
                <span class="odd-value">1.90</span>
              </button>
              <button
                class="odd-btn"
                :class="{
                  selected: isOddSelected(matchId, 'cards', 'under_3.5'),
                }"
                @click="
                  handleOddSelection(
                    'cards',
                    'under_3.5',
                    1.9,
                    'Total Cards',
                    'Under 3.5'
                  )
                "
              >
                <span>Under 3.5 Cards</span>
                <span class="odd-value">1.90</span>
              </button>
            </div>
          </div>

          <div class="market-section">
            <h3>Team Specials</h3>
            <div class="odds-grid">
              <button class="odd-btn">
                <span>{{ homeTeam }} Clean Sheet</span>
                <span class="odd-value">3.20</span>
              </button>
              <button class="odd-btn">
                <span>{{ awayTeam }} Clean Sheet</span>
                <span class="odd-value">3.50</span>
              </button>
              <button class="odd-btn">
                <span>{{ homeTeam }} To Score 2+</span>
                <span class="odd-value">2.40</span>
              </button>
              <button class="odd-btn">
                <span>{{ awayTeam }} To Score 2+</span>
                <span class="odd-value">2.60</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Sidebar -->
    <div class="betslip-sidebar">
      <BetSlip />
    </div>
  </div>
  <FooterMobile />
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ref } from "vue";
import { useBettingStore } from "../stores/betting";
import BetSlip from "../components/Common/BetSlip.vue";
import FooterMobile from "../components/Footer/FooterMobile.vue";
import Header from "../components/Header/Header.vue";

const route = useRoute();
const bettingStore = useBettingStore();

const homeTeam = computed(() =>
  decodeURIComponent(route.params.homeTeam as string)
);
const awayTeam = computed(() =>
  decodeURIComponent(route.params.awayTeam as string)
);
const matchId = computed(() => route.params.matchId as string);

// Correct Score options
const correctScores = ref([
  { label: "1-0", type: "1_0", odds: 7.5 },
  { label: "2-0", type: "2_0", odds: 9.0 },
  { label: "2-1", type: "2_1", odds: 8.5 },
  { label: "0-0", type: "0_0", odds: 10.0 },
  { label: "1-1", type: "1_1", odds: 6.5 },
  { label: "2-2", type: "2_2", odds: 12.0 },
]);

// Add function to check if any selection in a market is selected
const isMarketSelected = (market: string, excludeType?: string) => {
  return bettingStore.selections.some(
    (s) =>
      s.matchId === matchId.value &&
      s.type.startsWith(market) &&
      (!excludeType || !s.type.endsWith(excludeType))
  );
};

// Add function to check if button should be disabled
const isDisabled = (market: string, type: string) => {
  // If this specific option is selected, it shouldn't be disabled
  if (isOddSelected(matchId.value, market, type)) {
    return false;
  }
  // If any other option in this market is selected, disable this one
  return isMarketSelected(market, type);
};

const handleOddSelection = (
  market: string,
  type: string,
  odds: number,
  marketName: string,
  selectionName: string
) => {
  // If the button is disabled, don't allow selection
  if (isDisabled(market, type)) {
    return;
  }

  bettingStore.addSelection({
    matchId: matchId.value,
    homeTeam: homeTeam.value,
    awayTeam: awayTeam.value,
    type: `${market}_${type}`,
    selection: selectionName,
    odds: odds,
    sportKey: "soccer",
    market: marketName,
    status: "upcoming",
    event: `${homeTeam.value} vs ${awayTeam.value}`,
    commenceTime: new Date().toISOString(),
  });
};

const isOddSelected = (matchId: string, market: string, type: string) => {
  return bettingStore.selections.some(
    (s) => s.matchId === matchId && s.type === `${market}_${type}`
  );
};

const formatOdd = (odd: number) => {
  return odd.toFixed(2);
};
</script>

<style scoped>
.home-container {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 1.5rem;
  max-width: 1920px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  flex: 1;
  margin-top: 0;
}

.betslip-sidebar {
  position: sticky;
  top: calc(var(--header-height) + 1.5rem);
  height: calc(100vh - var(--header-height) - 3rem);
  overflow-y: auto;
}

.main-content {
  min-width: 0;
  background: var(--subheader);
  border-radius: 8px;
  border: 1px solid var(--leftpreborder);
}

.same-game-multi-content {
  padding: 1rem;
}

.match-header {
  background: var(--header);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
}

.teams {
  margin-top: 1rem;
  font-size: 1.2rem;
}

.vs {
  margin: 0 1rem;
  color: var(--textcolor);
}

.betting-options {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.market-section {
  background: var(--subheader);
  padding: 1rem;
  border-radius: 8px;
}

.market-section h3 {
  margin-bottom: 1rem;
  color: var(--textcolor);
  font-size: 1.1rem;
}

.odds-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.8rem;
}

.odd-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1rem;
  background: var(--pointbox);
  border: 1px solid var(--leftpreborder);
  border-radius: 4px;
  color: var(--white);
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 48px;
}

.odd-btn:hover {
  background: var(--preactive);
  transform: translateY(-2px);
  border-color: var(--active-color);
}

.odd-btn:active {
  transform: translateY(0);
}

.odd-btn.selected {
  background: var(--active-color);
  border-color: var(--active-color);
  transform: translateY(-2px);
}

.odd-btn.selected .odd-value {
  color: var(--white);
}

.odd-value {
  font-weight: bold;
  color: var(--active-color);
}

/* Mobile Styles */
@media (max-width: 768px) {
  .home-container {
    padding: 0.8rem;
  }

  .match-header {
    padding: 1rem;
  }

  .teams {
    font-size: 1rem;
  }

  .odds-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .odd-btn {
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
    min-height: 44px;
  }

  .market-section {
    padding: 0.8rem;
  }

  .market-section h3 {
    font-size: 1rem;
    margin-bottom: 0.8rem;
  }
}

.team {
  font-weight: 500;
}

.team.home {
  color: var(--white);
}

.team.away {
  color: var(--white);
}

/* Responsive adjustments */
@media (max-width: 1400px) {
  .home-container {
    grid-template-columns: 1fr 300px;
    padding: 1rem;
    gap: 1rem;
  }
}

@media (max-width: 1200px) {
  .home-container {
    grid-template-columns: 1fr;
  }

  .betslip-sidebar {
    display: none;
  }
}

/* Safe area support */
@supports (padding: max(0px)) {
  .home-container {
    padding-left: max(2rem, env(safe-area-inset-left));
    padding-right: max(2rem, env(safe-area-inset-right));
    padding-bottom: max(1.5rem, env(safe-area-inset-bottom));
  }
}

/* Scrollbar styling */
.betslip-sidebar::-webkit-scrollbar {
  width: 6px;
}

.betslip-sidebar::-webkit-scrollbar-thumb {
  background: var(--pointbox);
  border-radius: 3px;
}

.betslip-sidebar::-webkit-scrollbar-track {
  background: var(--body-color);
}

/* Adjust grid for correct score market */
.market-section:has(h3:contains("Correct Score")) .odds-grid {
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
}

.odd-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--pointbox);
  transform: none;
  border-color: var(--leftpreborder);
}

.odd-btn.disabled:hover {
  background: var(--pointbox);
  transform: none;
  border-color: var(--leftpreborder);
}

.odd-btn.disabled .odd-value {
  color: var(--textcolor);
}
</style>
