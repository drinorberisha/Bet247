<template>
  <div
    class="tab-pane mt__30 text-white fade"
    id="mainTab10"
    role="tabpanel"
    tabIndex="0"
  >
    <div class="main__body__wrap left__right__space pb-60">
      <div class="live__heightlight">
        <div class="height__table">
          <div class="main__table treanding__table main__basketballtable">
            <div class="section__head b__bottom">
              <div class="left__head">
                <span class="icons">
                  <i class="icon-golf"></i>
                </span>
                <span>Beach Volleyball</span>
              </div>
              <div class="right__catagoris">
                <div class="right__cate__items">
                  <Select :data="categoris"></Select>
                </div>
              </div>
            </div>
            <div class="heght__table__points">
              <span>Run Spread</span>
              <span>Total</span>
              <span>Money Lines</span>
            </div>
            <div class="table__wrap">
              <div class="table__items b__bottom">
                <div class="t__items">
                  <div class="t__items__left">
                    <h6 class="text__opa">
                      2023 World Baseball Classic - Futures
                    </h6>
                    <p>
                      <RouterLink to="#">20/03/2023 05:00</RouterLink>
                    </p>
                  </div>
                </div>
                <div class="tablebasket__main__wrap">
                  <div class="mart__point__items">
                    <div class="martbas__pointlast">
                      <div class="mart__point__left">
                        <RouterLink
                          to="#"
                          class="point__box aroow__text bg__none"
                        >
                          <span class="text__opa">Bet now</span>
                          <span class="icons">
                            <i class="fas fa-chevron-right"></i>
                          </span>
                        </RouterLink>
                      </div>
                    </div>
                    <div class="mart__point__right">
                      <RouterLink
                        to="#"
                        class="point__box point__boxpadding bg__none"
                      >
                        <i class="icon-star star"></i>
                      </RouterLink>
                    </div>
                  </div>
                </div>
              </div>
              <div class="table__items">
                <div class="t__items">
                  <div class="t__items__left">
                    <h6 class="text__opa">2023 MLB - Futures</h6>
                    <p>
                      <RouterLink to="#">20/03/2023 05:00</RouterLink>
                    </p>
                  </div>
                </div>
                <div class="tablebasket__main__wrap">
                  <div class="mart__point__items">
                    <div class="martbas__pointlast">
                      <div class="mart__point__left">
                        <RouterLink
                          to="#"
                          class="point__box aroow__text bg__none"
                        >
                          <span class="text__opa">Bet now</span>
                          <span class="icons">
                            <i class="fas fa-chevron-right"></i>
                          </span>
                        </RouterLink>
                      </div>
                    </div>
                    <div class="mart__point__right">
                      <RouterLink
                        to="#"
                        class="point__box point__boxpadding bg__none"
                      >
                        <i class="icon-star star"></i>
                      </RouterLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <FooterHome />
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import FooterHome from "../Footer/FooterHome.vue";
import Select from "../Select/Select.vue";

const categoris = [
  { id: 1, name: "Game Lines" },
  { id: 2, name: "Game Lines 2" },
  { id: 3, name: "Game Lines 3" },
  { id: 4, name: "Game Lines 4" },
];
</script>

<style scoped></style>
