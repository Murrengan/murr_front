import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import auth from "./auth/auth";
import showPopUpMessage from "./showPopUpMessage";
import restrictedAccess from "./restricted-access";
import { actions } from "./index/actions";
import { mutations } from "./index/mutations";
import { state } from "./index/state";
import { getters } from "./index/getters";
import comments from "../components/murr_comment/store";
import modal from "../components/modal/store";

Vue.use(Vuex);

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  plugins: [
    createPersistedState({
      paths: ["auth.accessToken", "auth.murrenName", "auth.murrenId"],
    }),
  ],
  modules: {
    auth,
    showPopUpMessage,
    restrictedAccess,
    comments,
    modal,
  },
});
