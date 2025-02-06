<template>
  <MainLayout>
    <Header />
    <div class="blackjack-page">
      <nav class="game-nav">
        <div class="left-nav">
          <router-link to="/casino" class="back-link">
            <i class="fas fa-arrow-left"></i> Back to Casino
          </router-link>
        </div>
        <div class="right-nav">
          <button class="info-button" @click="showInfo = true">
            <i class="fas fa-question-circle"></i> Info
          </button>
        </div>
      </nav>
      <div class="game-container">
        <h1>Blackjack</h1>
        <div class="game-wrapper">
          <BlackjackGame />
        </div>
      </div>
    </div>

    <!-- Info Modal -->
    <Transition name="fade">
      <div v-if="showInfo" class="info-modal" @click="showInfo = false">
        <div class="info-content" @click.stop>
          <button class="close-button" @click="showInfo = false">
            <i class="fas fa-times"></i>
          </button>
          <h2 class="header">Si të luani Blackjack</h2>
          <div class="info-sections">
            <div class="info-section">
              <h3>Objektivi i Lojës</h3>
              <p>
                Qëllimi është të fitoni ndaj dilerit duke pasur një dorë me
                vlerë më të afërt me 21, por pa e kaluar atë. Letrat me figura
                vlejnë 10, ndërsa "A" vlen 1 ose 11.
              </p>
            </div>
            <div class="info-section">
              <h3>Rregullat e Lojës</h3>
              <ul>
                <li>Vendosni shumën e bastit para fillimit të dorës</li>
                <li>Ju dhe dileri merrni nga dy letra fillimisht</li>
                <li>
                  Mund të kërkoni letra shtesë ('Hit') ose të qëndroni ('Stand')
                </li>
                <li>Nëse kaloni 21, humbni automatikisht ('Bust')</li>
                <li>Dileri duhet të tërheqë në 16 dhe të qëndrojë në 17</li>
                <li>Blackjack natyral ("A" + 10/Figurë) fiton 3:2</li>
              </ul>
            </div>
            <div class="info-section">
              <h3>Veprimet e Mundshme</h3>
              <ul>
                <li>Hit: Kërkoni një letër shtesë</li>
                <li>Stand: Qëndroni me letrat që keni</li>
                <li>
                  Double Down: Dyfishoni bastin dhe merrni vetëm një letër
                </li>
                <li>Split: Ndani çiftet në dy duar të ndryshme</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MainLayout from "../../Layouts/MainLayout.vue";
import BlackjackGame from "../../components/Casino/Games/Blackjack.vue";
import Header from "../../components/Header/Header.vue";

const showInfo = ref(false);
</script>

<style scoped>
.blackjack-page {
  padding: 2rem;
  min-height: calc(100vh - 60px);
  background: var(--background);
}

.game-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  width: 100%;
}

.left-nav,
.right-nav {
  display: flex;
  align-items: center;
}

.back-link {
  color: #fff;
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

.info-button {
  background: var(--subheader);
  border: 1px solid #4caf50;
  border-radius: 8px;
  color: #4caf50;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.info-button:hover {
  background: #4caf50;
  color: var(--header);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
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

.info-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
}

.info-content {
  background: var(--header);
  border-radius: 16px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--white);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s ease;
}

.info-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-section {
  color: var(--white);
}

.header {
  color: white;
}

.info-section h3 {
  color: var(--active-color);
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.info-section p,
.info-section ul {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
}

.info-section ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 0.5rem 0 0 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
