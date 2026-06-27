import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import { useMsal } from '@azure/msal-react';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../../constants/msal';
import { useAppSelector } from '../../app/hooks';
import { selectIsAuthenticated } from './authSlice';
import { ROUTES } from '../../constants/routes';

export default function LoginPage(): React.ReactElement {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await instance.loginRedirect(loginRequest);
    } catch {
      setError('Sign-in failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: 'background.default',
      }}
    >
      {/* Left gradient panel */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #3F51B5 0%, #00BCD4 100%)',
          color: 'white',
          p: 6,
        }}
      >
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            border: '3px solid rgba(255,255,255,0.4)',
          }}
        >
          <Typography variant="h4" fontWeight={700}>
            M2
          </Typography>
        </Box>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          M2 PARTNERS
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.85 }}>
          HR Platform
        </Typography>
        <Typography
          variant="body2"
          sx={{ mt: 4, opacity: 0.7, textAlign: 'center', maxWidth: 300 }}
        >
          Manage your team, leaves, and more from one place.
        </Typography>
      </Box>

      {/* Right sign-in panel */}
      <Box
        sx={{
          flex: { xs: 1, md: 'none' },
          width: { md: 480 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 400, p: 1 }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <Typography variant="h5" fontWeight={700} color="white">
                M2
              </Typography>
            </Box>

            <Typography variant="h5" fontWeight={700} gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Sign in with your M2 Partners Microsoft account to continue.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
                {error}
              </Alert>
            )}

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleLogin}
              disabled={isLoading}
              startIcon={
                isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <MicrosoftIcon />
                )
              }
              sx={{ py: 1.5 }}
            >
              {isLoading ? 'Redirecting…' : 'Sign in with Microsoft'}
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
