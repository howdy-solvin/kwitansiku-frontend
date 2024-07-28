import axios from 'axios'

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
      localStorage.setItem('accessToken', JSON.stringify(token))
    },
    setRefreshToken(state, token) {
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
        commit('setAccessToken', response.data.tokens.access);
        return response.data.tokens.access;
      } catch (error) {
        commit('clearAuthData');
        return Promise.reject(error);
      }
    },

    // logout({ commit }) {
    //   commit('clearAuthData');
    //   // Redirect to login page or other actions
    // }
  }
}

export default authModules
