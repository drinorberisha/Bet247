<template>
  <slot />
  <LoginModal />
  <SignUpModal />
</template>

<script setup lang="ts">
import LoginModal from "../components/Modals/LoginModal.vue";
import SignUpModal from "../components/Modals/SignUpModal.vue";

// fonts
import "../../public/vendor/glyphter-font/css/glyphter.css";
import "../../public/vendor/webfonts/css/all.min.css";
</script>

<style scoped></style>
