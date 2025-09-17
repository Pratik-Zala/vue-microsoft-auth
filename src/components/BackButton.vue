
<template>
  <button 
    @click="$emit('back')" 
    type="button"
    class="twymx-absolute twymx-top-6 twymx-left-6 twymx-text-gray-500 hover:twymx-text-gray-800"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="twymx-h-6 twymx-w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
  </button>
</template>

<script setup lang="ts">
defineEmits<{
  back: []
}>();
</script>
