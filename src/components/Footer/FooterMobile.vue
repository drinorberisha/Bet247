<template>
  <ul class="footer__menu d-lg-none">
    <li>
      <RouterLink
        to="/"
        class="d-grid justify-content-center"
        @click="closeModal"
      >
        <span>
          <i class="fas fa-table-tennis"></i>
        </span>
        <span class="texta">Sports</span>
      </RouterLink>
    </li>
    <li>
      <RouterLink
        to="#"
        class="d-grid justify-content-center"
        data-bs-toggle="modal"
        data-bs-target="#eventsp"
      >
        <span>
          <i class="fa-solid fa-gift"></i>
        </span>
        <span class="texta">Events</span>
      </RouterLink>
    </li>
    <li class="header-bartwo d-lg-none">
      <span class="bars">
        <i class="fas fa-bars"></i>
      </span>
      <span class="cros">
        <i class="fa-solid fa-xmark"></i>
      </span>
    </li>
    <li>
      <RouterLink
        to="#"
        class="d-grid justify-content-center"
        data-bs-toggle="modal"
        data-bs-target="#betsp"
      >
        <span>
          <i class="fas fa-ticket-alt"></i>
        </span>
        <span class="texta">My Bet</span>
      </RouterLink>
    </li>
    <li>
      <RouterLink
        to="/dashboard"
        class="d-grid justify-content-center"
        @click="closeModal"
      >
        <span>
          <i class="far fa-user-circle"></i>
        </span>
        <span class="texta"> Account</span>
      </RouterLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { onMounted, ref } from "vue";
import { Modal } from "bootstrap";

const eventsModal = ref<Modal | null>(null);
const betsModal = ref<Modal | null>(null);

onMounted(() => {
  const eventsModalElement = document.getElementById("eventsp");
  const betsModalElement = document.getElementById("betsp");

  if (eventsModalElement) {
    eventsModal.value = Modal.getOrCreateInstance(eventsModalElement);
  }

  if (betsModalElement) {
    betsModal.value = Modal.getOrCreateInstance(betsModalElement);
  }
});

const closeModal = () => {
  if (eventsModal.value) {
    eventsModal.value.hide();
  }
  if (betsModal.value) {
    betsModal.value.hide();
  }
};
</script>

<style scoped></style>
