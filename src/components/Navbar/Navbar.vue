<script setup lang="ts">
import uk from "../../assets/img/header/uk.png";
import logo from "../../assets/img/logo/logo.png";
import { ref } from "vue";
import Select from "../Select/Select.vue";

const lang = [
  { id: 1, name: "En" },
  { id: 2, name: "Cy" },
  { id: 3, name: "Et" },
];

const active = ref(false);
const handleActive = () => {
  active.value = !active.value;
};
</script>

<template>
  <header class="header-section py-1 py-lg-3">
    <div class="container-fluid p-0">
      <div class="header-wrapper">
        <div class="menu__left__wrap">
          <div class="logo-menu px-2">
            <RouterLink to="/" class="logo">
              <img :src="logo" alt="logo" />
            </RouterLink>
          </div>
          <div class="lang d-flex align-items-center px-2">
            <div class="language__wrap">
              <div class="flag">
                <img :src="uk" alt="flag" />
              </div>
              <Select :data="lang" />
            </div>
            <div
              class="header-bar d-lg-none"
              :class="active ? 'active' : ''"
              @click="handleActive"
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <ul class="main-menu" :class="active ? 'active' : ''">
            <li>
              <RouterLink to="/">
                <span>Live</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/sportsbetting">
                <span>Sports Betting</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/casino">
                <span>Casino</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="#">
                <span>Lucky Drops</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/livecasino">
                <span>Live Casino</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/promotions">
                <span>Promotions</span>
              </RouterLink>
            </li>
            <li class="cmn-grp">
              <RouterLink
                to="#"
                class="cmn--btn"
                data-bs-toggle="modal"
                data-bs-target="#signInPin"
              >
                <span>Sign In</span>
              </RouterLink>
              <RouterLink
                to="#"
                class="cmn--btn2"
                data-bs-toggle="modal"
                data-bs-target="#signUpPin"
              >
                <span class="rela">Sign Up</span>
              </RouterLink>
            </li>
          </ul>
        </div>
        <div class="mneu-btn-grp">
          <div class="language__wrap">
            <div class="flag">
              <img :src="uk" alt="flag" />
            </div>

            <Select :data="lang" />
          </div>
          <RouterLink
            to="#"
            class="cmn--btn"
            data-bs-toggle="modal"
            data-bs-target="#signInPin"
          >
            <span>Sign In</span>
          </RouterLink>
          <RouterLink
            to="#"
            class="cmn--btn2"
            data-bs-toggle="modal"
            data-bs-target="#signUpPin"
          >
            <span class="rela">Sign Up</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped></style>
