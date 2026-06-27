export type Role = 'EMPLOYEE' | 'ADMIN';

export interface AuthUser {
  userId: string;
  email: string;
  role: Role;
  full_name?: string;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
}
