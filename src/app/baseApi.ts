import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, loginRequest } from '../constants/msal';

const msalInstance = new PublicClientApplication(msalConfig);

async function getIdToken(): Promise<string | null> {
  await msalInstance.initialize();
  const account = msalInstance.getActiveAccount() ?? msalInstance.getAllAccounts()[0];
  if (!account) return null;
  try {
    const { idToken } = await msalInstance.acquireTokenSilent({ ...loginRequest, account });
    return idToken;
  } catch {
    return null;
  }
}

export const authenticatedBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL as string,
  prepareHeaders: async (headers) => {
    const token = await getIdToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});
