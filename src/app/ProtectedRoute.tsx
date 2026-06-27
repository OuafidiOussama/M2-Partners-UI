import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { Box, CircularProgress } from '@mui/material';
import { useAppSelector } from './hooks';
import { selectIsAuthenticated, selectIsAdmin } from '../features/auth/authSlice';
import type { Role } from '../types/auth';

interface ProtectedRouteProps {
  children: React.ReactElement;
  role?: Role;
}

export default function ProtectedRoute({
  children,
  role,
}: ProtectedRouteProps): React.ReactElement {
  const location = useLocation();
  const { inProgress } = useMsal();
  const msalAuthenticated = useIsAuthenticated();
  const reduxAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);

  // MSAL is still processing the redirect — render nothing until it settles.
  if (inProgress !== InteractionStatus.None) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // MSAL has an account but Redux isn't populated yet (e.g. page refresh).
  // Send to callback page to re-acquire token and repopulate Redux.
  if (msalAuthenticated && !reduxAuthenticated) {
    return <Navigate to="/auth/callback" state={{ from: location }} replace />;
  }

  if (!msalAuthenticated && !reduxAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role === 'ADMIN' && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
