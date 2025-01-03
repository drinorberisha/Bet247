<template>
  <div class="popular__events__body">
    <div class="container-fluid p-0">
      <div class="row g-0">
        <div class="col-xxl-2 col-xl-3 col-lg-3">
          <PopularEvents />
        </div>
        <div class="col-xxl-10 col-xl-9 col-lg-9">
          <HomeTab />

          <LiveTab />

          <TodayTab />

          <FootballTab />

          <TennisTab />

          <BasketballTab />

          <IceHockeyTab />

          <HandballTab />

          <AmericanTab />

          <BaseballTab />

          <HorseRacingTab />

          <VirtualTab />

          <FavouritesTab />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PopularEvents from "../Common/PopularEvents.vue";
import AmericanTab from "./AmericanTab.vue";
import BaseballTab from "./BaseballTab.vue";
import BasketballTab from "./BasketballTab.vue";
import FavouritesTab from "./FavouritesTab.vue";
import FootballTab from "./FootballTab.vue";
import HandballTab from "./HandballTab.vue";
import HomeTab from "./HomeTab.vue";
import HorseRacingTab from "./HorseRacingTab.vue";
import IceHockeyTab from "./IceHockeyTab.vue";
import LiveTab from "./LiveTab.vue";
import TennisTab from "./TennisTab.vue";
import TodayTab from "./TodayTab.vue";
import VirtualTab from "./VirtualTab.vue";
</script>

<style scoped></style>
