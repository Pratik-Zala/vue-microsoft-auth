export interface MicrosoftAuthOptions {
  apiBaseUrl: string;
}

export interface MicrosoftAuthUser {
  id: string;
  displayName: string;
  email: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  isNewUser?: boolean; // Backend can indicate if this is a new user
}

export interface MicrosoftAuthPlugin {
  install: (app: any, options: MicrosoftAuthOptions) => void;
}

export interface MicrosoftAuthComposable {
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  getUser: () => MicrosoftAuthUser | null;
  isAuthenticated: () => boolean;
  getAccessToken: () => string | null;
  refreshToken: () => Promise<string | null>;
  signUp: () => Promise<void>;
}

export interface AuthComposable {
  register: (userData: RegisterData) => Promise<void>;
  sendOtp: (email:string) => Promise<void>;
  verifyRegistration: (email: string,otp:string) => Promise<any>;
  registerBiometrics: (email:string) => Promise<any>;
  verifyBiometrics: (email: string) => Promise<any>;
}


export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface BiometricOptions {
  challenge: string;
  challengeToken: string;
  allowCredentials?: Array<{
    id: string;
    type: string;
  }>;
  user?: {
    id: string;
    name: string;
    displayName: string;
  };
} 