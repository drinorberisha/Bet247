<template>
  <header class="main-header">
    <div class="header-container">
      <!-- Logo and Brand -->
      <div class="header-brand">
        <RouterLink to="/" class="brand-link">
          <span class="brand-text">SportOdds</span>
        </RouterLink>
      </div>

      <!-- Main Navigation -->
      <nav class="main-nav">
        <RouterLink 
          v-for="item in mainNavItems" 
          :key="item.path"
          :to="item.path"
          class="nav-link"
          :class="{ active: currentPath === item.path }"
        >
          <i :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <!-- User Actions -->
      <div class="header-actions">
        <div class="balance-display" v-if="isAuthenticated">
          <span class="balance-label">Balance:</span>
          <span class="balance-amount">€{{ userBalance }}</span>
        </div>

        <div class="auth-buttons" v-if="!isAuthenticated">
          <button 
            class="auth-btn login"
            @click="openLoginModal"
          >
            Login
          </button>
          <button 
            class="auth-btn signup"
            @click="openSignupModal"
          >
            Sign Up
          </button>
        </div>

        <div class="user-menu" v-else>
          <button class="user-btn" @click="toggleUserMenu">
            <i class="icon-user"></i>
            <span>{{ username }}</span>
          </button>
          <div class="user-dropdown" v-if="showUserMenu">
            <RouterLink to="/dashboard" class="dropdown-item">
              <i class="icon-dashboard"></i>
              Dashboard
            </RouterLink>
            <button class="dropdown-item" @click="handleLogout">
              <i class="icon-logout"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Login Modal -->
    <LoginModal ref="loginModalRef" />

    <!-- Signup Modal -->
    <SignUpModal ref="signupModalRef" />
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import LoginModal from '../Modals/LoginModal.vue';
import SignUpModal from '../Modals/SignUpModal.vue';
import { Modal } from 'bootstrap';

const route = useRoute();
const authStore = useAuthStore();
const showUserMenu = ref(false);

const currentPath = computed(() => route.path);
const isAuthenticated = computed(() => authStore.isAuthenticated);
const username = computed(() => authStore.user?.username || '');
const userBalance = computed(() => authStore.user?.balance || '0.00');

const mainNavItems = [
  { path: '/sportsbetting', label: 'Sports', icon: 'icon-sports' },
  { path: '/casino', label: 'Casino', icon: 'icon-casino' },
  { path: '/livecasino', label: 'Live Casino', icon: 'icon-live' },
  { path: '/promotions', label: 'Promotions', icon: 'icon-gift' },
];

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const handleLogout = () => {
  authStore.logout();
  showUserMenu.value = false;
};

// Modal handling
const openLoginModal = () => {
  const modalEl = document.getElementById('signInPin');
  if (modalEl) {
    const modal = new Modal(modalEl);
    modal.show();
  }
};

const openSignupModal = () => {
  const modalEl = document.getElementById('signUpPin');
  if (modalEl) {
    const modal = new Modal(modalEl);
    modal.show();
  }
};
</script>

<style scoped>
.main-header {
  position: sticky;
  top: 0;
  background: var(--header);
  border-bottom: 1px solid var(--leftpreborder);
  z-index: 100;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1920px;
  margin: 0 auto;
}

.header-brand .brand-link {
  text-decoration: none;
}

.brand-text {
  color: var(--white);
  font-size: 1.5rem;
  font-weight: 600;
  transition: color 0.2s ease;
}

.brand-text:hover {
  color: var(--active-color);
}

.main-nav {
  display: flex;
  gap: 1rem;
  flex: 1;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.2rem;
  color: var(--white);
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: var(--signbet);
}

.nav-link.active {
  background: var(--preactive);
  color: var(--active-color);
}

.nav-link i {
  font-size: 1.2rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.balance-display {
  background: var(--pointbox);
  padding: 0.6rem 1rem;
  border-radius: 4px;
  border: 1px solid var(--leftpreborder);
}

.balance-label {
  color: var(--textcolor);
  margin-right: 0.5rem;
}

.balance-amount {
  color: var(--active-color);
  font-weight: 600;
}

.auth-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.auth-btn {
  padding: 0.5rem 1.2rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.auth-btn.login {
  background: var(--pointbox);
  border: 1px solid var(--leftpreborder);
  color: var(--white);
}

.auth-btn.signup {
  background: var(--active-color);
  border: none;
  color: var(--white);
}

.auth-btn:hover {
  transform: translateY(-1px);
  opacity: 0.9;
}

.user-menu {
  position: relative;
}

.user-btn {
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

.user-btn:hover {
  background: var(--signbet);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: var(--header);
  border: 1px solid var(--leftpreborder);
  border-radius: 4px;
  min-width: 200px;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1rem;
  color: var(--white);
  text-decoration: none;
  border: none;
  background: none;
  width: 100%;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background: var(--signbet);
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .main-header {
    padding: 0 1rem;
  }

  .nav-link {
    padding: 0.6rem 0.8rem;
  }

  .brand-text {
    font-size: 1.3rem;
  }
}

@media (max-width: 768px) {
  .header-container {
    height: 60px;
  }

  .main-nav {
    display: none;
  }

  .balance-display {
    display: none;
  }
}

/* Safe area support */
@supports (padding: max(0px)) {
  .main-header {
    padding-left: max(2rem, env(safe-area-inset-left));
    padding-right: max(2rem, env(safe-area-inset-right));
    padding-top: max(0px, env(safe-area-inset-top));
  }
}

/* Modal styles */
.modal-content {
  background: var(--subheader);
  border: 1px solid var(--leftpreborder);
  border-radius: 8px;
  color: var(--white);
}

/* Ensure modal appears above header */
:deep(.modal) {
  z-index: 1050 !important;
}

:deep(.modal-backdrop) {
  z-index: 1040 !important;
}
</style>
