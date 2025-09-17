<template>
  <button @click="handleSignIn" :disabled="isLoading"
    class="twymx-w-full twymx-flex twymx-items-center twymx-justify-center twymx-py-2 twymx-px-4 twymx-border twymx-border-gray-300 twymx-rounded-md twymx-shadow-sm twymx-text-sm twymx-font-medium twymx-text-gray-700 twymx-bg-white hover:twymx-bg-gray-50 disabled:twymx-opacity-50">
    <img class="twymx-h-5 twymx-w-5 twymx-mr-2"
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/240px-Microsoft_logo.svg.png"
      alt="Microsoft logo" />
    <span><slot>Sign in with Microsoft</slot></span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMicrosoftAuth } from '../composables/useMicrosoftAuth';

const emit = defineEmits(['success', 'error']);
const isLoading = ref(false);
const { signIn } = useMicrosoftAuth();

const handleSignIn = async () => {
  isLoading.value = true;
  try {
    await signIn();
    emit('success');
  } catch (e) {
    console.log("Error",e)
    emit('error', e);
  } finally {
    isLoading.value = false;
  }
};
</script> 