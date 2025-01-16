import { defineStore } from 'pinia';

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
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => {
    // Try to restore user from localStorage
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    console.log('Restored token from localStorage:', savedToken); // Debug log
    
    return {
      user: savedUser ? JSON.parse(savedUser) : null,
      token: savedToken || null,
      isAuthenticated: !!savedToken
    };
  },

  actions: {
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

        console.log('Saved token:', data.token); // Debug log

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

        return data;
      } catch (error: any) {
        throw new Error(error.message || 'Failed to register');
      }
    },

    async logout() {
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
      }
    },

    async checkAuth() {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
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
        // Update localStorage to persist the change
        localStorage.setItem('user', JSON.stringify(this.user));
      }
    },

    // Helper method to safely get user balance
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