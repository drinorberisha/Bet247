<template>
  <section class="main__body__area">
    <div class="container">
      <div class="row g-0">
        <div class="promotions__wrap mt__30 pb-60">
          <h3>Promotions</h3>
          <div class="row g-4">
            <div class="col-xxl-6 col-xl-6 col-lg-6">
              <div class="promo__items">
                <div class="promo__content">
                  <h3>Cashback Bonus</h3>
                  <h2>20% up to €800</h2>
                  <RouterLink to="#" class="cmn--btn2">
                    <span>Get Bonus</span>
                  </RouterLink>
                </div>
                <div class="promo__thumb">
                  <img :src="pro2" alt="img" />
                </div>
              </div>
            </div>
            <div class="col-xxl-6 col-xl-6 col-lg-6">
              <div class="promo__items">
                <div class="promo__content">
                  <h3>Casino Welcome bonus</h3>
                  <h2>50% up to €900</h2>
                  <RouterLink to="#" class="cmn--btn2">
                    <span>Get Bonus</span>
                  </RouterLink>
                </div>
                <div class="promo__thumb">
                  <img :src="pro1" alt="img" />
                </div>
              </div>
            </div>
            <div class="col-xxl-6 col-xl-6 col-lg-6">
              <div class="promo__items">
                <div class="promo__content">
                  <h3>Weekend Reload Bonus</h3>
                  <h2>€700 + 50 Bonus Spins</h2>
                  <RouterLink to="#" class="cmn--btn2">
                    <span>Get Bonus</span>
                  </RouterLink>
                </div>
                <div class="promo__thumb">
                  <img :src="pro3" alt="img" />
                </div>
              </div>
            </div>
            <div class="col-xxl-6 col-xl-6 col-lg-6">
              <div class="promo__items">
                <div class="promo__content">
                  <h3>Casino Welcome bonus</h3>
                  <h2>25% up to €4,000</h2>
                  <RouterLink to="#" class="cmn--btn2">
                    <span>Get Bonus</span>
                  </RouterLink>
                </div>
                <div class="promo__thumb">
                  <img :src="pro4" alt="img" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <FooterMobile />
  </section>
</template>

<script setup lang="ts">
import FooterMobile from "../Footer/FooterMobile.vue";

import pro1 from "../../assets/img/games/pro1.png";
import pro2 from "../../assets/img/games/pro2.png";
import pro3 from "../../assets/img/games/pro3.png";
import pro4 from "../../assets/img/games/pro4.png";
import { RouterLink } from "vue-router";
</script>

<style scoped></style>
