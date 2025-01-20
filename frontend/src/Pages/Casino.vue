<template>
  <Navbar />
  <SubHeader active="allGames" />
  <CasinoMain />
  <Footer />
</template>

<script setup lang="ts">
import CasinoMain from "../components/Casino/CasinoMain.vue";
import Footer from "../components/Footer/Footer.vue";
import SubHeader from "../components/Header/SubHeader.vue";
import Navbar from "../components/Navbar/Navbar.vue";
</script>

<style scoped></style>
