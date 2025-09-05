
// Main plugin
import MicrosoftAuth from './plugin';
import { ApiClientPlugin } from './plugin/apiClient';
import { RouterPlugin } from './plugin/router';

// Composables
import { useMicrosoftAuth } from './composables/useMicrosoftAuth';
import { useAuth } from './composables/useAuth';

// Components
import MicrosoftSignInButton from './components/MicrosoftSignInButton.vue';
import MicrosoftSignUpButton from './components/MicrosoftSignUpButton.vue';
import BiometricSetupButton from './components/BiometricSetupButton.vue';
import AuthContainer from './components/AuthContainer.vue';
import CompleteAuthComponent from './components/CompleteAuthComponent.vue';
import ModularLoginComponent from './components/ModularLoginComponent.vue';
import ModularRegisterComponent from './components/ModularRegisterComponent.vue';
import TwoFactorVerification from './components/TwoFactorVerification.vue';
import BackButton from './components/BackButton.vue';
import CredentialsForm from './components/CredentialsForm.vue';
import RegistrationForm from './components/RegistrationForm.vue';
import VerificationChoice from './components/VerificationChoice.vue';
import OtpVerification from './components/OtpVerification.vue';

// Types
export type { 
  MicrosoftAuthOptions, 
  MicrosoftAuthUser, 
  MicrosoftAuthComposable,
  RegisterData,
  BiometricOptions,
  AuthComposable
} from './types';


// Named exports for composables
export { 
  useMicrosoftAuth,
  MicrosoftAuth,
  useAuth
};

// Named exports for components
export { 
  MicrosoftSignInButton, 
  MicrosoftSignUpButton, 
  BiometricSetupButton,
  AuthContainer,
  CompleteAuthComponent,
  ModularLoginComponent,
  ModularRegisterComponent,
  TwoFactorVerification,
  BackButton,
  CredentialsForm,
  RegistrationForm,
  VerificationChoice,
  OtpVerification
};

// Plugin install function for manual installation
export { ApiClientPlugin, RouterPlugin };

// Version
export const version = '1.0.0';
