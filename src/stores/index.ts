// stores/index.ts
import { createPinia } from 'pinia';
import { useProductStore } from './product';
import { useAuthStore } from './auth';

const pinia = createPinia();

export { useProductStore, useAuthStore };
export default pinia;