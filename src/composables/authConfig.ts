
import { inject } from 'vue';
import type { MicrosoftAuthOptions } from '../types';

let globalOptions: MicrosoftAuthOptions | null = null;

export function setGlobalAuthConfig(options: MicrosoftAuthOptions): void {
  globalOptions = options;
}

export function getAuthApiBaseUrl(): string {
  // Try to get from Vue injection first
  const injectedOptions = inject<MicrosoftAuthOptions>('microsoftAuthOptions', null);
  
  if (injectedOptions?.apiBaseUrl) {
    return injectedOptions.apiBaseUrl;
  }
  
  // Fallback to global options
  if (globalOptions?.apiBaseUrl) {
    return globalOptions.apiBaseUrl;
  }
  
  // Environment variable fallback
  if (typeof window !== 'undefined' && (window as any).VUE_APP_AUTH_API_URL) {
    return (window as any).VUE_APP_AUTH_API_URL;
  }
  
  throw new Error('[vue-microsoft-auth] No API base URL configured. Please provide it in plugin options.');
}

export function getAuthConfig(): MicrosoftAuthOptions {
  const injectedOptions = inject<MicrosoftAuthOptions>('microsoftAuthOptions', null);
  
  if (injectedOptions) {
    return injectedOptions;
  }
  
  if (globalOptions) {
    return globalOptions;
  }
  
  throw new Error('[vue-microsoft-auth] No auth configuration found. Make sure to install the plugin with proper options.');
}
