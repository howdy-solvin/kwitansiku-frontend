import axios from 'axios'

const env = import.meta.env

// Membuat instance Axios dengan header otentikasi
const instance = axios.create({
  baseURL: env.VITE_API_BASE_URL
})

const pasienModules = {
  state: {
    totalPembayaran: null,
    totalPembayaranPasien: null
  },
  getters: {
    sisaPembayaran: (state) => {
      // Menghitung sisa pembayaran
      const sisa = state.totalPembayaranPasien - state.totalPembayaran
      // Melakukan pengecekan jika sisa kurang dari 0
      if (sisa === 0) {
        return 'lunas'
      } else {
        return sisa
      }
    }
  },
  mutations: {
    setTotalPembayaran(state, data) {
      state.totalPembayaran = data
    },
    setTotalPembayaranPasien(state, data) {
      state.totalPembayaranPasien = data
    }
  },

  actions: {
    async createRekap({ rootGetters }, data) {
      try {
        const stringAccessToken = JSON.stringify(rootGetters.getAccessToken)
        const tokenData = JSON.parse(stringAccessToken)

        const response = await instance.post('/receipt/create/tki', data, {
          headers: {
            Authorization: `Bearer ${tokenData.token}`
          }
        })
        return response.data
      } catch (error) {
        return error
      }
    },
    async fetchRegistNumber({ rootGetters }) {
      try {
        const stringAccessToken = JSON.stringify(rootGetters.getAccessToken)
        const tokenData = JSON.parse(stringAccessToken)

        const response = await instance.get('/receipt/newest-regist-number', {
          headers: {
            Authorization: `Bearer ${tokenData.token}`
          }
        })
        return response.data
      } catch (error) {
        return error
      }
    }
  }
}

export default pasienModules
