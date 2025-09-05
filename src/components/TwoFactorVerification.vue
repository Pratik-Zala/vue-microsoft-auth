<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="relative p-8 max-w-md w-full space-y-4 bg-white rounded-lg shadow-md text-center">
      <button @click="goBack" type="button" class="absolute top-6 left-6 text-gray-500 hover:text-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div v-if="authStep === 'biometricChoice'">
        <h2 class="text-xl font-bold text-gray-900">Biometric Verification</h2>
        <p class="mt-2 text-gray-600">Please verify your identity to complete the login.</p>
        <div class="mt-6">
          <button @click="verifyWithBiometrics" :disabled="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
            {{ isLoading ? 'Verifying...' : 'Verify with Biometrics' }}
          </button>
        </div>
        <div class="mt-6">
          <button @click="authStep = 'email'" :disabled="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Continue with OTP
          </button>
        </div>
      </div>

      <div v-if="authStep === 'email'">
        <h2 class="text-2xl font-bold text-center text-gray-900">Enter Email Address</h2>
        <form @submit.prevent="handleSendMail" class="mt-8 space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
            <div class="mt-1">
              <input type="email" id="email" v-model="userEmail" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
          </div>
          <div class="space-y-4">
            <button type="submit" :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
              {{ isLoading ? 'Verifying...' : 'Verify' }}
            </button>
          </div>
        </form>
      </div>

      <div v-if="authStep === 'otp'">
        <h2 class="text-2xl font-bold text-center text-gray-900">Enter OTP</h2>
        <p class="text-center text-sm text-gray-600 mt-2">
          An OTP has been sent to {{ userEmail }}.
        </p>
        <form @submit.prevent="verifyOtpLogin" class="mt-8 space-y-6">
          <div>
            <label for="otp" class="block text-sm font-medium text-gray-700">One-Time Password</label>
            <div class="mt-1">
              <input type="text" id="otp" v-model="otp" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
          </div>
          <div class="space-y-4">
            <button type="submit" :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
              {{ isLoading ? 'Verifying...' : 'Verify' }}
            </button>
          </div>
        </form>
      </div>

      <div v-if="authStep === 'biometricRegistration'">
        <h2 class="text-2xl font-bold text-center text-gray-900">Set up Biometric Login</h2>
        <p class="text-center text-sm text-gray-600 mt-2">
          Secure your account and log in faster with biometrics.
        </p>
        <div class="mt-8 space-y-4">
          <button @click="registerBiometrics" :disabled="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
            {{ isLoading ? 'Setting up...' : 'Enable Biometrics' }}
          </button>
        </div>
        <div class="mt-6">
          <button @click="authStep = 'email'" :disabled="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Continue with OTP
          </button>
        </div>
      </div>

      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getApiClient } from '../utils/apiClient';
import { useAuth } from '../composables/useAuth';

interface Props {
  autoRedirect: boolean,
  redirectPath?: string;
}

const props = withDefaults(defineProps<Props>(), {
  autoRedirect: true,
  redirectPath: '/'
});

const emit = defineEmits<{
  success: [data: any];
  error: [error: string];
}>();

const route = useRoute();
const router = useRouter();
const error = ref('');
const authStep = ref<'biometricChoice' | 'biometricRegistration' | 'email' | 'otp'>('biometricChoice');
const isLoading = ref(false);
const userEmail = ref('');
const otp = ref('');
const sessionToken = ref('');  // Store session token for 2FA completion

const { sendLoginOtp, verifyLogin, registerBiometrics: authRegisterBiometrics, verifyBiometrics } = useAuth();

const goBack = () => {
  if (authStep.value === 'biometricChoice') router.push('/login');
  else if (authStep.value === 'biometricRegistration') router.push('/login');
  else if (authStep.value === 'email') {
    // Go back to previous step - we'll determine this based on user state when component mounted
    authStep.value = 'biometricChoice';
  }
  else if (authStep.value === 'otp') authStep.value = 'email';
};

onMounted(async () => {
  try {
    // Get session token and user info from route params
    sessionToken.value = route.query.sessionToken as string;
    userEmail.value = decodeURIComponent(route.query.email as string || '');

    if (!sessionToken.value || !userEmail.value) {
      error.value = 'Invalid session. Please try logging in again.';
      emit('error', error.value);
      setTimeout(() => router.push('/login'), 3000);
      return;
    }

    // Check if user has biometrics set up by attempting to get login options
    try {
      await getApiClient().post('/auth/webauthn/authenticate/options', { email: userEmail.value }, {
        headers: { Authorization: `Session ${sessionToken.value}` }
      });
      // If successful, user has passkeys - show biometric choice
      authStep.value = 'biometricChoice';
    } catch (err: any) {
      // If failed, user likely has no passkeys - show registration
      const errorMessage = err.response?.data?.message || err.message || '';
      if (err.response?.status === 400 || errorMessage.includes('no passkeys') || errorMessage.includes('passkey')) {
        authStep.value = 'biometricRegistration';
      } else {
        // Some other error, show biometric choice as fallback
        authStep.value = 'biometricChoice';
      }
    }

  } catch (err: any) {
    error.value = err.response?.data?.message || 'An error occurred during authentication setup.';
    emit('error', error.value);
    console.error(err);
    setTimeout(() => router.push('/login'), 3000);
  }
});

const verifyWithBiometrics = async () => {
  isLoading.value = true;
  error.value = '';
  try {
    const response = await verifyBiometrics(userEmail.value, sessionToken.value);

    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      emit('success', response.data);

      if (props.autoRedirect) {
        router.push(props.redirectPath);
      }
    } else {
      error.value = response.message || 'Verification failed.';
      emit('error', error.value);
    }
  } catch (err: any) {
    const message = err.response?.data?.message || err.message || 'Verification failed.';
    error.value = message;
    emit('error', message);
    console.error("Error in verifying biometrics", err);
  } finally {
    isLoading.value = false;
  }
};

const verifyOtpLogin = async () => {
  isLoading.value = true;
  error.value = '';
  try {
    const response = await verifyLogin({
      email: userEmail.value,
      otp: otp.value,
      sessionToken: sessionToken.value
    });

    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      emit('success', response.data);

      if (props.autoRedirect) {
        router.push(props.redirectPath);
      }
    } else {
      error.value = response.message || 'Login failed: No token received from server.';
      emit('error', error.value);
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Invalid OTP.';
    emit('error', error.value);
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const registerBiometrics = async () => {
  isLoading.value = true;
  error.value = '';
  try {
    // Register biometrics using the session token directly
    // The webauthn setup endpoints support session tokens via sessionMiddleware
    const response = await authRegisterBiometrics(userEmail.value, sessionToken.value);

    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      emit('success', response.data);

      if (props.autoRedirect) {
        router.push(props.redirectPath);
      }
    } else {
      error.value = response.message || 'Biometric registration failed.';
      emit('error', error.value);
    }
  } catch (err: any) {
    const message = err.response?.data?.message || err.message || 'Biometric registration failed.';
    error.value = message;
    emit('error', message);

    if (err.name === 'NotAllowedError') {
      error.value = 'Biometric registration was cancelled.';
    }
  } finally {
    isLoading.value = false;
  }
};

const handleSendMail = async () => {
  try {
    error.value = '';
    isLoading.value = true;
    const response = await sendLoginOtp(userEmail.value);
    if (response.success) {
      authStep.value = 'otp';
    } else {
      error.value = response.message || 'Failed to send OTP.';
      emit('error', error.value);
    }
  } catch (err: any) {
    const message = err.response?.data?.message || err.message || 'Verification failed.';
    error.value = message;
    emit('error', message);
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};
</script>
