import axios from 'axios';

const env = import.meta.env;

// Membuat instance Axios dengan header otentikasi
const instance = axios.create({
    baseURL: env.VITE_API_BASE_URL,
});

const pasienModules = {
    state:{
        accessToken: JSON.parse(localStorage.getItem('accessToken')) || null,
        totalPembayaran: null,
        totalPembayaranPasien: null,
        regisNumber:''
    },
    getters: {
        getToken: state => state.accessToken.token,

        getRegisNumber: state => state.regisNumber,
    
        sisaPembayaran: (state) => {
            // Menghitung sisa pembayaran
            const sisa = state.totalPembayaranPasien - state.totalPembayaran;
            // Melakukan pengecekan jika sisa kurang dari 0
            if (sisa === 0) {
                return "lunas"
            } else {
                return sisa;
          }
        }
    },
    mutations:{
        setTotalPembayaran(state, data){
            state.totalPembayaran = data
        },
        setTotalPembayaranPasien(state, data){
            state.totalPembayaranPasien = data
        },
        setRegisNumber: (state, data) => state.regisNumber = data
    },

    actions:{
        async createRekap({getters}, data){
            try {
                const token = getters.getToken;
                const response = await instance.post("/receipt/create/tki", data, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                return response.data
            } catch (error) {
                return error
            }
        },
        async fetchRegistNumber({ getters }){
            try {
                const token = getters.getToken;

                const response = await instance.get('/receipt/newest-regist-number', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                return response.data
            } catch (error) {
                return error
            }
        }

    }
}

export default pasienModules