<template>
  <MainLayout>
    <Header />
    <div class="dragon-tower-page">
      <nav class="game-nav">
        <router-link to="/casino" class="back-link">
          <i class="fas fa-arrow-left"></i> Back to Casino
        </router-link>
      </nav>
      <div class="game-container">
        <h1>Dragon Tower</h1>
        <div class="game-wrapper">
          <DragonTowerGame />
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from "../../Layouts/MainLayout.vue";
import DragonTowerGame from "../../components/Casino/Games/DragonTower.vue";
import Header from "../../components/Header/Header.vue";
</script>

<style scoped>
.dragon-tower-page {
  padding: 1rem;
  min-height: calc(100vh - 60px);
  width: 100%;
  display: flex;
  flex-direction: column;
}

.game-nav {
  margin-bottom: 1rem;
  padding: 0 0.5rem;
}

.back-link {
  color: var(--white);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: color 0.2s ease;
  font-size: 0.9rem;
}

.back-link:hover {
  color: var(--active-color);
}

.game-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  flex: 1;
  display: flex;
  flex-direction: column;
}

h1 {
  color: var(--white);
  margin-bottom: 1.5rem;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
}

.game-wrapper {
  background: var(--header);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Tablet and up */
@media (min-width: 768px) {
  .dragon-tower-page {
    padding: 2rem;
  }

  .game-nav {
    margin-bottom: 2rem;
    padding: 0;
  }

  .back-link {
    font-size: 1rem;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }

  .game-wrapper {
    padding: 2rem;
    border-radius: 20px;
  }
}

/* Mobile landscape */
@media (max-height: 600px) and (orientation: landscape) {
  .dragon-tower-page {
    padding: 0.5rem;
  }

  .game-nav {
    margin-bottom: 0.5rem;
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .game-wrapper {
    padding: 0.5rem;
  }
}

/* Small mobile devices */
@media (max-width: 360px) {
  .dragon-tower-page {
    padding: 0.5rem;
  }

  .game-nav {
    margin-bottom: 0.5rem;
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .game-wrapper {
    padding: 0.5rem;
    border-radius: 8px;
  }
}

/* Handle notch devices */
@supports (padding-top: env(safe-area-inset-top)) {
  .dragon-tower-page {
    padding-top: calc(1rem + env(safe-area-inset-top));
    padding-bottom: calc(1rem + env(safe-area-inset-bottom));
    padding-left: calc(1rem + env(safe-area-inset-left));
    padding-right: calc(1rem + env(safe-area-inset-right));
  }
}
</style>
