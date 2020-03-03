import axios from 'axios';

export default {
  state: {
    accessToken: null,
    murrenName: '',
  },
  actions: {
    async createToken({commit}, payload) {
      try {
        const {data} = await axios.post('/murren/token_create/', payload)

        if (data.access) {
          commit('setAccessToken_mutations', data.access)
          commit('setMurrenName_mutations', payload.username)
        }
      } catch (e) {
        return {
          error: true,
          accountActivated: !(e.response.data.detail ===
              'No active account found with the given credentials'),
        }
      }

      return {
        error: false,
        accountActivated: true,
      }
    },
    async createMurren(_, payload) {
      try {
        let results = {
          murrenIsCreated: false,
          uniqueName: false,
          uniqueEmail: false,
          passwordIsTooCommon: false,
          recaptchaError: false,
        }

        const {data} = await axios.post('/murren/register/', payload)

        if (data.username && data.username[0] ===
            'A user with that username already exists.') {
          results.uniqueName = true
        }

        if (data.email && data.email[0] ===
            'User with this Email already exists.') {
          results.uniqueEmail = true
        }

        if (data.password && data.password[0] ===
            'This password is too common.') {
          results.passwordIsTooCommon = true
        }

        if (data.recaptcha_response_problem) {
          results.recaptchaError = true
        }

        if (data.is_murren_created) {
          results.murrenIsCreated = true
        }

        return results
      } catch (e) {
        return {error: true, message: 'Ошибка на сервере'}
      }
    },
    async requestResetPassword(_, payload) {
      try {
        let results = {
          emailIsSent: false,
          notFoundMurren: false,
        }
        const {data} = await axios.post('/murren/reset_password/', payload)

        if (data.email_sent_successfully) {
          results.emailIsSent = true
        }

        if (data.error_on_backend && data.error_text === 'Murren matching query does not exist.') {
          results.notFoundMurren = true
        }

        return results
      } catch (e) {
        return {error: true, message: 'Ошибка на сервере'}
      }
    },
    async setNewPassword(_, payload) {
      try {
        let results = {
          passwordIsChanged: false,
          passwordIsTooCommon: false,
          otherError: false,
        }

        const {data} = await axios.post('/murren/confirm_new_password/', {
          murren_password_1: payload.password,
          murren_password_2: payload.passwordRepeat,
          murren_email: payload.token,
          recaptchaToken: payload.recaptchaToken,
        })

        if (data.password_successfully_changed) {
          results.passwordIsChanged = true
        }

        if (data.password && data.password[0] === 'This password is too common.') {
          results.passwordIsTooCommon = true
        }

        if (data.error_on_backend) {
          results.otherError = true
        }

        return results
      } catch (e) {
        return {error: true, message: 'Ошибка на сервере'}
      }
    },
    async mailConfirmation(_, payload) {
      try {
        let results = {
          isActivated: false,
          otherError: false
        }

        const {data} = await axios.post('/murren/activation/', {
          murren_email: payload.token
        })

        if (data.murren_is_active) {
          results.isActivated = true
        }

        if (data.error_on_backend) {
          results.otherError = true
        }

        return results
      } catch (e) {
        return {error: true, message: 'Ошибка на сервере'}
      }
    },
    async logout({commit}) {
      commit('logout_mutations')
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
