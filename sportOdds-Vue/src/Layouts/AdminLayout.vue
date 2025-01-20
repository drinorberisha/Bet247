<template>
  <div class="admin-layout">
    <button class="mobile-menu-toggle" @click="toggleSidebar">
      <i :class="['fas', sidebarOpen ? 'fa-times' : 'fa-bars']"></i>
    </button>

    <aside class="admin-sidebar" :class="{ 'mobile-open': sidebarOpen }">
      <div class="logo">
        <img src="/favicon.png" alt="Logo" width="32" height="32" />
        <span>Admin Panel</span>
      </div>
      <nav>
        <RouterLink to="/admin/dashboard" class="nav-item" @click="closeSidebarOnMobile">
          <i class="fas fa-home"></i>
          <span>Dashboard</span>
        </RouterLink>
        <RouterLink to="/admin/users" class="nav-item" @click="closeSidebarOnMobile">
          <i class="fas fa-users"></i>
          <span>Users</span>
        </RouterLink>
        <RouterLink to="/admin/transactions" class="nav-item" @click="closeSidebarOnMobile">
          <i class="fas fa-exchange-alt"></i>
          <span>Transactions</span>
        </RouterLink>
        <RouterLink to="/admin/coins" class="nav-item" v-if="isAdminOrSuperuser" @click="closeSidebarOnMobile">
          <i class="fas fa-coins"></i>
          <span>Coins Management</span>
        </RouterLink>
      </nav>
    </aside>

    <div class="admin-content">
      <header class="admin-header">
        <div class="search">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Search..." />
        </div>
        <div class="user-menu">
          <span class="user-info">{{ authStore.user?.username }}</span>
          <span class="user-role">({{ authStore.user?.role }})</span>
          <button @click="handleLogout" class="logout-btn">
            <i class="fas fa-sign-out-alt"></i>
            <span class="logout-text">Logout</span>
          </button>
        </div>
      </header>

      <main class="main-content">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';

const authStore = useAuthStore();
const router = useRouter();
const sidebarOpen = ref(false);

const isAdminOrSuperuser = computed(() => {
  const role = authStore.user?.role;
  return role === 'admin' || role === 'superuser';
});

const isSuperuser = computed(() => authStore.user?.role === 'superuser');

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const closeSidebarOnMobile = () => {
  if (window.innerWidth <= 768) {
    sidebarOpen.value = false;
  }
};

const handleLogout = async () => {
  await authStore.logout();
  router.push('/');
};
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
  max-width: 100vw;
  overflow-x: hidden;
}

.mobile-menu-toggle {
  display: none;
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1000;
  background: #2c3e50;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
}

.admin-sidebar {
  position: fixed;
  width: 250px;
  height: 100vh;
  background: #2c3e50;
  color: white;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  z-index: 900;
  transition: transform 0.3s ease;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  font-size: 1.2rem;
  font-weight: bold;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  margin-bottom: 5px;
}

.nav-item:hover, .nav-item.router-link-active {
  background: rgba(255, 255, 255, 0.1);
}

.nav-item i {
  width: 20px;
}

.admin-content {
  flex: 1;
  margin-left: 250px;
  min-height: 100vh;
  max-width: 100%;
  overflow-x: hidden;
}

.admin-header {
  position: fixed;
  top: 0;
  right: 0;
  left: 250px;
  height: 60px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 100;
}

.main-content {
  padding: 80px 20px 20px;
  background-color: #f8f9fa;
  min-height: calc(100vh - 60px);
  width: 100%;
  overflow-x: hidden;
}

.search {
  position: relative;
  width: 300px;
}

.search i {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.search input {
  width: 100%;
  padding: 8px 8px 8px 35px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info {
  font-weight: 500;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 15px;
  border: none;
  background: #dc3545;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn:hover {
  background: #c82333;
}

@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: block;
  }

  .admin-sidebar {
    transform: translateX(-100%);
    width: 100%;
    max-width: 300px;
  }

  .admin-sidebar.mobile-open {
    transform: translateX(0);
  }

  .admin-content {
    margin-left: 0;
  }

  .admin-header {
    left: 0;
    padding: 0 10px;
  }

  .search {
    display: none;
  }

  .user-menu {
    width: 100%;
    justify-content: flex-end;
    padding: 0 10px;
  }

  .user-info {
    display: none;
  }

  .user-role {
    display: none;
  }

  .logout-btn {
    padding: 8px;
  }

  .logout-text {
    display: none;
  }

  .main-content {
    padding: 70px 10px 10px;
    width: 100%;
    overflow-x: hidden;
  }

  .table-responsive {
    max-width: calc(100vw - 20px);
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .admin-sidebar.mobile-open::after {
    content: '';
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: -1;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .admin-sidebar {
    width: 200px;
  }

  .admin-content {
    margin-left: 200px;
  }

  .admin-header {
    left: 200px;
  }

  .search {
    width: 200px;
  }
}
</style> 