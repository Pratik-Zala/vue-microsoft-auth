
<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="relative w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <!-- Back Button -->
      <BackButton
        v-if="loginStep === 'choice' || loginStep === 'otp'"
        @back="handleBackAction"
      />

      <!-- Credentials Step -->
      <CredentialsForm
        v-if="loginStep === 'credentials'"
        :is-loading="isLoading"
        @submit="handleCredentialsSubmit"
        @microsoft-signin="signInWithMicrosoft"
        ref="credentialsForm"
      />

      <!-- Verification Choice Step -->
      <VerificationChoice
        v-if="loginStep === 'choice'"
        @select-method="selectVerificationMethod"
      />

      <!-- OTP Verification Step -->
      <OtpVerification
        v-if="loginStep === 'otp'"
        :email="email"
        :is-loading="isLoading"
        @verify="verifyOtpLogin"
      />

      <!-- Error Message -->
      <p v-if="error" class="text-sm text-center text-red-500">{{ error }}</p>

      <!-- Register Link -->
      <p class="text-sm text-center">
        Don't have an account?
        <a 
          href="/register" 
          @click="$emit('register')" 
          class="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Register
        </a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useMicrosoftAuth } from '../composables/useMicrosoftAuth';
import BackButton from './BackButton.vue';
import CredentialsForm from './CredentialsForm.vue';
import OtpVerification from './OtpVerification.vue';
import VerificationChoice from './VerificationChoice.vue';

interface Props {
  autoRedirect: boolean,
  redirectPath?: string;
}

const props = withDefaults(defineProps<Props>(), {
  autoRedirect: true,
  redirectPath: '/'
});

const emit = defineEmits<{
  register: [];
  success: [data: any];
  error: [error: string];
}>();

const isLoading = ref(false);
const error = ref('');
const router = useRouter()
const loginStep = ref<'credentials' | 'choice' | 'otp'>('credentials');
const email = ref('');
const password = ref('');
const credentialsForm = ref(null);

const { login, sendLoginOtp, verifyBiometrics, verifyLoginOtp } = useAuth();
const { signIn: microsoftSignIn } = useMicrosoftAuth();

const handleBackAction = () => {
  if (loginStep.value === 'choice') {
    loginStep.value = 'credentials';
  } else if (loginStep.value === 'otp') {
    loginStep.value = 'choice';
  }
  error.value = '';
};

const handleCredentialsSubmit = async (credentials: { email: string; password: string }) => {
  isLoading.value = true;
  error.value = '';
  email.value = credentials.email;
  password.value = credentials.password;

  try {
    const data = await login({
      email:credentials.email,
      password: credentials.password
    });

    if (data) {
      // Redirect to two-factor authentication with session info
      const { sessionToken, email, isNewUser } = data;
      router.push(`/auth/two-factor?sessionToken=${sessionToken}&email=${encodeURIComponent(email)}&isNewUser=${isNewUser}`);
    } else {  
      error.value = 'Invalid login credentials.';
      emit('error', error.value);
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
    if (method === 'email') {
      isLoading.value = true;
      await sendLoginOtp(email.value);
      loginStep.value = 'otp';
    } else if (method === 'biometric') {
      isLoading.value = true;
      error.value = '';

      const data = await verifyBiometrics(email.value);

      if (data && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        emit('success', data);

        if(props.autoRedirect) {  
          router.push(props.redirectPath);
        }

      } else {
        error.value = 'Verification failed.';
        emit('error', error.value);
      }
    }
  } catch (err: any) {
    const message = err.response?.data?.message || err.message || 'Verification failed.';
    error.value = message;
    emit('error', error.value);
    if (err.name === 'NotAllowedError') {
      loginStep.value = 'choice';
    }
  } finally {
    isLoading.value = false;
  }
};

const verifyOtpLogin = async (otp: string) => {
  isLoading.value = true;
  error.value = '';
  try {
    const data = await verifyLoginOtp({
      email: email.value,
      otp: otp,
    });

    if (data && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      emit('success', data);
    } else {
      error.value = 'Login failed: No token received from server.';
      emit('error', error.value);
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Invalid OTP.';
    emit('error', error.value);
  } finally {
    isLoading.value = false;
  }
};
</script>
