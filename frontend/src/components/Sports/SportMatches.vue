<template>
  <div class="matches-container">
    <!-- Group matches by league -->
    <div v-for="(leagueMatches, league) in groupedMatches" :key="league" class="league-section">
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
              <div class="match-date">{{ formatMatchDate(match.commenceTime) }}</div>
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
import { ref, onMounted, watch, computed } from 'vue';
import { useMatchesStore } from '../../stores/matches';
import { useBettingStore } from '../../stores/betting';
import { SPORTS_CONFIG, LEAGUE_NAMES } from '../../config/sportsConfig';
import MatchOdds from './MatchOdds.vue';

const props = defineProps<{
  sportKey: string;
  sportTitle: string;
  tabId: string;
  iconClass: string;
  tableClass: string;
}>();

const matchesStore = useMatchesStore();
const bettingStore = useBettingStore();
const selectedStatus = ref('upcoming');

// Get leagues for the current sport
const getSportLeagues = (sportKey: string) => {
  // Map the sport keys to match the configuration
  const sportKeyMap = {
    'tennis': 'tennis',
    'icehockey': 'icehockey',
    'baseball': 'baseball',
    'soccer': 'soccer',
    'basketball': 'basketball',
    'cricket': 'cricket'
  };

  const configKey = sportKeyMap[sportKey] || sportKey;
  console.log('Getting leagues for sport:', sportKey, 'using config key:', configKey);
  return SPORTS_CONFIG[configKey] || [sportKey];
};

// Updated computed property with null checks
const filteredMatches = computed(() => {
  const matches = selectedStatus.value === 'live' 
    ? matchesStore.matches.filter(match => 
        match && 
        match.status === 'live' && 
        match.sportKey && 
        match.sportKey.startsWith(props.sportKey)
      )
    : matchesStore.matches.filter(match => 
        match && 
        match.sportKey && 
        match.sportKey.startsWith(props.sportKey) && 
        match.status === selectedStatus.value
      );

  // Debug log
  matches.forEach(match => {
    console.log('Match data:', {
      title: match.title,
      odds: match.odds,
      status: match.status
    });
  });

  return matches;
});

// Watch for status changes
watch(selectedStatus, async () => {
  console.log('Status changed to:', selectedStatus.value);
  isLoading.value = true;
  try {
    const leagues = getSportLeagues(props.sportKey);
    await Promise.all(leagues.map(key => 
      matchesStore.fetchMatches(key, selectedStatus.value)
    ));
  } finally {
    isLoading.value = false;
  }
});

// Initial fetch
onMounted(() => {
  console.log('Component mounted, fetching matches for:', props.sportKey);
  const leagues = getSportLeagues(props.sportKey);
  
  Promise.all(leagues.map(key => 
    matchesStore.fetchMatches(key, selectedStatus.value)
  ));
});

const handleOddSelection = (match: any, type: string, odds: number) => {
  if (match.status === 'ended') return;

  bettingStore.addSelection({
    matchId: match._id,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    type: type,
    odds: odds,
    sportKey: match.sportKey,
    market: 'Match Winner',
    status: match.status
  });
};

const isOddSelected = (matchId: string, type: string) => {
  return bettingStore.selections.some(s => 
    s.matchId === matchId && s.type === type
  );
};

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

const formatMatchDate = (time: string) => {
  const date = new Date(time);
  return date.toLocaleDateString(undefined, { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

const formatMatchTime = (time: string) => {
  const date = new Date(time);
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit'
  });
};

// Format league names using SPORTS_CONFIG structure
const formatLeagueName = (key: string) => {
  return LEAGUE_NAMES[key] || key.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const formatOdd = (odd: number) => {
  return odd ? odd.toFixed(2) : '-';
};

// Track expanded leagues
const expandedLeagues = ref({});

// Toggle league expansion
const toggleLeagueExpansion = (league: string) => {
  expandedLeagues.value[league] = !expandedLeagues.value[league];
};

// Add error handling for empty matches
const hasMatches = computed(() => {
  const matches = matchesStore.getMatchesBySport(props.sportKey);
  return matches && matches.length > 0;
});

// Add loading state
const isLoading = ref(false);
</script>

<style scoped>
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
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}

.match-row:hover {
  background: var(--signbet);
}

.match-info {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }
}

.match-datetime {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 100px;
  
  @media (max-width: 768px) {
    min-width: unset;
    align-items: flex-start;
  }
}

.match-date {
  color: var(--textcolor);
  font-size: 0.85rem;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
}

.match-time {
  color: var(--white);
  font-weight: 500;
  font-size: 0.9rem;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
}

.match-teams {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    width: 100%;
  }
}

.odds-container {
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    justify-content: space-between;
    width: 100%;
  }
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
  
  @media (max-width: 768px) {
    flex: 1;
    padding: 0.6rem;
    min-width: unset;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
}

.odd-box:hover:not(.disabled) {
  background: var(--preactive);
  border-color: var(--active-color);
  transform: translateY(-2px);
  
  @media (max-width: 768px) {
    transform: translateY(-1px);
  }
}

.odd-box.active {
  background: var(--preactive);
  border-color: var(--active-color);
}

.odd-label {
  font-size: 0.8rem;
  color: var(--textcolor);
  margin-bottom: 0.3rem;
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
    margin-bottom: 0.2rem;
  }
}

.odd-value {
  font-weight: bold;
  color: var(--active-color);
  font-size: 1.1rem;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.team {
  font-size: 0.95rem;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
}

.team.home {
  color: var(--white);
}

.team.away {
  color: var(--textcolor);
}

/* Add animation for odds changes */
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

/* Additional responsive container queries */
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

/* Smooth transition for expanding/collapsing */
.match-row {
  transition: all 0.3s ease;
}

/* Responsive styles for see more button */
@media (max-width: 768px) {
  .see-more-button {
    width: 100%;
    justify-content: center;
    padding: 0.8rem;
    font-size: 0.85rem;
  }
}

/* Optional: Add a subtle animation for the chevron icon */
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

/* Optional: Add a subtle separator between date and teams on mobile */
@media (max-width: 768px) {
  .match-datetime {
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--leftpreborder);
    width: 100%;
  }
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

/* Add animation for selection */
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

/* Ensure disabled state overrides selected state */
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

/* Responsive adjustments for selected state */
@media (max-width: 768px) {
  .odd-box.selected {
    transform: translateY(-1px);
  }
}
</style> 