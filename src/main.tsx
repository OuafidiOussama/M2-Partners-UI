import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { store } from './app/store';
import { router } from './app/router';
import theme from './app/theme';
import { msalConfig, loginRequest } from './constants/msal';
import { setCredentials } from './features/auth/authSlice';
import './index.css';

const msalInstance = new PublicClientApplication(msalConfig);

async function bootstrap(): Promise<void> {
  await msalInstance.initialize();

  // handleRedirectPromise returns the auth result when coming back from
  // Microsoft. We capture it directly here instead of relying on event
  // callbacks, which fire asynchronously and can miss the account.
  const redirectResult = await msalInstance.handleRedirectPromise();

  if (redirectResult?.account) {
    msalInstance.setActiveAccount(redirectResult.account);
  }

  const account = msalInstance.getActiveAccount() ?? msalInstance.getAllAccounts()[0];

  if (account) {
    try {
      const tokenResponse = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account,
      });

      const { idToken } = tokenResponse;

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/me`,
        { headers: { Authorization: `Bearer ${idToken}` } },
      );

      if (res.ok) {
        const user = await res.json();
        store.dispatch(setCredentials({ user, accessToken: idToken }));
      }
    } catch {
      // Silent token acquisition failed — user will be prompted to log in
    }
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <MsalProvider instance={msalInstance}>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <RouterProvider router={router} />
          </ThemeProvider>
        </Provider>
      </MsalProvider>
    </StrictMode>,
  );
}

bootstrap();
