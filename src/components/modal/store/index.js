import mutations from "./mutations.js";

export default {
  namespaced: true,
  state: {
    isOpen: false,
    payload: null,
    transition: null,
  },
  getters: {
    isOpen: (state) => state.isOpen,
    payload: (state) => state.payload,
    transition: (state) => state.transition,
  },
  mutations,
};
