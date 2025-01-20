<template>
  <div class="matches-container">
    <!-- Live Matches Header -->
    <div class="live-header">
      <h2>Live Matches</h2>
      <div class="live-filters">
        <button
          v-for="sport in liveSports"
          :key="sport.id"
          :class="{ active: selectedSport === sport.id }"
          @click="selectedSport = sport.id"
          class="filter-btn"
        >
          <i :class="sport.icon"></i>
          {{ sport.name }}
          <span class="count">{{ sport.count }}</span>
        </button>
      </div>
    </div>

    <div v-if="!hasMatches" class="empty-state">
      <i class="icon-calendar"></i>
      <p>No live matches available at the moment</p>
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
        <h3>{{ formatLeagueName(String(league)) }}</h3>
        <span class="live-indicator">LIVE</span>
      </div>

      <div class="match-list">
        <div v-for="match in leagueMatches" :key="match._id" class="match-row">
          <div class="match-info">
            <div class="match-status">
              <span class="live-time">{{ match.liveTime }}'</span>
              <span class="score">{{ match.score }}</span>
            </div>
            <div class="match-teams">
              <div class="team home">{{ match.homeTeam }}</div>
              <div class="team away">{{ match.awayTeam }}</div>
            </div>
          </div>

          <div class="odds-container">
            <button
              v-for="(odd, type) in match.odds"
              :key="type"
              class="odd-box"
              @click="handleOddSelection(match, type, odd)"
              :class="{
                selected: isOddSelected(match._id, String(type)),
              }"
            >
              <span class="odd-label">{{ type }}</span>
              <span class="odd-value">{{ formatOdd(odd) }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useBettingStore } from "../../stores/betting";
const hasMatches = computed(() => liveMatches.value.length > 0);

const bettingStore = useBettingStore();
const selectedSport = ref("all");

const liveSports = [
  { id: "all", name: "All", icon: "icon-all", count: 12 },
  { id: "football", name: "Football", icon: "icon-football", count: 8 },
  { id: "tennis", name: "Tennis", icon: "icon-tennis", count: 4 },
  { id: "basketball", name: "Basketball", icon: "icon-basketball", count: 6 },
];

// Mock data - replace with real API data
const liveMatches = ref([
  {
    _id: "live1",
    league: "Premier League",
    homeTeam: "Arsenal",
    awayTeam: "Chelsea",
    liveTime: "32",
    score: "1-0",
    odds: {
      "1": 2.1,
      X: 3.4,
      "2": 4.2,
    },
  },
  // Add more mock matches
]);

const groupedLiveMatches = computed(() => {
  // Group matches by league logic
  return liveMatches.value.reduce((acc: { [key: string]: any[] }, match) => {
    if (!acc[match.league]) {
      acc[match.league] = [];
    }
    acc[match.league].push(match);
    return acc;
  }, {});
});

const formatLeagueName = (league: string) => {
  return league;
};

const formatOdd = (odd: number | string) => {
  return Number(odd).toFixed(2);
};

const handleOddSelection = (
  match: any,
  type: string | number,
  odd: string | number
) => {
  bettingStore.addBet({
    matchId: match._id,
    type: String(type),
    odd: Number(odd),
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    league: match.league,
  });
};

const isOddSelected = (matchId: string, type: string) => {
  return bettingStore.isBetSelected(matchId, type);
};
</script>

<style scoped>
.matches-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: calc(
    100vh - var(--header-height) - 6rem
  ); /* Ensure minimum height */
}

.live-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.live-filters {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: var(--pointbox);
  border: 1px solid var(--leftpreborder);
  border-radius: 4px;
  color: var(--white);
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn.active {
  background: var(--preactive);
  color: var(--active-color);
}

.count {
  background: var(--header);
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  font-size: 0.8rem;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  color: var(--textcolor);
  text-align: center;
}

.empty-state i {
  font-size: 3rem;
  color: var(--pointbox);
}

.empty-state p {
  font-size: 1.2rem;
  margin: 0;
}

.empty-state span {
  font-size: 0.9rem;
  opacity: 0.7;
}

/* Rest of the styles from SportMatches.vue */
</style>
