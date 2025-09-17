
<template>
  <button @click="$emit('back')" 
    type="button"
    class="twymx-scope absolute top-6 left-6 text-gray-500 hover:text-gray-800"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
  </button>
</template>

<script setup lang="ts">
defineEmits<{
  back: []
}>();
</script>
