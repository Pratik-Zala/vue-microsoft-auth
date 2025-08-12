
<template>
  <div>
    <h2 class="text-2xl font-bold text-center text-gray-900">Login</h2>
    <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
        <div class="mt-1">
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
        </div>
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <div class="mt-1">
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
        </div>
      </div>
      <div>
        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {{ isLoading ? 'Signing in...' : 'Sign in' }}
        </button>
      </div>
    </form>

    <div class="relative my-4">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-300"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-white text-gray-500">Or continue with</span>
      </div>
    </div>

    <div>
      <button 
        @click="$emit('microsoft-signin')"
        class="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <img 
          class="h-5 w-5 mr-2"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/240px-Microsoft_logo.svg.png"
          alt="Microsoft logo" 
        />
        Sign in with Microsoft
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
});

const emit = defineEmits<{
  submit: [credentials: { email: string; password: string }];
  'microsoft-signin': [];
}>();

const email = ref('');
const password = ref('');

const handleSubmit = () => {
  emit('submit', {
    email: email.value,
    password: password.value
  });
};

defineExpose({
  email,
  password
});
</script>
