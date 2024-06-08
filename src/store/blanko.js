const blankoModules = {
    state: {
        form: {
            pra: {
                dataDiri: {
                    foto: [],
                    nama_pasien: "",
                    bn_bt: "",
                    tgl_cetak: "",
                    tgl_lahir: "",
                    usia: "",
                    kelamin: "",
                    status: "",
                },
                alamat: {
                    negara: "",
                    provinsi: "",
                    daerah: "",
                    pekerjaan_negara_tujuan: "",
                    no_visa: "",
                    no_passport: "",
                    masa_berlaku: "",
                    sampai_dengan: "",
                },
                fisik: {
                    tinggi: "",
                    berat: "",
                    kanan: "",
                    kiri: "",
                    atas: "",
                    bawah: "",
                    nadi: "",
                    gol: "",
                    suhu_tubuh: "",
                    rontgen: "",
                },
                laboratorium: {
                    gula: "",
                    ph: "",
                    vdrl: "",
                    protein: "",
                    hbs_ag: "",
                    tpha: "",
                },
                radiologi: {
                    thorax_pa: "",
                },
                hasil_pemeriksaan: {
                    hasil: "",
                    keterangan: "",
                    status: "",
                    penanggung_jawab: "",
                },
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
    },

    mutations: {

        //!SECTION - Mutations for handle pra medical
        setDataDiri(state, data) {
            state.form.pra.dataDiri = {
                ...state.form.pra.dataDiri,
                ...data
            }
        },
        setAlamat(state, data) {
            state.form.pra.alamat = {
                ...state.form.pra.alamat,
                ...data
            }
        },
        setFisik(state, data) {
            state.form.pra.fisik = {
                ...state.form.pra.fisik,
                ...data
            }

        },
        setLaboratorium(state, data) {
            state.form.pra.laboratorium = {
                ...state.form.pra.laboratorium,
                ...data
            }
        },
        setRadiologi(state, data) {
            state.form.pra.radiologi = {
                ...state.form.pra.radiologi,
                ...data
            }
        },
        setHasilPemeriksaan(state, data) {
            state.form.pra.hasil_pemeriksaan = {
                ...state.form.pra.hasil_pemeriksaan,
                ...data
            }
        },
        setFoto(state, foto) {
            state.form.pra.dataDiri.foto = foto;
        },

        //!SECTION - Mutations for handle full medical
        statusHiv(state, value) {
            state.form.full.riwayat_kesehatan.hiv.hivStatus = value
        },
    }
}

export default blankoModules