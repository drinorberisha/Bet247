<template>
  <div>
    <Header />
    <div class="my-bets-container">
      <!-- Tabs Navigation -->
      <div class="bets-tabs">
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'open' }"
          @click="activeTab = 'open'"
        >
          Open Bets
          <span class="bet-count" v-if="openBets.length">{{ openBets.length }}</span>
        </button>
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'settled' }"
          @click="activeTab = 'settled'"
        >
          Settled Bets
          <span class="bet-count" v-if="settledBets.length">{{ settledBets.length }}</span>
        </button>
      </div>

      <!-- Bets List -->
      <div class="bets-list" v-if="currentBets.length">
        <div 
          v-for="bet in currentBets" 
          :key="bet.id" 
          class="bet-card"
          :class="{ 'won': bet.status === 'won', 'lost': bet.status === 'lost' }"
        >
          <div class="bet-header">
            <span class="bet-date">{{ formatDate(bet.placedAt) }}</span>
            <span class="bet-status" :class="bet.status">
              {{ formatStatus(bet.status) }}
            </span>
          </div>

          <div class="bet-details">
            <div class="match-info">
              <span class="league">{{ bet.league }}</span>
              <div class="teams">
                <span class="team">{{ bet.homeTeam }}</span>
                <span class="vs">vs</span>
                <span class="team">{{ bet.awayTeam }}</span>
              </div>
            </div>

            <div class="bet-info">
              <div class="bet-type">{{ bet.type }}</div>
              <div class="bet-odds">{{ bet.odds }}</div>
              <div class="bet-amount">€{{ formatAmount(bet.amount) }}</div>
              <div class="potential-win" v-if="bet.status === 'open'">
                Potential Win: €{{ formatAmount(bet.potentialWin) }}
              </div>
              <div class="win-amount" v-else-if="bet.status === 'won'">
                Won: €{{ formatAmount(bet.winAmount) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" v-else>
        <i class="fas fa-ticket-alt"></i>
        <p>No {{ activeTab }} bets found</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import Header from '../components/Header/Header.vue';

const authStore = useAuthStore();
const activeTab = ref('open');

// Mock data - Replace with actual API calls
const openBets = ref([
  {
    id: 1,
    league: 'Germany Bundesliga',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Borussia Dortmund',
    type: '1',
    odds: 1.85,
    amount: 100,
    potentialWin: 185,
    status: 'open',
    placedAt: new Date(),
  },
  // Add more mock data
]);

const settledBets = ref([
  {
    id: 2,
    league: 'Premier League',
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    type: 'X',
    odds: 3.20,
    amount: 50,
    winAmount: 160,
    status: 'won',
    placedAt: new Date(Date.now() - 86400000),
  },
  // Add more mock data
]);

const currentBets = computed(() => {
  return activeTab.value === 'open' ? openBets.value : settledBets.value;
});

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const formatAmount = (amount: number) => {
  return amount.toFixed(2);
};

const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};
</script>

<style scoped>
.my-bets-container {
  padding: 1rem;
  margin-top: 60px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.bets-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--leftpreborder);
}

.tab-button {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  color: var(--textcolor);
  font-weight: 600;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab-button.active {
  color: var(--active-color);
  border-bottom: 2px solid var(--active-color);
}

.bet-count {
  background: var(--pointbox);
  color: var(--white);
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.bet-card {
  background: var(--subheader);
  border: 1px solid var(--leftpreborder);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.bet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.bet-date {
  color: var(--textcolor);
  font-size: 0.9rem;
}

.bet-status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.bet-status.won {
  background: var(--success);
  color: var(--white);
}

.bet-status.lost {
  background: var(--error);
  color: var(--white);
}

.bet-status.open {
  background: var(--warning);
  color: var(--black);
}

.match-info {
  margin-bottom: 1rem;
}

.league {
  color: var(--textcolor);
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  display: block;
}

.teams {
  font-weight: 600;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.vs {
  color: var(--textcolor);
  font-size: 0.8rem;
}

.bet-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  align-items: center;
}

.bet-type,
.bet-odds,
.bet-amount,
.potential-win,
.win-amount {
  text-align: center;
  padding: 0.5rem;
  background: var(--header);
  border-radius: 4px;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--textcolor);
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .my-bets-container {
    padding: 0.5rem;
    margin-bottom: 60px;
  }

  .bet-info {
    grid-template-columns: 1fr 1fr;
  }
}
</style> 