<script setup lang="ts">
import LeftBetsModal from "./components/Modals/LeftBetsModal.vue";
import RightBetsModal from "./components/Modals/RightBetsModal.vue";
import MainLayout from "./Layouts/MainLayout.vue";
</script>

<template>
  <component :is="$route.meta.layout || MainLayout">
    <RouterView />
    <LeftBetsModal />
    <RightBetsModal />
  </component>
</template>
