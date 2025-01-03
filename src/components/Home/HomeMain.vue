<template>
  <section class="main__body__area">
    <div class="container-fluid p-0">
      <div class="row g-0">
        <div class="col-xxl-10 col-xl-9 col-lg-9">
          <div class="left__site__section">
            <div class="tab-content" id="myTabContentmain">
              <!--  Global Main Body  -->
              <GlobalMain />
              <!--  Global Main Body  -->
            </div>
          </div>
        </div>
        <div class="col-xxl-2 col-xl-3 col-lg-3">
          <!-- {/* Right Side Bar */} -->
          <BetSlip />
        </div>
      </div>
    </div>
    <!-- {/* footer Bottom Menu */} -->
    <FooterMobile />
    <!-- {/* footer Bottom Menu */} -->
  </section>
</template>

<script setup lang="ts">
import BetSlip from '../Common/BetSlip.vue';
import FooterMobile from '../Footer/FooterMobile.vue';
import GlobalMain from './GlobalMain.vue';
</script>

<style scoped></style>