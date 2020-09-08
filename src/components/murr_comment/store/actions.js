import * as type from "./type.js";
import {
  fetchComments,
  addComment,
  likeComment,
  unlikeComment,
  STATUS_UNAUTHORIZED,
  STATUS_OK,
} from "./api.js";

const COMMENTS_START_PAGE = 1;

export default {
  async [type.ACTIONS_FETCH_COMMENTS]({ commit, dispatch }, { murrId }) {
    const { success, status, data } = await fetchComments(
      murrId,
      COMMENTS_START_PAGE
    );

    if (success) {
      commit(type.MUTATIONS_SET_COMMENT, data.results);

      return data;
    }

    if (status !== STATUS_OK) {
      dispatch("popUpMessage", {
        message: "Произошла ошибка при загрузке комментариев!",
        customClass: "element-ui-message__error",
        type: "error",
      });
    }

    return null;
  },
  async [type.ACTIONS_FETCH_NEXT_PAGE_COMMENTS](
    { commit, dispatch },
    { murrId, page }
  ) {
    const { success, status, data } = await fetchComments(murrId, page);

    if (success) {
      commit(type.MUTATIONS_APPEND_COMMENT, data.results);

      return data;
    }

    if (status !== STATUS_OK) {
      dispatch("popUpMessage", {
        message: "Произошла ошибка при загрузке комментариев!",
        customClass: "element-ui-message__error",
        type: "error",
      });
    }

    return null;
  },
  async [type.ACTIONS_ADD_COMMENT]({ commit, dispatch, getters }, payload) {
    const authorizationToken = getters.accessToken_getters;

    let formData = {
      author: getters.murrenId_getters,
      recaptchaToken: payload.recaptchaToken,
      murr: payload.murrId,
      text: payload.text,
    };

    const { success, status, data } = await addComment(
      authorizationToken,
      formData
    );

    if (success) {
      commit(type.MUTATIONS_ADD_COMMENT, data);
      return data;
    }

    if (status === STATUS_UNAUTHORIZED) {
      dispatch("popUpMessage", {
        message: "Для создания комментариев требуется авторизация 😳",
        customClass: "element-ui-message__warning",
        type: "warning",
      });
    }

    return null;
  },
  async [type.ACTIONS_REPLY_COMMENT]({ dispatch, getters }, payload) {
    const authorizationToken = getters.accessToken_getters;

    let formData = {
      author: getters.murrenId_getters,
      recaptchaToken: payload.recaptchaToken,
      murr: payload.murrId,
      text: payload.text,
      parent: payload.parent,
    };
    const { success, status, data } = await addComment(
      authorizationToken,
      formData
    );

    if (success) {
      return data;
    }

    if (status === STATUS_UNAUTHORIZED) {
      dispatch("popUpMessage", {
        message: "Для создания комментариев требуется авторизация 😳",
        customClass: "element-ui-message__warning",
        type: "warning",
      });
    }

    return null;
  },
  async [type.ACTIONS_LIKE]({ dispatch, getters }, payload) {
    const authorizationToken = getters.accessToken_getters;

    const { success, status, data } = await likeComment(
      authorizationToken,
      payload.commentId
    );

    if (success) {
      return data;
    }

    if (status === STATUS_UNAUTHORIZED) {
      dispatch("popUpMessage", {
        message: "Требуется авторизация 😳",
        customClass: "element-ui-message__warning",
        type: "warning",
      });
    }

    return null;
  },
  async [type.ACTIONS_UNLIKE]({ dispatch, getters }, payload) {
    const authorizationToken = getters.accessToken_getters;

    const { success, status, data } = await unlikeComment(
      authorizationToken,
      payload.commentId
    );

    if (success) {
      return data;
    }

    if (status === STATUS_UNAUTHORIZED) {
      dispatch("popUpMessage", {
        message: "Требуется авторизация 😳",
        customClass: "element-ui-message__warning",
        type: "warning",
      });
    }

    return null;
  },
};
