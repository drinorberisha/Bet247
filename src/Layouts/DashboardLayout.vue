<template>
  <slot />
  <Footer />
</template>

<script setup lang="ts">
import Footer from "../components/Footer/Footer.vue";

// fonts
import "../../public/vendor/glyphter-font/css/glyphter.css";
import "../../public/vendor/webfonts/css/all.min.css";
</script>

<style scoped></style>
