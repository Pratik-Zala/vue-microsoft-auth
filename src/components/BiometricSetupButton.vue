<template>
  <div class="w-full flex flex-col items-center gap-3">
    <!-- Helper / Info Text -->
    <p class="text-sm text-gray-600 text-center">
      Enable biometrics for <span class="font-medium">faster</span> and <span class="font-medium">more secure</span> logins.
    </p>

    <!-- Biometrics Button -->
    <button
      @click="handleRegisterBiometrics"
      :disabled="isLoading"
      class="relative w-full flex items-center justify-center gap-2 py-2.5 px-4
             rounded-xl font-medium text-white bg-indigo-600
             shadow-md transition-all duration-200
             hover:bg-indigo-700 focus:outline-none focus:ring-2
             focus:ring-offset-2 focus:ring-indigo-500
             disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <!-- Loading Spinner -->
      <svg
        v-if="isLoading"
        class="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
      </svg>

      <!-- Label -->
      <span>
        {{ isLoading ? 'Setting up...' : (label || 'Enable Biometrics') }}
      </span>
    </button>

    <!-- Error Message -->
    <p v-if="error" class="text-sm text-center text-red-500">
      {{ error }}
    </p>
  </div>
</template>



<script setup lang="ts">
import { ref, defineProps } from 'vue';
import { useAuth } from '../composables/useAuth';

const error = ref('');
const props = defineProps<{ email: string, label?: string }>();
const emit = defineEmits(['success', 'error']);
const { registerBiometrics } = useAuth();
const isLoading = ref(false);

const handleRegisterBiometrics = async () => {
  if (!props.email) {
    emit('error', new Error('Email is required for biometric registration'));
    return;
  }
  isLoading.value = true;
  try {
    const response = await registerBiometrics(props.email);
    emit('success',response.data);
  } catch (err:any) {
    error.value = err.response?.data?.message || 'Something went wrong.';
    emit('error', error.value);
    console.error(err)
  } finally {
    isLoading.value = false;
  }
};
</script> 