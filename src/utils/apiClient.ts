import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { AuthError } from '../types';

class ApiClient {
  private instance: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.instance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.instance.interceptors.request.use(
      (config) => {
        const token = this.getStoredToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(this.createAuthError(error, 'REQUEST_ERROR'))
    );

    // Response interceptor for error handling
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          this.clearTokens();
          throw this.createAuthError(error, 'UNAUTHORIZED');
        }
        throw this.createAuthError(error);
      }
    );
  }

  private getStoredToken(): string | null {
    try {
      const tokenData = localStorage.getItem('microsoft_auth_token');
      if (!tokenData) return null;

      const parsed = JSON.parse(tokenData);
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        this.clearTokens();
        return null;
      }

      return parsed.accessToken || null;
    } catch {
      return null;
    }
  }

  private clearTokens(): void {
    localStorage.removeItem('microsoft_auth_token');
    localStorage.removeItem('microsoft_auth_user');
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

  public getBaseURL(): string {
    return this.baseURL;
  }
}

// Singleton instance - will be initialized by the plugin
let apiClientInstance: ApiClient | null = null;

export function initializeApiClient(baseURL: string): ApiClient {
  apiClientInstance = new ApiClient(baseURL);
  return apiClientInstance;
}

export function getApiClient(): ApiClient {
  if (!apiClientInstance) {
    throw new Error('[vue-microsoft-auth] API client not initialized. Make sure the plugin is installed with proper options.');
  }
  return apiClientInstance;
}

// Export the getter as default for backward compatibility
export default {
  get: (...args: any[]) => getApiClient().get(...args),
  post: (...args: any[]) => getApiClient().post(...args),
  put: (...args: any[]) => getApiClient().put(...args),
  delete: (...args: any[]) => getApiClient().delete(...args),
};