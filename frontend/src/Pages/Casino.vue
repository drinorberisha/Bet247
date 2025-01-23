<template>
  <div class="main-layout">
    <Header />
    <CasinoMain />
  </div>
</template>

<script setup lang="ts">
import Header from "../components/Header/Header.vue";
import CasinoMain from "../components/Casino/CasinoMain.vue";
</script>

<style scoped>
.main-layout {
  width: 100%;
  min-height: 100vh;
  background: var(--body-color);
  display: flex;
  flex-direction: column;
}
</style>
