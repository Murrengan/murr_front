import axios from "axios";

export const actions = {
  async changeShownSignUpForm_actions(context) {
    context.commit("changeShownRegisterForm_mutations");
  },
  async changeShowRightSideMenu_actions(context) {
    context.commit("changeShowRightSideMenu_mutations");
  },
  async changeShowLoginForm_actions(context) {
    context.commit("changeShowLoginForm_mutations");
  },
  async changeShowResetPasswordForm_actions(context) {
    context.commit("changeShowResetPasswordForm_mutations");
  },
  async callSetClearState_actions(context) {
    context.commit("setClearState_mutations");
  },
  async changeShowCreateMurr_actions(context) {
    context.commit("changeShowCreateMurr_mutations");
  },
  async changeSaveMurrContent_action(context, data) {
    context.commit("changeSaveMurrContent_mutations", data);
  },
  async fetchMurrCards(context, page = null) {
    try {
      let url = "/api/murr_card/all/";
      if (page) {
        url += `?page=${page}`;
      }
      const { data } = await axios.get(url);
      if (data.results) {
        await context.commit("setMurrCards", data.results);
      }
      if (data.next) {
        await context.commit("setNextMurrCardsPage", data.next.split("=")[1]);
      } else {
        await context.commit("setNextMurrCardsPage", false);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  },
  async fetchTanochka({ state }) {
    try {
      const { data } = await axios.get("/api/murren/tanochka/", {
        headers: { Authorization: `Bearer ${state.auth.accessToken}` },
      });
      return axios.defaults.baseURL + data.img_url;
    } catch (e) {
      return { error: true, message: "Ошибка на сервере" };
    }
  },
};
