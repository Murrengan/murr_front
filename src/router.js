import Vue from 'vue'
import Router from 'vue-router'

import store from '@/store/index';


Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            meta: {layout: 'main-layout', murr_some_data: '42'},
            component: () => import('./views/Home.vue')
        },
        {
            path: '/login',
            name: 'login',
            meta: {layout: 'empty-layout'},
            component: () => import('./views/murren/Login.vue')
        },
        {
            path: '/signup',
            name: 'signup',
            meta: {layout: 'empty-layout'},
            component: () => import('./views/murren/SignUp.vue')
        },
        {
            path: '/murren',
            name: 'murren',
            meta: {layout: 'main-layout', accessTokenExpected: true},
            component: () => import('./views/murren/Murren.vue')
        },
        {
            path: '/check_email',
            name: 'check_email',
            meta: {layout: 'main-layout'},
            component: () => import('./views/murren/CheckEmail.vue')
        },
        {
            path: '/murren_email_activate',
            name: 'murren_email_activate',
            meta: {layout: 'main-layout'},
            component: () => import('./views/murren/ConfirmEmail.vue')
        },
        {
            path: '/set_new_password',
            name: 'set_new_password',
            meta: {layout: 'main-layout'},
            component: () => import('./views/murren/SetNewPassword.vue')
        },
    ]
});

import {Message} from 'element-ui';

router.beforeEach((to, from, next) => {

    if (to.matched.some(record => record.meta.accessTokenExpected)) {

        if (!store.getters.accessToken_getters) {

            store.dispatch('changeShowLoginForm_actions');

            Message({
                message: 'Требуется авторизация 😳',
                center: true,
                customClass: 'element-ui-message__error',
                type: 'warning',
                showClose: true
            });

        } else {

            next()
        }
    } else {

        next()
    }
});

export default router