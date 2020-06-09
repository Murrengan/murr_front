import axios from 'axios'

const jwtDecode = require('jwt-decode')

export default {
  state: {
    accessToken: null,
    murrenName: null,
    murrenId: null,
  },
  actions: {
    async createToken({ commit }, payload) {
      try {
        const { data } = await axios.post('/api/murren/token_create/', payload)
        const response = jwtDecode(data.access)

        if (data.access) {
          commit('setAccessToken_mutations', data.access)
          commit('setMurrenName_mutations', payload.username)
          commit('setMurrenId_mutations', response.user_id)
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
      let results = {
        murrenIsCreated: false,
        uniqueName: false,
        uniqueEmail: false,
        passwordIsTooCommon: false,
        recaptchaError: false,
        passwordIsTooSimilarToUsername: false,
        passwordIsTooSimilarToEmail: false,
      }
      try {
        const { status } = await axios.post('/auth/users/', payload)

        if (status === 201) {
          results.murrenIsCreated = true
        }

        return results
      } catch (e) {
        if (e.response.data.username && e.response.data.username[0] ===
          'A user with that username already exists.') {
          results.uniqueName = true
        }

        if (e.response.data.email && e.response.data.email[0] ===
          'user with this email already exists.') {
          results.uniqueEmail = true
        }

        if (e.response.data.password && e.response.data.password[0] ===
          'This password is too common.') {
          results.passwordIsTooCommon = true
        }

        if (e.response.data.password && e.response.data.password[0] ===
          'The password is too similar to the username.') {
          results.passwordIsTooSimilarToUsername = true
        }

        if (e.response.data.password && e.response.data.password[0] ===
          'The password is too similar to the email.') {
          results.passwordIsTooSimilarToEmail = true
        }

        if (e.response.data.recaptcha_response_problem) {
          results.recaptchaError = true
        }

        return results
      }
    },
    async requestResetPassword(_, payload) {
      try {
        let results = {
          emailIsSent: false,
          notFoundMurren: false,
        }

        const { status } = await axios.post('/auth/users/reset_password/', payload)

        if (status === 204) {
          results.emailIsSent = true
        }

        return results
      } catch (e) {

        return { error: true, message: 'Ошибка на сервере' }
      }
    },
    async setNewPassword(_, payload) {
      let results = {
        passwordIsChanged: false,
        passwordIsTooCommon: false,
      }

      try {
        const data = await axios.post('/auth/users/reset_password_confirm/', {
          uid: payload.uid,
          token: payload.token,
          new_password: payload.password,
          re_new_password: payload.passwordRepeat,
          recaptchaToken: payload.recaptchaToken,
        })

        if (data.status === 204) {
          results.passwordIsChanged = true
        }

        return results
      } catch (e) {

        if (e.response.data.new_password && e.response.data.new_password[0] ===
          'This password is too common.') {
          results.passwordIsTooCommon = true
          return results
        }
        return { error: true, message: 'Ошибка на сервере' }
      }
    },
    async mailConfirmation(_, payload) {
      try {
        let results = {
          isActivated: false,
          otherError: false
        }

        const data = await axios.post('/auth/users/activation/', {
          uid: payload.uid,
          token: payload.token
        })

        if (data.status === 204) {
          results.isActivated = true
        }

        return results
      } catch (e) {
        return { error: true, message: 'Ошибка на сервере' }
      }
    },
    async logout({ commit }) {
      commit('logout_mutations')
    },
  },
  mutations: {
    setAccessToken_mutations(state, accessToken) {
      state.accessToken = accessToken
    },
    logout_mutations(state) {
      state.accessToken = null
      state.murrenName = null
      state.murrenId = null
    },
    setMurrenName_mutations(state, username) {
      state.murrenName = username
    },
    setMurrenId_mutations(state, id) {
      state.murrenId = id
    }
  },
  getters: {
    accessToken_getters(state) {
      return state.accessToken
    },
    murrenName_getters(state) {
      return state.murrenName
    },
    murrenId_getters(state) {
      return state.murrenId
    },
  }
}
