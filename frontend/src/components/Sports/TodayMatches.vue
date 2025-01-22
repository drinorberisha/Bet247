<template>
  <div class="matches-container">
    <!-- Today's Matches Header -->
    <div class="today-header">
      <h2>Today's Matches</h2>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="loader"></div>
      <span>Loading matches...</span>
    </div>

    <!-- Empty State -->
    <div v-else-if="!hasMatches" class="empty-state">
      <i class="icon-calendar"></i>
      <p>No live matches at the moment</p>
      <span>Please check back later</span>
    </div>

    <!-- Group matches by league -->
    <div
      v-else
      v-for="(leagueMatches, league) in groupedLiveMatches"
      :key="league"
      class="league-section"
    >
      <div class="league-header">
        <h3>{{ formatLeagueName(league) }}</h3>
      </div>

      <div class="match-list">
        <div
          v-for="(match, index) in leagueMatches"
          :key="match._id"
          class="match-row"
          v-show="index < 2 || expandedLeagues[league]"
        >
          <div class="match-info">
            <div class="match-datetime">
              <div class="match-date">
                {{ formatMatchDate(match.commenceTime) }}
              </div>
              <div class="match-time">
                {{
                  formatMatchTime(match.commenceTime, match.status, currentTime)
                }}
              </div>
            </div>
            <div class="match-teams">
              <div class="team home">{{ match.homeTeam }}</div>
              <div class="team away">{{ match.awayTeam }}</div>
            </div>
          </div>

          <div class="odds-container">
            <button
              class="odd-box"
              @click="handleOddSelection(match, '1', match.odds.homeWin)"
              :class="{
                disabled: match.status === 'ended',
                selected: isOddSelected(match._id, '1'),
              }"
            >
              <span class="odd-label">1</span>
              <span class="odd-value">{{ formatOdd(match.odds.homeWin) }}</span>
            </button>
            <button
              class="odd-box"
              @click="handleOddSelection(match, 'X', match.odds.draw)"
              :class="{
                disabled: match.status === 'ended',
                selected: isOddSelected(match._id, 'X'),
              }"
            >
              <span class="odd-label">X</span>
              <span class="odd-value">{{ formatOdd(match.odds.draw) }}</span>
            </button>
            <button
              class="odd-box"
              @click="handleOddSelection(match, '2', match.odds.awayWin)"
              :class="{
                disabled: match.status === 'ended',
                selected: isOddSelected(match._id, '2'),
              }"
            >
              <span class="odd-label">2</span>
              <span class="odd-value">{{ formatOdd(match.odds.awayWin) }}</span>
            </button>
          </div>
        </div>

        <!-- See More button -->
        <div
          v-if="leagueMatches.length > 2"
          class="see-more-container"
          @click="toggleLeagueExpansion(league)"
        >
          <button class="see-more-button">
            {{
              expandedLeagues[league]
                ? "Show Less"
                : `Show ${leagueMatches.length - 2} More Matches`
            }}
            <i
              :class="
                expandedLeagues[league]
                  ? 'icon-chevron-up'
                  : 'icon-chevron-down'
              "
            ></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useBettingStore } from "../../stores/betting";
import { useMatchesStore } from "../../stores/matches";
import { LEAGUE_NAMES } from "../../config/sportsConfig";

const bettingStore = useBettingStore();
const matchesStore = useMatchesStore();
const selectedTimeSlot = ref("all");
const isLoading = ref(true);
const expandedLeagues = ref({});

const timeSlots = [
  { id: "all", label: "All Day", count: 24 },
  { id: "morning", label: "Morning", count: 8 },
  { id: "afternoon", label: "Afternoon", count: 10 },
  { id: "evening", label: "Evening", count: 6 },
];

// Get only live matches
const liveMatches = computed(() => {
  return matchesStore.matches.filter((match) => match.status === "live");
});

// Group matches by league
const groupedLiveMatches = computed(() => {
  const groups = {};
  liveMatches.value.forEach((match) => {
    const league = match.sportKey.split("_").slice(1).join("_");
    if (!groups[league]) {
      groups[league] = [];
    }
    groups[league].push(match);
  });
  return groups;
});

onMounted(async () => {
  isLoading.value = true;
  try {
    const sports = [
      "soccer",
      "tennis",
      "basketball",
      "icehockey",
      "handball",
      "baseball",
    ];
    await Promise.all(
      sports.map((sport) => matchesStore.fetchMatches(sport, "live"))
    );
  } catch (error) {
    console.error("Error fetching live matches:", error);
  } finally {
    isLoading.value = false;
  }
});

