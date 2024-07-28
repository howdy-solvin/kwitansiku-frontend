import { createStore } from 'vuex'
import authModules from './auth'
import pasienModules from './pasien'
import receiptsModules from './receipts'
import toastModules from './toast'
import blankoModules from './blanko'

const store = createStore({
  root: true,
  modules: {
    auth: authModules,
    pasien: pasienModules,
    receipts: receiptsModules,
    toast: toastModules,
    blanko: blankoModules
  }
})

export default store
