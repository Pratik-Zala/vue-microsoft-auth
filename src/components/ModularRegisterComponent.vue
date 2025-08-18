<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="relative w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <!-- Back Button -->
      <BackButton v-if="registrationStep === 'otp'" @back="goBackToDetails" />

      <!-- Registration Form Step -->
      <RegistrationForm v-if="registrationStep === 'details'" :is-loading="isLoading" @submit="handleRegister"
        @microsoft-signup="signUpWithMicrosoft" />

      <!-- OTP Verification Step -->
      <OtpVerification v-if="registrationStep === 'otp'" :email="email" :is-loading="isLoading"
        @verify="handleVerificationRegistration" />

      <!-- Biometric Setup Step -->
      <BiometricSetupButton v-if="registrationStep === 'biometric'" :email="email" @success="handleBiometricSuccess"
        @error="handleBiometricError" />

      <!-- Error Message -->
      <p v-if="error" class="text-sm text-center text-red-500">{{ error }}</p>

      <!-- Login Link -->
      <p v-if="registrationStep !== 'biometric'" class="text-sm text-center">
        Already have an account?
        <a href="/login" @click="$emit('login')" class="font-medium text-indigo-600 hover:text-indigo-500">
          Login
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
import BiometricSetupButton from './BiometricSetupButton.vue';
import OtpVerification from './OtpVerification.vue';
import RegistrationForm from './RegistrationForm.vue';

interface Props {
  autoRedirect: boolean,
  redirectPath?: string;
}

const router = useRouter();

const props = withDefaults(defineProps<Props>(), {
  autoRedirect: true,
  redirectPath: '/'
});

const emit = defineEmits<{
  login: [];
  success: [user: any];
  error: [error: string];
}>();

const isLoading = ref(false);
const error = ref('');
const registrationStep = ref<'details' | 'otp' | 'biometric'>('details');
const email = ref('');
const name = ref('');
const password = ref('');
const otp = ref('');

const { register, sendRegisterOtp, verifyRegistration } = useAuth();
const { signUp } = useMicrosoftAuth();

const goBackToDetails = () => {
  registrationStep.value = 'details';
  error.value = '';
};

const handleBiometricSuccess = async (data: any) => {
  console.log("dataaaaaaaa", data)
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));

  emit('success', data);

  if(props.autoRedirect) {  
    router.push(props.redirectPath);
  }

}

const handleBiometricError = async (error: any) => {
  console.error("Error in biometric", error)
  emit('error', error)
}

const signUpWithMicrosoft = async () => {
  try {
    await signUp();
  } catch (err: any) {
    error.value = err.message || 'Microsoft signup failed';
    emit('error', error.value);
  }
};

const handleRegister = async (formData: { name: string; email: string; password: string }) => {
  isLoading.value = true;
  error.value = '';

  // Store form data
  name.value = formData.name;
  email.value = formData.email;
  password.value = formData.password;

  try {
    await sendRegisterOtp(email.value);
    registrationStep.value = 'otp';
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to send OTP.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const handleVerificationRegistration = async (otpValue: string) => {
  isLoading.value = true;
  error.value = '';
  otp.value = otpValue;

  try {
    await verifyRegistration(email.value, otp.value);

    const response = await register({
      name: name.value,
      email: email.value,
      password: password.value,
    });

    if (response.data && response.data.token) {
      registrationStep.value = 'biometric';
    } else {
      error.value = 'Registration failed: No token received from server.';
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'An error occurred during verification.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};
</script>
