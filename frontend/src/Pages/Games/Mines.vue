<template>
  <MainLayout>
    <Header />
    <div class="mines-page">
      <nav class="game-nav">
        <router-link to="/casino" class="back-link">
          <i class="fas fa-arrow-left"></i> Back to Casino
        </router-link>
      </nav>
      <div class="game-container">
        <h1>Mines</h1>
        <div class="game-wrapper">
          <MinesGame />
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from "../../Layouts/MainLayout.vue";
import MinesGame from "../../components/Casino/Games/Mines.vue";
import Header from "../../components/Header/Header.vue";
</script>

<style scoped>
.mines-page {
  padding: 2rem;
  min-height: calc(100vh - 60px);
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
  .mines-page {
    padding: 1rem;
  }

  .game-wrapper {
    padding: 1rem;
    border-radius: 16px;
  }

  h1 {
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
  }

  .game-nav {
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 480px) {
  .mines-page {
    padding: 0.75rem;
  }

  .game-wrapper {
    padding: 0.75rem;
    border-radius: 12px;
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .game-nav {
    margin-bottom: 1rem;
  }

  .back-link {
    font-size: 0.9rem;
  }
}

@media (max-width: 360px) {
  .mines-page {
    padding: 0.5rem;
  }

  .game-wrapper {
    padding: 0.5rem;
  }

  h1 {
    font-size: 1.25rem;
  }
}
</style>
