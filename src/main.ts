import { createApp } from "vue";
import "./style.css";
import "./assets/scss/main.scss";
import App from "./App.vue";
import { router } from "./route";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { createPinia } from 'pinia';

router.beforeEach((to) => {
  if (to.meta && typeof to.meta.title === "string") {
    document.title = to.meta.title;
  } else {
    document.title = "Default Title";
  }
  window.scrollTo(0, 0);
});

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);

app.mount("#app");
