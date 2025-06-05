// src/types/toast.d.ts
export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

export interface ToastAPI {
  show(options: ToastOptions): void;
  info(message: string, duration?: number): void;
  success(message: string, duration?: number): void;
  warning(message: string, duration?: number): void;
  error(message: string, duration?: number): void;
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $toast: ToastAPI;
  }
}