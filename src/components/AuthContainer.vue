<template>
  <div class="auth-container">
    <!-- Login Flow -->
    <div v-if="authFlow === 'login'">

      <slot name="login-header">
        <h2 class="text-2xl font-bold text-center text-gray-900">Sign In</h2>
      </slot>
      
      <!-- Login Form -->
      <div v-if="loginStep === 'form'">
        <slot name="login-form" :email="email" :password="password" :isLoading="isLoading" :error="error" :handleLogin="handleLogin">
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input 
                v-model="email" 
                type="email" 
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Password</label>
              <input 
                v-model="password" 
                type="password" 
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>
            <button 
              type="submit" 
              :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {{ isLoading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>
        </slot>
      </div>

      <!-- Verification Choice -->
      <div v-if="loginStep === 'choice'">
        <slot name="verification-choice" :selectMethod="selectVerificationMethod" :isLoading="isLoading">
          <h2 class="text-2xl font-bold text-center text-gray-900">Choose Verification Method</h2>
          <p class="text-center text-sm text-gray-600 mt-2">How would you like to verify it's you?</p>
          <div class="mt-6 space-y-4">
            <button @click="selectVerificationMethod('email')"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Verify with Email OTP
            </button>
            <button @click="selectVerificationMethod('biometric')"
              class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Verify with Biometrics
            </button>
          </div>
        </slot>
      </div>

      <!-- OTP Verification -->
      <div v-if="loginStep === 'otp'">
        <slot name="otp-verification" :email="email" :otp="otp" :isLoading="isLoading" :error="error" :handleVerifyOtp="handleVerifyOtp">
          <form @submit.prevent="handleVerifyOtp" class="space-y-4">
            <h2 class="text-2xl font-bold text-center text-gray-900">Enter OTP</h2>
            <p class="text-center text-sm text-gray-600">We've sent a code to {{ email }}</p>
            <div>
              <input 
                v-model="otp" 
                type="text" 
                placeholder="Enter OTP"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>
            <button 
              type="submit" 
              :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {{ isLoading ? 'Verifying...' : 'Verify OTP' }}
            </button>
          </form>
        </slot>
      </div>
    </div>

    <!-- Registration Flow -->
    <div v-if="authFlow === 'register'">
      <slot name="register-header">
        <h2 class="text-2xl font-bold text-center text-gray-900">Create Account</h2>
      </slot>

      <!-- Registration Form -->
      <div v-if="registrationStep === 'details'">
        <slot name="register-form" :name="name" :email="email" :password="password" :isLoading="isLoading" :error="error" :handleRegister="handleRegister">
          <form @submit.prevent="handleRegister" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name</label>
              <input 
                v-model="name" 
                type="text" 
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input 
                v-model="email" 
                type="email" 
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Password</label>
              <input 
                v-model="password" 
                type="password" 
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>
            <button 
              type="submit" 
              :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {{ isLoading ? 'Creating account...' : 'Create Account' }}
            </button>
          </form>
        </slot>
      </div>

      <!-- OTP Verification for Registration -->
      <div v-if="registrationStep === 'otp'">
        <slot name="register-otp" :email="email" :otp="otp" :isLoading="isLoading" :error="error" :handleVerifyRegistration="handleVerifyRegistration">
          <form @submit.prevent="handleVerifyRegistration" class="space-y-4">
            <h2 class="text-2xl font-bold text-center text-gray-900">Verify Email</h2>
            <p class="text-center text-sm text-gray-600">We've sent a code to {{ email }}</p>
            <div>
              <input 
                v-model="otp" 
                type="text" 
                placeholder="Enter OTP"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>
            <button 
              type="submit" 
              :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {{ isLoading ? 'Verifying...' : 'Verify Email' }}
            </button>
          </form>
        </slot>
      </div>

      <!-- Biometric Setup -->
      <div v-if="registrationStep === 'biometric'">
        <slot name="biometric-setup" :email="email" :isLoading="isLoading" :error="error" :handleSetupBiometrics="handleSetupBiometrics">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-center text-gray-900">Set up Biometric Login</h2>
            <p class="text-center text-sm text-gray-600 mt-2">
              Secure your account and log in faster with biometrics.
            </p>
            <div class="mt-8 space-y-4">
              <button @click="handleSetupBiometrics" :disabled="isLoading"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                {{ isLoading ? 'Setting up...' : 'Enable Biometrics' }}
              </button>
              <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>
            </div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import { useMicrosoftAuth } from '../composables/useMicrosoftAuth';
import axios from 'axios';

const props = defineProps<{
  authFlow: 'login' | 'register';
  initialStep?: string;
}>();

const emit = defineEmits(['success', 'error', 'step-change']);

// Reactive state
const email = ref('');
const password = ref('');
const name = ref('');
const otp = ref('');
const isLoading = ref(false);
const error = ref('');

// Auth flow state
const loginStep = ref(props.initialStep || 'form');
const registrationStep = ref(props.initialStep || 'details');

const { 
  register, 
  sendOtp, 
  verifyRegistration, 
  registerBiometrics, 
  verifyBiometrics 
} = useMicrosoftAuth();

const handleLogin = async () => {
  isLoading.value = true;
  error.value = '';
  try {

    const response = await axios.post('/auth/logintyippp', {
      email: email.value,
      password: password.value,
    });

    if (response.data && response.data.success) {
      loginStep.value = 'choice';
      emit('step-change', 'choice');
    } else {
      error.value = 'Invalid login credentials.';
    }

    loginStep.value = 'choice';
  } catch (err: any) {
    error.value = err.message || 'Login failed';
    emit('error', err);
  } finally {
    isLoading.value = false;
  }
};

const selectVerificationMethod = async (method: 'email' | 'biometric') => {
  try {
    error.value = '';
    if (method === 'email') {
      isLoading.value = true;
      await sendOtp(email.value);
      loginStep.value = 'otp';
      emit('step-change', 'otp');
    } else if (method === 'biometric') {
      isLoading.value = true;
      const response = await verifyBiometrics(email.value);
      if (response.data && response.data.token) {
        emit('success', response.data);
      } else {
        error.value = 'Verification failed';
      }
    }
  } catch (err: any) {
    const message = err.message || 'Verification failed';
    error.value = message;
    emit('error', err);
    if (err.name === 'NotAllowedError') {
      loginStep.value = 'choice';
      emit('step-change', 'choice');
    }
  } finally {
    isLoading.value = false;
  }
};

const handleVerifyOtp = async () => {
  isLoading.value = true;
  error.value = '';
  try {
    const response = await axios.post('/auth/login/verify', {
      email: email.value,
      otp: otp.value,
    });

    if (response.data && response.data.token) {
      emit('success',response);
    } else {
      error.value = 'Login failed: No token received from server.';
    }
  } catch (err: any) {
    error.value = err.message || 'Invalid OTP';
    emit('error', err);
  } finally {
    isLoading.value = false;
  }
};

// Registration handlers
const handleRegister = async () => {
  isLoading.value = true;
  error.value = '';
  try {
    await sendOtp(email.value);
    registrationStep.value = 'otp';
    emit('step-change', 'otp');
  } catch (err: any) {
    error.value = err.message || 'Failed to send OTP';
    emit('error', err);
  } finally {
    isLoading.value = false;
  }
};

const handleVerifyRegistration = async () => {
  isLoading.value = true;
  error.value = '';
  try {
    await verifyRegistration(email.value, otp.value);
    await register({ name: name.value, email: email.value, password: password.value });
    registrationStep.value = 'biometric';
    emit('step-change', 'biometric');
  } catch (err: any) {
    error.value = err.message || 'Registration failed';
    emit('error', err);
  } finally {
    isLoading.value = false;
  }
};

const handleSetupBiometrics = async () => {
  isLoading.value = true;
  error.value = '';
  try {
    await registerBiometrics(email.value);
    emit('success', { message: 'Biometrics setup complete' });
  } catch (err: any) {
    error.value = err.message || 'Biometric setup failed';
    emit('error', err);
  } finally {
    isLoading.value = false;
  }
};
</script> 