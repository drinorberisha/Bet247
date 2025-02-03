<template>
  <MainLayout>
    <div class="blackjack-page">
      <nav class="game-nav">
        <router-link to="/casino" class="back-link">
          <i class="fas fa-arrow-left"></i> Back to Casino
        </router-link>
      </nav>
      <div class="game-container">
        <h1>Blackjack</h1>
        <div class="game-wrapper">
          <BlackjackGame />
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from "../../Layouts/MainLayout.vue";
import BlackjackGame from "../../components/Casino/Games/Blackjack.vue";
</script>

<style scoped>
.blackjack-page {
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

h1 {
  color: var(--white);
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
}

.game-wrapper {
  background: var(--header);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .blackjack-page {
    padding: 1rem;
  }

  .game-wrapper {
    padding: 1rem;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
}
</style> 