import Vue from 'vue';
import Router from 'vue-router';

import store from '@/store/index';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {layout: 'main-layout', murr_some_data: '42'},
      component: () => import('./views/Home.vue'),
    },
    {
      path: '/login',
      name: 'login',
      meta: {layout: 'empty-layout'},
      component: () => import('./views/murren/Login.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      meta: {layout: 'empty-layout'},
      component: () => import('./views/murren/SignUp.vue'),
    },
    {
      path: '/murren',
      name: 'murren',
      meta: {layout: 'main-layout', accessTokenExpected: true},
      component: () => import('./views/murren/Murren.vue'),
    },
    {
      path: '/murren_email_activate',
      name: 'murren_email_activate',
      meta: {layout: 'main-layout'},
      component: () => import('./views/murren/ConfirmEmail.vue'),
    },
    {
      path: '/set_new_password',
      name: 'set_new_password',
      meta: {layout: 'main-layout'},
      component: () => import('./views/murren/SetNewPassword.vue'),
    },
    {
      path: '*',
      name: 'page_404',
      meta: {layout: 'empty-layout'},
      component: () => import('./views/common/Page404.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {

  const isTokenExpectedAndExist = (to.matched.some(r => r.meta.accessTokenExpected) && store.state.auth.accessToken) ||
    !to.matched.some(r => r.meta.accessTokenExpected);

  if (isTokenExpectedAndExist) {
    return next();
  }

  store.dispatch('popUpMessage', {
    message: 'Требуется авторизация 😳',
    type: 'warning',
  });

  store.dispatch('changeShowLoginForm_actions');
});

export default router;
