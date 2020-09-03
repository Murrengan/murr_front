import Vue from "vue";
import Router from "vue-router";

import store from "@/store/index";

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      meta: { murr_some_data: "42" },
      component: () => import("./views/Home.vue"),
    },
    {
      path: "/login",
      name: "login",
      meta: {},
      component: () => import("./components/murren/Login.vue"),
    },
    {
      path: "/signup",
      name: "signup",
      meta: {},
      component: () => import("./components/murren/SignUp.vue"),
    },
    {
      path: "/murren",
      name: "murren",
      meta: { accessTokenExpected: true },
      component: () => import("./components/murren/Murren.vue"),
    },
    {
      path: "/murren_email_activate",
      name: "murren_email_activate",
      meta: {},
      component: () => import("./components/murren/ConfirmEmail.vue"),
    },
    {
      path: "/set_new_password",
      name: "set_new_password",
      meta: {},
      component: () => import("./components/murren/SetNewPassword.vue"),
    },
    {
      path: "/create_murr",
      name: "create_murr",
      meta: { accessTokenExpected: true },
      component: () => import("./components/murr_card/CreateMurr.vue"),
    },
    {
      path: "/murr_card/:id",
      name: "murr_card",
      meta: {},
      component: () => import("./components/murr_card/WatchOnMurr.vue"),
    },
    {
      path: "/about",
      name: "about",
      meta: {},
      component: () => import("./views/common/About.vue"),
    },
    // {
    //   path: "/murr_chat",
    //   name: "murr_chat",
    //   meta: {},
    //   component: () => import("./components/murr_chat/MurrChat.vue"),
    // },
    {
      path: "*",
      name: "page_404",
      meta: {},
      component: () => import("./views/common/Page404.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isTokenExpectedAndExist =
    (to.matched.some((r) => r.meta.accessTokenExpected) &&
      store.state.auth.accessToken) ||
    !to.matched.some((r) => r.meta.accessTokenExpected);
  if (isTokenExpectedAndExist) {
    return next();
  }
  store.dispatch("popUpMessage", {
    message: "Требуется авторизация 😳",
    type: "warning",
  });
  router.push("/");
  store.dispatch("changeShowLoginForm_actions");
});
export default router;

// workaround for push to "/some_url" when client on "/some_url"
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
//

Vue.use(Router);
