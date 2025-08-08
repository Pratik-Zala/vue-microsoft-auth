
import { inject } from 'vue';
import type { MicrosoftAuthOptions } from '../types';

let globalOptions: MicrosoftAuthOptions | null = null;

export function setGlobalAuthConfig(options: MicrosoftAuthOptions): void {
  globalOptions = options;
}

export function getAuthApiBaseUrl(): string {
  // Try to get from Vue injection first
  const injectedOptions = inject<MicrosoftAuthOptions | null>('microsoftAuthOptions', null);
  
  if (injectedOptions?.apiBaseUrl) {
    return injectedOptions.apiBaseUrl;
  }
  
  // Fallback to global options
  if (globalOptions?.apiBaseUrl) {
    return globalOptions.apiBaseUrl;
  }
  
  throw new Error('[vue-microsoft-auth] No API base URL configured. Please provide apiBaseUrl in plugin options during initialization.');
}

export function getAuthConfig(): MicrosoftAuthOptions {
  const injectedOptions = inject<MicrosoftAuthOptions | null>('microsoftAuthOptions', null);
  
  if (injectedOptions) {
    return injectedOptions;
  }
  
  if (globalOptions) {
    return globalOptions;
  }
  
  throw new Error('[vue-microsoft-auth] No auth configuration found. Make sure to install the plugin with proper options.');
}
