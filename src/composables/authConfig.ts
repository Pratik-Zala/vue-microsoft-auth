let apiBaseUrl = '';

export function setAuthApiBaseUrl(url: string) {
  apiBaseUrl = url;
}

export function getAuthApiBaseUrl(): string {
  if (!apiBaseUrl) {
    throw new Error('API base URL not set. Please call setAuthApiBaseUrl(url) during app initialization.');
  }
  return apiBaseUrl;
}