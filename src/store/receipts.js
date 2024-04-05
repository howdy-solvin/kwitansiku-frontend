import axios from 'axios';

function formatTanggal(tanggalISO) {
  const date = new Date(tanggalISO);
  const yyyy = date.getFullYear();
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${yyyy}-${dd}-${mm}`;
}

const receiptsModules = {
  state: {
    accessToken: JSON.parse(localStorage.getItem('accessToken')) || null,
    receipts: [], // State untuk menyimpan data kwitansi dari API
    rekap:'',
    sisaPembyaran: '', 
    form:{
      receipt: '',
      patient: []
    }
  },
  getters: {
    getMyToken: state => state.accessToken.token,
    allReceipts: (state) => state.receipts,
    getterRekap: (state) => state.rekap,
    data: (state) => state.form,
    getterRekapSisa: (state) => {
        // Menghitung sisa pembayaran
        const sisa = state.rekap.data.total_harga - state.rekap.data.total_pembayaran;
        // Melakukan pengecekan jika sisa kurang dari 0
        if (sisa === 0) {
            return "lunas"
        } else {
            return sisa;
      }
    }
  },

  mutations: {
    setReceipts: (state, receipts) => (state.receipts = receipts),
    setRekap: (state, rekap) => (state.rekap = rekap),
    setRekapTotalPembayaranPasien: (state, data) => (state.rekap.data.total_harga = data),
    setEditNamaPj: (state, data) => (state.rekap.data.nama_penanggungjawab = data),
    setEditNamaSponsor: (state, data) => (state.rekap.data.nama_sponsor = data),
    setEditNoForm(state, newValue ) {
      state.rekap.data.pasien_tkis.no_form = newValue;
    },
    setEditJk:(state, newValue) => (state.rekap.data.pasien_tkis.jenis_kelamin = newValue),
    setEditUsia:(state, newValue) => (state.rekap.data.pasien_tkis.usia = newValue),

    setFormEditPasien:(state, data) => (state.form.patient = data),
    setFormEditKuitansi:(state, data) => (state.form.receipt = data),
    setRekapStatus: (state, data) => (state.rekap.status = data),
  },
  actions: {
    async fetchReceipts({commit,  getters }) {
        try {
          // Mengirimkan permintaan GET ke API untuk mendapatkan data kwitansi
          const token = getters.getMyToken;
          const response = await axios.get('https://kwitansiku-backend.vercel.app/api/receipt', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
          });
          // Menyimpan data yang diterima dari API ke dalam state receipts
          commit('setReceipts', response.data.data);
        } catch (error) {
          return error
        }
    },

    async fetchReceiptsPatient({commit, getters}, uuid){
      try {
        const token = getters.getMyToken;
        const response = await axios.get(`https://kwitansiku-backend.vercel.app/api/receipt/one/${uuid}`, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
        })
        const rekapData = response.data.data;
        rekapData.tanggal = formatTanggal(rekapData.tanggal);
        commit('setRekap', response.data)
        return response.data
      } catch (error) {
        return error
      }
    },

    async editReceiptsPatient({getters}, data) {
      try {
        const token = getters.getMyToken;
        const getUuid = getters.getterRekap
        const uuid = getUuid.data.uuid
        console.log(data);
        console.log(uuid);
        const response = await axios.post(`https://kwitansiku-backend.vercel.app/api/receipt/update/tki/${uuid}`, data, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        return response
      } catch (error) {
        return error
      }
    }
  },
  
};

export default receiptsModules
