import { inject } from 'vue';
import type { MicrosoftAuthOptions } from '../types';

export function getAuthApiBaseUrl(): string {
  // Get API base URL from the dedicated API client plugin
  const apiBaseUrl = inject<string | null>('apiBaseUrl', null);

  if (apiBaseUrl) {
    return apiBaseUrl;
  }

  throw new Error('[vue-microsoft-auth] No API base URL configured. Please install the ApiClientPlugin with baseUrl option.');
}

export function getAuthConfig(): MicrosoftAuthOptions {
  const injectedOptions = inject<MicrosoftAuthOptions | null>('microsoftAuthOptions', null);

  if (injectedOptions) {
    return injectedOptions;
  }

  throw new Error('[vue-microsoft-auth] No Microsoft Auth configuration found. Make sure to install the MicrosoftAuth plugin with proper options.');
}