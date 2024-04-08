import { createStore } from 'vuex'
import authModules from './auth'
import pasienModules from './pasien'
import receiptsModules from './receipts'
import toastModules from './toast'

const store = createStore({
  root: true,
  modules: {
    auth: authModules,
    pasien: pasienModules,
    receipts: receiptsModules,
    toast: toastModules
  }
})

export default store
