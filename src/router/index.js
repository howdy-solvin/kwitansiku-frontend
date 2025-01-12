// router.js
import { createRouter, createWebHistory } from 'vue-router'
import TheWelcome from '@/views/TheWelcome.vue'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import HomeView from '@/views/HomeView.vue'
import PasienTki from '@/views/pasien/PasienTki.vue'
import PasienUmum from '@/views/pasien/PasienUmum.vue'
import RekapKwitansi from '@/views/RekapKwitansi.vue'
import BlankoKwitansi from '@/views/BlankoView.vue'
import store from '@/store'
import BlankoPraView from '@/views/print/BlankoPraView.vue'
import BlankoFullView from '@/views/print/BlankoFullView.vue'
import KwitansiView from '@/views/print/KwitansiView.vue'

const routes = [
  { path: '/', name: 'Welcome', component: TheWelcome },
  { path: '/login', name: 'Login', component: LoginView },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    children: [
      {
        path: '',
        name: 'Home',
        component: HomeView
      },
      {
        path: '/pasien-tki',
        name: 'Tki',
        component: PasienTki
      },
      {
        path: '/pasien-umum',
        name: 'Umum',
        component: PasienUmum
      },
      {
        path: '/rekap-kwitansi',
        name: 'RekapKwitansi',
        component: RekapKwitansi
      },
      {
        path: '/blanko-kwitansi',
        name: 'BlankoKwitansi',
        component: BlankoKwitansi
      }
    ]
  },
  {
    path: '/print/blanko-pra',
    name: 'PrintBlankoPra',
    component: BlankoPraView,
  },
  {
    path: '/print/blanko-full',
    name: 'PrintBlankoFull',
    component: BlankoFullView,
  },
  {
    path: '/print/kwitansi',
    name: 'PrintKwitansi',
    component: KwitansiView,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  let isAuthenticated = store.getters['isAuthenticated']
  let token = localStorage.getItem('accessToken')

  if (token && (await store.dispatch('isTokenExpired', token))) {
    try {
      await store.dispatch('refreshToken')
      isAuthenticated = true
    } catch (error) {
      store.commit('clearAuthData')
      isAuthenticated = false
    }
  }

  if (!isAuthenticated) {
    if (to.name !== 'Login' && to.name !== 'Register' && to.name !== 'Welcome') {
      next({ name: 'Login' })
    } else {
      next()
    }
  } else if (to.name === 'Login' || to.name === 'Register' || to.name === 'Welcome') {
    next({ name: 'Home' })
    console.log('login successful')
  } else {
    next()
  }
})

export default router
