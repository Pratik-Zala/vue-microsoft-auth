<template>
  <div class="twymx-flex twymx-items-center twymx-justify-center twymx-min-h-screen twymx-bg-gray-100">
    <div class="twymx-relative twymx-p-8 twymx-max-w-md twymx-w-full twymx-space-y-4 twymx-bg-white twymx-rounded-lg twymx-shadow-md twymx-text-center">
      <button @click="goBack" type="button" class="twymx-absolute twymx-top-6 twymx-left-6 twymx-text-gray-500 hover:twymx-text-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" class="twymx-h-6 twymx-w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div v-if="authStep === 'biometricChoice'">
        <h2 class="text-xl twymx-font-bold twymx-text-gray-900">Biometric Verification</h2>
        <p class="twymx-mt-2 twymx-text-gray-600">Please verify your identity to complete the login.</p>
        <div class="twymx-mt-6">
          <button @click="verifyWithBiometrics" :disabled="isLoading"
            class="twymx-w-full twymx-flex twymx-justify-center twymx-py-2 twymx-px-4 border twymx-border-transparent twymx-rounded-md twymx-shadow-sm twymx-text-sm twymx-font-medium twymx-text-white twymx-bg-indigo-600 hover:twymx-bg-indigo-700 focus:twymx-outline-none focus:twymx-ring-2 focus:twymx-ring-offset-2 focus:twymx-ring-indigo-500 disabled:twymx-opacity-50">
            {{ isLoading ? 'Verifying...' : 'Verify with Biometrics' }}
          </button>
        </div>
        <div class="twymx-mt-6">
          <button @click="authStep = 'email'" :disabled="isLoading"
            class="twymx-w-full twymx-flex twymx-justify-center twymx-py-2 twymx-px-4 border twymx-border-gray-300 twymx-rounded-md twymx-shadow-sm twymx-text-sm twymx-font-medium twymx-text-gray-700 twymx-bg-white hover:twymx-bg-gray-50">
            Continue with OTP
          </button>
        </div>
      </div>

      <div v-if="authStep === 'email'">
        <h2 class="twymx-text-2xl twymx-font-bold twymx-text-center twymx-text-gray-900">Enter Email Address</h2>
        <form @submit.prevent="handleSendMail" class="twymx-mt-8 twymx-space-y-6">
          <div>
            <label for="email" class="twymx-block twymx-text-sm twymx-font-medium twymx-text-gray-700">Email Address</label>
            <div class="twymx-mt-1">
              <input type="email" id="email" v-model="userEmail" required
                class="twymx-w-full twymx-px-3 twymx-py-2 border twymx-border-gray-300 twymx-rounded-md twymx-shadow-sm twymx-placeholder-gray-400 focus:twymx-outline-none focus:twymx-ring-indigo-500 focus:twymx-border-indigo-500 sm:twymx-text-sm">
            </div>
          </div>
          <div class="twymx-space-y-4">
            <button type="submit" :disabled="isLoading"
              class="twymx-w-full twymx-flex twymx-justify-center twymx-py-2 twymx-px-4 border twymx-border-transparent twymx-rounded-md twymx-shadow-sm twymx-text-sm twymx-font-medium twymx-text-white twymx-bg-indigo-600 hover:twymx-bg-indigo-700 focus:twymx-outline-none focus:twymx-ring-2 focus:twymx-ring-offset-2 focus:twymx-ring-indigo-500 disabled:twymx-opacity-50">
              {{ isLoading ? 'Verifying...' : 'Verify' }}
            </button>
          </div>
        </form>
      </div>

      <div v-if="authStep === 'otp'">
        <h2 class="twymx-text-2xl twymx-font-bold twymx-text-center twymx-text-gray-900">Enter OTP</h2>
        <p class="twymx-text-center twymx-text-sm twymx-text-gray-600 twymx-mt-2">
          An OTP has been sent to {{ userEmail }}.
        </p>
        <form @submit.prevent="verifyOtpLogin" class="twymx-mt-8 twymx-space-y-6">
          <div>
            <label for="otp" class="twymx-block twymx-text-sm twymx-font-medium twymx-text-gray-700">One-Time Password</label>
            <div class="twymx-mt-1">
              <input type="text" id="otp" v-model="otp" required
                class="twymx-w-full twymx-px-3 twymx-py-2 border twymx-border-gray-300 twymx-rounded-md twymx-shadow-sm twymx-placeholder-gray-400 focus:twymx-outline-none focus:twymx-ring-indigo-500 focus:twymx-border-indigo-500 sm:twymx-text-sm">
            </div>
          </div>
          <div class="twymx-space-y-4">
            <button type="submit" :disabled="isLoading"
              class="twymx-w-full twymx-flex twymx-justify-center twymx-py-2 twymx-px-4 border twymx-border-transparent twymx-rounded-md twymx-shadow-sm twymx-text-sm twymx-font-medium twymx-text-white twymx-bg-indigo-600 hover:twymx-bg-indigo-700 focus:twymx-outline-none focus:twymx-ring-2 focus:twymx-ring-offset-2 focus:twymx-ring-indigo-500 disabled:twymx-opacity-50">
              {{ isLoading ? 'Verifying...' : 'Verify' }}
            </button>
          </div>
        </form>
      </div>

      <div v-if="authStep === 'biometricRegistration'">
        <h2 class="twymx-text-2xl twymx-font-bold twymx-text-center twymx-text-gray-900">Set up Biometric Login</h2>
        <p class="twymx-text-center twymx-text-sm twymx-text-gray-600 twymx-mt-2">
          Secure your account and log in faster with biometrics.
        </p>
        <div class="twymx-mt-8 twymx-space-y-4">
          <button @click="registerBiometrics" :disabled="isLoading"
            class="twymx-w-full twymx-flex twymx-justify-center twymx-py-2 twymx-px-4 border twymx-border-transparent twymx-rounded-md twymx-shadow-sm twymx-text-sm twymx-font-medium twymx-text-white twymx-bg-indigo-600 hover:twymx-bg-indigo-700 focus:twymx-outline-none focus:twymx-ring-2 focus:twymx-ring-offset-2 focus:twymx-ring-indigo-500 disabled:twymx-opacity-50">
            {{ isLoading ? 'Setting up...' : 'Enable Biometrics' }}
          </button>
        </div>
        <div class="twymx-mt-6">
          <button @click="authStep = 'email'" :disabled="isLoading"
            class="twymx-w-full twymx-flex twymx-justify-center twymx-py-2 twymx-px-4 border twymx-border-gray-300 twymx-rounded-md twymx-shadow-sm twymx-text-sm twymx-font-medium twymx-text-gray-700 twymx-bg-white hover:twymx-bg-gray-50">
            Continue with OTP
          </button>
        </div>
      </div>

      <p v-if="error" class="twymx-text-red-500 twymx-text-sm">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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

