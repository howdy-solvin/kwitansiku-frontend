import axios from 'axios';

const env = import.meta.env;

const authModules = {
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    
  },

  getters: {
    admin: state => state.user
  },

  mutations: {
    setUser(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    setAccessToken(state, token) {
      localStorage.setItem('accessToken', JSON.stringify(token));
    },
    setRefreshToken(state, token) {
      localStorage.setItem('refreshToken', JSON.stringify(token));
    },
    
  },
  actions: {
    async loginUser({ commit }, form) {
      try {
        const response = await axios.post(`${env.VITE_API_BASE_URL}/auth/login`, form );
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
        const response = await axios.post(`${env.VITE_API_BASE_URL}/auth/register`, form);
        return response.data;
      } catch (error) {
        return error.message;
      }
    }
  },
  
};

export default authModules
