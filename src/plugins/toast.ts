// plugins/toast.ts
import { createApp, h, App, ComponentPublicInstance } from 'vue';
import Toast from '@/components/Toast.vue';

type ToastType = 'info' | 'success' | 'warning' | 'error';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastAPI {
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

const toast: ToastAPI = {
  show(options: ToastOptions) {
    const defaultOptions: Partial<ToastOptions> = {
      type: 'info',
      duration: 3000
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    const toastApp = createApp({
      render() {
        return h(Toast, mergedOptions);
      }
    });
    
    const mountPoint = document.createElement('div');
    document.body.appendChild(mountPoint);
    const instance = toastApp.mount(mountPoint) as ComponentPublicInstance;
    
    setTimeout(() => {
      toastApp.unmount();
      document.body.removeChild(mountPoint);
    }, mergedOptions.duration);
  },
  
  info(message: string, duration: number = 3000) {
    this.show({ message, type: 'info', duration });
  },
  
  success(message: string, duration: number = 3000) {
    this.show({ message, type: 'success', duration });
  },
  
  warning(message: string, duration: number = 3000) {
    this.show({ message, type: 'warning', duration });
  },
  
  error(message: string, duration: number = 3000) {
    this.show({ message, type: 'error', duration });
  }
};

export default {
  install(app: App) {
    app.config.globalProperties.$toast = toast;
    app.provide('toast', toast);
  }
};