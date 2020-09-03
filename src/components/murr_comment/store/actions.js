import * as type from "./type.js";
import { addComment, fetchComments, STATUS_UNAUTHORIZED } from "./api.js";

const COMMENTS_START_PAGE = 1;

export default {
  async [type.ACTIONS_FETCH_COMMENTS]({ commit, dispatch }, { murrId }) {
    try {
      const data = await fetchComments(murrId, COMMENTS_START_PAGE);

      commit(type.MUTATIONS_SET_COMMENT, data.results);

      return data;
    } catch (error) {
      dispatch("popUpMessage", {
        message: "Произошла ошибка при загрузке комментариев!",
        customClass: "element-ui-message__error",
        type: "error",
      });

      return Promise.reject(error);
    }
  },
  async [type.ACTIONS_FETCH_NEXT_PAGE_COMMENTS](
    { commit, dispatch },
    { murrId, page }
  ) {
    try {
      const data = await fetchComments(murrId, page);

      commit(type.MUTATIONS_APPEND_COMMENT, data.results);

      return data;
    } catch (error) {
      dispatch("popUpMessage", {
        message: "Произошла ошибка при загрузке комментариев!",
        customClass: "element-ui-message__error",
        type: "error",
      });

      return Promise.reject(error);
    }
  },
  async [type.ACTIONS_ADD_COMMENT]({ commit, dispatch, getters }, payload) {
    try {
      const token = getters.accessToken_getters;
      let formData = {
        author: getters.murrenId_getters,
        recaptchaToken: payload.recaptchaToken,
        murr: payload.murrId,
        text: payload.text,
      };
      const data = await addComment(token, formData);

      commit(type.MUTATIONS_ADD_COMMENT, data);

      return data;
    } catch (error) {
      if (error.status === STATUS_UNAUTHORIZED) {
        dispatch("popUpMessage", {
          message: "Для создания комментариев требуется авторизация 😳",
          customClass: "element-ui-message__warning",
          type: "warning",
        });
      }

      return Promise.reject(error);
    }
  },
  async [type.ACTIONS_REPLY_COMMENT]({ dispatch, getters }, payload) {
    try {
      const token = getters.accessToken_getters;
      let formData = {
        author: getters.murrenId_getters,
        recaptchaToken: payload.recaptchaToken,
        murr: payload.murrId,
        text: payload.text,
        parent: payload.parent,
      };
      return await addComment(token, formData);
    } catch (error) {
      if (error.status === STATUS_UNAUTHORIZED) {
        dispatch("popUpMessage", {
          message: "Для создания комментариев требуется авторизация 😳",
          customClass: "element-ui-message__warning",
          type: "warning",
        });
      }

      return Promise.reject(error);
    }
  },
};
