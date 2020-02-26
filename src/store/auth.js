import axios from 'axios';

export default {
  state: {
    accessToken: null,
    murrenName: '',
  },
  actions: {
    async createToken({commit}, payload) {
      try {
        const {data} = await axios.post('/murren/token_create/', payload);

        if (data.access) {
          commit('setAccessToken_mutations', data.access);
          commit('setMurrenName_mutations', payload.username);
        }
      } catch (e) {
        return {
          error: true,
          accountActivated: !(e.response.data.detail === 'No active account found with the given credentials')
        }
      }

      return {
        error: false,
        accountActivated: true
      }
    },
    async logout({commit}) {
      commit('logout_mutations');
    },
    async requestResetPassword({dispatch}, payload) {
      let message, isRedirect;

      /* Set a timeout for limiting requests and check */
      if (await dispatch('restrictedAccess/isWaiting', 5 * 60)) {
        message = {
          message: 'Попробуйте попытку чуть позже',
          type: 'warning',
        };

        isRedirect = false;
      } else {
        try {
          await axios.post('/murren/reset_password/', payload);

          message = {
            message: 'Вы получите письмо с востановлением данных на эту почту, если она была подтверждена',
            type: 'success',
          };

        } catch (e) {
          /* eslint-disable no-empty */
        } finally {
          /* Initializing a query restriction */
          dispatch('restrictedAccess/runRestriction');
          isRedirect = true;
        }
      }

      dispatch('popUpMessage', message);

      return isRedirect;
    },
  },
  mutations: {
    setAccessToken_mutations(state, accessToken) {
      state.accessToken = accessToken;
    },
    logout_mutations(state) {
      state.accessToken = null;
      state.murrenName = null;
    },
    setMurrenName_mutations(state, username) {
      state.murrenName = username;
    },
  },
  getters: {
    accessToken_getters(state) {
      return state.accessToken;
    },
    murrenName_getters(state) {
      return state.murrenName;
    },
  },
};
