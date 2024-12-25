import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

Array.prototype.sample = function () {
  return this[Math.floor(Math.random() * this.length)];
};

createApp(App).mount("#app");
