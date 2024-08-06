import axios from 'axios'

const env = import.meta.env

const toastModules = {
  state: {
    toastMessage: null,
    toastType: null,
    toastDate: null,
    isLoading: false
  },

  getters: {
    getAlertData: (state) => {
      return {
        message: state.toastMessage,
        type: state.toastType,
        date: state.toastDate,
        loading: state.isLoading
      }
    }
  },

  mutations: {
    setAlertData(state, { message, type = 'success', isLoading }) {
      state.toastMessage = message
      state.toastType = type
      state.isLoading = isLoading
      state.toastDate = new Date()
    }
  }
}

export default toastModules
