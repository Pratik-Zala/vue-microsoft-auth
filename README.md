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

### 1. Install the Plugins

**Important: You must install both the API Client plugin and the Microsoft Auth plugin. The API Client plugin must be installed first.**

```typescript
// main.ts
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import MicrosoftAuth, { ApiClientPlugin, RouterPlugin } from 'vue-microsoft-auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Your existing routes
  ]
})

const app = createApp(App)

// 1. First, install the API Client plugin with your base URL
app.use(ApiClientPlugin, {
  baseUrl: 'https://your-backend-api.com' // Required: Your authentication API base URL
})

// 2. Then install the Microsoft Auth plugin with optional settings
app.use(MicrosoftAuth, {
  autoRefresh: true,
  debug: process.env.NODE_ENV === 'development'
})

// 3. Optional: Install the Router plugin for automatic route registration
app.use(RouterPlugin, {
  router: router, // Required: Your Vue Router instance
  loginPath: '/login', // Optional: Custom login route path (default: '/login')
  registerPath: '/register', // Optional: Custom register route path (default: '/register')
  loginName: 'Login', // Optional: Custom login route name (default: 'Login')
  registerName: 'Register' // Optional: Custom register route name (default: 'Register')
})

app.use(router)
app.mount('#app')
```

**Note:** The `ApiClientPlugin` must be installed before the `MicrosoftAuth` plugin, as it provides the API base URL configuration.

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

### API Client Plugin Options
```typescript
interface ApiClientOptions {
  baseUrl: string;              // Required: Your backend API URL
}
```

### Microsoft Auth Plugin Options
```typescript
interface MicrosoftAuthOptions {
  redirectUri?: string;         // Optional: Custom redirect URI
  autoRefresh?: boolean;        // Optional: Auto-refresh tokens (default: true)
  refreshInterval?: number;     // Optional: Refresh interval in ms
  storagePrefix?: string;       // Optional: LocalStorage prefix
  debug?: boolean;             // Optional: Enable debug logging
}
```

### Router Plugin Options
```typescript
interface RouterPluginOptions {
  router: Router;               // Required: Vue Router instance
  loginPath?: string;          // Optional: Custom login route path (default: '/login')
  registerPath?: string;       // Optional: Custom register route path (default: '/register')
  loginName?: string;          // Optional: Custom login route name (default: 'Login')
  registerName?: string;       // Optional: Custom register route name (default: 'Register')
}
```

### Required Configuration

- **`baseUrl`** (ApiClientPlugin): This is the only required option. It must be the base URL of your authentication backend API (e.g., `https://api.yourdomain.com`). The plugin will make requests to endpoints like `${baseUrl}/auth/microsoft/token`.

### Configuration Examples

```typescript
// Development
app.use(ApiClientPlugin, {
  baseUrl: 'http://localhost:3000' // Your local backend
})
app.use(MicrosoftAuth, {
  debug: true
})

// Production
app.use(ApiClientPlugin, {
  baseUrl: 'https://api.yourdomain.com' // Your production API
})
app.use(MicrosoftAuth, {
  autoRefresh: true,
  refreshInterval: 300000 // 5 minutes
})

// Using environment variables
app.use(ApiClientPlugin, {
  baseUrl: import.meta.env.VITE_API_BASE_URL // From .env file
})
app.use(MicrosoftAuth, {
  debug: import.meta.env.DEV
})
```

## Automatic Route Registration

The RouterPlugin automatically registers `/login` and `/register` routes in your Vue Router when installed. This eliminates the need to manually define these routes in your application.

### Features
- Automatically adds `/login` and `/register` routes
- Uses the built-in `ModularLoginComponent` and `ModularRegisterComponent`
- Customizable route paths and names
- Checks for existing routes to avoid conflicts
- Adds metadata to identify auto-registered routes

### Usage
```typescript
import { RouterPlugin } from 'vue-microsoft-auth'

app.use(RouterPlugin, {
  router: router,
  loginPath: '/auth/login',    // Custom login path
  registerPath: '/auth/signup', // Custom register path
  loginName: 'AuthLogin',      // Custom route name
  registerName: 'AuthSignup'   // Custom route name
})
```

After installation, you can navigate to these routes using:
```typescript
// In your components
this.$router.push('/login')
this.$router.push('/register')

// Or with route names
this.$router.push({ name: 'Login' })
this.$router.push({ name: 'Register' })
```

### MicrosoftAuthCallback

Component for handling Microsoft OAuth callback after authentication:

