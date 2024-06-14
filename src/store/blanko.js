import axios from 'axios'

const env = import.meta.env

const instance = axios.create({
    baseURL: env.VITE_API_BASE_URL
})

const blankoModules = {
    state: {
        form: {
            pra: {
                blanko_pra: {
                    tinggi: "",
                    berat: "",
                    mata_kanan: "",
                    mata_kiri: "",
                    tekanan_darah_atas: "",
                    tekanan_darah_bawah: "",
                    tekanan_darah_nadi: "",
                    golongan_darah: "",
                    suhu_tubuh: "",
                    rontgen: "",
                    gula: "",
                    protein: "",
                    ph: "",
                    hbs_ag: "",
                    vdrl: "",
                    tpha: "",
                    thorax_pa: "",
                    hasil: "",
                    keterangan: "",
                    pic: "",
                },
                blanko_main: {
                    pasien_id: "",
                    tanggal_lahir: "",
                    bn_bt: "",
                    tanggal_cetak: "",
                    usia: "",
                    status: "",
                    jenis_kelamin: "",
                    negara: "",
                    provinsi: "",
                    daerah: "",
                    pekerjaan_negara_tujuan: "",
                    no_visa: "",
                    no_passpor: "",
                    masa_berlaku: "",
                    sampai_dengan: "",
                    status_blanko: "",
                    image_content_type: "",
                    base64_image: "",
                }
            },
            full: {
                riwayat_kesehatan: {
                    hiv: {
                        hiv_status: "",
                        tanggal: "",
                    },
                    tuberculosis: {
                        tuberculosis_status: "",
                        tanggal: "",
                    },
                    malaria: {
                        malaria_status: "",
                        tanggal: "",
                    },
                    leprosy: {
                        leprosy_status: "",
                        tanggal: "",
                    },
                    std: {
                        std_status: "",
                        tanggal: "",
                    },
                    bronchial_asthma: {
                        bronchial_asthma_status: "",
                        tanggal: "",
                    },
                    heart_disease: {
                        heart_disease_status: "",
                        tanggal: "",
                    },
                    hypertension: {
                        hypertension_status: "",
                        tanggal: "",
                    },
                    diabetes_mellitus: {
                        diabetes_mellitus_status: "",
                        tanggal: "",
                    },
                    peptic_ulcer: {
                        peptic_ulcer_status: "",
                        tanggal: "",
                    },
                    kidney_disease: {
                        kidney_disease_status: "",
                        tanggal: "",
                    },
                    cancer: {
                        cancer_status: "",
                        tanggal: "",
                    },
                    epylepsy: {
                        epylepsy_status: "",
                        tanggal: "",
                    },
                    psychiatric_illnes: {
                        psychiatric_illnes_status: "",
                        tanggal: "",
                    },
                    hearing_problem: {
                        hearing_problem_status: "",
                        tanggal: "",
                    },
                    hepatitis: {
                        hepatitis_status: "",
                        tanggal: "",
                    },
                    other: {
                        other_status: "",
                        tanggal: "",
                    },
                },
            },
        },

        receipt: []
    },

    getters: {
        getterReceipt: (state) => state.receipt,
        getPraData: (state) => state.form.pra
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
            state.form.pra.blanko_main.base64_image = foto;
        },
        setImageType(state, mimeType) {
            state.form.pra.blanko_main.image_content_type = mimeType;
        },
        setStatusMedical(state, data) {
            state.form.pra.blanko_main.status_blanko = data;
        },

        //!SECTION - Mutations for handle full medical
        statusHiv(state, value) {
            state.form.full.riwayat_kesehatan.hiv.hivStatus = value
        },


        //!SECTION - set state Receipt
        setDataReceipt(state, data) {
            state.receipt = data
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

                const response = await axios.get(`${env.VITE_API_BASE_URL}/receipt/one/${uuid}`, {
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`
                    }
                })

                response.status === 200
                    ? commit('setDataReceipt', {
                        message: response.data.message,
                        type: 'success',
                        isLoading: false,
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
                console.log('hasil respon', response);
                return response
            } catch (error) {
                return error
            }
        },
    }
}

export default blankoModules