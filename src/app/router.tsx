import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import AppLayout from '../components/Layout/AppLayout';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../features/auth/LoginPage';
import AuthCallbackPage from '../features/auth/AuthCallbackPage';
import { ROUTES } from '../constants/routes';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const LeavesPage = lazy(() => import('../pages/LeavesPage'));
const AdminLeavesPage = lazy(() => import('../pages/AdminLeavesPage'));

function PageLoader(): React.ReactElement {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh',
      }}
    >
      <CircularProgress />
    </Box>
  );
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/auth/callback',
    element: <AuthCallbackPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to={ROUTES.DASHBOARD} replace /> },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProfilePage />
          </Suspense>
        ),
      },
      {
        path: 'leaves',
        element: (
          <Suspense fallback={<PageLoader />}>
            <LeavesPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/leaves',
        element: (
          <ProtectedRoute role="ADMIN">
            <Suspense fallback={<PageLoader />}>
              <AdminLeavesPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
]);
