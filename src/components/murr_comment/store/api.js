import axios from "axios";

export const STATUS_OK = 200;
export const STATUS_CREATED = 201;
export const STATUS_NO_CONTENT = 204;
export const STATUS_UNAUTHORIZED = 401;
export const STATUS_INTERNAL_SERVER_ERROR = 500;

/**
 * @param {Number} murrId Murren card id
 * @param {Number} page Number page
 */
export const fetchComments = async (murrId, page) => {
  try {
    const { data, status } = await axios.get(
      `/api/murr_comments/?murr=${murrId}&page=${page}`
    );

    return { success: true, status, data };
  } catch ({ message, response: { status } }) {
    return { success: false, status, message };
  }
};

/**
 * @param {String} token Authorization jwt token
 * @param {Object} formData Object data form
 */
export const addComment = async (token, formData) => {
  try {
    const { data, status } = await axios.post(`/api/murr_comments/`, formData, {
      // todo: Fix - send to global instance of axios
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, status, data };
  } catch ({ message, response: { status } }) {
    return { success: false, status, message };
  }
};

/**
 * @param {String} token Authorization jwt token
 * @param {Number} commentId Comment id
 */
export const likeComment = async (token, commentId) => {
  try {
    const { data, status } = await axios.post(
      `/api/murr_comments/${commentId}/like/`,
      {},
      {
        // todo: Fix - send to global instance of axios
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { success: true, status, data };
  } catch ({ message, response: { status } }) {
    return { success: false, status, message };
  }
};

/**
 * @param {String} token Authorization jwt token
 * @param {Number} commentId Comment id
 */
export const unlikeComment = async (token, commentId) => {
  try {
    const { data, status } = await axios.post(
      `/api/murr_comments/${commentId}/dislike/`,
      {},
      {
        // todo: Fix - send to global instance of axios
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { success: true, status, data };
  } catch ({ message, response: { status } }) {
    return { success: false, status, message };
  }
};
