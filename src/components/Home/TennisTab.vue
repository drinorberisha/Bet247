<template>
  <div
    class="tab-pane mt__30 text-white fade"
    id="mainTab5"
    role="tabpanel"
    tabIndex="0"
  >
    <div class="main__body__wrap left__right__space pb-60">
      <div class="live__heightlight">
        <div class="height__table">
          <div class="main__table main__table__tennis main__tabletennis">
            <LiveBasketballTab :thead="false" />
          </div>
        </div>
      </div>
    </div>

    <FooterHome />
  </div>
</template>

<script setup lang="ts">
import FooterHome from "../Footer/FooterHome.vue";
import LiveBasketballTab from "./LiveBasketballTab.vue";
</script>

<style scoped></style>
