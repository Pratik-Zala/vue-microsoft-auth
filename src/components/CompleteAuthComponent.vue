
<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="relative w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <!-- Back Button -->
      <div
        v-if="loginStep === 'choice' || loginStep === 'otp'"
        class="absolute top-4 left-4 cursor-pointer text-gray-600 hover:text-gray-800"
        @click="handleBackAction"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </div>

      <!-- Credentials Step -->
      <div v-if="loginStep === 'credentials'" class="space-y-6">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-900">Sign in to your account</h2>
          <p class="mt-2 text-sm text-gray-600">Welcome back! Please enter your details.</p>
        </div>

        <form @submit.prevent="handleCredentialsSubmit" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              v-model="credentials.email"
              type="email"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              v-model="credentials.password"
              type="password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
            <span v-else>Sign in</span>
          </button>
        </form>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <MicrosoftSignInButton @click="signInWithMicrosoft" class="w-full" />
      </div>

      <!-- Verification Choice Step -->
      <div v-if="loginStep === 'choice'" class="space-y-6">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-900">Choose verification method</h2>
          <p class="mt-2 text-sm text-gray-600">How would you like to verify your identity?</p>
        </div>

        <div class="space-y-3">
          <button
            @click="selectVerificationMethod('email')"
            class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            Verify with Email OTP
          </button>

          <BiometricSetupButton
            @click="selectVerificationMethod('biometric')"
            class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            button-text="Verify with Biometric"
          />
        </div>
      </div>

      <!-- OTP Verification Step -->
      <div v-if="loginStep === 'otp'" class="space-y-6">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-900">Enter verification code</h2>
          <p class="mt-2 text-sm text-gray-600">
            We've sent a verification code to <span class="font-medium">{{ email }}</span>
          </p>
        </div>

        <form @submit.prevent="verifyOtpLogin" class="space-y-4">
          <div>
            <label for="otp" class="block text-sm font-medium text-gray-700">Verification Code</label>
            <input
              id="otp"
              v-model="otpCode"
              type="text"
              required
              maxlength="6"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center text-lg tracking-widest"
              placeholder="000000"
            />
          </div>

          <button
            type="submit"
            :disabled="isLoading || otpCode.length !== 6"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </span>
            <span v-else>Verify Code</span>
          </button>
        </form>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.704-.833-2.464 0L4.348 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-800">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="rounded-md bg-green-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-green-800">{{ successMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Register Link -->
      <p v-if="showRegisterLink" class="text-sm text-center text-gray-600">
        Don't have an account?
        <a href="#" @click="$emit('register')" class="font-medium text-indigo-600 hover:text-indigo-500">
          Register
        </a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import { useMicrosoftAuth } from '../composables/useMicrosoftAuth';
import { useAuth } from '../composables/useAuth';
import { getApiClient } from '../utils/apiClient';
import MicrosoftSignInButton from './MicrosoftSignInButton.vue';
import BiometricSetupButton from './BiometricSetupButton.vue';

// Props
interface Props {
  showRegisterLink?: boolean;
  autoRedirect?: boolean;
  redirectPath?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showRegisterLink: true,
  autoRedirect: true,
  redirectPath: '/'
});

// Emits
const emit = defineEmits<{
  register: [];
  success: [user: any];
  error: [error: string];
}>();

// Composables
const { signIn: microsoftSignIn } = useMicrosoftAuth();
const auth = useAuth();

// Reactive data
const isLoading = ref(false);
const error = ref('');
const successMessage = ref('');
const loginStep = ref<'credentials' | 'choice' | 'otp'>('credentials');
const email = ref('');
const otpCode = ref('');
const credentials = ref({
  email: '',
  password: ''
});

// WebAuthn helpers
const base64UrlToArrayBuffer = (base64url: string): ArrayBuffer => {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const binStr = atob(base64);
  const len = binStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binStr.charCodeAt(i);
  }
  return bytes.buffer;
};

const arrayBufferToBase64Url = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binStr = '';
  bytes.forEach((byte) => {
    binStr += String.fromCharCode(byte);
  });
  const base64 = btoa(binStr);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

// Methods
const handleBackAction = () => {
  if (loginStep.value === 'choice') {
    loginStep.value = 'credentials';
  } else if (loginStep.value === 'otp') {
    loginStep.value = 'choice';
  }
  error.value = '';
};

