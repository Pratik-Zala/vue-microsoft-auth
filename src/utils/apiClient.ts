import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { AuthError, ApiResponse, ApiError } from '../types';

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
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.instance.interceptors.request.use(
      (config) => {
        const token = this.getStoredToken();

        console.log("getting stored token in vue twymx",token)
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(this.createAuthError(error, 'REQUEST_ERROR'))
    );

    // Response interceptor for error handling
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        // For successful responses, return the response as is
        // The data will be accessed as response.data in the calling code
        return response;
      },
      async (error) => {
        if (error.response?.status === 401) {
          this.clearTokens();
          throw this.createAuthError(error, 'UNAUTHORIZED');
        }
        
        // Handle API error responses that follow our new structure
        if (error.response?.data && typeof error.response.data === 'object' && 'success' in error.response.data) {
          const apiError = error.response.data as ApiError;
          throw this.createAuthError(error, apiError.message || 'API_ERROR');
        }
        
        throw this.createAuthError(error);
      }
    );
  }

  private getStoredToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    return token;
  }

  private clearTokens(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  private createAuthError(error: any, code?: string): AuthError {
    let message = error.message || 'An authentication error occurred';
    
    // Extract message from our new API error structure
    if (error.response?.data && typeof error.response.data === 'object') {
      const apiError = error.response.data as ApiError;
      if (apiError.message) {
        message = apiError.message;
      }
    }
    
    const authError = new Error(message) as AuthError;
    authError.code = code || error.response?.data?.code || 'UNKNOWN_ERROR';
    authError.details = error.response?.data || error;
    return authError;
  }

  // Public methods with proper typing
  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.get<ApiResponse<T>>(url, config);
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.post<ApiResponse<T>>(url, data, config);
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.put<ApiResponse<T>>(url, data, config);
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.delete<ApiResponse<T>>(url, config);
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
