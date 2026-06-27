import type { Configuration, RedirectRequest } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID as string,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID as string}`,
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI as string,
    postLogoutRedirectUri: '/',
  },
  cache: {
    cacheLocation: 'sessionStorage',
  },
};

// Scopes for login — produces an ID token the API will validate.
// We use the ID token (not an access token) because both the UI and API share
// the same App Registration, and Azure blocks an app requesting an access
// token for itself (AADSTS90009).
export const loginRequest: RedirectRequest = {
  scopes: ['openid', 'profile', 'email'],
};
