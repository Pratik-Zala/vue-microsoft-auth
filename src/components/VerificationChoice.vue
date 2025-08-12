
<template>
  <div>
    <h2 class="text-2xl font-bold text-center text-gray-900">Choose Verification Method</h2>
    <p class="text-center text-sm text-gray-600 mt-2">How would you like to verify it's you?</p>
    <div class="mt-6 space-y-4">
      <button 
        @click="$emit('select-method', 'email')"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Verify with Email OTP
      </button>
      <button 
        @click="$emit('select-method', 'biometric')"
        class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
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
