
import type { MicrosoftAuthComposable } from './types'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $microsoftAuth: () => MicrosoftAuthComposable
  }
}

// Global augmentations for the plugin

export {}
