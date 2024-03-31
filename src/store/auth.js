import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    user: null,
   
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      // Simpan state ke local storage setelah diubah
      localStorage.setItem('user', JSON.stringify(user));
    },
    setAccessToken(state, token) {
      localStorage.setItem('accessToken', JSON.stringify(token));
    },
    setRefreshToken(state, token) {
      localStorage.setItem('refreshToken', JSON.stringify(token));
    },
    // Tambahkan mutation untuk memperbarui state dari local storage saat aplikasi dimuat
    restoreState(state) {
      const user = localStorage.getItem('user');
      if (user) {
        state.user = JSON.parse(user);
      }
    }
  },
  actions: {
    async loginUser({ commit }, form) {
      try {
        const response = await axios.post("https://kwitansiku-backend.vercel.app/api/auth/login", form );
        commit('setUser', response.data);
        // Simpan user dan token ke dalam state Vuex dan local storage
        commit('setAccessToken', response.data.tokens.access);
        commit('setRefreshToken', response.data.tokens.refresh); // assuming the response has a 'user' field
        return response.data; // returning data if needed
      } catch (error) {
        return error.response;
      }
    },

    async registerUser(state, form){
      try {
        const response = await axios.post("https://kwitansiku-backend.vercel.app/api/auth/register", form);
        return response.data;
      } catch (error) {
        return error.message;
      }
    }
  },
  
  plugins: [(store) => store.commit('restoreState')]
});
