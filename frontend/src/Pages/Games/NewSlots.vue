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
          <SlotGame />
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from "../../Layouts/MainLayout.vue";
import Header from "../../components/Header/Header.vue";
import SlotGame from "../../components/Casino/Games/SlotGame.vue";
import starsBackground from "../../assets/img/header/stars.avif";

// Make stars background available to template
const backgroundStyle = {
  backgroundImage: `url(${starsBackground})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};
</script>

<style scoped>
.game-page {
  padding: 2rem;
  min-height: calc(100vh - 60px);
  background: var(--background);
  position: relative;
}

.game-page::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: v-bind("backgroundStyle.backgroundImage");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.15;
  pointer-events: none;
  z-index: 0;
}

.game-container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
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
