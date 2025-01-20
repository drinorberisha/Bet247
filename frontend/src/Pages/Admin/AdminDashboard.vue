<template>
  <div class="admin-dashboard">
    <div v-if="loading" class="loading">
      Loading dashboard data...
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <template v-else>
      <div class="stats-grid">
        <div class="stat-card">
          <i class="fas fa-users"></i>
          <div class="stat-info">
            <h3>Total Users</h3>
            <p>{{ stats?.totalUsers || 0 }}</p>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-coins"></i>
          <div class="stat-info">
            <h3>Total Coins</h3>
            <p>{{ stats?.totalCoins || 0 }}</p>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-exchange-alt"></i>
          <div class="stat-info">
            <h3>Transactions Today</h3>
            <p>{{ stats?.transactionsToday || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="action-buttons">
          <button @click="router.push('/admin/coins')" v-if="isSuperuser" class="btn-action">
            <i class="fas fa-coins"></i>
            Generate Coins
          </button>
          <button @click="router.push('/admin/users')" class="btn-action">
            <i class="fas fa-users"></i>
            Manage Users
          </button>
          <button @click="router.push('/admin/transactions')" class="btn-action">
            <i class="fas fa-exchange-alt"></i>
            View Transactions
          </button>
        </div>
      </div>

      <div class="recent-activity">
        <h2>Recent Activity</h2>
        <table v-if="recentTransactions.length">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>From</th>
              <th>To</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in recentTransactions" :key="transaction._id">
              <td>{{ formatDate(transaction.createdAt) }}</td>
              <td>
                <span :class="['badge', transaction.type]">
                  {{ transaction.type }}
                </span>
              </td>
              <td>{{ transaction.amount }}</td>
              <td>{{ transaction.from?.username || 'System' }}</td>
              <td>{{ transaction.to?.username }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else>No recent transactions</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

interface DashboardStats {
  totalUsers: number;
  totalCoins: number;
  transactionsToday: number;
}

const stats = ref<DashboardStats>({
  totalUsers: 0,
  totalCoins: 0,
  transactionsToday: 0
});
const recentTransactions = ref([]);
const loading = ref(true);
const error = ref('');
const isSuperuser = computed(() => authStore.user?.role === 'superuser');

const formatDate = (date: string) => {
  return new Date(date).toLocaleString();
};

const fetchDashboardData = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    const apiUrl = `${import.meta.env.VITE_API_URL}/admin/dashboard`;
    console.log('Fetching dashboard data from:', apiUrl); // Debug log
    
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Response status:', response.status); // Debug log

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', errorData); // Debug log
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Dashboard data received:', data); // Debug log
    
    if (!data.stats) {
      throw new Error('Invalid data format received from server');
    }

    stats.value = data.stats;
    recentTransactions.value = data.recentTransactions;
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    error.value = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-card i {
  font-size: 24px;
  color: #007bff;
}

.stat-info h3 {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.stat-info p {
  margin: 5px 0 0;
  font-size: 24px;
  font-weight: bold;
}

.quick-actions {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 15px;
}

.btn-action {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-action:hover {
  background: #0056b3;
}

.recent-activity {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  font-weight: 600;
  color: #666;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.badge.system_generation {
  background: #28a745;
  color: white;
}

.badge.transfer {
  background: #007bff;
  color: white;
}

/* Responsive styles */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 10px;
  }

  .btn-action {
    width: 100%;
    justify-content: center;
  }

  /* Make table scrollable horizontally */
  .recent-activity {
    overflow-x: auto;
  }

  table {
    min-width: 600px; /* Ensure table doesn't shrink too much */
  }
}

.dashboard {
  max-width: 100%;
  overflow-x: hidden;
}

.table-container {
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

@media (max-width: 768px) {
  .table-responsive {
    margin: 0 -10px;
    padding: 0 10px;
    max-width: calc(100vw - 20px);
  }

  table {
    width: 100%;
    min-width: max-content;
  }

  .stats-grid {
    max-width: 100%;
    overflow-x: hidden;
  }
}
</style> 