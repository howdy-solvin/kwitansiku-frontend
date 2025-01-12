import axios from 'axios'

const env = import.meta.env

function formatTanggal(tanggalISO) {
  const date = new Date(tanggalISO)
  const yyyy = date.getFullYear()
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const receipt_init = () => {
  return {
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
    blankoPra: {
      id: null,
      uuid: null,
      tanggal_lahir: null,
      bn_bt: null,
      tanggal_cetak: null,
      usia: 0,
      status: null,
      jenis_kelamin: null,
      negara: null,
      provinsi: null,
      daerah: null,
      pekerjaan_negara_tujuan: null,
      no_visa: null,
      no_passpor: null,
      masa_berlaku: null,
      sampai_dengan: null,
      status_blanko: null,
      image_content_type: null,
      image_blob: null,
      pasien_id: null,
      status: false,
      blanko_pra: {
        id: 0,
        tinggi: 0,
        berat: 0,
        mata_kanan: null,
        mata_kiri: null,
        tekanan_darah_atas: 0,
        tekanan_darah_bawah: 0,
        tekanan_darah_nadi: 0,
        golongan_darah: null,
        suhu_tubuh: 0,
        rontgen: null,
        gula: null,
        protein: null,
        ph: 0,
        hbs_ag: null,
        vdrl: null,
        tpha: null,
        thorax_pa: null,
        hasil: null,
        keterangan: null,
        pic: null,
        createdAt: null,
        updatedAt: null,
        blanko_id: null
      }
    },
    blankoFull: {
      id: null,
      uuid: null,
      tanggal_lahir: null,
      bn_bt: null,
      tanggal_cetak: null,
      usia: 0,
      status: null,
      jenis_kelamin: null,
      negara: null,
      provinsi: null,
      daerah: null,
      pekerjaan_negara_tujuan: null,
      no_visa: null,
      no_passpor: null,
      masa_berlaku: null,
      sampai_dengan: null,
      status_blanko: null,
      image_content_type: null,
      image_blob: null,
      status: false,
      pasien_id: null,
      blanko_full: {
        id: 0,
        hiv_status: null,
        hiv_date: null,
        tbc_status: null,
        tbc_date: null,
        malaria_status: null,
        malaria_date: null,
        leprosy_status: null,
        leprosy_date: null,
        std_status: null,
        std_date: null,
        asma_status: null,
        asma_date: null,
        hd_status: null,
        hd_date: null,
        hypt_status: null,
        hypt_date: null,
        dbm_status: null,
        dbm_date: null,
        ptu_status: null,
        ptu_date: null,
        kidney_status: null,
        kidney_date: null,
        cancer_status: null,
        cancer_date: null,
        epylepsy_status: null,
        epylepsy_date: null,
        psin_status: null,
        psin_date: null,
        hepo_status: null,
        hepo_date: null,
        hpts_status: null,
        hpts_date: null,
        other_status: null,
        other_date: null,
        snf_status: null,
        nyd_status: null,
        dbj_status: null,
        pbk_status: null,
        rspks_status: null,
        hmp_status: null,
        ksm_status: null,
        rhb_sbk_status: null,
        gskl_status: null,
        kcuv_status: null,
        nsm_status: null,
        mpbw_status: null,
        rkk_status: null,
        pkln_status: null,
        dfab_status: null,
        anemia_status: null,
        pkn_status: null,
        tb_mt_kanan: null,
        db_mt_kanan: null,
        tgp_kanan: null,
        kbw_kanan: null,
        tb_mt_kiri: null,
        db_mt_kiri: null,
        tgp_kiri: null,
        kbw_kiri: null,
        ukj_status: null,
        saj_status: null,
        tl_jantung: null,
        sps_status: null,
        tl_sps: null,
        hati_status: null,
        limpa_status: null,
        ginjal_status: null,
        pbk_sp_status: null,
        tl_sp: null,
        pr_sp_status: null,
        smu_status: null,
        berbicara_status: null,
        fk_status: null,
        usp_status: null,
        km_status: null,
        sensorik_status: null,
        reflek_status: null,
        psg_pbn_status: null,
        luka_status: null,
        elisa_status: null,
        hbsag_status: null,
        hct_status: null,
        vdrl_tpha_status: null,
        pama_status: null,
        pafil_status: null,
        ck_status: null,
        cxray_report: null,
        sptm_afb_status: null,
        serum_krtnn: null,
        warna_urin: null,
        gravitasi_spesifik: null,
        gula_status: null,
        albumin_status: null,
        pm_miros: null,
        oga_status: null,
        kehamilan_status: null,
        urus_status: null,
        stm_hiv_status: null,
        stm_tbc_status: null,
        stm_malaria_status: null,
        stm_kusta_status: null,
        stm_pms_status: null,
        stm_hpb_status: null,
        stm_hpc_status: null,
        stm_filariasis_status: null,
        gpu_status: null,
        stm_pkl_status: null,
        urine_oka_status: null,
        dsh_status: null,
        sehat_bekerja_status: null,
        rekom_status: null,
        rekom_alasan: null,
        dokter: null,
        masa_berlaku: null,
        sampai_dengan: null,
        createdAt: null,
        updatedAt: null,
        blanko_id: null
      }
    },
    blankoPraAll: [],
    blankoFullAll: [],
    sisaPembyaran: '',
    form: {
      receipt: '',
      patient: []
    }
  }
}

const receiptsModules = {
  state: receipt_init,

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
    },
    getRekapStatus: (state) => state.rekap.status,
    getBlankoPra: (state) => state.blankoPra,
    getBlankoFull: (state) => state.blankoFull,
    getBlankoAllPra: (state) => state.blankoPraAll,
    getBlankoAllFull: (state) => state.blankoFullAll
  },

  mutations: {
    resetBlankoPra: (state) => Object.assign(state.blankoPra, receipt_init().blankoPra),
    resetBlankoFull: (state) => Object.assign(state.blankoFull, receipt_init().blankoFull),
    resetRekap: (state) => Object.assign(state.rekap, receipt_init().rekap),
    resetAllBlankoPra: (state) => (state.blankoPraAll = []),
    resetAllBlankoFull: (state) => (state.blankoFullAll = []),
    setReceipts: (state, receipts) => (state.receipts = receipts),
    setRekap: (state, rekap) => (state.rekap = rekap),
    setBlankoPra: (state, blankoPra) => (state.blankoPra = blankoPra),
    setBlankoFull: (state, blankoFull) => (state.blankoFull = blankoFull),
    setAllBlankoPra: (state, blankoAll) => (state.blankoPraAll = blankoAll),
    setAllBlankoFull: (state, blankoAll) => (state.blankoFullAll = blankoAll),
    setRekapTotalPembayaranPasien: (state, data) => (state.rekap.total_harga = data),
    setEditNamaPj: (state, data) => (state.rekap.nama_penanggungjawab = data),
    setEditNamaSponsor: (state, data) => (state.rekap.nama_sponsor = data),
    setEditNoForm(state, newValue) {
      state.rekap.pasien_tkis.no_form = newValue
    },
    setEditJk: (state, newValue) => (state.rekap.pasien_tkis.jenis_kelamin = newValue),
    setEditUsia: (state, newValue) => (state.rekap.pasien_tkis.usia = newValue),

    setFormEditPasien: (state, data) => (state.form.patient = data),
    setFormEditKuitansi: (state, data) => (state.form.receipt = { ...data, print_status: false }),
    setRekapStatus: (state, data) => (state.rekap.status = data)

    //NOTE - setFormKuitansiForCetak (Masih belum digunakan )
    // setFormKuitansiForCetak: (state, data) => (state.form.receipt = {...data, print_status:true}),
  },
  actions: {
    async fetchReceipts({ commit, rootGetters }) {
      try {
        // Mengirimkan permintaan GET ke API untuk mendapatkan data kwitansi
        const stringAccessToken = JSON.stringify(rootGetters.getAccessToken)
        const tokenData = JSON.parse(stringAccessToken)
        commit('setAlertData', { message: 'Mengambil data', type: 'info', isLoading: false })

        const response = await axios.get(`${env.VITE_API_BASE_URL}/receipt`, {
          headers: {
            Authorization: `Bearer ${tokenData.token}`
          }
        })

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
        // Menyimpan data yang diterima dari API ke dalam state receipts
        commit('setReceipts', response.data.data)
      } catch (e) {
        return e
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
        const rekapData = response.data.data
        rekapData.tanggal = formatTanggal(rekapData.tanggal)
        commit('setRekap', { ...rekapData, status: true })
        return response.data
      } catch (e) {
        return e
      }
    },

    async fetchBlankoPra({ commit, rootGetters }, pasien_uuid) {
      try {
        const stringAccessToken = JSON.stringify(rootGetters.getAccessToken)
        const tokenData = JSON.parse(stringAccessToken)

        const response = await axios.get(
          `${env.VITE_API_BASE_URL}/blanko/one/${pasien_uuid}?type=pra`,
          {
            headers: {
              Authorization: `Bearer ${tokenData.token}`
            }
          }
        )
        const blankoPraData = response.data.data
        blankoPraData.tanggal_lahir = formatTanggal(blankoPraData.tanggal_lahir)
        blankoPraData.tanggal_cetak = formatTanggal(blankoPraData.tanggal_cetak)
        blankoPraData.masa_berlaku = formatTanggal(blankoPraData.masa_berlaku)
        blankoPraData.sampai_dengan = formatTanggal(blankoPraData.sampai_dengan)
        commit('setBlankoPra', { ...blankoPraData, status: true })
        return response
      } catch (e) {
        commit('setAlertData', {
          message: e.response.data.message || e,
          type: 'error',
          isLoading: false
        })
        return e
      }
    },

    async fetchBlankoFull({ commit, rootGetters }, pasien_uuid) {
      try {
        const stringAccessToken = JSON.stringify(rootGetters.getAccessToken)
        const tokenData = JSON.parse(stringAccessToken)

        const response = await axios.get(
          `${env.VITE_API_BASE_URL}/blanko/one/${pasien_uuid}?type=full`,
          {
            headers: {
              Authorization: `Bearer ${tokenData.token}`
            }
          }
        )

        const blankoFullData = response.data.data
        blankoFullData.tanggal_lahir = formatTanggal(blankoFullData.tanggal_lahir)
        blankoFullData.tanggal_cetak = formatTanggal(blankoFullData.tanggal_cetak)
        blankoFullData.masa_berlaku = formatTanggal(blankoFullData.masa_berlaku)
        blankoFullData.sampai_dengan = formatTanggal(blankoFullData.sampai_dengan)
        commit('setBlankoFull', { ...blankoFullData, status: true })
        return response
      } catch (e) {
        commit('setAlertData', {
          message: e.response.data.message || e,
          type: 'error',
          isLoading: false
        })
        return e
      }
    },

    async fetchAllBlankoPras({ commit, rootGetters }, pasiens) {
      try {
        const stringAccessToken = JSON.stringify(rootGetters.getAccessToken)
        const tokenData = JSON.parse(stringAccessToken)
        let isError = false
        let blankoPraAll = []
        for (let i = 0; i < pasiens.length; i++) {
          const response = await axios.get(
            `${env.VITE_API_BASE_URL}/blanko/one/${pasiens[i]}?type=pra`,
            {
              headers: {
                Authorization: `Bearer ${tokenData.token}`
              }
            }
          )
          if (response.status !== 200) {
            new Error(response)
            isError = true
            break
          }
          const blankoPraData = response.data.data
          blankoPraData.masa_berlaku = formatTanggal(blankoPraData.masa_berlaku)
          blankoPraData.tanggal_lahir = formatTanggal(blankoPraData.tanggal_lahir)
          blankoPraData.tanggal_cetak = formatTanggal(blankoPraData.tanggal_cetak)
          blankoPraData.sampai_dengan = formatTanggal(blankoPraData.sampai_dengan)
          blankoPraAll.push(blankoPraData)
        }
        commit('setAlertData', {
          message: 'Data Blanko Pra Berhasil diambil!',
          type: 'success',
          isLoading: false
        })

        commit('setAllBlankoPra', { ...blankoPraAll })
        return !isError
      } catch (e) {
        commit('setAlertData', {
          message: e.response.data.message || e,
          type: 'error',
          isLoading: false
        })
        return false
      }
    },

    async fetchAllBlankoFull({ commit, rootGetters }, pasiens) {
      try {
        const stringAccessToken = JSON.stringify(rootGetters.getAccessToken)
        const tokenData = JSON.parse(stringAccessToken)
        let blankoFullAll = []
        let isError = false
        for (let i = 0; i < pasiens.length; i++) {
          const response = await axios.get(
            `${env.VITE_API_BASE_URL}/blanko/one/${pasiens[i]}?type=full`,
            {
              headers: {
                Authorization: `Bearer ${tokenData.token}`
              }
            }
          )
          if (response.status !== 200) {
            new Error(response)
            isError = true
            break
          }
          const blankoFullData = response.data.data
          blankoFullData.masa_berlaku = formatTanggal(blankoFullData.masa_berlaku)
          blankoFullData.tanggal_lahir = formatTanggal(blankoFullData.tanggal_lahir)
          blankoFullData.tanggal_cetak = formatTanggal(blankoFullData.tanggal_cetak)
          blankoFullData.sampai_dengan = formatTanggal(blankoFullData.sampai_dengan)
          blankoFullAll.push(blankoFullData)
        }
        commit('setAlertData', {
          message: 'Data Blanko Full Berhasil diambil!',
          type: 'success',
          isLoading: false
        })

        commit('setAllBlankoFull', { ...blankoFullAll })
        return !isError
      } catch (e) {
        commit('setAlertData', {
          message: e.response.data.message || e,
          type: 'error',
          isLoading: false
        })
        return false
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
      } catch (e) {
        return e
      }
    }
  }
}

export default receiptsModules
