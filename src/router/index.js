// router.js
import { createRouter, createWebHistory } from 'vue-router';
import TheWelcome from '@/views/TheWelcome.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import DashboardView from '@/views/DashboardView.vue';
import HomeView from '@/views/HomeView.vue';
import PasienTki from '@/views/pasien/PasienTki.vue';
import PasienUmum from '@/views/pasien/PasienUmum.vue';
import RekapKwitansi from '@/views/RekapKwitansi.vue';

const routes = [
  { path: '/', name:'Welcome', component: TheWelcome },
  { path: '/login', name:'Login', component: LoginView},
  {path: '/register', name:'Register', component: RegisterView},
  {
    path: '/dashboard', 
    name:'Dashboard', 
    component: DashboardView, 
    children:[
      {
        path: "",
        name:'Home', 
        component: HomeView, 
      },
      {
        path: '/pasien-tki',
        name:'Tki',
        component: PasienTki, 
      },
      {
        path: '/pasien-umum',
        name:'Umum',
        component: PasienUmum, 
      },
      {
        path: '/rekap-kwitansi',
        name:'RekapKwitansi',
        component: RekapKwitansi, 
      }
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach((to, from, next) => {
  const isAuthenticated = JSON.parse(localStorage.getItem('accessToken'))
  if (to.name !== "Login" && !isAuthenticated) next({name: "Login"})
  if (to.name === "Login" && isAuthenticated) next({name: "Home"})
  else next()
})

export default router;