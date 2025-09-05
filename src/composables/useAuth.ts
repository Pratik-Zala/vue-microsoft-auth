import type {
  AuthComposable,
  BiometricSetupResponse,
  BiometricVerifyResponse,
  LoginData,
  LoginResponse,
  RegisterData,
  RegisterResponse,
  VerifyLogin,
  VerifyLoginResponse
} from '../types';
import { getApiClient } from '../utils/apiClient';

// Helper functions for WebAuthn
const base64UrlToArrayBuffer = (base64url: string): ArrayBuffer => {
  if (!base64url || typeof base64url !== 'string') {
    throw new Error('Invalid base64url input: ' + base64url);
  }
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const binStr = atob(base64);
  const len = binStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binStr.charCodeAt(i);
  }
  return bytes.buffer;
};

const arrayBufferToBase64Url = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binStr = '';
  bytes.forEach((byte) => {
    binStr += String.fromCharCode(byte);
  });
  const base64 = btoa(binStr);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

export function useAuth(): AuthComposable {
  const apiClient = getApiClient();

  const login = async (userData: LoginData): Promise<LoginResponse | undefined> => {
    const response = await apiClient.post<LoginResponse>(`/auth/login`, userData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const apiResponse = response.data;
    // Note: Login typically doesn't return a token immediately, it returns a success message
    // Token is provided after 2FA verification
    return apiResponse.data;
  };

  const verifyLoginOtp = async (userData: VerifyLogin): Promise<VerifyLoginResponse | undefined> => {
    // Prepare headers - include Session token if provided for 2FA flow
    const headers: any = {
      'Content-Type': 'application/json',
    };

    const { sessionToken, ...requestData } = userData;

    if (sessionToken) {
      headers.Authorization = `Session ${sessionToken}`;
    }

    const response = await apiClient.post<VerifyLoginResponse>(`/auth/2fa/verify-email`, requestData, {
      headers
    });

    const apiResponse = response.data;
    if (apiResponse.data?.token) {
      localStorage.setItem('token', apiResponse.data.token);
    }
    return apiResponse.data;
  };

  const register = async (userData: RegisterData): Promise<RegisterResponse | undefined> => {
    const response = await apiClient.post<RegisterResponse>(`/auth/register`, userData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const apiResponse = response.data;
    return apiResponse.data;
  };

  const sendRegisterOtp = async (email: string): Promise<void> => {
    await apiClient.post<void>(`/auth/public/email/send-verification`, { email }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return;
  };

  const sendLoginOtp = async (email: string, sessionToken?: string): Promise<{ otp: string } | undefined> => {
    // Prepare headers - include Session token if provided for 2FA flow
    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (sessionToken) {
      headers.Authorization = `Session ${sessionToken}`;
    }

    const response = await apiClient.post<{ otp: string }>(`/auth/2fa/send-email`, { email }, {
      headers
    });
    return response.data.data;
  };

  const verifyRegistrationOtp = async (email: string, otp: string): Promise<void> => {
    await apiClient.post<void>(`/auth/public/email/verify`, { email, otp }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  };

  const registerBiometrics = async (email: string, sessionToken?: string): Promise<BiometricSetupResponse | undefined> => {
    try {
      // Prepare headers - include Session token if provided for 2FA flow
      const headers: any = {
        'Content-Type': 'application/json',
      };

      if (sessionToken) {
        headers.Authorization = `Session ${sessionToken}`;
      }

      // Get registration options from backend
      const optionsResponse = await apiClient.post<any>(`/auth/webauthn/setup/options`, { email }, {
        headers
      });

      // Debug logging
      console.log('Full WebAuthn registration response:', optionsResponse.data);
      console.log('WebAuthn registration options data:', optionsResponse.data.data);

      const options = optionsResponse.data.data;

      if (!options) {
        throw new Error('No registration options data received from server');
      }

      console.log('WebAuthn registration options received:', options);

      // Validate and convert challenge
      if (!options.challenge) {
        throw new Error('No challenge received from server');
      }

      // Convert base64url to ArrayBuffer
      options.challenge = base64UrlToArrayBuffer(options.challenge);

      if (options.user && options.user.id) {
        options.user.id = base64UrlToArrayBuffer(options.user.id);
      }
      // Create credential
      const credential = await navigator.credentials.create({ publicKey: options });
      if (!credential) {
        throw new Error('Failed to create biometric credential');
      }
      if (credential.type !== 'public-key') {
        throw new Error('Invalid credential type');
      }
      const publicKeyCredential = credential as PublicKeyCredential;
      const attestationResponse = publicKeyCredential.response as AuthenticatorAttestationResponse;
      // Prepare credential for server
      const credentialForServer = {
        id: publicKeyCredential.id,
        rawId: arrayBufferToBase64Url(publicKeyCredential.rawId),
        type: publicKeyCredential.type,
        response: {
          attestationObject: arrayBufferToBase64Url(attestationResponse.attestationObject),
          clientDataJSON: arrayBufferToBase64Url(attestationResponse.clientDataJSON),
        },
      };
      // Prepare headers for verification - include Session token if provided
      const verifyHeaders: any = {
        'Content-Type': 'application/json',
      };

      if (sessionToken) {
        verifyHeaders.Authorization = `Session ${sessionToken}`;
      }

      // Send to backend for verification
      const response = await apiClient.post<BiometricSetupResponse>(`/auth/webauthn/setup/verify`, {
        ...credentialForServer,
        challengeToken: options.challengeToken,
        email,
      }, {
        headers: verifyHeaders
      });

      const apiResponse = response.data;
      if (apiResponse.data?.token) {
        localStorage.setItem('token', apiResponse.data.token);
      }
      return apiResponse.data;
    } catch (error: any) {
      console.log("Register biometrics failedddd error", error)
      if (error instanceof Error && error.name === 'NotAllowedError') {
        throw new Error('Biometric registration was cancelled');
      }
      throw error;
    }
  };

  const verifyBiometrics = async (email: string, sessionToken?: string): Promise<BiometricVerifyResponse | undefined> => {
    try {
      // Prepare headers - include Session token if provided for 2FA flow
      const headers: any = {
        'Content-Type': 'application/json',
      };

      if (sessionToken) {
        headers.Authorization = `Session ${sessionToken}`;
      }

      // Get login options from backend
      const optionsResponse = await apiClient.post<any>(`/auth/webauthn/authenticate/options`, { email }, {
        headers
      });

      // Debug logging
      console.log('Full WebAuthn response:', optionsResponse.data);
      console.log('WebAuthn options data:', optionsResponse.data.data);

      const options = optionsResponse.data.data;

      if (!options) {
        throw new Error('No options data received from server');
      }

      console.log('WebAuthn options received:', options);

      // Validate and convert challenge
      if (!options.challenge) {
        throw new Error('No challenge received from server');
      }

      // Convert base64url to ArrayBuffer
      options.challenge = base64UrlToArrayBuffer(options.challenge);

      if (options.allowCredentials) {
        for (const cred of options.allowCredentials) {
          if (!cred.id) {
            console.warn('Credential missing ID:', cred);
            continue;
          }
          cred.id = base64UrlToArrayBuffer(cred.id);
        }
      }
      // Get credential
      const credential = await navigator.credentials.get({ publicKey: options });
      if (!credential) {
        throw new Error('Failed to get biometric credential');
      }
      if (credential.type !== 'public-key') {
        throw new Error('Invalid credential type');
      }
      const publicKeyCredential = credential as PublicKeyCredential;
      const assertionResponse = publicKeyCredential.response as AuthenticatorAssertionResponse;
      // Prepare credential for server
      const credentialForServer = {
        id: publicKeyCredential.id,
        rawId: arrayBufferToBase64Url(publicKeyCredential.rawId),
        type: publicKeyCredential.type,
        response: {
          authenticatorData: arrayBufferToBase64Url(assertionResponse.authenticatorData),
          clientDataJSON: arrayBufferToBase64Url(assertionResponse.clientDataJSON),
          signature: arrayBufferToBase64Url(assertionResponse.signature),
          userHandle: assertionResponse.userHandle ? arrayBufferToBase64Url(assertionResponse.userHandle) : null,
        },
      };
      // Prepare headers for verification - include Session token if provided
      const verifyHeaders: any = {
        'Content-Type': 'application/json',
      };

      if (sessionToken) {
        verifyHeaders.Authorization = `Session ${sessionToken}`;
      }

      // Send to backend for verification
      const response = await apiClient.post<BiometricVerifyResponse>(`/auth/webauthn/authenticate/verify`, {
        email,
        data: credentialForServer,
        challengeToken: options.challengeToken,
        sessionToken: sessionToken,  // Include sessionToken for 2FA completion
      }, {
        headers: verifyHeaders
      });

      const apiResponse = response.data;
      if (apiResponse.data?.token) {
        localStorage.setItem('token', apiResponse.data.token);
        return apiResponse.data;
      } else {
        throw new Error('Verification failed');
      }
    } catch (error: any) {
      if (error instanceof Error && error.name === 'NotAllowedError') {
        throw new Error('Biometric verification was cancelled');
      }
      throw error;
    }
  };

  return {
    register,
    sendRegisterOtp,
    sendLoginOtp,
    verifyRegistrationOtp,
    registerBiometrics,
    login,
    verifyLoginOtp,
    verifyBiometrics
  };
};