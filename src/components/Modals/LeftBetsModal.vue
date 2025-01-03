<template>
  <div class="modal event__modal " id="eventsp" tabIndex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header mt-2">
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="left__site__section">
          <div class="tab-content" id="myTabContentmainevent">
            <div
              class="tab-pane text-white fade show active"
              id="mainTabevent"
              role="tabpanel"
              tabIndex="0"
            >
              <div class="popular__events__body">
                <div class="container-fluid p-0">
                  <div class="row g-0">
                    <div class="col-xxl-2 col-xl-3 col-lg-3">
                      <div class="popular__events__left">
                        <div class="popular__events__head">
                          <h5>Popular events</h5>
                          <ul>
                            <li>
                              <span>
                                <img :src="cup" alt="img" />
                              </span>
                              <span>Eorld Cup 2022</span>
                            </li>
                            <li>
                              <span>
                                <img :src="europ" alt="img" />
                              </span>
                              <span>Euroleague. Season 22/23</span>
                            </li>
                          </ul>
                        </div>
                        <div class="star__wrap">
                          <span>
                            <img :src="start" alt="img" />
                          </span>
                          <span>Favorites</span>
                        </div>
                        <div class="prematch__wrap">
                          <div class="nav" id="nav-tabpreevent" role="tablist">
                            <button
                              class="nav-link active"
                              id="nav-home-tabpreevent"
                              data-bs-toggle="tab"
                              data-bs-target="#nav-homepreevent"
                              type="button"
                              role="tab"
                              aria-selected="true"
                            >
                              Live
                            </button>
                            <button
                              class="nav-link"
                              id="nav-profile-tabpreevent"
                              data-bs-toggle="tab"
                              data-bs-target="#nav-profilepreevent"
                              type="button"
                              role="tab"
                              aria-selected="false"
                            >
                              Prematch
                            </button>
                          </div>
                          <div class="tab-content" id="nav-tabContentpreevent">
                            <div
                              class="tab-pane fade text-white show active"
                              id="nav-homepreevent"
                              role="tabpanel"
                              aria-labelledby="nav-home-tabpreevent"
                              tabIndex="0"
                            >
                              <div class="prematch__scopre">
                                <RouterLink to="#" class="prescore__items">
                                  <div class="prescore__left">
                                    <span>
                                      <i class="icon-football"></i>
                                    </span>
                                    <span class="score">Soccer</span>
                                  </div>
                                  <div class="prescore__right">
                                    <span>2</span>
                                    <span>
                                      <i class="fa-solid fa-angle-down"></i>
                                    </span>
                                  </div>
                                </RouterLink>
                                <RouterLink to="#" class="prescore__items">
                                  <div class="prescore__left">
                                    <span>
                                      <i class="icon-tennis"></i>
                                    </span>
                                    <span class="score">Tennis</span>
                                  </div>
                                  <div class="prescore__right">
                                    <span>4</span>
                                    <span>
                                      <i class="fa-solid fa-angle-down"></i>
                                    </span>
                                  </div>
                                </RouterLink>
                                <RouterLink to="#" class="prescore__items">
                                  <div class="prescore__left">
                                    <span>
                                      <i class="icon-basketball"></i>
                                    </span>
                                    <span class="score">Basketball</span>
                                  </div>
                                  <div class="prescore__right">
                                    <span>4</span>
                                    <span>
                                      <i class="fa-solid fa-angle-down"></i>
                                    </span>
                                  </div>
                                </RouterLink>
                                <RouterLink to="#" class="prescore__items">
                                  <div class="prescore__left">
                                    <span>
                                      <i class="icon-ttennis"></i>
                                    </span>
                                    <span class="score"> Table Tennis </span>
                                  </div>
                                  <div class="prescore__right">
                                    <span>8</span>
                                    <span>
                                      <i class="fa-solid fa-angle-down"></i>
                                    </span>
                                  </div>
                                </RouterLink>
                                <RouterLink to="#" class="prescore__items">
                                  <div class="prescore__left">
                                    <span>
                                      <i class="icon-volly"></i>
                                    </span>
                                    <span class="score">Volleyball</span>
                                  </div>
                                  <div class="prescore__right">
                                    <span>2</span>
                                    <span>
                                      <i class="fa-solid fa-angle-down"></i>
                                    </span>
                                  </div>
                                </RouterLink>
                                <RouterLink to="#" class="prescore__items">
                                  <div class="prescore__left">
                                    <span>
                                      <i class="icon-handball"></i>
                                    </span>
                                    <span class="score">Handball</span>
                                  </div>
                                  <div class="prescore__right">
                                    <span>1</span>
                                    <span>
                                      <i class="fa-solid fa-angle-down"></i>
                                    </span>
                                  </div>
                                </RouterLink>
                              </div>
                            </div>
                            <div
                              class="tab-pane fade text-white"
                              id="nav-profilepreevent"
                              role="tabpanel"
                              aria-labelledby="nav-profile-tabpreevent"
                              tabIndex="0"
                            >
                              <div class="multiple__components">
                                <div class="prematch__scopre">
                                  <RouterLink to="#" class="prescore__items">
                                    <div class="prescore__left">
                                      <span>
                                        <i class="icon-football"></i>
                                      </span>
                                      <span class="score">Soccer</span>
                                    </div>
                                    <div class="prescore__right">
                                      <span>2</span>
                                      <span>
                                        <i class="fa-solid fa-angle-down"></i>
                                      </span>
                                    </div>
                                  </RouterLink>
                                  <RouterLink to="#" class="prescore__items">
                                    <div class="prescore__left">
                                      <span>
                                        <i class="icon-tennis"></i>
                                      </span>
                                      <span class="score">Tennis</span>
                                    </div>
                                    <div class="prescore__right">
                                      <span>4</span>
                                      <span>
                                        <i class="fa-solid fa-angle-down"></i>
                                      </span>
                                    </div>
                                  </RouterLink>
                                  <RouterLink to="#" class="prescore__items">
                                    <div class="prescore__left">
                                      <span>
                                        <i class="icon-basketball"></i>
                                      </span>
                                      <span class="score"> Basketball </span>
                                    </div>
                                    <div class="prescore__right">
                                      <span>4</span>
                                      <span>
                                        <i class="fa-solid fa-angle-down"></i>
                                      </span>
                                    </div>
                                  </RouterLink>
                                  <RouterLink to="#" class="prescore__items">
                                    <div class="prescore__left">
                                      <span>
                                        <i class="icon-ttennis"></i>
                                      </span>
                                      <span class="score"> Table Tennis </span>
                                    </div>
                                    <div class="prescore__right">
                                      <span>8</span>
                                      <span>
                                        <i class="fa-solid fa-angle-down"></i>
                                      </span>
                                    </div>
                                  </RouterLink>
                                  <RouterLink to="#" class="prescore__items">
                                    <div class="prescore__left">
                                      <span>
                                        <i class="icon-volly"></i>
                                      </span>
                                      <span class="score"> Volleyball </span>
                                    </div>
                                    <div class="prescore__right">
                                      <span>2</span>
                                      <span>
                                        <i class="fa-solid fa-angle-down"></i>
                                      </span>
                                    </div>
                                  </RouterLink>
                                  <RouterLink to="#" class="prescore__items">
                                    <div class="prescore__left">
                                      <span>
                                        <i class="icon-handball"></i>
                                      </span>
                                      <span class="score">Handball</span>
                                    </div>
                                    <div class="prescore__right">
                                      <span>1</span>
                                      <span>
                                        <i class="fa-solid fa-angle-down"></i>
                                      </span>
                                    </div>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import cup from "../../assets/img/leftmenu/cup.png";
import europ from "../../assets/img/leftmenu/europ.png";
import start from "../../assets/img/leftmenu/start.png";
</script>

<style scoped></style>