const formatMatchDate = (time: string) => {
  const date = new Date(time);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatMatchTime = (
  time: string,
  status: string,
  currentTime?: string
) => {
  if (status === "live" && currentTime) {
    return `${currentTime}'`; // For live matches, show current match time
  }

  const date = new Date(time);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatLeagueName = (key: string) => {
  return (
    LEAGUE_NAMES[key] ||
    key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
};

const formatOdd = (odd: number) => {
  return odd ? odd.toFixed(2) : "-";
};

const toggleLeagueExpansion = (league: string) => {
  expandedLeagues.value[league] = !expandedLeagues.value[league];
};

const handleOddSelection = (match: any, type: string, odds: number) => {
  if (match.status === "ended") return;

  bettingStore.addSelection({
    matchId: match._id,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    type,
    odds,
    sportKey: match.sportKey,
  });
};

const isOddSelected = (matchId: string, type: string) => {
  const bet = bettingStore.bets.find((b) => b.matchId === matchId);
  return bet?.selections.some((s) => s.type === type) ?? false;
};

const hasMatches = computed(() => liveMatches.value.length > 0);
</script>

<style scoped>
.today-header {
  padding: 1rem;

  color: var(--white);
}
.matches-container {
  padding: 1rem;
  background: var(--body-color);
}

.league-section {
  margin-bottom: 2rem;
  background: var(--subheader);
  border-radius: 8px;
  overflow: hidden;
}

.league-header {
  padding: 1rem;
  background: var(--header);
  color: var(--white);
  border-bottom: 2px solid var(--active-color);
}

.match-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--leftpreborder);
  transition: background 0.3s ease;
}

.match-row:hover {
  background: var(--signbet);
}

.match-info {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.match-datetime {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 100px;
}

.match-date {
  color: var(--textcolor);
  font-size: 0.85rem;
}

.match-time {
  color: var(--white);
  font-weight: 500;
  font-size: 0.9rem;
}

.match-teams {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.odds-container {
  display: flex;
  gap: 0.5rem;
}

.odd-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.8rem 1.2rem;
  min-width: 70px;
  background: var(--pointbox);
  border: 1px solid var(--leftpreborder);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.odd-box:hover:not(.disabled) {
  background: var(--preactive);
  border-color: var(--active-color);
  transform: translateY(-2px);
}

.odd-box.active {
  background: var(--preactive);
  border-color: var(--active-color);
}

.odd-label {
  font-size: 0.8rem;
  color: var(--textcolor);
  margin-bottom: 0.3rem;
}

.odd-value {
  font-weight: bold;
  color: var(--active-color);
  font-size: 1.1rem;
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.team {
  font-size: 0.95rem;
}

.team.home {
  color: var(--white);
}

.team.away {
  color: var(--textcolor);
}

@keyframes oddUpdate {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
    color: var(--active-color);
  }
  100% {
    transform: scale(1);
  }
}

.odd-value.updated {
  animation: oddUpdate 0.5s ease;
}

.see-more-container {
  display: flex;
  justify-content: center;
  padding: 0.5rem;
  border-top: 1px solid var(--leftpreborder);
}

.see-more-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  color: var(--active-color);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.see-more-button:hover {
  color: var(--active-two);
}

.see-more-button i {
  font-size: 0.8rem;
  transition: transform 0.2s ease;
}

@keyframes rotateChevron {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(180deg);
  }
}

.icon-chevron-up {
  animation: rotateChevron 0.3s ease forwards;
}

.icon-chevron-down {
  animation: rotateChevron 0.3s ease reverse forwards;
}

.odd-box.selected {
  background: var(--preactive);
  border-color: var(--active-color);
  transform: translateY(-2px);
}

.odd-box.selected .odd-value {
  color: var(--active-color);
}

.odd-box.selected:hover {
  background: var(--preactive);
  transform: translateY(-2px);
}

@keyframes selectOdd {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.odd-box.selected {
  animation: selectOdd 0.3s ease;
}

.odd-box.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  background: var(--pointbox);
  border-color: var(--leftpreborder);
}

.odd-box.disabled:hover {
  transform: none;
  background: var(--pointbox);
}

/* Media Queries */
@media (max-width: 768px) {
  .match-row {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .match-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }

  .match-datetime {
    min-width: unset;
    align-items: flex-start;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--leftpreborder);
    width: 100%;
  }

  .match-teams {
    width: 100%;
  }

  .odds-container {
    justify-content: space-between;
    width: 100%;
  }

  .odd-box {
    flex: 1;
    padding: 0.6rem;
    min-width: unset;
  }

  .team {
    font-size: 0.9rem;
  }

  .see-more-button {
    width: 100%;
    justify-content: center;
    padding: 0.8rem;
    font-size: 0.85rem;
  }

  .odd-box.selected {
    transform: translateY(-1px);
  }
}

@media (max-width: 480px) {
  .odd-box {
    padding: 0.5rem;
  }

  .odd-label {
    font-size: 0.7rem;
    margin-bottom: 0.2rem;
  }

  .odd-value {
    font-size: 0.9rem;
  }

  .team {
    font-size: 0.85rem;
  }
}

@container (max-width: 400px) {
  .match-row {
    padding: 0.8rem;
  }

  .league-header {
    padding: 0.8rem;
  }

  .odds-container {
    gap: 0.3rem;
  }
}
</style>
