
<template>
  <div>
    <h2 class="twymx-text-2xl twymx-font-bold twymx-text-center twymx-text-gray-900">Choose Verification Method</h2>
    <p class="twymx-text-center twymx-text-sm twymx-text-gray-600 twymx-mt-2">How would you like to verify it's you?</p>
    <div class="twymx-mt-6 twymx-space-y-4">
      <button 
        @click="$emit('select-method', 'email')"
        class="twymx-w-full twymx-flex twymx-justify-center twymx-py-2 twymx-px-4 border twymx-border-transparent twymx-rounded-md twymx-shadow-sm twymx-text-sm twymx-font-medium twymx-text-white twymx-bg-indigo-600 hover:twymx-bg-indigo-700 focus:twymx-outline-none focus:twymx-ring-2 focus:twymx-ring-offset-2 focus:twymx-ring-indigo-500"
      >
        Verify with Email OTP
      </button>
      <button 
        @click="$emit('select-method', 'biometric')"
        class="twymx-w-full twymx-flex twymx-justify-center twymx-py-2 twymx-px-4 border twymx-border-gray-300 twymx-rounded-md twymx-shadow-sm twymx-text-sm twymx-font-medium twymx-text-gray-700 twymx-bg-white hover:twymx-bg-gray-50"
      >
        Verify with Biometrics
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  'select-method': [method: 'email' | 'biometric'];
}>();
</script>
