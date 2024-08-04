// router.js
import { createRouter, createWebHistory } from 'vue-router';
import TheWelcome from '@/views/TheWelcome.vue';
import LoginView from '@/views/LoginView.vue';
import DashboardView from '@/views/DashboardView.vue';
import HomeView from '@/views/HomeView.vue';
import PasienTki from '@/views/pasien/PasienTki.vue';
import PasienUmum from '@/views/pasien/PasienUmum.vue';
import RekapKwitansi from '@/views/RekapKwitansi.vue';
import BlankoKwitansi from '@/views/BlankoView.vue';
import store from '@/store';

const routes = [
  { path: '/', name: 'Welcome', component: TheWelcome },
  { path: '/login', name: 'Login', component: LoginView },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    children: [
      {
        path: "",
        name: 'Home',
        component: HomeView,
      },
      {
        path: '/pasien-tki',
        name: 'Tki',
        component: PasienTki,
      },
      {
        path: '/pasien-umum',
        name: 'Umum',
        component: PasienUmum,
      },
      {
        path: '/rekap-kwitansi',
        name: 'RekapKwitansi',
        component: RekapKwitansi,
      },
      {
        path: '/blanko-kwitansi',
        name: 'BlankoKwitansi',
        component: BlankoKwitansi,
      }
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach(async (to, from, next) => {
  const isAuthenticated = store.getters['isAuthenticated'];
  console.log('isAuthenticated', isAuthenticated);
  if (!isAuthenticated && to.name !== 'Login' && to.name !== 'Register' && to.name !== 'Welcome') {
    try {
      if (store.getters['auth/refreshToken']) {
        await store.dispatch('auth/refreshToken');
        next();
      } else {
        next({ name: 'Login' });
      }
    } catch (error) {
      next({ name: 'Login' });
    }
  } else if (to.name === 'Login' && isAuthenticated) {
    next({ name: 'Home' });
  } else {
    next();
  }
});

// async function checkAuthentication() {
//   return new Promise(resolve => {
//     const isAuthenticated = localStorage.getItem('accessToken');
//     resolve(isAuthenticated);
//   });
// }


export default router;