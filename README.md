
# Vue Microsoft Auth Plugin

A comprehensive Vue.js 3 plugin for Microsoft authentication with OAuth2, including biometric authentication support and additional auth utilities.

## Features

- 🔐 Microsoft OAuth2 authentication
- 👆 Biometric authentication support
- 🔄 Automatic token refresh
- 📱 Responsive auth components
- 🛡️ TypeScript support
- 🎨 Customizable UI components
- 🚀 Easy integration
- 📊 Built-in error handling

## Installation

```bash
npm install vue-microsoft-auth
```

## Quick Start

### 1. Install the Plugin

**Important: You must provide the `apiBaseUrl` during plugin installation. This is required and cannot be set later.**

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import MicrosoftAuth from 'vue-microsoft-auth'

const app = createApp(App)

app.use(MicrosoftAuth, {
  apiBaseUrl: 'https://your-backend-api.com', // Required: Your authentication API base URL
  autoRefresh: true,
  debug: process.env.NODE_ENV === 'development'
})

app.mount('#app')
```

**Note:** The `apiBaseUrl` must be provided during plugin initialization. The plugin will throw an error if this required option is missing.

### 2. Use in Components

```vue
<template>
  <div>
    <div v-if="!isAuthenticated()">
      <MicrosoftSignInButton @success="handleSignInSuccess" />
      <MicrosoftSignUpButton @success="handleSignUpSuccess" />
    </div>
    
    <div v-else>
      <p>Welcome, {{ user?.displayName }}!</p>
      <button @click="signOut">Sign Out</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  useMicrosoftAuth, 
  MicrosoftSignInButton, 
  MicrosoftSignUpButton 
} from 'vue-microsoft-auth'

const { signOut, getUser, isAuthenticated } = useMicrosoftAuth()
const user = ref(getUser())

const handleSignInSuccess = (userData) => {
  user.value = userData
  console.log('Sign in successful:', userData)
}

const handleSignUpSuccess = (userData) => {
  user.value = userData
  console.log('Sign up successful:', userData)
}

onMounted(() => {
  user.value = getUser()
})
</script>
```

## Configuration Options

```typescript
interface MicrosoftAuthOptions {
  apiBaseUrl: string;           // Required: Your backend API URL
  redirectUri?: string;         // Optional: Custom redirect URI
  autoRefresh?: boolean;        // Optional: Auto-refresh tokens (default: true)
  refreshInterval?: number;     // Optional: Refresh interval in ms
  storagePrefix?: string;       // Optional: LocalStorage prefix
  debug?: boolean;             // Optional: Enable debug logging
}
```

### Required Configuration

- **`apiBaseUrl`**: This is the only required option. It must be the base URL of your authentication backend API (e.g., `https://api.yourdomain.com`). The plugin will make requests to endpoints like `${apiBaseUrl}/auth/microsoft/token`.

### Configuration Examples

```typescript
// Development
app.use(MicrosoftAuth, {
  apiBaseUrl: 'http://localhost:3000', // Your local backend
  debug: true
})

// Production
app.use(MicrosoftAuth, {
  apiBaseUrl: 'https://api.yourdomain.com', // Your production API
  autoRefresh: true,
  refreshInterval: 300000 // 5 minutes
})

// Using environment variables
app.use(MicrosoftAuth, {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL, // From .env file
  debug: import.meta.env.DEV
})
```

## Available Components

### MicrosoftSignInButton
Pre-built sign-in button with Microsoft branding.

```vue
<MicrosoftSignInButton 
  @success="handleSuccess"
  @error="handleError"
  :loading="isLoading"
  custom-class="my-signin-btn"
/>
```

### MicrosoftSignUpButton
Pre-built sign-up button for new user registration.

```vue
<MicrosoftSignUpButton 
  @success="handleSuccess"
  @error="handleError"
/>
```

### BiometricSetupButton
Button for setting up biometric authentication.

```vue
<BiometricSetupButton 
  :email="userEmail"
  @success="handleBiometricSetup"
  @error="handleError"
/>
```

### AuthContainer
Container component that handles different auth states.

```vue
<AuthContainer>
  <template #authenticated="{ user }">
    <p>Welcome {{ user.displayName }}!</p>
  </template>
  
  <template #unauthenticated>
    <MicrosoftSignInButton />
  </template>
</AuthContainer>
```

## Composables

### useMicrosoftAuth()

Main authentication composable for Microsoft OAuth.

```typescript
const {
  signIn,           // () => Promise<void>
  signOut,          // () => Promise<void>
  signUp,           // () => Promise<void>
  getUser,          // () => MicrosoftAuthUser | null
  isAuthenticated,  // () => boolean
  getAccessToken,   // () => string | null
  refreshToken      // () => Promise<string | null>
} = useMicrosoftAuth()
```

### useAuth()

Additional authentication utilities for email/password and biometric auth.

```typescript
const {
  register,           // (userData: RegisterData) => Promise<void>
  sendOtp,           // (email: string) => Promise<void>
  verifyRegistration, // (email: string, otp: string) => Promise<void>
  registerBiometrics, // (email: string) => Promise<any>
  verifyBiometrics   // (email: string) => Promise<any>
} = useAuth()
```

## TypeScript Support

The plugin is fully typed. Import types as needed:

```typescript
import type { 
  MicrosoftAuthUser, 
  MicrosoftAuthOptions,
  RegisterData,
  BiometricOptions 
} from 'vue-microsoft-auth'
```

## Backend Integration

Your backend should provide these endpoints:

- `POST /auth/microsoft/token` - Exchange OAuth code for tokens
- `POST /auth/refresh` - Refresh access token
- `POST /register` - Register new user
- `POST /register/send-otp` - Send OTP for verification
- `POST /register/verify` - Verify OTP

## Error Handling

The plugin provides structured error handling:

```typescript
import type { AuthError } from 'vue-microsoft-auth'

try {
  await signIn()
} catch (error: AuthError) {
  console.error(`Auth Error [${error.code}]:`, error.message)
  console.error('Details:', error.details)
}
```

## Development

```bash
# Install dependencies
npm install

# Build the plugin
npm run build

# Run in development mode
npm run dev
```

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## Support

For issues and questions, please use the GitHub issues page or contact our support team.
