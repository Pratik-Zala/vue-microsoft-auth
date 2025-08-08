
export interface MicrosoftAuthOptions {
  /** Base URL for the authentication API */
  apiBaseUrl: string;
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
  refreshToken: () => Promise<string | null>;
  /** Sign up with Microsoft OAuth */
  signUp: () => Promise<void>;
}

export interface AuthComposable {
  /** Register a new user with email/password */
  register: (userData: RegisterData) => Promise<void>;
  /** Send OTP to email for verification */
  sendOtp: (email: string) => Promise<void>;
  /** Verify registration with OTP */
  verifyRegistration: (email: string, otp: string) => Promise<any>;
  /** Register biometric authentication */
  registerBiometrics: (email: string) => Promise<any>;
  /** Verify biometric authentication */
  verifyBiometrics: (email: string) => Promise<any>;
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

// Event types for plugin events
export interface AuthEvents {
  'auth:login': MicrosoftAuthUser;
  'auth:logout': void;
  'auth:token-refresh': string;
  'auth:error': AuthError;
}
