export const mutations = {
  changeShownRegisterForm_mutations(state) {
    state.showRegisterForm = !state.showRegisterForm;
  },
  changeShowRightSideMenu_mutations(state) {
    state.showRightSideMenu = !state.showRightSideMenu;
  },
  changeShowLoginForm_mutations(state) {
    state.showLoginForm = !state.showLoginForm;
  },
  changeShowResetPasswordForm_mutations(state) {
    state.showResetPasswordForm = !state.showResetPasswordForm;
  },
  changeShowCreateMurr_mutations(state) {
    state.showCreateMurr = !state.showCreateMurr;
  },
  changeSaveMurrContent_mutations(state, data) {
    state.murrContent = data.murrContent;
    state.murrHeader = data.murrHeader;
  },
  setMurrCards(state, murrCards) {
    state.murrCards = [...state.murrCards, ...murrCards];
  },
  clearMurrCards(state) {
    state.murrCards = [];
  },
  setNextMurrCardsPage(state, nextPage) {
    state.nextMurrCardsPage = nextPage;
  },
};
