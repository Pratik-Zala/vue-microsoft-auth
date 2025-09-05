
// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  timestamp: string;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface ApiError {
  success: false;
  message: string;
  timestamp: string;
  errors?: string[];
}

export interface MicrosoftAuthOptions {
  /** Optional: Custom redirect URI after authentication */
  redirectUri?: string;
  /** Optional: Whether to automatically refresh tokens */
  autoRefresh?: boolean;
  /** Optional: Token refresh interval in milliseconds (default: 5 minutes before expiry) */
  refreshInterval?: number;
  /** Optional: Custom storage prefix for localStorage keys */
  storagePrefix?: string;
  /** Optional: Debug mode for additional logging */
  debug?: boolean;
}

export interface MicrosoftAuthUser {
  /** Unique user identifier */
  id: string;
  /** User's display name */
  displayName: string;
  /** User's email address */
  email: string;
  /** Optional: Access token for API requests */
  accessToken?: string;
  /** Optional: Refresh token for token renewal */
  refreshToken?: string;
  /** Optional: Token expiration timestamp */
  expiresAt?: number;
  /** Optional: Whether this is a newly registered user */
  isNewUser?: boolean;
  /** Optional: User's profile picture URL */
  profilePicture?: string;
  /** Optional: Additional user metadata */
  metadata?: Record<string, any>;
}

export interface MicrosoftAuthPlugin {
  install: (app: any, options: MicrosoftAuthOptions) => void;
}

export interface RouterPluginOptions {
  router: any; // Vue Router instance
  loginPath?: string;
  registerPath?: string;
  loginName?: string;
  registerName?: string;
}

export interface MicrosoftAuthComposable {
  /** Sign in with Microsoft OAuth */
  signIn: () => Promise<void>;
  /** Sign out and clear user session */
  signOut: () => Promise<void>;
  /** Get current authenticated user */
  getUser: () => MicrosoftAuthUser | null;
  /** Check if user is authenticated */
  isAuthenticated: () => boolean;
  /** Get current access token */
  getAccessToken: () => string | null;
  /** Refresh the access token */
  signUp: () => Promise<void>;
}


export interface VerifyLogin {
  email: string;
  otp: string;
  sessionToken?: string;  // Optional session token for 2FA completion
}

export interface LoginData {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
}

export interface RegisterData {
  /** User's full name */
  name: string;
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
  /** Optional: Additional user data */
  metadata?: Record<string, any>;
}

export interface BiometricOptions {
  /** Authentication challenge string */
  challenge: string;
  /** Challenge token for verification */
  challengeToken: string;
  /** Optional: Allowed credentials for authentication */
  allowCredentials?: Array<{
    id: string;
    type: string;
  }>;
  /** Optional: User information for biometric registration */
  user?: {
    id: string;
    name: string;
    displayName: string;
  };
}

export interface AuthError extends Error {
  /** Error code for programmatic handling */
  code: string;
  /** Additional error details */
  details?: any;
}

// Specific API Response Types for Auth Endpoints
export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  createdAt: string;
  updatedAt: string;
  provider?: string;
  providerId?: string;
  emailVerified: boolean;
  metaData?: any;
  passkeys?: Passkey[];
}

export interface Passkey {
  id: string;
  credentialID: string;
  publicKey: any;
  userId: string;
  counter: number;
  deviceType: string;
  backedUp: boolean;
  transports?: string;
}

export interface LoginResponse {
  message: string;
  success: boolean;
}

export interface RegisterResponse {
  message: string;
  user: User;
  token: string;
}

export interface VerifyLoginResponse {
  user: User;
  token: string;
}

export interface BiometricSetupResponse {
  success: boolean;
  token: string;
  user: User;
  message: string;
}

export interface BiometricVerifyResponse {
  success: boolean;
  token: string;
  user: User;
  isNewUser?: boolean;
}

export interface TwoFactorSessionResponse {
  requiresTwoFA: boolean;
  sessionToken: string;
  isNewUser: boolean;
  email: string;
}

export interface CompleteTwoFAResponse {
  user: User;
  token: string;
  isNewUser: boolean;
}

// Update AuthComposable to use typed responses
export interface AuthComposable {
  login: (userData: LoginData) => Promise<ApiResponse<LoginResponse>>;
  verifyLogin: (userData: VerifyLogin) => Promise<ApiResponse<VerifyLoginResponse>>;
  register: (userData: RegisterData) => Promise<ApiResponse<RegisterResponse>>;
  sendLoginOtp: (email: string) => Promise<ApiResponse<{ otp: string }>>;
  sendRegisterOtp: (email: string) => Promise<ApiResponse<void>>;
  verifyRegistration: (email: string, otp: string) => Promise<ApiResponse<void>>;
  registerBiometrics: (email: string, sessionToken?: string) => Promise<ApiResponse<BiometricSetupResponse>>;
  verifyBiometrics: (email: string, sessionToken?: string) => Promise<ApiResponse<BiometricVerifyResponse>>;
}

// Event types for plugin events
export interface AuthEvents {
  'auth:login': MicrosoftAuthUser;
  'auth:logout': void;
  'auth:token-refresh': string;
  'auth:error': AuthError;
}
