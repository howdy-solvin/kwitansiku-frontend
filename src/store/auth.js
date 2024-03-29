import { createStore } from 'vuex';

export default createStore({
  state: {
    user: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    async loginUser({ commit }, form) {
      try {
        const response = await fetch("https://kwitansiku-backend.vercel.app/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        
        const data = await response.json();
        commit('setUser', data.user); // assuming the response has a 'user' field
        return data; // returning data if needed
      } catch (error) {
        console.error("Error logging in:", error);
        return error.response;
      }
    },

    async registerUser(state, form){
      try {
        const response = await fetch("https://kwitansiku-backend.vercel.app/api/auth/register",{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await response.json();
        return data;
      } catch (error) {
        return error.message;
      }
    }
  },
  getters: {
    loggedIn(state) {
      return !!state.user;
    },
  },
});
