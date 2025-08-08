import MicrosoftAuth from './plugin';
import { useMicrosoftAuth } from './composables/useMicrosoftAuth';
import { useAuth } from './composables/useAuth';
import MicrosoftSignInButton from './components/MicrosoftSignInButton.vue';
import MicrosoftSignUpButton from './components/MicrosoftSignUpButton.vue';
import BiometricSetupButton from './components/BiometricSetupButton.vue';
import AuthContainer from './components/AuthContainer.vue';

export type { 
  MicrosoftAuthOptions, 
  MicrosoftAuthUser, 
  MicrosoftAuthComposable,
  RegisterData,
  BiometricOptions
} from './types';

export default MicrosoftAuth;
export { 
  useMicrosoftAuth,
  useAuth,
  MicrosoftSignInButton, 
  MicrosoftSignUpButton, 
  BiometricSetupButton,
  AuthContainer
}; 