import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'

import auth from './auth'
import showPopUpMessage from './showPopUpMessage'
import restrictedAccess from './restricted-access'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showRegisterForm: false,
    showRightSideMenu: false,
    showLoginForm: false,
    showResetPasswordForm: false,
    showCreateMurr: false,
    murrContent: false,
    murrCards: [],
    nextMurrCardsPage: null
  },
  mutations: {
    changeShownRegisterForm_mutations(state) {
      state.showRegisterForm = !state.showRegisterForm
    },
    changeShowRightSideMenu_mutations(state) {
      state.showRightSideMenu = !state.showRightSideMenu
    },
    changeShowLoginForm_mutations(state) {
      state.showLoginForm = !state.showLoginForm
    },
    changeShowResetPasswordForm_mutations(state) {
      state.showResetPasswordForm = !state.showResetPasswordForm
    },
    changeShowCreateMurr_mutations(state) {
      state.showCreateMurr = !state.showCreateMurr
    },
    changeSaveMurrContent_mutations(state, data) {
      state.murrContent = data.murrContent
      state.murrHeader = data.murrHeader
    },
    setMurrCards(state, murrCards) {
      state.murrCards = [...state.murrCards, ...murrCards]
    },
    clearMurrCards(state) {
      state.murrCards = []
    },
    setNextMurrCardsPage(state, nextPage) {
      state.nextMurrCardsPage = nextPage
    }
  },
  actions: {
    async changeShownSignUpForm_actions(context) {
      context.commit('changeShownRegisterForm_mutations')
    },
    async changeShowRightSideMenu_actions(context) {
      context.commit('changeShowRightSideMenu_mutations')
    },
    async changeShowLoginForm_actions(context) {
      context.commit('changeShowLoginForm_mutations')
    },
    async changeShowResetPasswordForm_actions(context) {
      context.commit('changeShowResetPasswordForm_mutations')
    },
    async callSetClearState_actions(context) {
      context.commit('setClearState_mutations')
    },
    async changeShowCreateMurr_actions(context) {
      context.commit('changeShowCreateMurr_mutations')
    },
    async changeSaveMurrContent_action(context, data) {
      context.commit('changeSaveMurrContent_mutations', data)
    },
    async fetchMurrCards(context, page = null) {
      try {
        let url = '/api/murr_card/all/'
        if (page) {
          url += `?page=${page}`
        }
        const { data } = await axios.get(url)
        if (data.results) {
          await context.commit('setMurrCards', data.results)
        }
        if (data.next) {
          await context.commit('setNextMurrCardsPage', data.next.split("=")[1])
        } else {
          await context.commit('setNextMurrCardsPage', false)
        }

      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
      }
    },
    async fetchTanochka({ state }) {
      try {
        const { data } = await axios.get('/api/murren/tanochka/', {
          headers: { Authorization: `Bearer ${state.auth.accessToken}` },
        })
        return axios.defaults.baseURL + data.img_url
      } catch (e) {
        return { error: true, message: 'Ошибка на сервере' }
      }
    }
  },
  getters: {
    showRegisterForm_getters(state) {
      return state.showRegisterForm
    },
    showRightSideMenu_getters(state) {
      return state.showRightSideMenu
    },
    showLoginForm_getters(state) {
      return state.showLoginForm
    },
    showResetPasswordForm_getters(state) {
      return state.showResetPasswordForm
    },
    showCreateMurr_getters(state) {
      return state.showCreateMurr
    },
    showMurrContent_getters(state) {
      return {
        murrContent: state.murrContent,
        murrHeader: state.murrHeader
      }
    },
    murrCards(state) {
      return state.murrCards
    },
    nextMurrCardsPage_getters(state) {
      return state.nextMurrCardsPage
    }
  },
  plugins: [createPersistedState(
    {
      paths: ['auth.accessToken', 'auth.murrenName'],
    }
  )],
  modules: {
    auth,
    showPopUpMessage,
    restrictedAccess,
  },
})
