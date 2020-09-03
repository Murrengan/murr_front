import Vue from "vue";
import Vuelidate from "vuelidate";
import VueMasonry from "vue-masonry-css";
import router from "@/router";
import store from "@/store";
import axios from "axios";
import ElementUI from "element-ui";
import GSignInButton from "vue-google-signin-button";
import { formatDistance } from "date-fns";
import { ru } from "date-fns/locale";

import App from "./App.vue";
import Loader from "./components/common/Loader";
import { axios_defaults_baseURL } from "./devAndProdVariables";

import "normalize.css";
import "element-ui/lib/theme-chalk/index.css";
import "@/assets/css/index.css";
import "@/assets/css/fade-and-slide-fade.css";
import "@/assets/css/fonts.css";
import "@/assets/scss/main.scss";
import "@/assets/css/murr_editorjs.css";

Vue.use(VueMasonry);
Vue.use(ElementUI);
Vue.use(Vuelidate);
Vue.use(GSignInButton);
Vue.component(Loader.name, Loader);

Vue.config.productionTip = false;

axios.defaults.baseURL = axios_defaults_baseURL;

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      if (error.response.data.hasOwnProperty("detail")) {
        if (error.response.data.detail === "Signature has expired.") {
          const dataForPopUpMessage = {
            message: "Истек токен доступа. Перезайди в Мурренган",
            type: "warning",
          };
          store.dispatch("popUpMessage", dataForPopUpMessage);
          store.dispatch("logout");
          router.push("/");
        }
      }
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

Vue.filter("dateFormatHumanDiff", (value) => {
  return formatDistance(new Date(value), new Date(), { locale: ru });
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
