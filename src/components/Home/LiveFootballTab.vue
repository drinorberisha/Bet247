<template>
  <div>
    <div class="section__head b__bottom">
      <div class="left__head">
        <span class="icons">
          <i class="icon-football"></i>
        </span>
        <span>Football</span>
      </div>
      <div class="right__catagoris">
        <div class="right__cate__items">
          <Select :data="categoris1"></Select>
        </div>
        <div class="right__cate__items">
          <Select :data="categoris2"></Select>
        </div>
        <div class="right__cate__items">
          <Select :data="categoris3"></Select>
        </div>
      </div>
    </div>
    <div class="table__wrap">
      <div class="table__wrap">
        <div v-if="thead" class="table__items table__pointnone__items">
          <div class="t__items">
            <div class="t__items__left"></div>
          </div>
          <div class="cart__point"></div>
          <div class="mart__point__items">
            <RouterLink to="#" class="twing opo twing__right">
              <i class="icon-twer"></i>
            </RouterLink>
            <RouterLink to="#" class="mart opo">
              <i class="icon-pmart"></i>
            </RouterLink>
            <RouterLink to="#0box" class="point__box bg__none">1</RouterLink>
            <RouterLink to="#0box" class="point__box bg__none">X</RouterLink>
            <RouterLink to="#0box" class="point__box bg__none">2</RouterLink>
          </div>
          <div class="cart__point cart__point__two">Goals</div>
          <div class="mart__point__two">
            <div class="mart__point__left">
              <RouterLink to="#" class="point__box bg__none">Over</RouterLink>
              <RouterLink to="#" class="point__box bg__none">Under</RouterLink>
            </div>
            <div class="mart__point__right">
              <RouterLink to="#" class="point__box bg__none">Yes</RouterLink>
              <RouterLink to="#" class="point__box bg__none">No</RouterLink>
            </div>
          </div>
        </div>
      </div>
      <div class="table__items b__bottom">
        <div class="t__items">
          <div class="t__items__left">
            <h6>FK Septemvri Sofia</h6>
            <span class="text">PFC CteSKA Sofia</span>
            <p>
              <RouterLink to="#">Live</RouterLink>
              <span>2H 45:34</span>
            </p>
          </div>
        </div>
        <div class="cart__point">
          <span>0</span>
          <span>0</span>
        </div>
        <div class="mart__point__items">
          <RouterLink to="#" class="twing twing__right">
            <i class="icon-twer"></i>
          </RouterLink>
          <RouterLink to="#" class="mart">
            <i class="icon-pmart"></i>
          </RouterLink>
          <RouterLink to="#0box" class="point__box"> 8.55 </RouterLink>
          <RouterLink to="#0box" class="point__box"> 2.70 </RouterLink>
          <RouterLink to="#0box" class="point__box"> 8.50 </RouterLink>
        </div>
        <div class="cart__point cart__point__two">2,6</div>
        <div class="mart__point__two">
          <div class="mart__point__left">
            <RouterLink to="#" class="point__box"> 8.55 </RouterLink>
            <RouterLink to="#" class="point__box"> 2.70 </RouterLink>
          </div>
          <div class="mart__point__right">
            <RouterLink to="#" class="point__box bg__none">
              <i class="icon-lock"></i>
            </RouterLink>
            <RouterLink to="#" class="point__box bg__none">
              <i class="icon-star star"></i>
            </RouterLink>
          </div>
        </div>
      </div>
      <div class="table__items b__bottom">
        <div class="t__items">
          <div class="t__items__left">
            <h6>Lampun Warrior FC</h6>
            <span class="text">Prachuap FC</span>
            <p>
              <RouterLink to="#">Live</RouterLink>
              <span>1H 05:34</span>
            </p>
          </div>
        </div>
        <div class="cart__point">
          <span>2</span>
          <span>1</span>
        </div>
        <div class="mart__point__items">
          <RouterLink to="#" class="twing twing__right">
            <i class="icon-twer"></i>
          </RouterLink>
          <RouterLink to="#" class="mart">
            <i class="icon-pmart"></i>
          </RouterLink>
          <RouterLink to="#0box" class="point__box"> 8.55 </RouterLink>
          <RouterLink to="#0box" class="point__box"> 2.70 </RouterLink>
          <RouterLink to="#0box" class="point__box"> 8.50 </RouterLink>
        </div>
        <div class="cart__point cart__point__two">2,6</div>
        <div class="mart__point__two">
          <div class="mart__point__left">
            <RouterLink to="#" class="point__box"> 7.05 </RouterLink>
            <RouterLink to="#" class="point__box"> 5.50 </RouterLink>
          </div>
          <div class="mart__point__right">
            <RouterLink to="#" class="point__box"> 5.05 </RouterLink>
            <RouterLink to="#" class="point__box"> 5.50 </RouterLink>
          </div>
        </div>
      </div>
      <div class="table__items">
        <div class="t__items">
          <div class="t__items__left">
            <h6>England</h6>
            <span class="text">USA</span>
            <p>
              <RouterLink to="#">Live</RouterLink>
              <span>2H 45:34</span>
            </p>
          </div>
        </div>
        <div class="cart__point">
          <span>0</span>
          <span>0</span>
        </div>
        <div class="mart__point__items">
          <RouterLink to="#" class="twing twing__right">
            <i class="icon-twer"></i>
          </RouterLink>
          <RouterLink to="#" class="mart opo">
            <i class="icon-pmart"></i>
          </RouterLink>
          <RouterLink to="#0box" class="point__box"> 8.55 </RouterLink>
          <RouterLink to="#0box" class="point__box"> 2.70 </RouterLink>
          <RouterLink to="#0box" class="point__box"> 8.50 </RouterLink>
        </div>
        <div class="cart__point cart__point__two">2,6</div>
        <div class="mart__point__two">
          <div class="mart__point__left">
            <RouterLink to="#" class="point__box"> 7.05 </RouterLink>
            <RouterLink to="#" class="point__box"> 5.50 </RouterLink>
          </div>
          <div class="mart__point__right">
            <RouterLink to="#" class="point__box"> 7.05 </RouterLink>
            <RouterLink to="#" class="point__box"> 5.50 </RouterLink>
          </div>
        </div>
      </div>
      <div class="table__items b__bottom">
        <div class="t__items">
          <div class="t__items__left">
            <h6>Korea Republic</h6>
            <span class="text">PFC CSKA Sofia</span>
            <p>
              <RouterLink to="#">Live</RouterLink>
              <span>2H 45:34</span>
            </p>
          </div>
        </div>
        <div class="cart__point">
          <span>1</span>
          <span>1</span>
        </div>
        <div class="mart__point__items">
          <RouterLink to="#" class="twing twing__right">
            <i class="icon-twer"></i>
          </RouterLink>
          <RouterLink to="#" class="mart">
            <i class="icon-pmart"></i>
          </RouterLink>
          <RouterLink to="#0box" class="point__box"> 8.55 </RouterLink>
          <RouterLink to="#0box" class="point__box"> 2.70 </RouterLink>
          <RouterLink to="#0box" class="point__box"> 8.50 </RouterLink>
        </div>
        <div class="cart__point cart__point__two">2,6</div>
        <div class="mart__point__two">
          <div class="mart__point__left">
            <RouterLink to="#" class="point__box"> 7.05 </RouterLink>
            <RouterLink to="#" class="point__box"> 5.05 </RouterLink>
          </div>
          <div class="mart__point__right">
            <RouterLink to="#" class="point__box bg__none">
              <i class="icon-lock"></i>
            </RouterLink>
            <RouterLink to="#" class="point__box bg__none">
              <i class="icon-star star"></i>
            </RouterLink>
          </div>
        </div>
      </div>
      <div class="table__items b__bottom">
        <div class="t__items">
          <div class="t__items__left">
            <h6>Portugal</h6>
            <span class="text">Netherlands</span>
            <p>
              <RouterLink to="#">Live</RouterLink>
              <span>2H 45:34</span>
            </p>
          </div>
        </div>
        <div class="cart__point">
          <span>0</span>
          <span>0</span>
        </div>
        <div class="mart__point__items">
          <RouterLink to="#" class="twing twing__right">
            <i class="icon-twer"></i>
          </RouterLink>
          <RouterLink to="#" class="mart opo">
            <i class="icon-pmart"></i>
          </RouterLink>
          <RouterLink to="#0box" class="point__box"> 8.55 </RouterLink>
          <RouterLink to="#0box" class="point__box"> 2.70 </RouterLink>
          <RouterLink to="#0box" class="point__box"> 8.50 </RouterLink>
        </div>
        <div class="cart__point cart__point__two">2,6</div>
        <div class="mart__point__two">
          <div class="mart__point__left">
            <RouterLink to="#" class="point__box"> 7.05 </RouterLink>
            <RouterLink to="#" class="point__box"> 5.05 </RouterLink>
          </div>
          <div class="mart__point__right">
            <RouterLink to="#" class="point__box bg__none">
              <i class="icon-lock"></i>
            </RouterLink>
            <RouterLink to="#" class="point__box bg__none">
              <i class="icon-star star"></i>
            </RouterLink>
          </div>
        </div>
      </div>
      <div class="table__items b__bottom">
        <div class="t__items">
          <div class="t__items__left">
            <h6>Lampun Warrior FC</h6>
            <span class="text">Prachuap FC</span>
            <p>
              <RouterLink to="#">Live</RouterLink>
              <span>1H 05:34</span>
            </p>
          </div>
        </div>
        <div class="cart__point">
          <span>0</span>
          <span>0</span>
        </div>
        <div class="mart__point__items">
          <RouterLink to="#" class="twing twing__right">
            <i class="icon-twer"></i>
          </RouterLink>
          <RouterLink to="#" class="mart opo">
            <i class="icon-pmart"></i>
          </RouterLink>
          <RouterLink to="#0box" class="point__box"> 8.55 </RouterLink>
          <RouterLink to="#0box" class="point__box"> 2.70 </RouterLink>
          <RouterLink to="#0box" class="point__box"> 8.50 </RouterLink>
        </div>
        <div class="cart__point cart__point__two">2,6</div>
        <div class="mart__point__two">
          <div class="mart__point__left">
            <RouterLink to="#" class="point__box"> 7.05 </RouterLink>
            <RouterLink to="#" class="point__box"> 5.50 </RouterLink>
          </div>
          <div class="mart__point__right">
            <RouterLink to="#" class="point__box"> 7.05 </RouterLink>
            <RouterLink to="#" class="point__box"> 5.50 </RouterLink>
          </div>
        </div>
      </div>
      <div class="table__footer">
        <RouterLink to="#" class="lobby"> Open Football lobby </RouterLink>
        <RouterLink to="#" class="footerpoing">
          <span>322</span>
          <span>
            <i class="fas fa-angle-right"></i>
          </span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import Select from "../Select/Select.vue";

const categoris1 = [
  { id: 1, name: "Result 1X2" },
  { id: 2, name: "Result 1X3" },
  { id: 3, name: "Result 1X4" },
  { id: 4, name: "Result 1X5" },
];

const categoris2 = [
  { id: 1, name: "Over/Under" },
  { id: 2, name: "...." },
  { id: 3, name: "...." },
  { id: 4, name: "...." },
];

const categoris3 = [
  { id: 1, name: "Both teams to score?" },
  { id: 2, name: "...." },
  { id: 3, name: "...." },
  { id: 4, name: "...." },
];

defineProps({
  thead: {
    type: Boolean,
    default: true,
  },
});
</script>

<style scoped></style>
