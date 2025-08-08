import type { App } from 'vue';
import type { MicrosoftAuthOptions, MicrosoftAuthPlugin } from '../types';
import { useMicrosoftAuth } from '../composables/useMicrosoftAuth';

const MicrosoftAuth: MicrosoftAuthPlugin = {
  install(app: App, options: MicrosoftAuthOptions) {
    // Provide Microsoft Auth options globally
    app.provide('microsoftAuthOptions', options);
    
    // Add global properties (optional for template usage)
    app.config.globalProperties.$microsoftAuth = useMicrosoftAuth;
  }
};

export default MicrosoftAuth;