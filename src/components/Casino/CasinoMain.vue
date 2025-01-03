<template>
  <section class="main__body__area">
    <div class="container">
      <div class="row g-0">
        <div class="casino__tab__area">
          <div class="tab-content" id="nav-tabCcasino">
            <AllGamesTab show="show active" />

            <TopGamesTab />

            <NewGamesTab />

            <PopularGamesTab />

            <SlotsGamesTab />

            <TableGamesTab />

            <JackpotsTab />

            <LiveGamesTab />
          </div>
        </div>
      </div>
    </div>

    <FooterMobile />
  </section>
</template>

<script setup lang="ts">
import FooterMobile from "../Footer/FooterMobile.vue";
import AllGamesTab from "./AllGamesTab.vue";
import JackpotsTab from "./JackpotsTab.vue";
import LiveGamesTab from "./LiveGamesTab.vue";
import NewGamesTab from "./NewGamesTab.vue";
import PopularGamesTab from "./PopularGamesTab.vue";
import SlotsGamesTab from "./SlotsGamesTab.vue";
import TableGamesTab from "./TableGamesTab.vue";
import TopGamesTab from "./TopGamesTab.vue";
</script>

<style scoped></style>