const handleCredentialsSubmit = async () => {
  isLoading.value = true;
  error.value = '';
  email.value = credentials.value.email;

  try {
    const apiClient = getApiClient();
    const response = await apiClient.post('/auth/login', credentials.value);

    if (response.data && response.data.success) {
      loginStep.value = 'choice';
      successMessage.value = 'Credentials verified. Please choose verification method.';
    } else {
      error.value = 'Invalid login credentials.';
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Invalid login credentials.';
    emit('error', error.value);
  } finally {
    isLoading.value = false;
  }
};

const signInWithMicrosoft = async () => {
  try {
    await microsoftSignIn();
  } catch (err: any) {
    error.value = err.message || 'Microsoft sign-in failed.';
    emit('error', error.value);
  }
};

const selectVerificationMethod = async (method: 'email' | 'biometric') => {
  try {
    error.value = '';
    successMessage.value = '';
    
    if (method === 'email') {
      isLoading.value = true;
      const apiClient = getApiClient();
      await apiClient.post('/auth/login/send-otp', { email: email.value });
      loginStep.value = 'otp';
      successMessage.value = 'OTP sent to your email.';
    } else if (method === 'biometric') {
      isLoading.value = true;
      
      const apiClient = getApiClient();
      const optionsResponse = await apiClient.post('/auth/webauthn/login/options', { email: email.value });
      const options = optionsResponse.data;

      options.challenge = base64UrlToArrayBuffer(options.challenge);
      if (options.allowCredentials) {
        for (const cred of options.allowCredentials) {
          cred.id = base64UrlToArrayBuffer(cred.id);
        }
      }

      const credential = await navigator.credentials.get({ publicKey: options }) as PublicKeyCredential;

      const credentialForServer = {
        id: credential.id,
        rawId: arrayBufferToBase64Url(credential.rawId),
        type: credential.type,
        response: {
          authenticatorData: arrayBufferToBase64Url((credential.response as AuthenticatorAssertionResponse).authenticatorData),
          clientDataJSON: arrayBufferToBase64Url(credential.response.clientDataJSON),
          signature: arrayBufferToBase64Url((credential.response as AuthenticatorAssertionResponse).signature),
          userHandle: (credential.response as AuthenticatorAssertionResponse).userHandle 
            ? arrayBufferToBase64Url((credential.response as AuthenticatorAssertionResponse).userHandle!) 
            : null,
        },
      };

      const response = await apiClient.post('/auth/webauthn/login/verify', {
        email: email.value,
        data: credentialForServer,
        challengeToken: options.challengeToken
      });

      if (response.data && response.data.token) {
        await handleSuccessfulLogin(response.data);
        successMessage.value = 'Biometric authentication successful!';
      } else {
        error.value = 'Verification failed.';
      }
    }
  } catch (err: any) {
    const message = err.response?.data?.message || err.message || 'Verification failed.';
    error.value = message;
    emit('error', error.value);
    
    if (err.name === 'NotAllowedError') {
      loginStep.value = 'choice';
      error.value = 'Biometric authentication was cancelled or failed.';
    }
  } finally {
    isLoading.value = false;
  }
};

const verifyOtpLogin = async () => {
  isLoading.value = true;
  error.value = '';
  
  try {
    const apiClient = getApiClient();
    const response = await apiClient.post('/auth/login/verify', {
      email: email.value,
      otp: otpCode.value,
    });

    if (response.data && response.data.token) {
      await handleSuccessfulLogin(response.data);
      successMessage.value = 'OTP verification successful!';
    } else {
      error.value = 'Login failed: No token received from server.';
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Invalid OTP.';
    emit('error', error.value);
  } finally {
    isLoading.value = false;
  }
};

const handleSuccessfulLogin = async (data: any) => {
  try {
    // Store token and user data
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Update auth state
    if (auth && auth.setUser) {
      auth.setUser(data.user);
    }

    // Emit success event
    emit('success', data.user);

    // Auto redirect if enabled
    if (props.autoRedirect && typeof window !== 'undefined') {
      setTimeout(() => {
        window.location.href = props.redirectPath;
      }, 1500);
    }
  } catch (err: any) {
    console.error('Error handling successful login:', err);
    error.value = 'Login successful but failed to complete setup.';
  }
};
</script>
