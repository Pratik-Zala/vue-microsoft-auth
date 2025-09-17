
<template>
  <div>
    <h2 class="twymx-text-2xl twymx-font-bold twymx-text-center twymx-text-gray-900">Enter OTP</h2>
    <p class="twymx-text-center twymx-text-sm twymx-text-gray-600 twymx-mt-2">
      An OTP has been sent to {{ email }}.
    </p>
    <form @submit.prevent="$emit('verify', otp)" class="twymx-mt-8 twymx-space-y-6">
      <div>
        <label for="otp" class="twymx-block twymx-text-sm twymx-font-medium twymx-text-gray-700">One-Time Password</label>
        <div class="twymx-mt-1">
          <input 
            type="text" 
            id="otp" 
            v-model="otp" 
            required
            class="twymx-w-full twymx-px-3 twymx-py-2 border twymx-border-gray-300 twymx-rounded-md twymx-shadow-sm twymx-placeholder-gray-400 focus:twymx-outline-none focus:twymx-ring-indigo-500 focus:twymx-border-indigo-500 sm:twymx-text-sm"
          >
        </div>
      </div>
      <div class="twymx-space-y-4">
        <button 
          type="submit" 
          :disabled="isLoading"
          class="twymx-w-full twymx-flex twymx-justify-center twymx-py-2 twymx-px-4 border twymx-border-transparent twymx-rounded-md twymx-shadow-sm twymx-text-sm twymx-font-medium twymx-text-white twymx-bg-indigo-600 hover:twymx-bg-indigo-700 focus:twymx-outline-none focus:twymx-ring-2 focus:twymx-ring-offset-2 focus:twymx-ring-indigo-500 disabled:twymx-opacity-50"
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
