<template>
  <div class="modal mybets__modal" id="betsp" tabIndex="-1" aria-hidden="true">
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
        <div class="right__site__section">
          <div class="betslip__wrap">
            <h5 class="betslip__title">Betslip</h5>
            <div class="nav" id="nav-tabr" role="tablist">
              <button
                class="nav-link"
                id="nav-home-tabr"
                data-bs-toggle="tab"
                data-bs-target="#nav-homer"
                type="button"
                role="tab"
                aria-selected="true"
              >
                Single
              </button>
              <button
                class="nav-link active"
                id="nav-profile-tabr"
                data-bs-toggle="tab"
                data-bs-target="#nav-profiler"
                type="button"
                role="tab"
                aria-selected="false"
              >
                Multiple
              </button>
              <button
                class="nav-link"
                id="nav-contact-tabr"
                data-bs-toggle="tab"
                data-bs-target="#nav-contactr"
                type="button"
                role="tab"
                aria-selected="false"
              >
                System
              </button>
            </div>
            <div class="tab-content" id="nav-tabContentr">
              <div
                class="tab-pane fade text-white"
                id="nav-homer"
                role="tabpanel"
                aria-labelledby="nav-home-tabr"
                tabIndex="0"
              >
                <div class="multiple__components">
                  <div class="multiple__items">
                    <div class="multiple__head">
                      <div class="multiple__left">
                        <span class="icons">
                          <i class="icon-football"></i>
                        </span>
                        <span>Real Kashmir vs Trau FC</span>
                      </div>
                      <RouterLink to="#" class="cros">
                        <i class="icon-cross"></i>
                      </RouterLink>
                    </div>
                    <div class="multiple__point">
                      <span class="pbox">50.2</span>
                      <span class="rightname">
                        <span class="fc">Trau FC</span>
                        <span class="point">1x2</span>
                      </span>
                    </div>
                  </div>
                  <div class="total__odds">
                    <div class="total__head">
                      <h6 class="odd">Total Odds</h6>
                      <span>25</span>
                    </div>
                    <div class="wrapper">
                      <div class="result">
                        <span>Stake amount, $</span>
                        <span class="result">0.00 $</span>
                      </div>
                      <div class="buttons">
                        <button type="button">5</button>
                        <button type="button">10</button>
                        <button type="button">50</button>
                      </div>
                    </div>
                  </div>
                  <div class="possible__pay">
                    <span>Possible Payout</span>
                    <span>0.00$</span>
                  </div>
                  <RouterLink to="#" class="cmn--btn2">
                    <span>Sign In & Bet</span>
                  </RouterLink>
                </div>
                <div class="setting__area">
                  <div class="tab-content" id="nav-tabContentsettingr">
                    <div
                      class="tab-pane fade text-white"
                      id="nav-homesettr"
                      role="tabpanel"
                      aria-labelledby="nav-home-tabsettingr"
                      tabIndex="0"
                    >
                      <div class="sign__bets__wrap">
                        <h5 class="betslip__title">Betslip</h5>
                        <div class="sign__boxes">
                          <div class="content">
                            <h6>Erase Betslip</h6>
                            <p>Are you sure you want to erase Betslip?</p>
                            <div class="btn__grp">
                              <RouterLink to="#" class="cmn--btn">
                                <span>No</span>
                              </RouterLink>
                              <RouterLink to="#" class="cmn--btn2">
                                <span>Accept</span>
                              </RouterLink>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="tab-pane fade text-white"
                      id="nav-homeett2r"
                      role="tabpanel"
                      aria-labelledby="nav-home-tabsetting2r"
                      tabIndex="0"
                    >
                      <div class="sign__bets__wrap">
                        <h5 class="betslip__title">Betslip</h5>
                        <div class="setting__boxes">
                          <div class="setting__boxes__head">
                            <span>Accept Changes automatically?</span>
                            <RouterLink to="#">
                              <i class="icon-cross"></i>
                            </RouterLink>
                          </div>
                          <div class="check__wrap">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                id="check11"
                              />
                              <label class="form-check-label" for="check11">
                                Accept any odds changes
                              </label>
                            </div>
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                id="check2oa"
                              />
                              <label class="form-check-label" for="check2oa">
                                Only accept increased odds
                              </label>
                            </div>
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                id="check3a"
                              />
                              <label class="form-check-label" for="check3a">
                                Always ask
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="nav" id="nav-tabsetingr" role="tablist">
                    <button
                      class="nav-link"
                      id="nav-home-tabsettingr"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-homesettr"
                      type="button"
                      role="tab"
                      aria-selected="true"
                    >
                      <span class="icons">
                        <i class="icon-trush"></i>
                      </span>
                      <span class="text">Sign IN & Bet</span>
                    </button>
                    <button
                      class="nav-link"
                      id="nav-home-tabsetting2r"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-homeett2r"
                      type="button"
                      role="tab"
                      aria-selected="false"
                    >
                      <span class="icons">
                        <i class="icon-setting"></i>
                      </span>
                      <span class="text">Settings</span>
                    </button>
                  </div>
                </div>
              </div>
              <div
                class="tab-pane fade text-white show active"
                id="nav-profiler"
                role="tabpanel"
                aria-labelledby="nav-profile-tabr"
                tabIndex="0"
              >
                <div class="multiple__components">
                  <div class="multiple__items">
                    <div class="multiple__head">
                      <div class="multiple__left">
                        <span class="icons">
                          <i class="icon-football"></i>
                        </span>
                        <span>Real Kashmir vs Trau FC</span>
                      </div>
                      <RouterLink to="#" class="cros">
                        <i class="icon-cross"></i>
                      </RouterLink>
                    </div>
                    <div class="multiple__point">
                      <span class="pbox">50.2</span>
                      <span class="rightname">
                        <span class="fc">Trau FC</span>
                        <span class="point">1x2</span>
                      </span>
                    </div>
                  </div>
                  <div class="multiple__items">
                    <div class="multiple__head">
                      <div class="multiple__left">
                        <span class="icons">
                          <i class="icon-football"></i>
                        </span>
                        <span>Stodder, Timo vs Kopriva, Vit</span>
                      </div>
                      <RouterLink to="#" class="cros">
                        <i class="icon-cross"></i>
                      </RouterLink>
                    </div>
                    <div class="multiple__point">
                      <span class="pbox">3.66</span>
                      <span class="rightname">
                        <span class="fc">Stodder, Timo</span>
                        <span class="point">Winner</span>
                      </span>
                    </div>
                  </div>
                  <div class="total__odds">
                    <div class="total__head">
                      <h6 class="odd">Total Odds</h6>
                      <span>25</span>
                    </div>
                    <div class="wrapper">
                      <div class="result">
                        <span>Stake amount, $</span>
                        <span class="result">0.00 $</span>
                      </div>
                      <div class="buttons">
                        <button type="button">5</button>
                        <button type="button">10</button>
                        <button type="button">50</button>
                      </div>
                    </div>
                  </div>
                  <RouterLink to="#" class="cmn--btn2">
                    <span>Sign In & Bet</span>
                  </RouterLink>
                </div>
              </div>
              <div
                class="tab-pane fade text-white"
                id="nav-contactr"
                role="tabpanel"
                aria-labelledby="nav-contact-tabr"
                tabIndex="0"
              >
                <div class="multiple__components">
                  <div class="multiple__items">
                    <div class="multiple__head">
                      <div class="multiple__left">
                        <span class="icons">
                          <i class="icon-football"></i>
                        </span>
                        <span>Real Kashmir vs Trau FC</span>
                      </div>
                      <RouterLink to="#" class="cros">
                        <i class="icon-cross"></i>
                      </RouterLink>
                    </div>
                    <div class="multiple__point">
                      <span class="pbox">50.2</span>
                      <span class="rightname">
                        <span class="fc">Trau FC</span>
                        <span class="point">1x2</span>
                      </span>
                    </div>
                  </div>
                  <div class="multiple__items">
                    <div class="multiple__head">
                      <div class="multiple__left">
                        <span class="icons">
                          <i class="icon-football"></i>
                        </span>
                        <span>Stodder, Timo vs Kopriva, Vit</span>
                      </div>
                      <RouterLink to="#" class="cros">
                        <i class="icon-cross"></i>
                      </RouterLink>
                    </div>
                    <div class="multiple__point">
                      <span class="pbox">3.66</span>
                      <span class="rightname">
                        <span class="fc">Stodder, Timo</span>
                        <span class="point">Winner</span>
                      </span>
                    </div>
                  </div>
                  <div class="total__odds">
                    <div class="total__head">
                      <h6 class="odd">Total Odds</h6>
                      <span>25</span>
                    </div>
                    <div class="wrapper">
                      <div class="result">
                        <span>Stake amount, $</span>
                        <span class="result">0.00 $</span>
                      </div>
                      <div class="buttons">
                        <button type="button">5</button>
                        <button type="button">10</button>
                        <button type="button">50</button>
                      </div>
                    </div>
                  </div>
                  <RouterLink to="#" class="cmn--btn2">
                    <span>Sign In & Bet</span>
                  </RouterLink>
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
</script>

<style scoped></style>
