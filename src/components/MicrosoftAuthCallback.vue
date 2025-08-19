<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="relative p-8 max-w-md w-full space-y-4 bg-white rounded-lg shadow-md text-center">
      <button @click="goBack" type="button" class="absolute top-6 left-6 text-gray-500 hover:text-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div v-if="authStep === 'microsoft'">
        <h2 class="text-xl font-bold text-gray-900">Authenticating with Microsoft...</h2>
        <div v-if="!error" class="flex justify-center mt-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>

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

      <div v-if="authStep === 'email' || authStep === 'email-register'">
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
          <button @click="authStep = 'email-register'" :disabled="isLoading"
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
const authStep = ref<'microsoft' | 'biometricChoice' | 'biometricRegistration' | 'email' | 'email-register' | 'otp'>('microsoft');
const isLoading = ref(false);
const userEmail = ref('');
const otp = ref('');

const { sendLoginOtp, verifyLogin, registerBiometrics: authRegisterBiometrics, verifyBiometrics } = useAuth();

const goBack = () => {
  if (authStep.value === 'microsoft') router.push('/login');
  else if (authStep.value === 'biometricChoice') router.push('/login');
  else if (authStep.value === 'biometricRegistration') router.push('/login');
  else if (authStep.value === 'email-register') authStep.value = 'biometricRegistration';
  else if (authStep.value === 'email') authStep.value = 'biometricChoice';
  else if (authStep.value === 'otp') authStep.value = 'email';
};

onMounted(async () => {
  const code = route.query.code as string;

  // if (!code) {
  //   error.value = 'Authentication failed: No authorization code provided.';
  //   emit('error', error.value);
  //   setTimeout(() => router.push('/login'), 3000);
  //   return;
  // }

  try {
    if (code) {
      const apiClient = getApiClient();
      const response = await apiClient.post('/auth/microsoft/token', { code });

      console.log("microsoft toekn response", response)

      if (response.data && response.data.user && response.data.user.email) {
        userEmail.value = response.data.user.email;

        if (response.data.isNewUser) {
          // New user: Store token and proceed to biometric registration
          authStep.value = 'biometricRegistration';
        } else {
          // Existing user: Proceed to biometric login verification
          authStep.value = 'biometricChoice';
        }
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } else {
        error.value = 'Authentication failed: Could not retrieve user details from server.';
        emit('error', error.value);
        setTimeout(() => router.push('/login'), 3000);
      }
    }
    else {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        userEmail.value = userData.email;
      }
      authStep.value = 'biometricRegistration';
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'An error occurred during Microsoft authentication.';
    emit('error', error.value);
    console.error(err);
    setTimeout(() => router.push('/login'), 3000);
  }
});

const verifyWithBiometrics = async () => {
  isLoading.value = true;
  error.value = '';
  try {
    const response = await verifyBiometrics(userEmail.value);

    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      emit('success', response.data);

      if (props.autoRedirect) {
        router.push(props.redirectPath);
      }
    } else {
      error.value = 'Verification failed.';
      emit('error', error.value);
      console.log("verification failed")
      // setTimeout(() => router.push('/login'), 3000);
    }
  } catch (err: any) {
    const message = err.response?.data?.message || err.message || 'Verification failed.';
    error.value = message;
    emit('error', message);
    console.error("Error in verifying biometrics", err);
    // setTimeout(() => router.push('/login'), 3000);
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
    });

    if (response.data && response.data.token) {

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      emit('success', response.data);

      console.log("after verify with otp redirecting", props.redirectPath)
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
    const response = await authRegisterBiometrics(userEmail.value);

    if (response.data && response.data.success) {

      emit('success', { message: 'Biometric registration completed successfully!' });

      console.log("registration success")
      if (props.autoRedirect) {
        router.push(props.redirectPath);
      }
    } else {
      error.value = 'Biometric registration failed.';
      emit('error', error.value);
      // setTimeout(() => router.push("/login"), 3000);
    }
  } catch (err: any) {
    console.log("Biometric regissssssss faileddd", err)
    const message = err.response?.data?.message || err.message || 'Biometric registration failed.';
    error.value = message;
    emit('error', message);

    if (err.name === 'NotAllowedError') {
      error.value = 'Biometric registration was cancelled.';
      // localStorage.removeItem('token');  
      // localStorage.removeItem('user');
      console.log("Not allowed error")
      // setTimeout(() => router.push('/login'), 4000);
    } else {
      // setTimeout(() => router.push('/login'), 3000);
    }
  } finally {
    isLoading.value = false;
  }
};

const handleSendMail = async () => {
  try {
    error.value = '';
    isLoading.value = true;
    await sendLoginOtp(userEmail.value);
    authStep.value = 'otp';
  } catch (err: any) {
    const message = err.response?.data?.message || err.message || 'Verification failed.';
    error.value = message;
    emit('error', message);
    console.error(err);
    if (err.name === 'NotAllowedError') {
      authStep.value = 'microsoft';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
