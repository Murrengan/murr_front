import axios from "axios";

export const STATUS_OK = 200;
export const STATUS_CREATED = 201;
export const STATUS_UNAUTHORIZED = 401;
export const STATUS_INTERNAL_SERVER_ERROR = 500;

/**
 * Fetch all comment
 *
 * @param {Number} murrId
 * @param {Number} page
 * @return {Promise}
 */
export const fetchComments = async (murrId, page) => {
  try {
    const { data, status } = await axios.get(
      `/api/murr_comments/?murr=${murrId}&page=${page}`
    );

    if (status === STATUS_OK) {
      return Promise.resolve(data);
    }

    return Promise.reject(data);
  } catch (error) {
    return Promise.reject(error.response);
  }
};

/**
 * Add comment
 *
 * @param {String} token
 * @param {Object} formData
 * @return {Promise}
 */
export const addComment = async (token, formData) => {
  try {
    const { data, status } = await axios.post(`/api/murr_comments/`, formData, {
      // todo: Fix - send to global instance of axios
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (status === STATUS_CREATED) {
      return Promise.resolve(data);
    }

    return Promise.reject(data);
  } catch (error) {
    return Promise.reject(error.response);
  }
};
