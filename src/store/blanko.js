import axios from 'axios'

const env = import.meta.env

const instance = axios.create({
  baseURL: env.VITE_API_BASE_URL
})

const blanko_init = () => {
  return {
    form: {
      pra: {
        type: 'create', // create | update
        blanko_pra: {
          id: '',
          tinggi: '',
          berat: '',
          mata_kanan: '',
          mata_kiri: '',
          tekanan_darah_atas: '',
          tekanan_darah_bawah: '',
          tekanan_darah_nadi: '',
          golongan_darah: '',
          suhu_tubuh: '',
          rontgen: '',
          gula: '',
          protein: '',
          ph: '',
          hbs_ag: '',
          vdrl: '',
          tpha: '',
          thorax_pa: '',
          hasil: '',
          keterangan: '',
          pic: ''
        },
        blanko_main: {
          uuid: '',
          pasien_id: '',
          tanggal_lahir: '',
          bn_bt: '',
          tanggal_cetak: '',
          usia: '',
          status: '',
          jenis_kelamin: '',
          negara: '',
          provinsi: '',
          daerah: '',
          pekerjaan_negara_tujuan: '',
          no_visa: '',
          no_passpor: '',
          masa_berlaku: '',
          sampai_dengan: '',
          status_blanko: '',
          image_content_type: '',
          base64_image: ''
        }
      },
      full: {
        type: 'create', // create | update
        blanko_id: '',
        hiv_status: false,
        hiv_date: '',
        tbc_status: false,
        tbc_date: '',
        malaria_status: false,
        malaria_date: '',
        leprosy_status: false,
        leprosy_date: '',
        std_status: false,
        std_date: '',
        asma_status: false,
        asma_date: '',
        hd_status: false,
        hd_date: '',
        hypt_status: false,
        hypt_date: '',
        dbm_status: false,
        dbm_date: '',
        ptu_status: false,
        ptu_date: '',
        kidney_status: false,
        kidney_date: '',
        cancer_status: false,
        cancer_date: '',
        epylepsy_status: false,
        epylepsy_date: '',
        psin_status: false,
        psin_date: '',
        hepo_status: false,
        hepo_date: '',
        hpts_status: false,
        hpts_date: '',
        other_status: false,
        other_date: '',
        snf_status: false,
        nyd_status: false,
        dbj_status: false,
        pbk_status: false,
        rspks_status: false,
        hmp_status: false,
        ksm_status: false,
        rhb_sbk_status: false,
        gskl_status: false,
        kcuv_status: false,
        nsm_status: false,
        mpbw_status: false,
        rkk_status: false,
        pkln_status: false,
        dfab_status: false,
        anemia_status: false,
        pkn_status: false,
        tb_mt_kanan: false,
        db_mt_kanan: false,
        tgp_kanan: false,
        kbw_kanan: false,
        tb_mt_kiri: false,
        db_mt_kiri: false,
        tgp_kiri: false,
        kbw_kiri: false,
        ukj_status: false,
        saj_status: false,
        tl_jantung: '',
        sps_status: false,
        tl_sps: '',
        hati_status: false,
        limpa_status: false,
        ginjal_status: false,
        pbk_sp_status: false,
        tl_sp: '',
        pr_sp_status: false,
        smu_status: false,
        berbicara_status: false,
        fk_status: false,
        usp_status: false,
        km_status: false,
        sensorik_status: false,
        reflek_status: false,
        psg_pbn_status: false,
        luka_status: false,
        elisa_status: false,
        hbsag_status: false,
        hct_status: false,
        vdrl_tpha_status: false,
        pama_status: false,
        pafil_status: false,
        ck_status: false,
        cxray_report: '',
        sptm_afb_status: false,
        serum_krtnn: '',
        warna_urin: '',
        gravitasi_spesifik: '',
        gula_status: false,
        albumin_status: false,
        pm_miros: '',
        oga_status: false,
        kehamilan_status: false,
        urus_status: false,
        stm_hiv_status: false,
        stm_tbc_status: false,
        stm_malaria_status: false,
        stm_kusta_status: false,
        stm_pms_status: false,
        stm_hpb_status: false,
        stm_hpc_status: false,
        stm_filariasis_status: false,
        gpu_status: false,
        stm_pkl_status: false,
        urine_oka_status: false,
        dsh_status: false,
        sehat_bekerja_status: false,
        rekom_status: false,
        rekom_alasan: '',
        dokter: '',
        masa_berlaku: '',
        sampai_dengan: ''
      }
    },

    receipt: {
      id: 0,
      uuid: '',
      no_pendaftaran: '',
      tanggal: '',
      nama_penanggungjawab: '',
      nama_sponsor: '',
      keterangan: '',
      total_pendaftar: 0,
      total_harga: 0,
      total_pembayaran: 0,
      print_status: false,
      pasien_tkis: []
    },

    selected_receipt: {
      id: 0,
      uuid: '',
      no_pendaftaran: '',
      tanggal: '',
      nama_penanggungjawab: '',
      nama_sponsor: '',
      keterangan: '',
      total_pendaftar: 0,
      total_harga: 0,
      total_pembayaran: 0,
      print_status: false,
      pasien_tkis: []
    },

    pasien_full: []
  }
}

