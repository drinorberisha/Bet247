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
          <span class="count">{{ getTimeSlotCount(timeSlot.id) }}</span>
        </button>
      </div>
    </div>

    <div v-if="!hasMatches" class="empty-state">
      <i class="icon-calendar"></i>
      <p>No matches scheduled for today</p>
      <span>Please check back later</span>
    </div>

    <!-- Group matches by league -->
    <div
      v-else
      v-for="(leagueMatches, league) in groupedMatches"
      :key="league"
      class="league-section"
    >
      <div class="league-header">
        <h3>{{ formatLeagueName(String(league)) }}</h3>
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
              <div class="match-time">{{ formatMatchTime(match.commenceTime) }}</div>
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
                'disabled': match.status === 'ended',
                'selected': isOddSelected(match._id, '1')
              }"
            >
              <span class="odd-label">1</span>
              <span class="odd-value">{{ formatOdd(match.odds.homeWin) }}</span>
            </button>
            <button 
              class="odd-box"
              @click="handleOddSelection(match, 'X', match.odds.draw)"
              :class="{ 
                'disabled': match.status === 'ended',
                'selected': isOddSelected(match._id, 'X')
              }"
            >
              <span class="odd-label">X</span>
              <span class="odd-value">{{ formatOdd(match.odds.draw) }}</span>
            </button>
            <button 
              class="odd-box"
              @click="handleOddSelection(match, '2', match.odds.awayWin)"
              :class="{ 
                'disabled': match.status === 'ended',
                'selected': isOddSelected(match._id, '2')
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
            {{ expandedLeagues[league] ? 'Show Less' : `Show ${leagueMatches.length - 2} More Matches` }}
            <i :class="expandedLeagues[league] ? 'icon-chevron-up' : 'icon-chevron-down'"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useMatchesStore } from '../../stores/matches';
import { useBettingStore } from '../../stores/betting';
import { LEAGUE_NAMES } from '../../config/sportsConfig';

const matchesStore = useMatchesStore();
const bettingStore = useBettingStore();
const selectedTimeSlot = ref('all');
const expandedLeagues = ref({});

const timeSlots = [
  { id: 'all', label: 'All Day', startHour: 0, endHour: 24 },
  { id: 'morning', label: 'Morning', startHour: 6, endHour: 12 },
  { id: 'afternoon', label: 'Afternoon', startHour: 12, endHour: 18 },
  { id: 'evening', label: 'Evening', startHour: 18, endHour: 24 }
];

// Filter matches for today and by time slot
const filteredMatches = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const matches = matchesStore.matches.filter(match => {
    const matchDate = new Date(match.commenceTime);
    const isToday = matchDate >= today && matchDate < tomorrow;
    
    if (!isToday) return false;

    if (selectedTimeSlot.value === 'all') return true;

    const slot = timeSlots.find(s => s.id === selectedTimeSlot.value);
    if (!slot) return true;

    const hour = matchDate.getHours();
    return hour >= slot.startHour && hour < slot.endHour;
  });

  return matches;
});

// Group matches by league
const groupedMatches = computed(() => {
  const groups = {};
  filteredMatches.value.forEach(match => {
    const league = match.sportKey.split('_').slice(1).join('_');
    if (!groups[league]) {
      groups[league] = [];
    }
    groups[league].push(match);
  });
  return groups;
});

const getTimeSlotCount = (slotId: string) => {
  const slot = timeSlots.find(s => s.id === slotId);
  if (!slot) return 0;

  return filteredMatches.value.filter(match => {
    if (slotId === 'all') return true;
    const matchHour = new Date(match.commenceTime).getHours();
    return matchHour >= slot.startHour && matchHour < slot.endHour;
  }).length;
};

const formatMatchTime = (time: string) => {
  const date = new Date(time);
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit'
  });
};

const formatLeagueName = (key: string) => {
  return LEAGUE_NAMES[key] || key.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const formatOdd = (odd: number) => {
  return odd ? odd.toFixed(2) : '-';
};

const handleOddSelection = (match: any, type: string, odds: number) => {
  if (match.status === 'ended') return;

  bettingStore.addSelection({
    matchId: match._id,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    type: type,
    selection: type,
    odds: odds,
    sportKey: match.sportKey,
    market: 'Match Winner',
    status: match.status,
    event: `${match.homeTeam} vs ${match.awayTeam}`,
    commenceTime: match.commenceTime
  });
};

const isOddSelected = (matchId: string, type: string) => {
  return bettingStore.selections.some(s => 
    s.matchId === matchId && s.type === type
  );
};

const toggleLeagueExpansion = (league: string) => {
  expandedLeagues.value[league] = !expandedLeagues.value[league];
};

const hasMatches = computed(() => filteredMatches.value.length > 0);

// Initial fetch
onMounted(() => {
  // Fetch all matches - they will be filtered by the computed properties
  matchesStore.fetchMatches('all', 'upcoming');
});
</script>

<style scoped>
/* Import all styles from SportMatches.vue */
.matches-container {
  padding: 1rem;
  background: var(--body-color);
}

/* Today-specific styles */
.today-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
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

/* Reuse all match display styles from SportMatches.vue */
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

.match-info {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.match-teams {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

/* Reuse all odds styles */
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

/* Include all responsive styles and animations from SportMatches.vue */
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

  .odds-container {
    justify-content: space-between;
    width: 100%;
  }

  .odd-box {
    flex: 1;
    padding: 0.6rem;
    min-width: unset;
  }
}

/* Reuse all the animations */
@keyframes selectOdd {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.odd-box.selected {
  animation: selectOdd 0.3s ease;
  background: var(--preactive);
  border-color: var(--active-color);
  transform: translateY(-2px);
}

/* Include empty state styles */
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
