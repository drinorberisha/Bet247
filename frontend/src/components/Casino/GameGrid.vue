<template>
  <div class="game-grid-container">
    <!-- Featured Game Banner -->
    <div class="featured-game" v-if="currentGame === 'originals'">
      <div class="featured-content">
        <h2>Stake Originals</h2>
        <p>Experience our exclusive in-house games</p>
      </div>
    </div>

    <!-- Games Grid -->
    <div class="games-wrapper">
      <div v-for="game in filteredGames" :key="game.id" class="game-card">
        <div class="game-thumbnail">
          <img :src="game.thumbnail" :alt="game.name">
          <div class="game-overlay">
            <button class="play-button">Play Now</button>
          </div>
        </div>
        <div class="game-info">
          <h3>{{ game.name }}</h3>
          <span class="provider">{{ game.provider }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  currentGame: string;
}>();

// Sample game data - replace with actual data from your backend
const games = [
  {
    id: 1,
    name: 'Mines',
    provider: 'Stake Originals',
    thumbnail: '/images/games/mines.webp',
    category: 'originals'
  },
  {
    id: 2,
    name: 'Plinko',
    provider: 'Stake Originals',
    thumbnail: '/images/games/plinko.webp',
    category: 'originals'
  },
  // Add more games here
];

const filteredGames = computed(() => {
  return games.filter(game => game.category === props.currentGame);
});
</script>

<style scoped>
.game-grid-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.featured-game {
  height: 200px;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  align-items: center;
}

.featured-content {
  color: var(--white);
}

.featured-content h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.featured-content p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.games-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.game-card {
  background: var(--header);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.game-card:hover {
  transform: translateY(-4px);
}

.game-thumbnail {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.game-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.game-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.game-card:hover .game-overlay {
  opacity: 1;
}

.play-button {
  background: var(--active-color);
  color: var(--white);
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.play-button:hover {
  background: var(--active-hover);
}

.game-info {
  padding: 1rem;
}

.game-info h3 {
  color: var(--white);
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
}

.provider {
  color: var(--textcolor);
  font-size: 0.875rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .games-wrapper {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  .featured-game {
    height: 150px;
    padding: 1.5rem;
  }

  .featured-content h2 {
    font-size: 1.5rem;
  }

  .featured-content p {
    font-size: 1rem;
  }
}
</style> 