export default {
  open(state, payload) {
    state.isOpen = true;
    state.payload = payload;
    state.transition = payload.transition;
  },
  close(state) {
    state.isOpen = false;
    state.payload = null;
    state.transition = null;
  },
};
