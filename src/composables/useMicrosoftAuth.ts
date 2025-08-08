import axios from 'axios';
import { computed, ref } from 'vue';
import type { MicrosoftAuthComposable, MicrosoftAuthUser } from '../types';
import { getAuthApiBaseUrl } from './authConfig';

let currentUser = ref<MicrosoftAuthUser | null>(null);

export function useMicrosoftAuth(): MicrosoftAuthComposable {
  const isAuthenticated = computed(() => !!currentUser.value);

  const signIn = async (): Promise<void> => {
    const apiBaseUrl = getAuthApiBaseUrl();
    const url = `${apiBaseUrl}/auth/microsoft`;
    window.location.href = url;
  };

  const signUp = async (): Promise<void> => {
    const apiBaseUrl = getAuthApiBaseUrl();
    const url = `${apiBaseUrl}/auth/microsoft`;
    window.location.href = url;
  };

  const signOut = async (): Promise<void> => {
    const apiBaseUrl = getAuthApiBaseUrl();
    
    try {
      // Call backend logout endpoint
      const token = getAccessToken();
      if (token) {
        await axios.post(`${apiBaseUrl}/auth/logout`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('microsoft_auth_user');
      localStorage.removeItem('token');
      currentUser.value = null;
    }
  };

  const getUser = (): MicrosoftAuthUser | null => {
    return currentUser.value;
  };

  const getAccessToken = (): string | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const tokenData = JSON.parse(token);
      if (tokenData.expiresAt && Date.now() > tokenData.expiresAt) {
        localStorage.removeItem('token');
        return null;
      }
      return tokenData.accessToken;
    } catch {
      return null;
    }
  };

  const refreshToken = async (): Promise<string | null> => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const tokenData = JSON.parse(token);
      if (!tokenData.refreshToken) return null;

      const apiBaseUrl = getAuthApiBaseUrl();
      const response = await axios.post(`${apiBaseUrl}/auth/refresh`, {
        refreshToken: tokenData.refreshToken,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const newTokenData = response.data;
      const updatedToken = {
        accessToken: newTokenData.accessToken,
        refreshToken: newTokenData.refreshToken || tokenData.refreshToken,
        expiresAt: Date.now() + (newTokenData.expiresIn * 1000),
      };

      localStorage.setItem('token', JSON.stringify(updatedToken));
      return updatedToken.accessToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      localStorage.removeItem('token');
      currentUser.value = null;
      return null;
    }
  };

  // Handle callback from backend OAuth
  const handleCallback = async (): Promise<void> => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      throw new Error(`Authentication error: ${error}`);
    }

    if (!code) return;

    try {
      const apiBaseUrl = getAuthApiBaseUrl();
      const response = await axios.post(`${apiBaseUrl}/auth/microsoft/token`, {
        code
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = response.data;
      
      if (data.user && data.user.email) {
        const user: MicrosoftAuthUser = {
          id: data.user.id || data.user.email,
          displayName: data.user.displayName || data.user.name || data.user.email,
          email: data.user.email,
          accessToken: data.token,
          isNewUser: data.isNewUser,
        };

        currentUser.value = user;
        localStorage.setItem('microsoft_auth_user', JSON.stringify(user));
        localStorage.setItem('token', JSON.stringify({
          accessToken: data.token,
          expiresAt: Date.now() + (data.expiresIn * 1000),
        }));

        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        throw new Error('Invalid user data received from server');
      }
    } catch (error) {
      console.error('Error handling callback:', error);
      throw error;
    }
  };

  // Initialize user from localStorage
  const initializeUser = (): void => {
    const savedUser = localStorage.getItem('microsoft_auth_user');
    if (savedUser) {
      try {
        currentUser.value = JSON.parse(savedUser);
      } catch {
        localStorage.removeItem('microsoft_auth_user');
      }
    }
  };

  // Initialize on mount
  initializeUser();

  // Handle callback if we're returning from OAuth
  if (window.location.search.includes('code=')) {
    handleCallback();
  }

  return {
    signIn,
    signOut,
    signUp,
    getUser,
    isAuthenticated: () => isAuthenticated.value,
    getAccessToken,
    refreshToken,
  };
}   