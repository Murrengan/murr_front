export default {
  namespaced: true,
  state: {
    timestamp: localStorage.getItem("limitationComponentTime"),
  },
  actions: {
    isWaiting: ({ state }, waitSeconds = 5 * 60) => {
      const dateTimestamp = Date.now();
      const timestamp = +(state.timestamp || dateTimestamp);
      const seconds = Math.floor(Math.abs(dateTimestamp - timestamp) / 1000);

      return seconds !== 0 && waitSeconds - seconds > 0;
    },
    runRestriction: ({ commit }) => {
      const timestamp = Date.now();

      localStorage.setItem("limitationComponentTime", String(timestamp));

      commit("setTimestamp", timestamp);
    },
  },
  mutations: {
    setTimestamp: (s, t) => (s.timestamp = t),
  },
};
