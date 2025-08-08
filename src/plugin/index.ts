import type { App } from 'vue';
import type { MicrosoftAuthOptions, MicrosoftAuthPlugin } from '../types';
import { useMicrosoftAuth } from '../composables/useMicrosoftAuth';

const MicrosoftAuth: MicrosoftAuthPlugin = {
  install(app: App, options: MicrosoftAuthOptions) {
    app.provide('microsoftAuthOptions', options);
  }
};

export default MicrosoftAuth;
export { useMicrosoftAuth };

export type { MicrosoftAuthOptions, MicrosoftAuthUser, MicrosoftAuthComposable } from '../types';