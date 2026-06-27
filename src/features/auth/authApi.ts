import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { AuthUser } from '../../types/auth';

// This API uses a plain base query — it sends the MSAL access token in the
// Authorization header and receives the enriched user profile (with role) from
// the backend. The token is passed explicitly, not pulled from Redux state,
// to avoid a circular dependency during initial auth setup.
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL as string }),
  endpoints: (builder) => ({
    getMe: builder.query<AuthUser, string>({
      query: (accessToken) => ({
        url: '/auth/me',
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }),
  }),
});

export const { useGetMeQuery, useLazyGetMeQuery } = authApi;
