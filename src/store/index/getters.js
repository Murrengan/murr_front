export const getters = {
  showRegisterForm_getters(state) {
    return state.showRegisterForm;
  },
  showRightSideMenu_getters(state) {
    return state.showRightSideMenu;
  },
  showLoginForm_getters(state) {
    return state.showLoginForm;
  },
  showResetPasswordForm_getters(state) {
    return state.showResetPasswordForm;
  },
  showCreateMurr_getters(state) {
    return state.showCreateMurr;
  },
  showMurrContent_getters(state) {
    return {
      murrContent: state.murrContent,
      murrHeader: state.murrHeader,
    };
  },
  murrCards(state) {
    return state.murrCards;
  },
  nextMurrCardsPage_getters(state) {
    return state.nextMurrCardsPage;
  },
};
