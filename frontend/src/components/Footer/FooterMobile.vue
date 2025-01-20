<template>
  <nav class="mobile-nav">
    <RouterLink
      to="/"
      class="nav-item"
      :class="{ active: currentRoute === '/' }"
      @click="closeModal"
    >
      <i class="fas fa-table-tennis"></i>
      <span>Sports</span>
    </RouterLink>

    <RouterLink
      to="/events"
      class="nav-item"
      :class="{ active: currentRoute === '/events' }"
      @click="openEventsModal"
    >
      <i class="fa-solid fa-gift"></i>
      <span>Events</span>
    </RouterLink>

    <RouterLink
      to="/my-bets"
      class="nav-item"
      :class="{ active: currentRoute === '/my-bets' }"
    >
      <i class="fas fa-ticket-alt"></i>
      <span>My Bets</span>
    </RouterLink>

    <RouterLink
      to="/dashboard"
      class="nav-item"
      :class="{ active: currentRoute === '/dashboard' }"
      @click="closeModal"
    >
      <i class="far fa-user-circle"></i>
      <span>Account</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router";
import { onMounted, ref, computed } from "vue";
import { Modal } from "bootstrap";

const route = useRoute();
const currentRoute = computed(() => route.path);
const isMenuOpen = ref(false);

const eventsModal = ref<Modal | null>(null);
const betsModal = ref<Modal | null>(null);

onMounted(() => {
  const eventsModalElement = document.getElementById("eventsp");
  const betsModalElement = document.getElementById("betsp");

  if (eventsModalElement) {
    eventsModal.value = Modal.getOrCreateInstance(eventsModalElement);
  }

  if (betsModalElement) {
    betsModal.value = Modal.getOrCreateInstance(betsModalElement);
  }
});

const closeModal = () => {
  if (eventsModal.value) {
    eventsModal.value.hide();
  }
  if (betsModal.value) {
    betsModal.value.hide();
  }
};

const openEventsModal = () => {
  if (eventsModal.value) {
    eventsModal.value.show();
  }
};

const openBetsModal = () => {
  if (betsModal.value) {
    betsModal.value.show();
  }
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<style scoped>
.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: var(--header);
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid var(--leftpreborder);
  z-index: 1000;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--textcolor);
  text-decoration: none;
  padding: 8px;
  min-width: 64px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-item i {
  font-size: 1.2rem;
  transition: all 0.2s ease;
}

.nav-item span {
  font-size: 0.75rem;
  font-weight: 500;
}

.nav-item.active {
  color: var(--active-color);
}

.nav-item:hover {
  color: var(--active-color);
}

.menu-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.menu-button.active i {
  transform: rotate(180deg);
}

/* Safe area support for mobile devices */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .mobile-nav {
    padding-bottom: env(safe-area-inset-bottom);
    height: calc(60px + env(safe-area-inset-bottom));
  }
}

/* Hide on larger screens */
@media (min-width: 992px) {
  .mobile-nav {
    display: none;
  }
}
</style>
