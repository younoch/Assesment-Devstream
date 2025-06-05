// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const Login = () => import('@/views/Login.vue');
const Products = () => import('@/views/Products.vue');

const BASE_URL = '/';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/products',
    name: 'products',
    component: Products,
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    redirect: '/products'
  }
];

const router = createRouter({
  history: createWebHistory(BASE_URL),
  routes
});

  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next({ name: 'login', query: { redirect: to.fullPath } });
    } else if (to.name === 'login' && authStore.isAuthenticated) {
      next({ name: 'products' });
    } else {
      next();
    }
  });

export default router;
