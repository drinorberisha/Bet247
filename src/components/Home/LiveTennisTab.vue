<script setup lang="ts">
import { RouterLink } from "vue-router";
import Select from "../Select/Select.vue";

const categoris = [
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

<template>
  <div>
    <div class="section__head b__bottom">
      <div class="left__head">
        <span class="icons">
          <i class="icon-tennis"></i>
        </span>
        <span>Tennis</span>
      </div>
      <div class="right__catagoris">
        <div class="right__cate__items">
          <Select :data="categoris"></Select>
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
      <div v-if="thead" class="table__items table__pointnone__items">
        <div class="t__items">
          <div class="t__items__left"></div>
        </div>
        <div class="tennis__cart__wrap"></div>
        <div class="tennis__right">
          <div class="mart__point__items">
            <RouterLink to="#" class="twing twing__right opo">
              <i class="icon-twer"></i>
            </RouterLink>
            <RouterLink to="#" class="mart opo">
              <i class="icon-pmart"></i>
            </RouterLink>
            <RouterLink to="#0box" class="point__box bg__none"> 1 </RouterLink>
            <RouterLink to="#0box" class="point__box bg__none"> 2 </RouterLink>
          </div>
          <div class="mart__point__two">
            <div class="mart__point__left">
              <RouterLink to="#" class="point__box bg__none"> 1 </RouterLink>
              <RouterLink to="#" class="point__box bg__none"> 2 </RouterLink>
            </div>
          </div>
          <div class="mart__point__two">
            <div class="mart__point__left">
              <RouterLink to="#" class="point__box bg__none"> 1 </RouterLink>
              <RouterLink to="#" class="point__box bg__none"> 2 </RouterLink>
            </div>
            <div class="mart__point__right">
              <RouterLink to="#" class="point__box opo">
                <i class="icon-star star"></i>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <div class="table__items b__bottom">
        <div class="t__items">
          <div class="t__items__left">
            <h6>Ilya Snitari MDA</h6>
            <span class="text">Alex Marti Pujolras ESP</span>
            <p>
              <RouterLink to="#">Live</RouterLink>
              <span>3rd Set</span>
            </p>
          </div>
        </div>
        <div class="tennis__cart__wrap">
          <div class="cart__point">
            <span>0 4</span>
            <span>0 2</span>
            <span>P G</span>
          </div>
          <div class="tennis__cart__right">
            <span>2</span>
            <span>2</span>
            <span>Sets</span>
          </div>
        </div>
        <div class="tennis__right">
          <div class="mart__point__items">
            <RouterLink to="#" class="twing twing__right">
              <i class="icon-twer"></i>
            </RouterLink>
            <RouterLink to="#" class="mart">
              <i class="icon-pmart"></i>
            </RouterLink>
            <RouterLink to="#0box" class="point__box"> 2.70 </RouterLink>
            <RouterLink to="#0box" class="point__box"> 8.50 </RouterLink>
          </div>
          <div class="mart__point__two">
            <div class="mart__point__left">
              <RouterLink to="#" class="point__box"> 8.55 </RouterLink>
              <RouterLink to="#" class="point__box"> 2.70 </RouterLink>
            </div>
          </div>
          <div class="mart__point__two">
            <div class="mart__point__left">
              <RouterLink to="#" class="point__box"> 8.55 </RouterLink>
              <RouterLink to="#" class="point__box"> 2.70 </RouterLink>
            </div>
            <div class="mart__point__right">
              <RouterLink to="#" class="point__box bg__none">
                <i class="icon-star star"></i>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
      <div class="table__items b__bottom">
        <div class="t__items">
          <div class="t__items__left">
            <h6>Daniel Rincon SUI</h6>
            <span class="text">Clara Vlasselaer BEL</span>
            <p>
              <RouterLink to="#">Live</RouterLink>
              <span>1st Set</span>
            </p>
          </div>
        </div>
        <div class="tennis__cart__wrap">
          <div class="cart__point">
            <span>0 4</span>
            <span>0 2</span>
            <span>P G</span>
          </div>
          <div class="tennis__cart__right">
            <span>2</span>
            <span>2</span>
            <span>Sets</span>
          </div>
        </div>
        <div class="tennis__right">
          <div class="mart__point__items">
            <RouterLink to="#" class="twing twing__right">
              <i class="icon-twer"></i>
            </RouterLink>
            <RouterLink to="#" class="mart">
              <i class="icon-pmart"></i>
            </RouterLink>
            <RouterLink to="#0box" class="point__box"> 2.70 </RouterLink>
            <RouterLink to="#0box" class="point__box"> 8.50 </RouterLink>
          </div>
          <div class="mart__point__two">
            <div class="mart__point__left">
              <RouterLink to="#" class="point__box"> 8.55 </RouterLink>
              <RouterLink to="#" class="point__box"> 2.70 </RouterLink>
            </div>
          </div>
          <div class="mart__point__two">
            <div class="mart__point__left">
              <RouterLink to="#" class="point__box"> 8.55 </RouterLink>
              <RouterLink to="#" class="point__box"> 2.70 </RouterLink>
            </div>
            <div class="mart__point__right">
              <RouterLink to="#" class="point__box bg__none">
                <i class="icon-star star"></i>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
      <div class="table__items b__bottom">
        <div class="t__items">
          <div class="t__items__left">
            <h6>Steven Diez CAN</h6>
            <span class="text">Oriol Roca Batalla ESP</span>
            <p>
              <RouterLink to="#">Live</RouterLink>
              <span>2rd Set</span>
            </p>
          </div>
        </div>
        <div class="tennis__cart__wrap">
          <div class="cart__point">
            <span>0 4</span>
            <span>0 2</span>
            <span>P G</span>
          </div>
          <div class="tennis__cart__right">
            <span>2</span>
            <span>2</span>
            <span>Sets</span>
          </div>
        </div>
        <div class="tennis__right">
          <div class="mart__point__items">
            <RouterLink to="#" class="twing twing__right">
              <i class="icon-twer"></i>
            </RouterLink>
            <RouterLink to="#" class="mart">
              <i class="icon-pmart"></i>
            </RouterLink>
            <RouterLink to="#0box" class="point__box"> 2.70 </RouterLink>
            <RouterLink to="#0box" class="point__box"> 8.50 </RouterLink>
          </div>
          <div class="mart__point__two">
            <div class="mart__point__left">
              <RouterLink to="#" class="point__box"> 8.55 </RouterLink>
              <RouterLink to="#" class="point__box"> 2.70 </RouterLink>
            </div>
          </div>
          <div class="mart__point__two">
            <div class="mart__point__left">
              <RouterLink to="#" class="point__box"> 8.55 </RouterLink>
              <RouterLink to="#" class="point__box"> 2.70 </RouterLink>
            </div>
            <div class="mart__point__right">
              <RouterLink to="#" class="point__box bg__none">
                <i class="icon-star star"></i>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
      <div class="table__items b__bottom">
        <div class="t__items">
          <div class="t__items__left">
            <h6>Victoria Kan RUS</h6>
            <span class="text">Denisa Hindova CZE</span>
            <p>
              <RouterLink to="#">Live</RouterLink>
              <span>4rd Set</span>
            </p>
          </div>
        </div>
        <div class="tennis__cart__wrap">
          <div class="cart__point">
            <span>0 4</span>
            <span>0 2</span>
            <span>P G</span>
          </div>
          <div class="tennis__cart__right">
            <span>2</span>
            <span>2</span>
            <span>Sets</span>
          </div>
        </div>
        <div class="tennis__right">
          <div class="mart__point__items">
            <RouterLink to="#" class="twing twing__right">
              <i class="icon-twer"></i>
            </RouterLink>
            <RouterLink to="#" class="mart">
              <i class="icon-pmart"></i>
            </RouterLink>
            <RouterLink to="#0box" class="point__box"> 2.70 </RouterLink>
            <RouterLink to="#0box" class="point__box"> 8.50 </RouterLink>
          </div>
          <div class="mart__point__two">
            <div class="mart__point__left">
              <RouterLink to="#" class="point__box"> 8.55 </RouterLink>
              <RouterLink to="#" class="point__box"> 2.70 </RouterLink>
            </div>
          </div>
          <div class="mart__point__two">
            <div class="mart__point__left">
              <RouterLink to="#" class="point__box"> 8.55 </RouterLink>
              <RouterLink to="#" class="point__box"> 2.70 </RouterLink>
            </div>
            <div class="mart__point__right">
              <RouterLink to="#" class="point__box bg__none">
                <i class="icon-star star"></i>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
      <div class="table__items b__bottom">
        <div class="t__items">
          <div class="t__items__left">
            <h6>Steven Diez CAN</h6>
            <span class="text">Alex Marti Pujolras ESP</span>
            <p>
              <RouterLink to="#">Live</RouterLink>
              <span>6rd Set</span>
            </p>
          </div>
        </div>
        <div class="tennis__cart__wrap">
          <div class="cart__point">
            <span>0 4</span>
            <span>0 2</span>
            <span>P G</span>
          </div>
          <div class="tennis__cart__right">
            <span>2</span>
            <span>2</span>
            <span>Sets</span>
          </div>
        </div>
        <div class="tennis__right">
          <div class="mart__point__items">
            <RouterLink to="#" class="twing twing__right">
              <i class="icon-twer"></i>
            </RouterLink>
            <RouterLink to="#" class="mart">
              <i class="icon-pmart"></i>
            </RouterLink>
            <RouterLink to="#0box" class="point__box"> 2.70 </RouterLink>
            <RouterLink to="#0box" class="point__box"> 8.50 </RouterLink>
          </div>
          <div class="mart__point__two">
            <div class="mart__point__left">
              <RouterLink to="#" class="point__box"> 8.55 </RouterLink>
              <RouterLink to="#" class="point__box"> 2.70 </RouterLink>
            </div>
          </div>
          <div class="mart__point__two">
            <div class="mart__point__left">
              <RouterLink to="#" class="point__box"> 8.55 </RouterLink>
              <RouterLink to="#" class="point__box"> 2.70 </RouterLink>
            </div>
            <div class="mart__point__right">
              <RouterLink to="#" class="point__box bg__none">
                <i class="icon-star star"></i>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
      <div class="table__items b__bottom">
        <div class="t__items">
          <div class="t__items__left">
            <h6>Clara Vlasselaer BEL</h6>
            <span class="text">Oriol Roca Batalla ESP</span>
            <p>
              <RouterLink to="#">Live</RouterLink>
              <span>9rd Set</span>
            </p>
          </div>
        </div>
        <div class="tennis__cart__wrap">
          <div class="cart__point">
            <span>0 4</span>
            <span>0 2</span>
            <span>P G</span>
          </div>
          <div class="tennis__cart__right">
            <span>2</span>
            <span>2</span>
            <span>Sets</span>
          </div>
        </div>
        <div class="tennis__right">
          <div class="mart__point__items">
            <RouterLink to="#" class="twing twing__right">
              <i class="icon-twer"></i>
            </RouterLink>
            <RouterLink to="#" class="mart">
              <i class="icon-pmart"></i>
            </RouterLink>
            <RouterLink to="#0box" class="point__box"> 2.70 </RouterLink>
            <RouterLink to="#0box" class="point__box"> 8.50 </RouterLink>
          </div>
          <div class="mart__point__two">
            <div class="mart__point__left">
              <RouterLink to="#" class="point__box"> 8.55 </RouterLink>
              <RouterLink to="#" class="point__box"> 2.70 </RouterLink>
            </div>
          </div>
          <div class="mart__point__two">
            <div class="mart__point__left">
              <RouterLink to="#" class="point__box"> 8.55 </RouterLink>
              <RouterLink to="#" class="point__box"> 2.70 </RouterLink>
            </div>
            <div class="mart__point__right">
              <RouterLink to="#" class="point__box bg__none">
                <i class="icon-star star"></i>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
      <div class="table__footer">
        <RouterLink to="#" class="lobby">
          All <span class="text__btn">Tennis Live</span>
        </RouterLink>
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

<style scoped></style>
