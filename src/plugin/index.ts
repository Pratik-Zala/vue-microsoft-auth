import type { App } from 'vue';
import type { MicrosoftAuthOptions, MicrosoftAuthPlugin } from '../types';
import { useMicrosoftAuth } from '../composables/useMicrosoftAuth';

const MicrosoftAuth: MicrosoftAuthPlugin = {
  install(app: App, options: MicrosoftAuthOptions) {
    // Validate required options
    if (!options.apiBaseUrl) {
      throw new Error('[vue-microsoft-auth] apiBaseUrl is required in plugin options');
    }

    // Provide options globally
    app.provide('microsoftAuthOptions', options);
    
    // Add global properties (optional for template usage)
    app.config.globalProperties.$microsoftAuth = useMicrosoftAuth;
  }
};

export default MicrosoftAuth;
export { useMicrosoftAuth };

export type { 
  MicrosoftAuthOptions, 
  MicrosoftAuthUser, 
  MicrosoftAuthComposable,
  RegisterData,
  BiometricOptions,
  AuthComposable
} from '../types';