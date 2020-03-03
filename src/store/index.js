import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate';

import auth from './auth';
import showPopUpMessage from './showPopUpMessage';
import restrictedAccess from './restricted-access';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    showRegisterForm: false,
    showRightSideMenu: false,
    showLoginForm: false,
    showCheckEmail: false,
    showResetPasswordForm: false,
  },
  mutations: {
    changeShownRegisterForm_mutations(state) {
      state.showRegisterForm = !state.showRegisterForm;
    },
    changeShowRightSideMenu_mutations(state) {
      state.showRightSideMenu = !state.showRightSideMenu;
    },
    changeShowLoginForm_mutations(state) {
      state.showLoginForm = !state.showLoginForm;
    },
    changeCheckEmail_mutations(state) {
      state.showCheckEmail = !state.showCheckEmail;
    },
    changeShowResetPasswordForm_mutations(state) {
      state.showResetPasswordForm = !state.showResetPasswordForm;
    },
  },
  actions: {
    async changeShownSignUpForm_actions(context) {
      context.commit('changeShownRegisterForm_mutations');
    },
    async changeShowRightSideMenu_actions(context) {
      context.commit('changeShowRightSideMenu_mutations');
    },
    async changeShowLoginForm_actions(context) {
      context.commit('changeShowLoginForm_mutations');
    },
    async changeCheckEmail_actions(context) {
      context.commit('changeCheckEmail_mutations');
    },
    async changeShowResetPasswordForm_actions(context) {
      context.commit('changeShowResetPasswordForm_mutations');
    },
    async fetchMurrens() {
      try {
        const {data} = await axios.get('/murren/all/')
        return data
      } catch (error) {
        return {error: true, message: 'Ошибка на сервере'}
      }
    },
    async fetchTanochka({state}) {
      try {
        const {data} = await axios.get('/murren/tanochka/', {
          headers: {Authorization: `Bearer ${state.auth.accessToken}`},
        })

        return axios.defaults.baseURL + data.img_url
      } catch (e) {
        return {error: true, message: 'Ошибка на сервере'}
      }
    },
  },
  getters: {
    showRegisterForm_getters(state) {
      return state.showRegisterForm;
    },
    showRightSideMenu_getters(state) {
      return state.showRightSideMenu;
    },
    showLoginForm_getters(state) {
      return state.showLoginForm;
    },
    showCheckEmail_getters(state) {
      return state.showCheckEmail;
    },
    showResetPasswordForm_getters(state) {
      return state.showResetPasswordForm;
    },
  },
  plugins: [createPersistedState()],
  modules: {
    auth,
    showPopUpMessage,
    restrictedAccess,
  },
});
