import axios from 'axios'
import router from '@/router';

const env = import.meta.env

const authModules = {
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
  },

  getters: {
    admin: (state) => state.user.data,
    getAccessToken: (state) => {
      return state.user.tokens.access
    },
    getRefreshToken: (state) => state.user.tokens.refresh,
    isAuthenticated: (state) => !!state.accessToken,
  },

  mutations: {
    setUser(state, user) {
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    setAccessToken(state, token) {
      state.accessToken = token;
      localStorage.setItem('accessToken', JSON.stringify(token))
    },
    setRefreshToken(state, token) {
      state.refreshToken = token;
      localStorage.setItem('refreshToken', JSON.stringify(token))
    },
    clearAuthData(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },
  actions: {
    async loginUser({ commit }, form) {
      try {
        commit('setAlertData', {
          message: 'Logging in...',
          type: 'info',
          isLoading: false
        })
        const response = await axios.post(`${env.VITE_API_BASE_URL}/auth/login`, form)
        commit('setUser', response.data)
        response.status === 200
          ? commit('setAlertData', {
            message: response.data.message,
            type: 'success',
            isLoading: false
          })
          : commit('setAlertData', {
            message: response.data.message,
            type: 'error',
            isLoading: false
          })
        // Simpan user dan token ke dalam state Vuex dan local storage
        commit('setAccessToken', response.data.tokens.access)
        commit('setRefreshToken', response.data.tokens.refresh) // assuming the response has a 'user' field
        return response.data // returning data if needed
      } catch (error) {
        return error.response
      }
    },

    async registerUser(state, form) {
      try {
        const response = await axios.post(`${env.VITE_API_BASE_URL}/auth/register`, form)
        return response.data
      } catch (error) {
        return error.message
      }
    },
    async refreshToken({ commit, state }) {
      try {
        const response = await axios.post(`${env.VITE_API_BASE_URL}/auth/refresh-token`, {
          refreshToken: state.refreshToken,
        });
        // commit('setAccessToken', response.data.tokens.access);
        localStorage.setItem('refreshToken', response.data.tokens.refresh);

        return response.data.tokens.access;
      } catch (error) {
        console.log('error auth', error);
        commit('clearAuthData');
        return Promise.reject(error);
      }
    },

    isTokenExpired(_, token) {
      if (!token) return true;
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      return (Math.floor((new Date).getTime() / 1000)) >= expiry;
    }
  }
}

export default authModules
