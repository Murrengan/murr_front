import axios from 'axios';

export default {
  state: {
    accessToken: null,
    murrenName: '',
  },
  actions: {
    async login({commit}, {username, password, recaptchaToken}) {
      try {
        const response = await axios.post('/murren/token_create/',
          {username, password, recaptchaToken});
        const accessToken = response.data.access;

        if (accessToken) {
          await commit('setAccessToken_mutations', accessToken);
          await commit('setMurrenName_mutations', username);
        }
      } catch (e) {
        throw e;
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
