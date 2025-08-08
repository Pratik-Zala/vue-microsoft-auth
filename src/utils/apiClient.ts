
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { AuthError } from '../types';
import { getAuthApiBaseUrl, getAuthConfig } from '../composables/authConfig';

class ApiClient {
  private instance: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.instance = axios.create({
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Set base URL dynamically
        config.baseURL = getAuthApiBaseUrl();
        
        // Add auth header if token exists
        const tokenData = this.getStoredToken();
        if (tokenData && !this.isTokenExpired(tokenData)) {
          config.headers['Authorization'] = `Bearer ${tokenData.accessToken}`;
        }

        // Add debug logging if enabled
        const authConfig = getAuthConfig();
        if (authConfig.debug) {
          console.log('[vue-microsoft-auth] API Request:', {
            method: config.method,
            url: config.url,
            headers: config.headers
          });
        }

        return config;
      },
      (error) => Promise.reject(this.createAuthError(error, 'REQUEST_ERROR'))
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const authConfig = getAuthConfig();
        if (authConfig.debug) {
          console.log('[vue-microsoft-auth] API Response:', {
            status: response.status,
            data: response.data
          });
        }
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle token refresh on 401
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshToken();
            if (newToken) {
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              return this.instance(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, clear stored tokens
            this.clearTokens();
            return Promise.reject(this.createAuthError(refreshError, 'TOKEN_REFRESH_FAILED'));
          }
        }

        return Promise.reject(this.createAuthError(error));
      }
    );
  }

  private getStoredToken(): any {
    try {
      const config = getAuthConfig();
      const storageKey = `${config.storagePrefix || 'microsoft_auth'}_token`;
      const tokenData = localStorage.getItem(storageKey);
      return tokenData ? JSON.parse(tokenData) : null;
    } catch {
      return null;
    }
  }

  private isTokenExpired(tokenData: any): boolean {
    return tokenData.expiresAt && Date.now() > tokenData.expiresAt;
  }

  private async refreshToken(): Promise<string | null> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const tokenData = this.getStoredToken();
    if (!tokenData?.refreshToken) {
      return null;
    }

    this.refreshPromise = this.performTokenRefresh(tokenData);
    
    try {
      const newToken = await this.refreshPromise;
      this.refreshPromise = null;
      return newToken;
    } catch (error) {
      this.refreshPromise = null;
      throw error;
    }
  }

  private async performTokenRefresh(tokenData: any): Promise<string> {
    const response = await axios.post(`${getAuthApiBaseUrl()}/auth/refresh`, {
      refreshToken: tokenData.refreshToken,
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const newTokenData = response.data;
    const config = getAuthConfig();
    const storageKey = `${config.storagePrefix || 'microsoft_auth'}_token`;
    
    const updatedToken = {
      accessToken: newTokenData.accessToken,
      refreshToken: newTokenData.refreshToken || tokenData.refreshToken,
      expiresAt: Date.now() + (newTokenData.expiresIn * 1000),
    };

    localStorage.setItem(storageKey, JSON.stringify(updatedToken));
    return updatedToken.accessToken;
  }

  private clearTokens(): void {
    const config = getAuthConfig();
    const prefix = config.storagePrefix || 'microsoft_auth';
    localStorage.removeItem(`${prefix}_token`);
    localStorage.removeItem(`${prefix}_user`);
  }

  private createAuthError(error: any, code?: string): AuthError {
    const authError = new Error(error.message || 'An authentication error occurred') as AuthError;
    authError.code = code || error.response?.data?.code || 'UNKNOWN_ERROR';
    authError.details = error.response?.data || error;
    return authError;
  }

  // Public methods
  public get(url: string, config?: AxiosRequestConfig) {
    return this.instance.get(url, config);
  }

  public post(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.post(url, data, config);
  }

  public put(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.put(url, data, config);
  }

  public delete(url: string, config?: AxiosRequestConfig) {
    return this.instance.delete(url, config);
  }
}

// Export singleton instance
const apiClient = new ApiClient();
export default apiClient;
