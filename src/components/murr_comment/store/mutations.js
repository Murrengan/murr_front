import * as type from "./type.js";

export default {
  [type.MUTATIONS_SET_COMMENT](state, data) {
    state.comments = data;
  },
  [type.MUTATIONS_ADD_COMMENT](state, data) {
    state.comments = [data, ...state.comments];
  },
  [type.MUTATIONS_APPEND_COMMENT](state, data) {
    state.comments = [...state.comments, ...data];
  },
};
