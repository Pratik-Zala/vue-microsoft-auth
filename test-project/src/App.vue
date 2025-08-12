<template>
  <div id="app">
    <div style="display: flex; gap: 20px;">
      <!-- Login Component -->
      <div style="flex: 1;">
        <h3>Login Component</h3>
        <ModularLoginComponent 
          :show-register-link="true"
          :api-base-url="'http://localhost:3000'"
          @success="handleSuccess"
          @error="handleError"
          @register="showRegister = true"
        />
      </div>

      <!-- Register Component -->
      <div style="flex: 1;" v-if="showRegister">
        <h3>Register Component</h3>
        <ModularRegisterComponent 
          :show-login-link="true"
          :api-base-url="'http://localhost:3000'"
          @success="handleSuccess"
          @error="handleError"
          @login="showRegister = false"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ModularLoginComponent, ModularRegisterComponent } from '@twymai/vue-twymx'

const showRegister = ref(false)

const handleSuccess = (user) => {
  console.log('Auth successful:', user)
}

const handleError = (error) => {
  console.error('Auth error:', error)
}
</script>