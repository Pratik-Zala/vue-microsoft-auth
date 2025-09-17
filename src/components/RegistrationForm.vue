
<template>
  <div>
    <h2 class="twymx-text-2xl twymx-font-bold twymx-text-center twymx-text-gray-900">Create Account</h2>
    <form @submit.prevent="handleSubmit" class="twymx-mt-8 twymx-space-y-6">
      <div>
        <label for="name" class="twymx-block twymx-text-sm twymx-font-medium twymx-text-gray-700">Full Name</label>
        <div class="twymx-mt-1">
          <input 
            type="text" 
            id="name" 
            v-model="name" 
            required
            class="twymx-w-full twymx-px-3 twymx-py-2 border twymx-border-gray-300 twymx-rounded-md twymx-shadow-sm twymx-placeholder-gray-400 focus:twymx-outline-none focus:twymx-ring-indigo-500 focus:twymx-border-indigo-500 sm:twymx-text-sm"
          >
        </div>
      </div>
      <div>
        <label for="email" class="twymx-block twymx-text-sm twymx-font-medium twymx-text-gray-700">Email Address</label>
        <div class="twymx-mt-1">
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required
            class="twymx-w-full twymx-px-3 twymx-py-2 border twymx-border-gray-300 twymx-rounded-md twymx-shadow-sm twymx-placeholder-gray-400 focus:twymx-outline-none focus:twymx-ring-indigo-500 focus:twymx-border-indigo-500 sm:twymx-text-sm"
          >
        </div>
      </div>
      <div>
        <label for="password" class="twymx-block twymx-text-sm twymx-font-medium twymx-text-gray-700">Password</label>
        <div class="twymx-mt-1">
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required
            class="twymx-w-full twymx-px-3 twymx-py-2 border twymx-border-gray-300 twymx-rounded-md twymx-shadow-sm twymx-placeholder-gray-400 focus:twymx-outline-none focus:twymx-ring-indigo-500 focus:twymx-border-indigo-500 sm:twymx-text-sm"
          >
        </div>
      </div>
      <div>
        <button 
          type="submit" 
          :disabled="isLoading"
          class="twymx-w-full twymx-flex twymx-justify-center twymx-py-2 twymx-px-4 border twymx-border-transparent twymx-rounded-md twymx-shadow-sm twymx-text-sm twymx-font-medium twymx-text-white twymx-bg-indigo-600 hover:twymx-bg-indigo-700 focus:twymx-outline-none focus:twymx-ring-2 focus:twymx-ring-offset-2 focus:twymx-ring-indigo-500 disabled:twymx-opacity-50"
        >
          {{ isLoading ? 'Creating account...' : 'Create Account' }}
        </button>
      </div>
    </form>

    <div class="twymx-relative my-4">
      <div class="twymx-absolute inset-0 twymx-flex twymx-items-center">
        <div class="twymx-w-full border-t twymx-border-gray-300"></div>
      </div>
      <div class="twymx-relative twymx-flex twymx-justify-center twymx-text-sm">
        <span class="twymx-px-2 twymx-bg-white twymx-text-gray-500">Or continue with</span>
      </div>
    </div>

    <div>
      <button 
        @click="$emit('microsoft-signup')"
        class="twymx-w-full twymx-flex twymx-items-center twymx-justify-center twymx-py-2 twymx-px-4 border twymx-border-gray-300 twymx-rounded-md twymx-shadow-sm twymx-text-sm twymx-font-medium twymx-text-gray-700 twymx-bg-white hover:twymx-bg-gray-50"
      >
        <img 
          class="twymx-h-5 twymx-w-5 twymx-mr-2"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/240px-Microsoft_logo.svg.png"
          alt="Microsoft logo" 
        />
        Sign up with Microsoft
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
  submit: [formData: { name: string; email: string; password: string }];
  'microsoft-signup': [];
}>();

const name = ref('');
const email = ref('');
const password = ref('');

const handleSubmit = () => {
  emit('submit', {
    name: name.value,
    email: email.value,
    password: password.value
  });
};

defineExpose({
  name,
  email,
  password
});
</script>
