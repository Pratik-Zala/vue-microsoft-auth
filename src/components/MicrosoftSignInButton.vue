<template>
  <button @click="handleSignIn" :disabled="isLoading"
    class="twymx-scope w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
    <img class="h-5 w-5 mr-2"
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