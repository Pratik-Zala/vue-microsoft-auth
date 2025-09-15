
// Main plugin
import MicrosoftAuth from './plugin';
import { ApiClientPlugin } from './plugin/apiClient';
import { RouterPlugin } from './plugin/router';

// Composables
import { useAuth } from './composables/useAuth';
import { useMicrosoftAuth } from './composables/useMicrosoftAuth';

// Components
import AuthContainer from './components/AuthContainer.vue';
import BackButton from './components/BackButton.vue';
import BiometricSetupButton from './components/BiometricSetupButton.vue';
import CredentialsForm from './components/CredentialsForm.vue';
import MicrosoftSignInButton from './components/MicrosoftSignInButton.vue';
import MicrosoftSignUpButton from './components/MicrosoftSignUpButton.vue';
import ModularLoginComponent from './components/ModularLoginComponent.vue';
import ModularRegisterComponent from './components/ModularRegisterComponent.vue';
import OtpVerification from './components/OtpVerification.vue';
import RegistrationForm from './components/RegistrationForm.vue';
import TwoFactorVerification from './components/TwoFactorVerification.vue';
import VerificationChoice from './components/VerificationChoice.vue';

// Types
export type {
  AuthComposable, BiometricOptions, MicrosoftAuthComposable, MicrosoftAuthOptions,
  MicrosoftAuthUser, RegisterData
} from './types';


// Named exports for composables
export {
  MicrosoftAuth,
  useAuth, useMicrosoftAuth
};

// Named exports for components
export {
  AuthContainer, BackButton, BiometricSetupButton, CredentialsForm, MicrosoftSignInButton,
  MicrosoftSignUpButton, ModularLoginComponent,
  ModularRegisterComponent, OtpVerification, RegistrationForm, TwoFactorVerification, VerificationChoice
};

// Plugin install function for manual installation
export { ApiClientPlugin, RouterPlugin };

// Version
export const version = '2.1.0';

// CSS import paths for consuming applications
export const stylesPath = '@twymai/vue-twymx/styles.css'; // Raw styles with Tailwind directives
export const stylesProcessedPath = '@twymai/vue-twymx/styles-processed.css'; // Pre-processed styles

// Tailwind config path for consuming applications
export const tailwindConfigPath = '@twymai/vue-twymx/tailwind.config.js';
