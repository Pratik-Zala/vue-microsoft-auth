import type { AuthComposable, LoginData, RegisterData, VerifyLogin } from '../types';
import { getApiClient } from '../utils/apiClient';

// Helper functions for WebAuthn
const base64UrlToArrayBuffer = (base64url: string): ArrayBuffer => {
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

  const login = async (userData: LoginData): Promise<any> => {
    const response = await apiClient.post(`/auth/login`, userData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = response.data;
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return response;
  };

  const verifyLogin = async (userData: VerifyLogin): Promise<any> => {
    const response = await apiClient.post(`/auth/login/verify`, userData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response;
  };

  const register = async (userData: RegisterData): Promise<any> => {
    const response = await apiClient.post(`/auth/register`, userData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const data = response.data;

    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    return response;
  };

  const sendRegisterOtp = async (email: string): Promise<void> => {
    await apiClient.post(`/auth/register/send-otp`, { email }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  };

  const sendLoginOtp = async (email: string): Promise<void> => {
    await apiClient.post(`/auth/login/send-otp`, { email }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  };

  const verifyRegistration = async (email: string, otp: string): Promise<void> => {
    await apiClient.post(`/auth/register/verify`, { email, otp }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  };

  const registerBiometrics = async (email: string): Promise<any> => {
    try {
      // Get registration options from backend
      const optionsResponse = await apiClient.post(`/auth/webauthn/register/options`, { email }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const options = optionsResponse.data;
      // Convert base64url to ArrayBuffer
      options.challenge = base64UrlToArrayBuffer(options.challenge);
      if (options.user) {
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
      // Send to backend for verification
      const response = await apiClient.post(`/auth/webauthn/register/verify`, {
        ...credentialForServer,
        challengeToken: options.challengeToken,
        email,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response;
    } catch (error: any) {
      console.log("Register biometrics failedddd error",error)
      if (error instanceof Error && error.name === 'NotAllowedError') {
        throw new Error('Biometric registration was cancelled');
      }
      throw error;
    }
  };

  const verifyBiometrics = async (email: string): Promise<any> => {
    try {
      // Get login options from backend
      const optionsResponse = await apiClient.post(`/auth/webauthn/login/options`, { email }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const options = optionsResponse.data;
      // Convert base64url to ArrayBuffer
      options.challenge = base64UrlToArrayBuffer(options.challenge);
      if (options.allowCredentials) {
        for (const cred of options.allowCredentials) {
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
      // Send to backend for verification
      const response = await apiClient.post(`/auth/webauthn/login/verify`, {
        email,
        data: credentialForServer,
        challengeToken: options.challengeToken,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = response.data;
      if (data.token) {
        return response;
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
    verifyRegistration,
    registerBiometrics,
    login,
    verifyLogin,
    verifyBiometrics
  };
};