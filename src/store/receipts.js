import axios from 'axios'

const env = import.meta.env

function formatTanggal(tanggalISO) {
  const date = new Date(tanggalISO)
  const yyyy = date.getFullYear()
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const receiptsModules = {
  state: {
    receipts: [], // State untuk menyimpan data kwitansi dari API
    rekap: {
      id: null,
      uuid: null,
      no_pendaftaran: null,
      tanggal: null,
      nama_penanggungjawab: null,
      nama_sponsor: null,
      keterangan: null,
      total_pendaftar: null,
      total_harga: null,
      total_pembayaran: null,
      pasien_tkis: [],
      status: false
    },
    sisaPembyaran: '',
    form: {
      receipt: '',
      patient: []
    }
  },
  getters: {
    allReceipts: (state) => state.receipts,
    getterRekap: (state) => state.rekap,
    data: (state) => state.form,
    getterRekapSisa: (state) => {
      // Menghitung sisa pembayaran
      const sisa = state.rekap.total_harga - state.rekap.total_pembayaran
      // Melakukan pengecekan jika sisa kurang dari 0
      if (sisa === 0) {
        return 'lunas'
      } else {
        return sisa
      }
    }
  },

  mutations: {
    setReceipts: (state, receipts) => (state.receipts = receipts),
    setRekap: (state, rekap) => (state.rekap = rekap),
    setRekapTotalPembayaranPasien: (state, data) => (state.rekap.total_harga = data),
    setEditNamaPj: (state, data) => (state.rekap.nama_penanggungjawab = data),
    setEditNamaSponsor: (state, data) => (state.rekap.nama_sponsor = data),
    setEditNoForm(state, newValue) {
      state.rekap.pasien_tkis.no_form = newValue
    },
    setEditJk: (state, newValue) => (state.rekap.pasien_tkis.jenis_kelamin = newValue),
    setEditUsia: (state, newValue) => (state.rekap.pasien_tkis.usia = newValue),

    setFormEditPasien: (state, data) => (state.form.patient = data),
    setFormEditKuitansi: (state, data) => (state.form.receipt = data),
    setRekapStatus: (state, data) => (state.rekap.status = data)
  },
  actions: {
    async fetchReceipts({ commit, rootGetters }) {
      try {
        // Mengirimkan permintaan GET ke API untuk mendapatkan data kwitansi
        const stringAccessToken = JSON.stringify(rootGetters.getAccessToken)
        const tokenData = JSON.parse(stringAccessToken)
        const response = await axios.get(`${env.VITE_API_BASE_URL}/receipt`, {
          headers: {
            Authorization: `Bearer ${tokenData.token}`
          }
        })
        // Menyimpan data yang diterima dari API ke dalam state receipts
        commit('setReceipts', response.data.data)
      } catch (error) {
        return error
      }
    },

    async fetchReceiptsPatient({ commit, rootGetters }, uuid) {
      try {
        const stringAccessToken = JSON.stringify(rootGetters.getAccessToken)
        const tokenData = JSON.parse(stringAccessToken)

        const response = await axios.get(`${env.VITE_API_BASE_URL}/receipt/one/${uuid}`, {
          headers: {
            Authorization: `Bearer ${tokenData.token}`
          }
        })
        console.log('cek datanya', response.data)
        const rekapData = response.data.data
        rekapData.tanggal = formatTanggal(rekapData.tanggal)
        commit('setRekap', { ...rekapData, status: true })
        return response.data
      } catch (error) {
        return error
      }
    },

    async editReceiptsPatient({ getters, rootGetters }, data) {
      try {
        const stringAccessToken = JSON.stringify(rootGetters.getAccessToken)
        const tokenData = JSON.parse(stringAccessToken)
        const getUuid = getters.getterRekap
        const uuid = getUuid.uuid
        console.log(data)
        console.log(uuid)
        const response = await axios.post(
          `${env.VITE_API_BASE_URL}/receipt/update/tki/${uuid}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${tokenData.token}`
            }
          }
        )
        return response
      } catch (error) {
        return error
      }
    }
  }
}

export default receiptsModules
