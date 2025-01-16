<template>
  <div class="notification-container">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['notification', notification.type]"
      >
        <div class="notification-content">
          <i :class="getIconClass(notification.type)"></i>
          <span class="notification-message">{{ notification.message }}</span>
        </div>
        <button 
          class="close-button"
          @click="removeNotification(notification.id)"
          aria-label="Close notification"
        >
          <i class="icon-close"></i>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useNotificationStore } from '../../stores/notification';

const notificationStore = useNotificationStore();
const notifications = computed(() => notificationStore.notifications);

const removeNotification = (id: string) => {
  notificationStore.removeNotification(id);
};

const getIconClass = (type: string) => {
  switch (type) {
    case 'success':
      return 'icon-check-circle';
    case 'error':
      return 'icon-alert-circle';
    case 'warning':
      return 'icon-alert-triangle';
    default:
      return 'icon-info';
  }
};
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 400px;
  pointer-events: none;
}

.notification {
  background: var(--subheader);
  border: 1px solid var(--leftpreborder);
  border-radius: 8px;
  padding: 1rem;
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  padding-right: 2.5rem;
}

.notification:hover {
  transform: translateY(-1px);
  border-color: var(--active-color);
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.notification i {
  font-size: 1.2rem;
}

.notification.success {
  border-left: 4px solid var(--active-color);
}

.notification.success i {
  color: var(--active-color);
}

.notification.error {
  border-left: 4px solid var(--button-one);
}

.notification.error i {
  color: var(--button-one);
}

.notification.warning {
  border-left: 4px solid var(--active-two);
}

.notification.warning i {
  color: var(--active-two);
}

.close-button {
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  color: var(--textcolor);
  padding: 0.4rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.close-button:hover {
  color: var(--white);
  background: var(--pointbox);
}

/* Notification animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Safe area support */
@supports (padding: max(0px)) {
  .notification-container {
    padding-top: max(20px, env(safe-area-inset-top));
    padding-right: max(20px, env(safe-area-inset-right));
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .notification-container {
    top: auto;
    bottom: 20px;
    left: 20px;
    right: 20px;
  }

  .notification {
    padding: 0.8rem;
    font-size: 0.9rem;
  }

  .notification i {
    font-size: 1.1rem;
  }

  .close-button {
    top: 6px;
    right: 6px;
    width: 20px;
    height: 20px;
  }
}

/* Additional mobile safe area support */
@supports (padding: max(0px)) {
  @media (max-width: 768px) {
    .notification-container {
      padding-bottom: max(20px, env(safe-area-inset-bottom));
      padding-left: max(20px, env(safe-area-inset-left));
      padding-right: max(20px, env(safe-area-inset-right));
    }
  }
}
</style> 