import { defineStore } from 'pinia';
import { useNotificationStore } from './notification'

const API_URL = import.meta.env.VITE_API_URL;

interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'superuser';
  balance: number;
}

interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  showLoginModal: boolean;
  showSignupModal: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => {
    // Try to restore user from localStorage
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    return {
      user: savedUser ? JSON.parse(savedUser) : null,
      token: savedToken || null,
      isAuthenticated: !!savedToken,
      showLoginModal: false,
      showSignupModal: false
    };
  },

  actions: {
    // Modal management
    toggleLoginModal() {
      this.showLoginModal = !this.showLoginModal;
      if (!this.showLoginModal) {
        document.body.classList.remove('modal-open');
      } else {
        document.body.classList.add('modal-open');
      }
    },

    toggleSignupModal() {
      this.showSignupModal = !this.showSignupModal;
      if (!this.showSignupModal) {
        document.body.classList.remove('modal-open');
      } else {
        document.body.classList.add('modal-open');
      }
    },

    // Authentication actions
    async login(credentials: LoginCredentials) {
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Login failed');
        }

        const data = await response.json();
        
        this.token = data.token;
        this.user = data.user;
        this.isAuthenticated = true;

        // Save to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Close login modal after successful login
        this.showLoginModal = false;
        document.body.classList.remove('modal-open');

        return data;
      } catch (error: any) {
        throw new Error(error.message || 'Failed to login');
      }
    },

    async register(credentials: RegisterCredentials) {
      try {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Registration failed');
        }

        const data = await response.json();
        
        this.token = data.token;
        this.user = data.user;
        this.isAuthenticated = true;

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Close signup modal after successful registration
        this.showSignupModal = false;
        document.body.classList.remove('modal-open');

        return data;
      } catch (error: any) {
        throw new Error(error.message || 'Failed to register');
      }
    },

    async logout() {
      const notificationStore = useNotificationStore()
      
      try {
        if (this.token) {
          await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.token}`
            }
          });
        }
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        this.user = null;
        this.token = null;
        this.isAuthenticated = false;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Show success notification
        notificationStore.show({
          type: 'success',
          title: 'Logged Out',
          message: 'You have been successfully logged out',
          duration: 4000,
          position: 'top-right'
        })
      }
    },

    async checkAuth() {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          this.logout();
          return false;
        }

        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Invalid token');
        }

        const data = await response.json();
        this.user = data.user;
        this.token = token;
        this.isAuthenticated = true;
        
        return true;
      } catch (error) {
        this.logout();
        return false;
      }
    },

    async updateProfile(userData: Partial<User>) {
      try {
        const response = await fetch(`${API_URL}/auth/profile`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify(userData)
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to update profile');
        }

        const data = await response.json();
        this.user = { ...this.user, ...data.user };
        localStorage.setItem('user', JSON.stringify(this.user));

        return data;
      } catch (error: any) {
        throw new Error(error.message || 'Failed to update profile');
      }
    },

    async changePassword(passwords: { currentPassword: string; newPassword: string }) {
      try {
        const response = await fetch(`${API_URL}/auth/change-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify(passwords)
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to change password');
        }

        return await response.json();
      } catch (error: any) {
        throw new Error(error.message || 'Failed to change password');
      }
    },

    updateBalance(newBalance: number) {
      if (this.user) {
        this.user.balance = newBalance;
        localStorage.setItem('user', JSON.stringify(this.user));
      }
    },

    getUserBalance(): number {
      return this.user?.balance ?? 0;
    }
  },

  getters: {
    isAdmin: (state) => state.user?.role === 'admin' || state.user?.role === 'superuser',
    isSuperuser: (state) => state.user?.role === 'superuser',
    userBalance: (state) => state.user?.balance || 0
  }
}); 