import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAppSelector } from '../../app/hooks';
import { selectIsAuthenticated } from './authSlice';
import { ROUTES } from '../../constants/routes';

// By the time this page renders, main.tsx has already called
// handleRedirectPromise() and populated Redux. We just wait for that and
// navigate accordingly.
export default function AuthCallbackPage(): React.ReactElement {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    } else {
      // bootstrap() finished but no user in Redux — account not in DB or token failed
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <CircularProgress size={48} />
      <Typography color="text.secondary">Signing you in…</Typography>
    </Box>
  );
}