const { sendLoginOtp, verifyLoginOtp, registerBiometrics: authRegisterBiometrics, verifyBiometrics } = useAuth();

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
    // Get session token, user info, and isNewUser from route params
    sessionToken.value = route.query.sessionToken as string;
    userEmail.value = decodeURIComponent(route.query.email as string || '');
    const isNewUser = route.query.isNewUser === 'true';

    if (!sessionToken.value || !userEmail.value) {
      error.value = 'Invalid session. Please try logging in again.';
      emit('error', error.value);
      setTimeout(() => router.push('/login'), 3000);
      return;
    }

    // Determine auth step based on isNewUser flag from backend
    if (isNewUser) {
      // New user needs to set up biometrics
      authStep.value = 'biometricRegistration';
    } else {
      // Existing user can choose biometric verification
      authStep.value = 'biometricChoice';
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
    const data = await verifyBiometrics(userEmail.value, sessionToken.value);

    if (data?.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      emit('success', data);

      if (props.autoRedirect) {
        router.push(props.redirectPath);
      }
    } else {
      error.value = 'Verification failed.';
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
    const data = await verifyLoginOtp({
      email: userEmail.value,
      otp: otp.value,
      sessionToken: sessionToken.value
    });

    if (data?.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      emit('success', data);

      if (props.autoRedirect) {
        router.push(props.redirectPath);
      }
    } else {
      error.value = 'Login failed: No token received from server.';
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
    const data = await authRegisterBiometrics(userEmail.value, sessionToken.value);

    if (data?.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      emit('success', data);

      if (props.autoRedirect) {
        router.push(props.redirectPath);
      }
    } else {
      error.value = 'Biometric registration failed.';
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
    const data = await sendLoginOtp(userEmail.value, sessionToken.value);
    if (data) {
      authStep.value = 'otp';
    } else {
      error.value = 'Failed to send OTP.';
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
