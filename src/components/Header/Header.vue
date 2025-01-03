<template>
  <section class="main__tab__slide">
    <ul class="nav nav-tabs" id="myTabmain" role="tablist">
      <li class="nav-item" role="presentation">
        <button
          class="nav-link active"
          id="main-tab"
          data-bs-toggle="tab"
          data-bs-target="#mainTab"
          type="button"
          role="tab"
          aria-selected="true"
        >
          <span class="icons">
            <i class="icon-home"></i>
          </span>
          <span>Home</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="main-tab2"
          data-bs-toggle="tab"
          data-bs-target="#mainTab2"
          type="button"
          role="tab"
          aria-selected="false"
        >
          <span class="icons">
            <i class="icon-live"></i>
          </span>
          <span>Live</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="main-tab3"
          data-bs-toggle="tab"
          data-bs-target="#mainTab3"
          type="button"
          role="tab"
          aria-selected="false"
        >
          <span class="icons">
            <i class="icon-calender"></i>
          </span>
          <span>Today</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="main-tab4"
          data-bs-toggle="tab"
          data-bs-target="#mainTab4"
          type="button"
          role="tab"
          aria-selected="false"
        >
          <span class="icons">
            <i class="icon-football"></i>
          </span>
          <span>Football</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="main-tab5"
          data-bs-toggle="tab"
          data-bs-target="#mainTab5"
          type="button"
          role="tab"
          aria-selected="false"
        >
          <span class="icons">
            <i class="icon-tennis"></i>
          </span>
          <span>Tennis</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="main-tab6"
          data-bs-toggle="tab"
          data-bs-target="#mainTab6"
          type="button"
          role="tab"
          aria-selected="false"
        >
          <span class="icons">
            <i class="icon-basketball"></i>
          </span>
          <span>Basketball</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="main-tab7"
          data-bs-toggle="tab"
          data-bs-target="#mainTab7"
          type="button"
          role="tab"
          aria-selected="false"
        >
          <span class="icons">
            <i class="icon-icehockey"></i>
          </span>
          <span>Ice Hockey</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="main-tab8"
          data-bs-toggle="tab"
          data-bs-target="#mainTab8"
          type="button"
          role="tab"
          aria-selected="false"
        >
          <span class="icons">
            <i class="icon-handball"></i>
          </span>
          <span>Handball</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="main-tab9"
          data-bs-toggle="tab"
          data-bs-target="#mainTab9"
          type="button"
          role="tab"
          aria-selected="false"
        >
          <span class="icons">
            <i class="icon-afootball"></i>
          </span>
          <span>American Football</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="main-tab10"
          data-bs-toggle="tab"
          data-bs-target="#mainTab10"
          type="button"
          role="tab"
          aria-selected="false"
        >
          <span class="icons">
            <i class="icon-baseball"></i>
          </span>
          <span>Baseball</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="main-tab11"
          data-bs-toggle="tab"
          data-bs-target="#mainTab11"
          type="button"
          role="tab"
          aria-selected="false"
        >
          <span class="icons">
            <i class="icon-horse"></i>
          </span>
          <span>Horse Racing</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="main-tab12"
          data-bs-toggle="tab"
          data-bs-target="#mainTab12"
          type="button"
          role="tab"
          aria-selected="false"
        >
          <span class="icons">
            <i class="icon-v"></i>
          </span>
          <span>Virtuals</span>
        </button>
      </li>
      <li class="nav-item">     
        <Search />
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="main-tab14"
          data-bs-toggle="tab"
          data-bs-target="#mainTab14"
          type="button"
          role="tab"
          aria-selected="false"
        >
          <span class="icons">
            <i class="icon-star"></i>
          </span>
          <span>Favourites</span>
        </button>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import Search from '../Common/Search.vue';
</script>

<style scoped></style>
