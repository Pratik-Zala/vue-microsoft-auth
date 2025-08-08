
import type { AuthComposable, LoginData, RegisterData, VerifyLogin } from '../types';
import { getApiClient } from '../utils/apiClient';

const base64UrlToArrayBuffer = (base64Url: string): ArrayBuffer => {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

const arrayBufferToBase64Url = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = window.btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

export function useAuth(): AuthComposable {
  const login = async (userData: LoginData): Promise<any> => {
    const apiClient = getApiClient();
    const response = await apiClient.post(`/auth/login`, userData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = response.data;
    if (data.token) {
      localStorage.setItem('microsoft_auth_token', JSON.stringify({
        accessToken: data.token,
        expiresAt: Date.now() + (data.expiresIn * 1000),
      }));
    }
    return response;
  };

  const verifyLogin = async (userData: VerifyLogin): Promise<any> => {
    const apiClient = getApiClient();
    const response = await apiClient.post(`/auth/login/verify`, userData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response;
  };

  const register = async (userData: RegisterData): Promise<any> => {
    const apiClient = getApiClient();
    const response = await apiClient.post(`/register`, userData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = response.data;
    if (data.token) {
      localStorage.setItem('microsoft_auth_token', JSON.stringify({
        accessToken: data.token,
        expiresAt: Date.now() + (data.expiresIn * 1000),
      }));
    }

    return response;
  };

  const sendOtp = async (email: string): Promise<void> => {
    const apiClient = getApiClient();
    await apiClient.post(`/register/send-otp`, { email }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  };

  const verifyRegistration = async (email: string, otp: string): Promise<void> => {
    const apiClient = getApiClient();
    await apiClient.post(`/register/verify`, { email, otp }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  };

  const registerBiometrics = async (email: string): Promise<any> => {
    try {
      const apiClient = getApiClient();
      // Get registration options from backend
      const optionsResponse = await apiClient.post(`/webauthn/register/options`, { email }, {
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
      const response = await apiClient.post(`/webauthn/register/verify`, {
        ...credentialForServer,
        challengeToken: options.challengeToken,
        email,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = response.data;
      if (!data.success) {
        throw new Error('Biometric registration failed');
      }
      return response;
    } catch (error: any) {
      if (error instanceof Error && error.name === 'NotAllowedError') {
        throw new Error('Biometric registration was cancelled');
      }
      throw error;
    }
  };

  const verifyBiometrics = async (email: string): Promise<any> => {
    const apiClient = getApiClient();
    try {
      // Get login options from backend
      const optionsResponse = await apiClient.post(`/webauthn/login/options`, { email }, {
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
      const response = await apiClient.post(`/webauthn/login/verify`, {
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
    login,
    verifyLogin,
    register, sendOtp, verifyRegistration, registerBiometrics, verifyBiometrics
  }

}

