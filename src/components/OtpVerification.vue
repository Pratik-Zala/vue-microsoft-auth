
<template>
  <div>
    <h2 class="text-2xl font-bold text-center text-gray-900">Enter OTP</h2>
    <p class="text-center text-sm text-gray-600 mt-2">
      An OTP has been sent to {{ email }}.
    </p>
    <form @submit.prevent="$emit('verify', otp)" class="mt-8 space-y-6">
      <div>
        <label for="otp" class="block text-sm font-medium text-gray-700">One-Time Password</label>
        <div class="mt-1">
          <input 
            type="text" 
            id="otp" 
            v-model="otp" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
        </div>
      </div>
      <div class="space-y-4">
        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {{ isLoading ? 'Verifying...' : 'Verify' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  email: string;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
});

const emit = defineEmits<{
  verify: [otp: string];
}>();

const otp = ref('');
</script>
