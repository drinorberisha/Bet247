<template>
    <Transition name="notification">
      <div 
        v-if="isVisible" 
        class="notification"
        :class="[type, position]"
      >
        <div class="notification-content">
          <i :class="iconClass"></i>
          <div class="notification-text">
            <h4 v-if="title" class="notification-title">{{ title }}</h4>
            <p class="notification-message">{{ message }}</p>
          </div>
          <button class="notification-close" @click="close" aria-label="Close notification">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="notification-progress" :style="progressStyle"></div>
      </div>
    </Transition>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
  
  const props = defineProps({
    type: {
      type: String,
      default: 'success',
      validator: (value: string) => ['success', 'error', 'info', 'warning'].includes(value)
    },
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      default: 4000
    },
    position: {
      type: String,
      default: 'top-right',
      validator: (value: string) => [
        'top-right',
        'top-left',
        'bottom-right',
        'bottom-left'
      ].includes(value)
    }
  });
  
  const emit = defineEmits(['close']);
  
  const isVisible = ref(true);
  const progress = ref(100);
  const progressStyle = computed(() => ({
    width: `${progress.value}%`
  }));
  
  const iconClass = computed(() => {
    switch (props.type) {
      case 'success':
        return 'icon-check-circle';
      case 'error':
        return 'icon-alert-circle';
      case 'warning':
        return 'icon-alert-triangle';
      case 'info':
        return 'icon-info';
      default:
        return 'icon-info';
    }
  });
  
  let progressInterval: number;
  let timeout: number;
  
  const close = () => {
    isVisible.value = false;
    clearInterval(progressInterval);
    clearTimeout(timeout);
    emit('close');
  };
  
  onMounted(() => {
    if (props.duration > 0) {
      const startTime = Date.now();
      const endTime = startTime + props.duration;
  
      progressInterval = setInterval(() => {
        const now = Date.now();
        progress.value = ((endTime - now) / props.duration) * 100;
        
        if (progress.value <= 0) {
          close();
        }
      }, 10) as unknown as number;
  
      timeout = setTimeout(close, props.duration) as unknown as number;
    }
  });
  
  onBeforeUnmount(() => {
    clearInterval(progressInterval);
    clearTimeout(timeout);
  });
  </script>
  
  <style scoped>
  .notification {
    position: fixed;
    z-index: 9999;
    min-width: 300px;
    max-width: 450px;
    padding: 1rem 2.5rem 1rem 1rem;
    background: var(--signbet);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-left: 4px solid;
  }
  
  .notification-content {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding-right: 2rem;
  }
  
  .notification i {
    font-size: 1.5rem;
    flex-shrink: 0;
  }
  
  .notification-text {
    flex-grow: 1;
  }
  
  .notification-title {
    margin: 0;
    color: var(--white);
    font-size: 1rem;
    font-weight: 600;
  }
  
  .notification-message {
    margin: 0.25rem 0 0;
    color: var(--textcolor);
    font-size: 0.9rem;
  }
  
  .notification-close {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: none;
    border: none;
    color: var(--textcolor);
    cursor: pointer;
    padding: 0.5rem;
    font-size: 1rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    transition: all 0.2s ease;
  }
  
  .notification-close:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--white);
  }
  
  .notification-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background: var(--active-color);
    transition: width 10ms linear;
  }
  
  /* Types */
  .success {
    border-left-color: var(--active-color);
  }
  
  .success i:first-child {
    color: var(--active-color);
  }
  
  .error {
    border-left-color: var(--button-one);
  }
  
  .error i:first-child {
    color: var(--button-one);
  }
  
  .warning {
    border-left-color: #f59e0b;
  }
  
  .warning i:first-child {
    color: #f59e0b;
  }
  
  .info {
    border-left-color: #3b82f6;
  }
  
  .info i:first-child {
    color: #3b82f6;
  }
  
  /* Positions */
  .top-right {
    top: 1rem;
    right: 1rem;
  }
  
  .top-left {
    top: 1rem;
    left: 1rem;
  }
  
  .bottom-right {
    bottom: 1rem;
    right: 1rem;
  }
  
  .bottom-left {
    bottom: 1rem;
    left: 1rem;
  }
  
  /* Animation */
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
  
  @media (max-width: 768px) {
    .notification {
      min-width: auto;
      max-width: calc(100vw - 2rem);
      margin: 0 1rem;
    }
  }
  </style>