```vue
<template>
  <MicrosoftAuthCallback 
    :redirect-path="'/dashboard'"
    :on-success="handleAuthSuccess"
    :on-error="handleAuthError"
    @success="onCallbackSuccess"
    @error="onCallbackError"
  />
</template>

<script setup>
import { MicrosoftAuthCallback } from 'vue-microsoft-auth'

const handleAuthSuccess = (data) => {
  console.log('Authentication successful:', data)
}

const handleAuthError = (error) => {
  console.error('Authentication error:', error)
}

const onCallbackSuccess = (data) => {
  console.log('Callback success:', data)
}

const onCallbackError = (error) => {
  console.error('Callback error:', error)
}
</script>
```

### ModularRegisterComponent

A complete modular registration component:

```vue
<template>
  <ModularRegisterComponent 
    :show-login-link="true"
    :api-base-url="apiBaseUrl"
    :on-success="handleSuccess"
    :on-error="handleError"
    @success="onAuthSuccess"
    @error="onAuthError"
    @login="showLoginForm"
  />
</template>

<script setup>
import { ModularRegisterComponent } from 'vue-microsoft-auth'

const apiBaseUrl = 'https://your-backend-api.com'

const handleSuccess = (data) => {
  // Handle successful registration
  console.log('Registration successful:', data)
}

const handleError = (error) => {
  // Handle registration error
  console.error('Registration error:', error)
}

const onAuthSuccess = (user) => {
  console.log('User authenticated:', user)
}

const onAuthError = (error) => {
  console.error('Auth error:', error)
}

const showLoginForm = () => {
  // Handle login action
}
</script>
```

## Available Components

### CompleteAuthComponent

A comprehensive authentication component that includes all authentication flows in one component:

```vue
<template>
  <CompleteAuthComponent 
    :show-register-link="true"
    :auto-redirect="true"
    redirect-path="/dashboard"
    @success="onAuthSuccess"
    @error="onAuthError"
    @register="showRegisterForm"
  />
</template>

<script setup>
import { CompleteAuthComponent } from 'vue-microsoft-auth'

const onAuthSuccess = (user) => {
  console.log('User authenticated:', user)
}

const onAuthError = (error) => {
  console.error('Auth error:', error)
}

const showRegisterForm = () => {
  // Handle register action
}
</script>
```

**Props:**
- `showRegisterLink` (boolean, default: `true`): Show register link at bottom
- `autoRedirect` (boolean, default: `true`): Automatically redirect after successful auth
- `redirectPath` (string, default: `'/'`): Path to redirect to after successful auth

**Events:**
- `@success`: Emitted when authentication is successful (receives user object)
- `@error`: Emitted when an error occurs (receives error message)
- `@register`: Emitted when register link is clicked

**Features:**
- Email/password authentication
- Microsoft OAuth integration
- Biometric authentication support
- OTP verification via email
- Multi-step authentication flow
- Built-in loading states and error handling
- Responsive design

### ModularLoginComponent

A complete modular authentication component that provides the same functionality as CompleteAuthComponent but with a different UI design:

```vue
<template>
  <ModularLoginComponent 
    :show-register-link="true"
    :api-base-url="apiBaseUrl"
    :on-success="handleSuccess"
    :on-error="handleError"
    @success="onAuthSuccess"
    @error="onAuthError"
    @register="showRegisterForm"
  />
</template>

<script setup>
import { ModularLoginComponent } from 'vue-microsoft-auth'

const apiBaseUrl = 'https://your-backend-api.com'

const handleSuccess = (data) => {
  // Handle successful authentication
  console.log('Login successful:', data)
}

const handleError = (error) => {
  // Handle authentication error
  console.error('Login error:', error)
}

const onAuthSuccess = (user) => {
  console.log('User authenticated:', user)
}

const onAuthError = (error) => {
  console.error('Auth error:', error)
}

const showLoginForm = () => {
  // Handle register action
}
</script>
```

## Individual Components

You can also use the individual components separately for more customization:

### BackButton
```vue
<BackButton @back="handleBack" />
```

### CredentialsForm
```vue
<CredentialsForm 
  :is-loading="isLoading"
  @submit="handleCredentialsSubmit"
  @microsoft-signin="signInWithMicrosoft"
/>
```

### VerificationChoice
```vue
<VerificationChoice @select-method="selectVerificationMethod" />
```

### OtpVerification
```vue
<OtpVerification 
  :email="userEmail"
  :is-loading="isLoading"
  @verify="verifyOtpLogin"
/>
``` with Tailwind CSS classes

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