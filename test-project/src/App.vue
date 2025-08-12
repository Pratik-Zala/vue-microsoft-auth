
<template>
  <div id="app">
    <ModularLoginComponent 
      :show-register-link="true"
      :api-base-url="'http://localhost:3000'"
      @success="handleSuccess"
      @error="handleError"
    />
  </div>
</template>

<script setup>
import { ModularLoginComponent } from '@twymai/vue-twymx'

const handleSuccess = (user) => {
  console.log('Login successful:', user)
}

const handleError = (error) => {
  console.error('Login error:', error)
}
</script>
</template>

<script setup>
import { ModularLoginComponent } from '@twymai/vue-twymx'

const handleSuccess = (user) => {
  console.log('Login successful:', user)
}

const handleError = (error) => {
  console.error('Login error:', error)
}
</script>
