import { useMsal } from '@azure/msal-react';
import { useAppSelector } from '../app/hooks';
import { selectCurrentUser, selectIsAdmin, selectIsAuthenticated } from '../features/auth/authSlice';

export function useAuth() {
  const { instance, accounts } = useMsal();
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);
  const msalAccount = accounts[0] ?? null;

  const logout = (): void => {
    instance.logoutRedirect({ postLogoutRedirectUri: '/' });
  };

  return { user, isAuthenticated, isAdmin, msalAccount, logout };
}
