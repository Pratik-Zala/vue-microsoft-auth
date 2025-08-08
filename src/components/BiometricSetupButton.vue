<template>
  <button @click="handleRegisterBiometrics" :disabled="isLoading"
    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
    <span>{{ isLoading ? 'Setting up...' : (label || 'Enable Biometrics') }}</span>
  </button>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';
import { useMicrosoftAuth } from '../composables/useMicrosoftAuth';

const props = defineProps<{ email: string, label?: string }>();
const emit = defineEmits(['success', 'error']);
const { registerBiometrics } = useMicrosoftAuth();
const isLoading = ref(false);

const handleRegisterBiometrics = async () => {
  if (!props.email) {
    emit('error', new Error('Email is required for biometric registration'));
    return;
  }
  isLoading.value = true;
  try {
    await registerBiometrics(props.email);
    emit('success');
  } catch (e) {
    emit('error', e);
  } finally {
    isLoading.value = false;
  }
};
</script> 