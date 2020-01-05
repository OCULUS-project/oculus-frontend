import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    drawer: false,
    routes: [
      {
        text: "Home",
        to: "/"
      },
      {
        text: "Patients",
        to: "/patients"
      },
      {
        text: "Jobs",
        to: "/jobs"
      },
      {
        text: "Analysys",
        to: "analysys"
      },
      {
        text: "About",
        to: "/about"
      }
    ]
  },
  getters: {
    routes: state => {
      return state.routes;
    }
  },
  mutations: {
    setDrawer: (state, payload) => (state.drawer = payload),
    toggleDrawer: state => (state.drawer = !state.drawer)
  },
  actions: {}
});
