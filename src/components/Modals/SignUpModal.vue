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
                        <form @submit.prevent="handleRegister">
                          <div class="form__grp">
                            <label for="username">Username</label>
                            <input
                              type="text"
                              id="username"
                              v-model="registerForm.username"
                              placeholder="Enter username"
                              required
                            />
                          </div>
                          <div class="form__grp">
                            <label for="email344">Email</label>
                            <input
                              type="email"
                              id="email344"
                              v-model="registerForm.email"
                              placeholder="Enter your email"
                              required
                            />
                          </div>
                          <div class="form__grp">
                            <label for="toggle-password1022">Password</label>
                            <input
                              id="toggle-password1022"
                              :type="show ? 'text' : 'password'"
                              v-model="registerForm.password"
                              placeholder="Enter password"
                              required
                            />
                            <span
                              class="fa fa-fw field-icon cursor-pointer"
                              :class="show ? 'fa-eye-slash' : 'fa-eye'"
                              @click="handleShow"
                            ></span>
                          </div>
                          <div class="form__grp">
                            <label for="toggle-password91">Confirm Password</label>
                            <input
                              id="toggle-password91"
                              :type="show2 ? 'text' : 'password'"
                              v-model="registerForm.confirmPassword"
                              placeholder="Confirm password"
                              required
                            />
                            <span
                              class="fa fa-fw field-icon cursor-pointer"
                              :class="show2 ? 'fa-eye-slash' : 'fa-eye'"
                              @click="handleShow2"
                            ></span>
                          </div>
                          <div v-if="error" class="alert alert-danger">
                            {{ error }}
                          </div>
                          <div class="create__btn">
                            <button type="submit" class="cmn--btn" :disabled="loading">
                              <span v-if="!loading">Sign Up</span>
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
const show2 = ref(false);
const loading = ref(false);
const error = ref('');

const registerForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const handleShow = () => {
  show.value = !show.value;
};

const handleShow2 = () => {
  show2.value = !show2.value;
};

const handleRegister = async () => {
  try {
    // Validate passwords match
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
      error.value = 'Passwords do not match';
      
      // Show validation error notification
      notificationStore.show({
        type: 'error',
        title: 'Validation Error',
        message: 'Passwords do not match. Please try again.',
        duration: 5000,
        position: 'top-right'
      });
      return;
    }

    loading.value = true;
    error.value = '';

    await authStore.register({
      username: registerForm.value.username,
      email: registerForm.value.email,
      password: registerForm.value.password
    });

    // Show success notification
    notificationStore.show({
      type: 'success',
      title: 'Registration Successful',
      message: 'Your account has been created successfully. Welcome!',
      duration: 5000,
      position: 'top-right'
    });

    // Close modal using Bootstrap's Modal class
    const modalEl = document.getElementById('signUpPin');
    if (modalEl) {
      const modalInstance = Modal.getInstance(modalEl);
      modalInstance?.hide();
    }

    // Redirect to dashboard
    router.push('/dashboard');

  } catch (err: any) {
    error.value = err.message || 'Failed to register. Please try again.';
    
    // Show error notification
    notificationStore.show({
      type: 'error',
      title: 'Registration Failed',
      message: err.message || 'Failed to create account. Please try again.',
      duration: 5000,
      position: 'top-right'
    });
  } finally {
    loading.value = false;
  }
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
  z-index: 9050 !important;
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

.nav-tabs {
  position: relative;
  z-index: 1075 !important;
}

.tab-content {
  position: relative;
  z-index: 1070 !important;
}

.social__head {
  position: relative;
  z-index: 1075 !important;
}

.modal-dialog-centered {
  display: flex;
  align-items: center;
  min-height: calc(100% - 1rem);
}

.form-check {
  position: relative;
  z-index: 1075 !important;
}

.nav-link {
  position: relative;
  z-index: 1080 !important;
}

.modal__right {
  position: relative;
  z-index: 1065 !important;
}

.social {
  position: relative;
  z-index: 1075 !important;
}
</style>
