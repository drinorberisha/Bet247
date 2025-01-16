<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import MainLayout from "./Layouts/MainLayout.vue";
import NotificationContainer from "./components/Common/NotificationContainer.vue";

onMounted(() => {
  // Clean up any lingering modal backdrops
  document.body.classList.remove('modal-open');
  const modalBackdrops = document.getElementsByClassName('modal-backdrop');
  while (modalBackdrops.length > 0) {
    modalBackdrops[0].remove();
  }
});

onUnmounted(() => {
  // Ensure cleanup when component is destroyed
  document.body.classList.remove('modal-open');
  document.body.style.overflow = 'auto';
});
</script>

<template>
  <component :is="$route.meta.layout || MainLayout">
    <RouterView />
    <NotificationContainer />
  </component>
</template>
