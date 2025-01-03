<template>
  <div
    class="modal register__modal"
    id="signUpPin"
    tabIndex="-1"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable"
    >
      <div class="modal-content">
        <div class="modal-header">
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="container">
            <div class="row align-items-center g-4">
              <div class="col-lg-6">
                <div class="modal__left">
                  <img :src="modal" alt="modal" />
                </div>
              </div>
              <div class="col-lg-6">
                <div class="modal__right">
                  <ul class="nav nav-tabs" id="myTab2" role="tablist">
                    <li class="nav-item" role="presentation">
                      <button
                        class="nav-link"
                        id="home-tab1"
                        data-bs-toggle="tab"
                        data-bs-target="#home2"
                        type="button"
                        role="tab"
                        aria-selected="true"
                      >
                        Sign In
                      </button>
                    </li>
                    <li class="nav-item" role="presentation">
                      <button
                        class="nav-link active"
                        id="contact-tab3"
                        data-bs-toggle="tab"
                        data-bs-target="#contact2"
                        type="button"
                        role="tab"
                        aria-selected="false"
                      >
                        Sign Up
                      </button>
                    </li>
                  </ul>
                  <div class="tab-content" id="myTabContent2">
                    <div class="tab-pane fade" id="home2" role="tabpanel">
                      <div class="form__tabs__wrap">
                        <div class="focus__icon">
                          <p>or registration via social media accounts robin</p>
                          <div class="social__head">
                            <ul class="social">
                              <li>
                                <RouterLink to="#">
                                  <i class="fa-brands fa-facebook-f"></i>
                                </RouterLink>
                              </li>
                              <li>
                                <RouterLink to="#">
                                  <i class="fab fa-twitter"></i>
                                </RouterLink>
                              </li>
                              <li>
                                <RouterLink to="#">
                                  <i class="fa-brands fa-linkedin-in"></i>
                                </RouterLink>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <form action="#0">
                          <div class="form__grp">
                            <label for="emailsign2">Email</label>
                            <input
                              type="email"
                              id="emailsign2"
                              placeholder="Email Your"
                            />
                          </div>
                          <div class="form__grp">
                            <label for="toggle-password102"> Password </label>
                            <input
                              id="toggle-password102"
                              :type="show === true ? 'text' : 'password'"
                              placeholder="Your Password"
                            />
                            <span
                             
                              class="fa fa-fw fa-eye-slash field-icon toggle-password10 cursor-pointer"
                              v-if="show"
                              @click="handleShow"
                            ></span>
                            <span
                            
                              class="fa fa-fw fa-eye field-icon toggle-password10 cursor-pointer"
                              v-else
                              @click="handleShow"
                            ></span>
                          </div>
                          <div class="login__signup">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                id="remem2"
                              />
                              <label class="form-check-label" for="remem2">
                                Remember me
                              </label>
                            </div>
                            <RouterLink to="#">Forgot Password</RouterLink>
                          </div>
                          <div class="create__btn">
                            <RouterLink to="#" class="cmn--btn">
                              <span>Sign Up</span>
                            </RouterLink>
                          </div>
                          <p>
                            Do you have an account?
                            <RouterLink to="#">Registration</RouterLink>
                          </p>
                        </form>
                      </div>
                    </div>
                    <div
                      class="tab-pane show active"
                      id="contact2"
                      role="tabpanel"
                    >
                      <div class="form__tabs__wrap">
                        <div class="focus__icon">
                          <p>or registration via social media accounts tahid</p>
                          <div class="social__head">
                            <ul class="social">
                              <li>
                                <RouterLink to="#">
                                  <i class="fa-brands fa-facebook-f"></i>
                                </RouterLink>
                              </li>
                              <li>
                                <RouterLink to="#">
                                  <i class="fab fa-twitter"></i>
                                </RouterLink>
                              </li>
                              <li>
                                <RouterLink to="#">
                                  <i class="fa-brands fa-linkedin-in"></i>
                                </RouterLink>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <form action="#0">
                          <div class="form__grp">
                            <label for="email344">Email</label>
                            <input
                              type="email"
                              id="email344"
                              placeholder="Email Your"
                            />
                          </div>
                          <div class="form__grp">
                            <label for="toggle-password1022"> Password </label>
                            <input
                              id="toggle-password1022"
                              :type="show === true ? 'text' : 'password'"
                              placeholder="Your Password"
                            />
                            <span
                              
                              class="fa fa-fw fa-eye-slash field-icon toggle-password10 cursor-pointer"
                              v-if="show"
                              @click="handleShow"
                            ></span>
                            <span
                             
                              class="fa fa-fw fa-eye field-icon toggle-password10 cursor-pointer"
                              v-else
                              @click="handleShow"
                            ></span>
                          </div>
                          <div class="form__grp">
                            <label for="toggle-password91">Confrim</label>
                            <input
                              id="toggle-password91"
                              :type="show2 === true ? 'text' : 'password'"
                              placeholder="Password"
                            />
                            <span
                              
                              class="fa fa-fw fa-eye-slash field-icon toggle-password9 cursor-pointer"
                              v-if="show2"
                              @click="handleShow2"
                            ></span>
                            <span
                            
                              class="fa fa-fw fa-eye field-icon toggle-password9 cursor-pointer"
                              v-else
                              @click="handleShow2"
                            ></span>
                          </div>
                          <div class="create__btn">
                            <RouterLink to="#" class="cmn--btn">
                              <span>Sign Up</span>
                            </RouterLink>
                          </div>
                          <p>
                            Already have an account?
                            <RouterLink to="#">Sign In</RouterLink>
                          </p>
                        </form>
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
import { ref } from "vue";
import modal from "../../assets/img/modal/modal.png";

const show = ref(false);
const show2 = ref(false);
const handleShow = () => {
  show.value = !show.value;
};
const handleShow2 = () => {
  show2.value = !show2.value;
};
</script>

<style scoped></style>
