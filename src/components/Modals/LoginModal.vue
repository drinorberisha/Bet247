<template>
  <div
    class="modal register__modal"
    id="signInPin"
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
                        data-bs-target="#home22"
                        type="button"
                        role="tab"
                        aria-selected="true"
                      >
                        Sign Up
                      </button>
                    </li>
                    <li class="nav-item" role="presentation">
                      <button
                        class="nav-link active"
                        id="contact-tab3"
                        data-bs-toggle="tab"
                        data-bs-target="#contact22"
                        type="button"
                        role="tab"
                        aria-selected="false"
                      >
                        Sign In
                      </button>
                    </li>
                  </ul>
                  <div class="tab-content" id="myTabContent2">
                    <div class="tab-pane fade" id="home22" role="tabpanel">
                      <div class="form__tabs__wrap">
                        <div class="focus__icon">
                          <p>or registration via social media accounts</p>
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
                            <label for="emailsign">Email</label>
                            <input
                              type="email"
                              id="emailsign"
                              placeholder="Email Your"
                            />
                          </div>
                          <div class="form__grp">
                            <label for="toggle-password3">Password</label>
                            <input
                              id="toggle-password3"
                              :type="show === true ? 'text' : 'password'"
                              placeholder="Your Password"
                            />
                            <span
                              id="#toggle-password3"
                              class="fa fa-fw fa-eye-slash field-icon toggle-password3 cursor-pointer"
                              v-if="show"
                              @click="handleShow"
                            ></span>
                            <span
                              id="#toggle-password9"
                              class="fa fa-fw fa-eye field-icon toggle-password9 cursor-pointer"
                              v-else
                              @click="handleShow"
                            ></span>
                          </div>

                          <div class="form__grp">
                            <label for="toggle-password9">Confrim</label>
                            <input
                              id="toggle-password9"
                              :type="show2 === true ? 'text' : 'password'"
                              placeholder="Password"
                            />
                            <span
                              id="#toggle-password9"
                              class="fa fa-fw fa-eye-slash field-icon toggle-password9 cursor-pointer"
                              v-if="show2"
                              @click="handleShow2"
                            ></span>
                            <span
                              id="#toggle-password9"
                              class="fa fa-fw fa-eye field-icon toggle-password9 cursor-pointer"
                              v-else
                              @click="handleShow2"
                            ></span>
                          </div>

                          <div class="create__btn">
                            <button to="#" class="cmn--btn text-white">
                              <span>Sign Up</span>
                            </button>
                          </div>
                          <p>
                            Already have an account?
                            <RouterLink to="#">Sign In</RouterLink>
                          </p>
                        </form>
                      </div>
                    </div>
                    <div
                      class="tab-pane fade show active"
                      id="contact22"
                      role="tabpanel"
                    >
                      <div class="form__tabs__wrap">
                        <form @submit.prevent="handleLogin">
                          <div class="form__grp">
                            <label for="email34">Email</label>
                            <input
                              type="email"
                              id="email34"
                              v-model="loginForm.email"
                              placeholder="Enter your email"
                              required
                            />
                          </div>
                          <div class="form__grp">
                            <label for="toggle-password10">Password</label>
                            <input
                              id="toggle-password10"
                              :type="show ? 'text' : 'password'"
                              v-model="loginForm.password"
                              placeholder="Enter your password"
                              required
                            />
                            <span
                              class="fa fa-fw field-icon cursor-pointer"
                              :class="show ? 'fa-eye-slash' : 'fa-eye'"
                              @click="handleShow"
                            ></span>
                          </div>
                          <div class="login__signup">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                id="remem"
                                v-model="loginForm.remember"
                              />
                              <label class="form-check-label" for="remem">
                                Remember me
                              </label>
                            </div>
                            <a href="#" @click.prevent="handleForgotPassword">Forgot Password</a>
                          </div>
                          <div v-if="error" class="alert alert-danger">
                            {{ error }}
                          </div>
                          <div class="create__btn">
                            <button type="submit" class="cmn--btn text-white" :disabled="loading">
                              <span v-if="!loading">Sign In</span>
                              <span v-else>Loading...</span>
                            </button>
                          </div>
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
import { useAuthStore } from "../../stores/auth";
import modal from "../../assets/img/modal/modal.png";
import { useRouter } from 'vue-router';
import { Modal } from 'bootstrap';
import { useNotificationStore } from '../../stores/notification';

const router = useRouter();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const show = ref(false);
const loading = ref(false);
const error = ref('');

const loginForm = ref({
  email: '',
  password: '',
  remember: false
});

const handleShow = () => {
  show.value = !show.value;
};

const handleLogin = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    await authStore.login({
      email: loginForm.value.email,
      password: loginForm.value.password,
      remember: loginForm.value.remember
    });

    // Show success notification
    notificationStore.show({
      type: 'success',
      title: 'Login Successful',
      message: 'Welcome back! You have been successfully logged in.',
      duration: 5000,
      position: 'top-right'
    });

    // Close modal using Bootstrap's Modal class
    const modalEl = document.getElementById('signInPin');
    if (modalEl) {
      const modalInstance = Modal.getInstance(modalEl);
      modalInstance?.hide();
    }

    // Redirect based on role
    if (authStore.user?.role === 'superuser' || authStore.user?.role === 'admin') {
      await router.push('/admin/dashboard');
    } else {
      await router.push('/');
    }

  } catch (err: any) {
    error.value = err.message || 'Failed to login. Please try again.';
    
    // Show error notification
    notificationStore.show({
      type: 'error',
      title: 'Login Failed',
      message: err.message || 'Failed to login. Please check your credentials and try again.',
      duration: 5000,
      position: 'top-right'
    });
  } finally {
    loading.value = false;
  }
};

const handleForgotPassword = () => {
  // Implement forgot password functionality
  console.log('Forgot password clicked');
};
</script>

<style scoped>
.alert {
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
}

.alert-danger {
  background-color: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}

.cursor-pointer {
  cursor: pointer;
}

.register__modal {
  z-index: 1050 !important;
}

:deep(.modal-dialog) {
  z-index: 1055 !important;
}

.modal-content {
  position: relative;
  z-index: 1060 !important;
}

.modal-body {
  position: relative;
  z-index: 1060 !important;
}

.form__tabs__wrap {
  position: relative;
  z-index: 1065 !important;
}

.form__grp {
  position: relative;
  z-index: 1070 !important;
}

.create__btn {
  position: relative;
  z-index: 1070 !important;
}

:deep(.modal-backdrop) {
  z-index: 9040 !important;
}
</style>
