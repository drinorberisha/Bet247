<template>
  <div class="matches-container">
    <!-- Today's Matches Header -->
    <div class="today-header">
      <h2>Today's Matches</h2>
      <div class="time-filters">
        <button
          v-for="timeSlot in timeSlots"
          :key="timeSlot.id"
          :class="{ active: selectedTimeSlot === timeSlot.id }"
          @click="selectedTimeSlot = timeSlot.id"
          class="filter-btn"
        >
          {{ timeSlot.label }}
          <span class="count">{{ timeSlot.count }}</span>
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!hasMatches" class="empty-state">
      <i class="icon-calendar"></i>
      <p>No matches scheduled for today</p>
      <span>Please check back later</span>
    </div>

    <!-- Group matches by league -->
    <div
      v-else
      v-for="(leagueMatches, league) in groupedTodayMatches"
      :key="league"
      class="league-section"
    >
      <div class="league-header">
        <h3>{{ formatLeagueName(league) }}</h3>
      </div>

      <div class="match-list">
        <div v-for="match in leagueMatches" :key="match._id" class="match-row">
          <div class="match-info">
            <div class="match-datetime">
              <div class="match-time">
                {{ formatMatchTime(match.startTime) }}
              </div>
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

const bettingStore = useBettingStore();
const selectedTimeSlot = ref("all");

const timeSlots = [
  { id: "all", label: "All Day", count: 24 },
  { id: "morning", label: "Morning", count: 8 },
  { id: "afternoon", label: "Afternoon", count: 10 },
  { id: "evening", label: "Evening", count: 6 },
];

interface Match {
  _id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  odds: Record<string, number>;
}

const todayMatches = ref<Match[]>([
  {
    _id: "today1",
    league: "Premier League",
    homeTeam: "Liverpool",
    awayTeam: "Man City",
    startTime: "20:45",
    odds: {
      "1": 2.5,
      X: 3.2,
      "2": 3.8,
    },
  },
  // Add more mock matches
]);

const groupedTodayMatches = computed(() => {
  return todayMatches.value.reduce((acc: Record<string, Match[]>, match) => {
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

const formatMatchTime = (time: string) => {
  return time;
};

const formatOdd = (odd: number) => {
  return odd.toFixed(2);
};

const handleOddSelection = (match: Match, type: string, odd: number) => {
  bettingStore.addBet({
    matchId: match._id,
    type: String(type),
    odd,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    league: match.league,
  });
};

const isOddSelected = (matchId: string, type: string) => {
  return bettingStore.isBetSelected(matchId, type);
};

const hasMatches = computed(() => todayMatches.value.length > 0);
</script>

<style scoped>
.matches-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.today-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.time-filters {
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

/* Rest of the styles from SportMatches.vue */

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
</style>
