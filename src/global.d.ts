
import type { MicrosoftAuthComposable } from './types'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $microsoftAuth: () => MicrosoftAuthComposable
  }
}

// Augment window for environment variables
declare global {
  interface Window {
    VUE_APP_AUTH_API_URL?: string;
  }
}

export {}
