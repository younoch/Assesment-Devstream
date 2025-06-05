// src/composables/useToast.ts
import { ToastAPI } from '@/types/toast';
import { inject } from 'vue';

export function useToast() {
  const toast = inject<ToastAPI>('toast');
  
  if (!toast) {
    throw new Error('Toast plugin not installed');
  }
  
  return toast;
}