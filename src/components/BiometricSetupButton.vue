<template>
  <div class="twymx-w-full flex twymx-flex-col twymx-items-center gap-3">

    
    <!-- Helper / Info Text -->
    <p class="twymx-text-sm twymx-text-gray-600 twymx-text-center">
      Enable biometrics for <span class="twymx-font-medium">faster</span> and <span class="twymx-font-medium">more secure</span> logins.
    </p>

    <!-- Biometrics Button -->
    <button
      @click="handleRegisterBiometrics"
      :disabled="isLoading"
      class="twymx-relative twymx-w-full twymx-flex twymx-items-center twymx-justify-center twymx-gap-2 twymx-py-2.5 twymx-px-4
             rounded-xl twymx-font-medium twymx-text-white twymx-bg-indigo-600
             twymx-shadow-md transition-all duration-200
             hover:twymx-bg-indigo-700 focus:twymx-outline-none focus:twymx-ring-2
             focus:twymx-ring-offset-2 focus:twymx-ring-indigo-500
             disabled:twymx-opacity-50 disabled:twymx-cursor-not-allowed"
    >
      <!-- Loading Spinner -->
      <svg
        v-if="isLoading"
        class="animate-spin twymx-h-5 twymx-w-5 twymx-text-white"
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
    <p v-if="error" class="twymx-text-sm twymx-text-center twymx-text-red-500">
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
    const data = await registerBiometrics(props.email);
    emit('success',data);
  } catch (err:any) {
    error.value = err.response?.data?.message || 'Something went wrong.';
    emit('error', error.value);
    console.error(err)
  } finally {
    isLoading.value = false;
  }
};
</script> 