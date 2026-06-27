import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/auth/authApi';
import { leavesApi } from '../features/leaves/leavesApi';
import { employeesApi } from '../features/employees/employeesApi';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [leavesApi.reducerPath]: leavesApi.reducer,
    [employeesApi.reducerPath]: employeesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      leavesApi.middleware,
      employeesApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
