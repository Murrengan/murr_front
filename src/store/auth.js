import axios from 'axios'

export default {
    state: {

        accessToken:null,
        murrenName: ''
    },

    actions: {

        async login({commit}, {username, password}) {

            try {

                const response = await axios.post('/murren/token_create/', {username, password});
                const accessToken = response.data.access;

                if (accessToken) {

                    await commit('setAccessToken_mutations', accessToken);
                    await commit('setMurrenName_mutations', username);
                }

            } catch (e) {
                throw e
            }
        },

        async logout({commit}) {
            commit('logout_mutations');
        }
    },

    mutations: {

        setAccessToken_mutations(state, accessToken) {
            state.accessToken = accessToken
        },

        logout_mutations(state) {

            state.accessToken = null;
            state.murrenName = null
        },

        setMurrenName_mutations(state, username) {
            state.murrenName = username
        }
    },

    getters: {

        accessToken_getters(state) {
            return state.accessToken
        },

        murrenName_getters(state) {
            return state.murrenName
        }
    }
}