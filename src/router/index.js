// router.js
import { createRouter, createWebHistory } from 'vue-router';
import TheWelcome from '@/views/TheWelcome.vue';
import LoginForm from '@/views/LoginForm.vue';


const routes = [
  { path: '/', component: TheWelcome },
  { path: '/login', component: LoginForm}
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;