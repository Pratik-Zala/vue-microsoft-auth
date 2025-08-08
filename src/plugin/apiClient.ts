
import type { App } from 'vue';
import { initializeApiClient } from '../utils/apiClient';

export interface ApiClientOptions {
  baseUrl: string;
}

export const ApiClientPlugin = {
  install(app: App, options: ApiClientOptions) {
    if (!options.baseUrl) {
      throw new Error('[vue-microsoft-auth] baseUrl is required for API client');
    }

    // Initialize the API client singleton
    initializeApiClient(options.baseUrl);
    
    // Provide the base URL globally for other composables
    app.provide('apiBaseUrl', options.baseUrl);
  }
};
