import type { App } from 'vue';
import type { MicrosoftAuthOptions, MicrosoftAuthPlugin } from '../types';
import { useMicrosoftAuth } from '../composables/useMicrosoftAuth';
import { initializeApiClient } from '../utils/apiClient';

const MicrosoftAuth: MicrosoftAuthPlugin = {
  install(app: App, options: MicrosoftAuthOptions) {
    // Validate required options
    if (!options.apiBaseUrl) {
      throw new Error('[vue-microsoft-auth] apiBaseUrl is required in plugin options');
    }

    // Initialize API client with base URL
    initializeApiClient(options.apiBaseUrl);

    // Provide options globally
    app.provide('microsoftAuthOptions', options);
    
    // Add global properties (optional for template usage)
    app.config.globalProperties.$microsoftAuth = useMicrosoftAuth;
  }
};

export default MicrosoftAuth;