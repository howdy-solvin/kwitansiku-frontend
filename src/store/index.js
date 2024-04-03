import { createStore } from 'vuex';
import authModules from './auth';
import pasienModules from './pasien';
import receiptsModules from './receipts';

const store = createStore({
  modules: {
    auth: authModules,
    pasien: pasienModules,
    receipts: receiptsModules,
  },
});

export default store;