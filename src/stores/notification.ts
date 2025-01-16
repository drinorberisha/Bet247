import { defineStore } from 'pinia';
import { ref } from 'vue';

interface NotificationOptions {
  type?: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<NotificationOptions[]>([]);

  const show = (options: NotificationOptions) => {
    const notification = {
      type: 'info',
      duration: 5000,
      position: 'top-right',
      ...options
    };
    
    notifications.value.push(notification);
    
    if (notification.duration > 0) {
      setTimeout(() => {
        remove(notification);
      }, notification.duration);
    }
  };

  const remove = (notification: NotificationOptions) => {
    const index = notifications.value.indexOf(notification);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  };

  return {
    notifications,
    show,
    remove
  };
}); 