const blankoModules = {
  state: blanko_init,

  getters: {
    getReceipt: (state) => state.receipt,
    getPraData: (state) => state.form.pra,
    getFullData: (state) => state.form.full,
    getListPasien: (state) => state.receipt.pasien_tkis,
    getBlankoUUID: (state) => state.form.pra.blanko_main.uuid,
    getListPasienFull: (state) => state.pasien_full,
    getSelectedReceipt: (state) => state.selected_receipt
  },

  mutations: {
    //!SECTION - Mutations for handle pra medical
    setDataDiri(state, data) {
      state.form.pra.blanko_main = {
        ...state.form.pra.blanko_main,
        ...data
      }
    },
    setAlamat(state, data) {
      state.form.pra.blanko_main = {
        ...state.form.pra.blanko_main,
        ...data
      }
    },
    setFisik(state, data) {
      state.form.pra.blanko_pra = {
        ...state.form.pra.blanko_pra,
        ...data
      }
    },
    setLaboratorium(state, data) {
      state.form.pra.blanko_pra = {
        ...state.form.pra.blanko_pra,
        ...data
      }
    },
    setRadiologi(state, data) {
      state.form.pra.blanko_pra = {
        ...state.form.pra.blanko_pra,
        ...data
      }
    },
    setHasilPemeriksaan(state, data) {
      state.form.pra.blanko_pra = {
        ...state.form.pra.blanko_pra,
        ...data
      }
    },
    setFoto(state, foto) {
      state.form.pra.blanko_main.base64_image = foto
    },
    setImageType(state, mimeType) {
      state.form.pra.blanko_main.image_content_type = mimeType
    },
    setStatusMedical(state, data) {
      state.form.pra.blanko_main.status_blanko = data
    },

    setFormPra(state, data) {
      state.form.pra = { ...state.form.pra, ...data }
    },

    setFormFull(state, data) {
      state.form.full = { ...state.form.full, ...data }
    },

    setSelectedReceipt(state, data) {
      state.selected_receipt = data
    },

    resetSelectedReceipt(state) {
      Object.assign(state.selected_receipt, blanko_init().selected_receipt)
    },

    resetFormPra(state) {
      Object.assign(state.form.pra, blanko_init().form.pra)
    },

    resetFormFull(state) {
      Object.assign(state.form.full, blanko_init().form.full)
    },

    resetReceipt(state) {
      Object.assign(state.receipt, blanko_init().receipt)
    },

    resetPasienFull(state) {
      Object.assign(state.pasien_full, blanko_init().pasien_full)
    },

    //!SECTION - Mutations for handle full medical
    statusHiv(state, value) {
      state.form.full.riwayat_kesehatan.hiv.hivStatus = value
    },

    //!SECTION - set state Receipt
    setDataReceipt(state, data) {
      state.receipt = data
    },

    setPasienFull(state, data) {
      state.pasien_full = data
    }
  },

  actions: {
    //SECTION - fetching blanko
    async getReceiptId({ commit, rootGetters }, uuid) {
      try {
        // Mengirimkan permintaan GET ke API untuk mendapatkan data kwitansi
        const stringAccessToken = JSON.stringify(rootGetters.getAccessToken)
        const tokenData = JSON.parse(stringAccessToken)
        commit('setAlertData', { message: 'Mengambil data', type: 'info', isLoading: false })

        const response = await instance.get(`/receipt/one/${uuid}`, {
          headers: {
            Authorization: `Bearer ${tokenData.token}`
          }
        })

        response.status === 200
          ? commit('setDataReceipt', {
              message: response.data.message,
              type: 'success',
              isLoading: false
            })
          : commit('setDataReceipt', {
              message: response.data.message,
              type: 'error',
              isLoading: false
            })
        // Menyimpan data yang diterima dari API ke dalam state receipts
        commit('setDataReceipt', response.data.data)
      } catch (error) {
        return error
      }
    },

    async getSelectedReceipt({ commit, rootGetters }, uuid) {
      try {
        // Mengirimkan permintaan GET ke API untuk mendapatkan data kwitansi
        const stringAccessToken = JSON.stringify(rootGetters.getAccessToken)
        const tokenData = JSON.parse(stringAccessToken)

        const response = await instance.get(`/receipt/one/${uuid}`, {
          headers: {
            Authorization: `Bearer ${tokenData.token}`
          }
        })

        response.status === 200
          ? commit('setSelectedReceipt', {
              message: response.data.message,
              type: 'success',
              isLoading: false
            })
          : commit('setSelectedReceipt', {
              message: response.data.message,
              type: 'error',
              isLoading: false
            })
        // Menyimpan data yang diterima dari API ke dalam state receipts
        commit('setSelectedReceipt', response.data.data)
      } catch (error) {
        return error
      }
    },

    async createPraMedical({ rootGetters }, data) {
      try {
        const stringAccessToken = JSON.stringify(rootGetters.getAccessToken)
        const tokenData = JSON.parse(stringAccessToken)

        // eslint-disable-next-line no-undef
        const response = await instance.post('/blanko/create/pra', data, {
          headers: {
            Authorization: `Bearer ${tokenData.token}`
          }
        })
        console.log('hasil respon', response)
        return response
      } catch (error) {
        return error
      }
    },

    async updatePraMedical({ rootGetters }, data) {
      try {
        const stringAccessToken = JSON.stringify(rootGetters.getAccessToken)
        const tokenData = JSON.parse(stringAccessToken)

        if (data.blanko_main.base64_image.startsWith('data:')) {
          data.blanko_main.base64_image = data.blanko_main.base64_image.split(',')[1]
        }

        // eslint-disable-next-line no-undef
        const response = await instance.put('/blanko/update/pra', data, {
          headers: {
            Authorization: `Bearer ${tokenData.token}`
          }
        })
        console.log('hasil respon', response)
        return response
      } catch (error) {
        return error
      }
    },

    async createFullMedical({ rootGetters }, data) {
      try {
        const stringAccessToken = JSON.stringify(rootGetters.getAccessToken)
        const tokenData = JSON.parse(stringAccessToken)

        // eslint-disable-next-line no-undef
        const response = await instance.post('/blanko/create/full', data, {
          headers: {
            Authorization: `Bearer ${tokenData.token}`
          }
        })
        console.log('hasil respon', response)
        return response
      } catch (error) {
        return error
      }
    },

    async updateFullMedical({ rootGetters }, data) {
      try {
        const stringAccessToken = JSON.stringify(rootGetters.getAccessToken)
        const tokenData = JSON.parse(stringAccessToken)

        // eslint-disable-next-line no-undef
        const response = await instance.put('/blanko/update/full', data, {
          headers: {
            Authorization: `Bearer ${tokenData.token}`
          }
        })
        console.log('hasil respon', response)
        return response
      } catch (error) {
        return error
      }
    },

    async getOneBlankoPra({ commit, rootGetters }, uuid_pasien) {
      try {
        const stringAccessToken = JSON.stringify(rootGetters.getAccessToken)
        const tokenData = JSON.parse(stringAccessToken)
        const response = await instance.get(`/blanko/one/${uuid_pasien}?type=pra`, {
          headers: {
            Authorization: `Bearer ${tokenData.token}`
          }
        })
        if (response.status === 200)
          commit('setFormPra', {
            blanko_pra: {
              id: response.data.data.blanko_pra.id,
              tinggi: response.data.data.blanko_pra.tinggi,
              berat: response.data.data.blanko_pra.berat,
              mata_kanan: response.data.data.blanko_pra.mata_kanan,
              mata_kiri: response.data.data.blanko_pra.mata_kiri,
              tekanan_darah_atas: response.data.data.blanko_pra.tekanan_darah_atas,
              tekanan_darah_bawah: response.data.data.blanko_pra.tekanan_darah_bawah,
              tekanan_darah_nadi: response.data.data.blanko_pra.tekanan_darah_nadi,
              golongan_darah: response.data.data.blanko_pra.golongan_darah,
              suhu_tubuh: response.data.data.blanko_pra.suhu_tubuh,
              rontgen: response.data.data.blanko_pra.rontgen,
              gula: response.data.data.blanko_pra.gula,
              protein: response.data.data.blanko_pra.protein,
              ph: response.data.data.blanko_pra.ph,
              hbs_ag: response.data.data.blanko_pra.hbs_ag,
              vdrl: response.data.data.blanko_pra.vdrl,
              tpha: response.data.data.blanko_pra.tpha,
              thorax_pa: response.data.data.blanko_pra.thorax_pa,
              hasil: response.data.data.blanko_pra.hasil,
              keterangan: response.data.data.blanko_pra.keterangan,
              pic: response.data.data.blanko_pra.pic
            },
            blanko_main: {
              pasien_id: response.data.data.pasien_id,
              tanggal_lahir: response.data.data.tanggal_lahir,
              bn_bt: response.data.data.bn_bt,
              tanggal_cetak: response.data.data.tanggal_cetak,
              usia: response.data.data.usia,
              status: response.data.data.status,
              jenis_kelamin: response.data.data.jenis_kelamin,
              negara: response.data.data.negara,
              provinsi: response.data.data.provinsi,
              daerah: response.data.data.daerah,
              pekerjaan_negara_tujuan: response.data.data.pekerjaan_negara_tujuan,
              no_visa: response.data.data.no_visa,
              no_passpor: response.data.data.no_passpor,
              masa_berlaku: response.data.data.masa_berlaku,
              sampai_dengan: response.data.data.sampai_dengan,
              status_blanko: response.data.data.status_blanko,
              image_content_type: response.data.data.image_content_type,
              base64_image: response.data.data.image_blob
            },
            type: 'update'
          })
        return response
      } catch (error) {
        return error
      }
    },

    async getOneBlankoFull({ commit, rootGetters }, { uuid_pasien, blanko_uuid }) {
      try {
        commit('resetFormFull')
        const stringAccessToken = JSON.stringify(rootGetters.getAccessToken)
        const tokenData = JSON.parse(stringAccessToken)
        const response = await instance.get(`/blanko/one/${uuid_pasien}?type=full`, {
          headers: {
            Authorization: `Bearer ${tokenData.token}`
          }
        })
        response.status === 200
          ? commit('setFormFull', { ...response.data.data.blanko_full, type: 'update' })
          : commit('setFormFull', { blanko_id: blanko_uuid, type: 'create' })
        return response
      } catch (error) {
        commit('setFormFull', { blanko_id: blanko_uuid, type: 'create' })
        return error
      }
    },

    async checkCreatedBlankoPra({ rootGetters, getters, commit }) {
      try {
        const stringAccessToken = JSON.stringify(rootGetters.getAccessToken)
        const tokenData = JSON.parse(stringAccessToken)
        const uuid_pasiens = getters.getListPasien.map((pasien) => pasien.uuid)
        const response = await instance.post(
          `/blanko/check/pra`,
          { pasien_uuid: uuid_pasiens },
          {
            headers: {
              Authorization: `Bearer ${tokenData.token}`
            }
          }
        )

        if (response.status === 200) commit('setPasienFull', response.data.data)

        return response
      } catch (error) {
        return error
      }
    }
  }
}

export default blankoModules
