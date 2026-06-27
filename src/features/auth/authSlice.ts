import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, AuthUser } from '../../types/auth';

interface AuthRootState {
  auth: AuthState;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: AuthUser; accessToken: string }>,
    ) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    updateToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    clearCredentials(state) {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { setCredentials, updateToken, clearCredentials } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: AuthRootState) => state.auth.user;
export const selectAccessToken = (state: AuthRootState) => state.auth.accessToken;
export const selectIsAuthenticated = (state: AuthRootState) =>
  state.auth.accessToken !== null && state.auth.user !== null;
export const selectIsAdmin = (state: AuthRootState) =>
  state.auth.user?.role === 'ADMIN';
