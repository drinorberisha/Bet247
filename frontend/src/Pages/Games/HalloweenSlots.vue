<template>
  <MainLayout>
    <Header />
    <div class="game-page">
      <nav class="game-nav">
        <router-link to="/casino" class="back-link">
          <i class="fas fa-arrow-left"></i> Back to Casino
        </router-link>
      </nav>
      <div class="game-container">
        <h1>Halloween Slots</h1>
        <div class="game-wrapper">
          <HalloweenSlotsGame />
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from "../../Layouts/MainLayout.vue";
import Header from "../../components/Header/Header.vue";
import HalloweenSlotsGame from "../../components/Casino/Games/HalloweenSlots.vue";
</script>

<style scoped>
.game-page {
  padding: 2rem;
  min-height: calc(100vh - 60px);
  background: var(--background);
}

.game-nav {
  margin-bottom: 2rem;
}

.back-link {
  color: var(--text-secondary);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--active-color);
}

.game-container {
  max-width: 1200px;
  margin: 0 auto;
}

.game-wrapper {
  background: var(--header);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

h1 {
  color: var(--white);
  margin-bottom: 2rem;
  text-align: center;
}

@media (max-width: 768px) {
  .game-page {
    padding: 1rem;
  }
  
  .game-wrapper {
    padding: 1rem;
  }
}
</style> 