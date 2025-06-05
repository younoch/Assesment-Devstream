// src/composables/useToast.ts
import { inject } from 'vue';
import type { ToastAPI } from '@/plugins/toast';

export function useToast() {
  const toast = inject<ToastAPI>('toast');
  
  if (!toast) {
    throw new Error('Toast plugin not installed');
  }
  
  return toast;
}