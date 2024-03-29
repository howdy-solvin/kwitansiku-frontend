import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import  authStore  from './store/auth'


const app = createApp(App)
app.use(router)
app.use(authStore)
app.mount('#app')
