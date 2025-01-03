<template>
  <div
    class="tab-pane mt__30 text-white fade"
    id="mainTab4"
    role="tabpanel"
    tabIndex="0"
  >
  
    <div class="main__body__wrap left__right__space pb-60">
      <div class="live__heightlight">
        <div class="height__table">
          <div
            class="main__table treanding__table main__table__nextfootball"
          >
            <div class="section__head b__bottom">
              <div class="left__head">
                <span class="icons">
                  <i class="icon-football"></i>
                </span>
                <span>Football</span>
              </div>
              <div class="right__catagoris">
                <div class="right__cate__items">
                
                  <Select :data="categoris" ></Select>
                </div>
                <div class="right__cate__items">
               
                  <Select :data="categoris2" ></Select>
                </div>
                <div class="right__cate__items">
              
                  <Select :data="categoris3" ></Select>
                </div>
              </div>
            </div>
            <div class="table__wrap">
              <div class="table__items b__bottom">
                <div class="t__items">
                  <div class="t__items__left">
                    <h6>Netherlands</h6>
                    <span class="text">England</span>
                    <p>
                      <RouterLink to="#">Today / 21:00</RouterLink>
                      <RouterLink to="#" class="today">
                        Today / 21:00
                      </RouterLink>
                    </p>
                  </div>
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
                    <RouterLink to="#" class="point__box">
                      7.05
                    </RouterLink>
                    <RouterLink to="#" class="point__box">
                      5.50
                    </RouterLink>
                  </div>
                  <div class="mart__point__right">
                    <RouterLink to="#" class="point__box">
                      3.05
                    </RouterLink>
                    <RouterLink to="#" class="point__box">
                      6.50
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
                    <h6>USA</h6>
                    <span class="text">Senegal</span>
                    <p>
                      <RouterLink to="#">Today / 21:00</RouterLink>
                      <RouterLink to="#" class="today">
                        Today / 21:00
                      </RouterLink>
                    </p>
                  </div>
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
                    <RouterLink to="#" class="point__box">
                      7.05
                    </RouterLink>
                    <RouterLink to="#" class="point__box">
                      5.50
                    </RouterLink>
                  </div>
                  <div class="mart__point__right">
                    <RouterLink to="#" class="point__box">
                      3.05
                    </RouterLink>
                    <RouterLink to="#" class="point__box">
                      6.50
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
                    <h6>Prance</h6>
                    <span class="text">Poland</span>
                    <p>
                      <RouterLink to="#">Today / 21:00</RouterLink>
                      <RouterLink to="#" class="today">
                        Today / 21:00
                      </RouterLink>
                    </p>
                  </div>
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
                    <RouterLink to="#" class="point__box">
                      7.05
                    </RouterLink>
                    <RouterLink to="#" class="point__box">
                      5.50
                    </RouterLink>
                  </div>
                  <div class="mart__point__right">
                    <RouterLink to="#" class="point__box">
                      3.05
                    </RouterLink>
                    <RouterLink to="#" class="point__box">
                      6.50
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
                    <h6>Argentina</h6>
                    <span class="text">Australia</span>
                    <p>
                      <RouterLink to="#">Today / 21:00</RouterLink>
                      <RouterLink to="#" class="today">
                        Today / 21:00
                      </RouterLink>
                    </p>
                  </div>
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
                    <RouterLink to="#" class="point__box">
                      7.05
                    </RouterLink>
                    <RouterLink to="#" class="point__box">
                      5.50
                    </RouterLink>
                  </div>
                  <div class="mart__point__right">
                    <RouterLink to="#" class="point__box">
                      3.05
                    </RouterLink>
                    <RouterLink to="#" class="point__box">
                      6.50
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
                    <h6>France</h6>
                    <span class="text">Senegal</span>
                    <p>
                      <RouterLink to="#">Today / 21:00</RouterLink>
                      <RouterLink to="#" class="today">
                        Today / 21:00
                      </RouterLink>
                    </p>
                  </div>
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
                    <RouterLink to="#" class="point__box">
                      7.05
                    </RouterLink>
                    <RouterLink to="#" class="point__box">
                      5.50
                    </RouterLink>
                  </div>
                  <div class="mart__point__right">
                    <RouterLink to="#" class="point__box">
                      3.05
                    </RouterLink>
                    <RouterLink to="#" class="point__box">
                      6.50
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
                    <h6>Japan</h6>
                    <span class="text">Croatia</span>
                    <p>
                      <RouterLink to="#">Today / 21:00</RouterLink>
                      <RouterLink to="#" class="today">
                        Today / 21:00
                      </RouterLink>
                    </p>
                  </div>
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
                    <RouterLink to="#" class="point__box">
                      7.05
                    </RouterLink>
                    <RouterLink to="#" class="point__box">
                      5.50
                    </RouterLink>
                  </div>
                  <div class="mart__point__right">
                    <RouterLink to="#" class="point__box">
                      3.05
                    </RouterLink>
                    <RouterLink to="#" class="point__box">
                      6.50
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
                    <h6>Brazil</h6>
                    <span class="text">Korea Republic</span>
                    <p>
                      <RouterLink to="#">Today / 21:00</RouterLink>
                      <RouterLink to="#" class="today">
                        Today / 21:00
                      </RouterLink>
                    </p>
                  </div>
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
                    <RouterLink to="#" class="point__box">
                      7.05
                    </RouterLink>
                    <RouterLink to="#" class="point__box">
                      5.50
                    </RouterLink>
                  </div>
                  <div class="mart__point__right">
                    <RouterLink to="#" class="point__box">
                      3.05
                    </RouterLink>
                    <RouterLink to="#" class="point__box">
                      6.50
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
                    <h6>Real Zaragoza</h6>
                    <span class="text">Casa Pia Lisbon</span>
                    <p>
                      <RouterLink to="#">Today / 21:00</RouterLink>
                      <RouterLink to="#" class="today">
                        Today / 21:00
                      </RouterLink>
                    </p>
                  </div>
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
                    <RouterLink to="#" class="point__box">
                      7.05
                    </RouterLink>
                    <RouterLink to="#" class="point__box">
                      5.50
                    </RouterLink>
                  </div>
                  <div class="mart__point__right">
                    <RouterLink to="#" class="point__box">
                      3.05
                    </RouterLink>
                    <RouterLink to="#" class="point__box">
                      6.50
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
                    <h6>SC Braga</h6>
                    <span class="text">Real Zaragoza</span>
                    <p>
                      <RouterLink to="#">Today / 21:00</RouterLink>
                      <RouterLink to="#" class="today">
                        Today / 21:00
                      </RouterLink>
                    </p>
                  </div>
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
                    <RouterLink to="#" class="point__box">
                      7.05
                    </RouterLink>
                    <RouterLink to="#" class="point__box">
                      5.50
                    </RouterLink>
                  </div>
                  <div class="mart__point__right">
                    <RouterLink to="#" class="point__box">
                      3.05
                    </RouterLink>
                    <RouterLink to="#" class="point__box">
                      6.50
                    </RouterLink>
                    <RouterLink to="#" class="point__box bg__none">
                      <i class="icon-star star"></i>
                    </RouterLink>
                  </div>
                </div>
              </div>
              <div class="table__items b__bottom">
                <div class="t__items">
                  <div class="t__items__left t__items__left__nextogo">
                    <div class="t__items__icon">
                      <i class="icon-football"></i>
                    </div>
                    <div class="content">
                      <span class="text">Sunderland</span>
                      <h6>Millwall</h6>
                    </div>
                  </div>
                </div>
                <div class="mart__point__two mart__pint__nextgo">
                  <div class="mart__point__left">
                    <RouterLink to="#" class="point__box">
                      <span class="point__1">1</span>
                      <span>2.25</span>
                    </RouterLink>
                    <RouterLink to="#" class="point__box">
                      <span class="point__1">x</span>
                      <span>3.00</span>
                    </RouterLink>
                    <RouterLink to="#" class="point__box">
                      <span class="point__1">2</span>
                      <span>2.53</span>
                    </RouterLink>
                  </div>
                  <div class="mart__point__right">
                    <RouterLink
                      to="#min"
                      class="point__box-text point__box__nextto"
                    >
                      <span> Today / 21:00</span>
                      <span class="icons">
                        <i class="fas fa-angle-right"></i>
                      </span>
                    </RouterLink>
                  </div>
                </div>
              </div>
              <div class="table__items b__bottom">
                <div class="t__items">
                  <div class="t__items__left t__items__left__nextogo">
                    <div class="t__items__icon">
                      <i class="icon-football"></i>
                    </div>
                    <div class="content">
                      <span class="text">World Cup 2022 - Winner</span>
                    </div>
                  </div>
                </div>
                <div class="mart__point__two mart__pint__nextgo">
                  <div class="mart__point__left">
                    <RouterLink to="#" class="point__boxbet">
                      <span>Bet now</span>
                    </RouterLink>
                  </div>
                  <div class="mart__point__right">
                    <RouterLink
                      to="#min"
                      class="point__box-text point__box__nextto"
                    >
                      <span> Today / 21:00</span>
                      <span class="icons">
                        <i class="fas fa-angle-right"></i>
                      </span>
                    </RouterLink>
                  </div>
                </div>
              </div>
              <div class="table__items b__bottom">
                <div class="t__items">
                  <div class="t__items__left t__items__left__nextogo">
                    <div class="t__items__icon">
                      <i class="icon-football"></i>
                    </div>
                    <div class="content">
                      <span class="text">
                        World Cup 2022 - Top Goalscorer
                      </span>
                    </div>
                  </div>
                </div>
                <div class="mart__point__two mart__pint__nextgo">
                  <div class="mart__point__left">
                    <RouterLink to="#" class="point__boxbet">
                      <span>Bet now</span>
                    </RouterLink>
                  </div>
                  <div class="mart__point__right">
                    <RouterLink
                      to="#min"
                      class="point__box-text point__box__nextto"
                    >
                      <span> Today / 21:00</span>
                      <span class="icons">
                        <i class="fas fa-angle-right"></i>
                      </span>
                    </RouterLink>
                  </div>
                </div>
              </div>
              <div class="table__items b__bottom">
                <div class="t__items">
                  <div class="t__items__left t__items__left__nextogo">
                    <div class="t__items__icon">
                      <i class="icon-football"></i>
                    </div>
                    <div class="content">
                      <span class="text">Netherlands</span>
                      <h6>Millwall</h6>
                    </div>
                  </div>
                </div>
                <div class="mart__point__two mart__pint__nextgo">
                  <div class="mart__point__left">
                    <RouterLink to="#" class="point__box">
                      <span class="point__1">1</span>
                      <span>6.22</span>
                    </RouterLink>
                    <RouterLink to="#" class="point__box">
                      <span class="point__1">X</span>
                      <span>4.53</span>
                    </RouterLink>
                    <RouterLink to="#" class="point__box">
                      <span class="point__1">2</span>
                      <span>3.53</span>
                    </RouterLink>
                  </div>
                  <div class="mart__point__right">
                    <RouterLink
                      to="#min"
                      class="point__box-text point__box__nextto"
                    >
                      <span> Today / 21:00</span>
                      <span class="icons">
                        <i class="fas fa-angle-right"></i>
                      </span>
                    </RouterLink>
                  </div>
                </div>
              </div>
              <div class="table__items b__bottom">
                <div class="t__items">
                  <div class="t__items__left t__items__left__nextogo">
                    <div class="t__items__icon">
                      <i class="icon-football"></i>
                    </div>
                    <div class="content">
                      <span class="text">Canada</span>
                      <h6>Belgium</h6>
                    </div>
                  </div>
                </div>
                <div class="mart__point__two mart__pint__nextgo">
                  <div class="mart__point__left">
                    <RouterLink to="#" class="point__box">
                      <span class="point__1">1</span>
                      <span>5.22</span>
                    </RouterLink>
                    <RouterLink to="#" class="point__box">
                      <span class="point__1">X</span>
                      <span>4.53</span>
                    </RouterLink>
                    <RouterLink to="#" class="point__box">
                      <span class="point__1">2</span>
                      <span>3.53</span>
                    </RouterLink>
                  </div>
                  <div class="mart__point__right">
                    <RouterLink
                      to="#min"
                      class="point__box-text point__box__nextto"
                    >
                      <span> Today / 21:00</span>
                      <span class="icons">
                        <i class="fas fa-angle-right"></i>
                      </span>
                    </RouterLink>
                  </div>
                </div>
              </div>
              <div class="table__items b__bottom">
                <div class="t__items">
                  <div class="t__items__left t__items__left__nextogo">
                    <div class="t__items__icon">
                      <i class="icon-football"></i>
                    </div>
                    <div class="content">
                      <h6>Luca Van Assche <span>FRA</span></h6>
                      <h6>Aleksandar Vukic <span>AUS</span></h6>
                    </div>
                  </div>
                </div>
                <div class="mart__point__two mart__pint__nextgo">
                  <div class="mart__point__left">
                    <RouterLink to="#" class="point__box">
                      <span class="point__1">1</span>
                      <span>3.20</span>
                    </RouterLink>
                    <RouterLink to="#" class="point__box">
                      <span class="point__1">2</span>
                      <span>2.40</span>
                    </RouterLink>
                  </div>
                  <div class="mart__point__right">
                    <RouterLink
                      to="#min"
                      class="point__box-text point__box__nextto"
                    >
                      <span class="text-base"> Starting now</span>
                      <span class="icons">
                        <i class="fas fa-angle-right text-base"></i>
                      </span>
                    </RouterLink>
                  </div>
                </div>
              </div>
              <div class="table__footer">
                <RouterLink to="#" class="lobby text__opa">
                  Open Football lobby
                </RouterLink>
                <RouterLink to="#" class="footerpoing">
                  <span>790</span>
                  <span>
                    <i class="fas fa-angle-right"></i>
                  </span>
                </RouterLink>
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
</script>

<style scoped></style>
