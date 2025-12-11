import { User } from './user';

export interface LoginRequest {
  username: string; // Backend expects 'username' but it's actually email
  password: string;
}

export interface RegisterRequest {
  email: string;
  full_name?: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  loading: boolean;
}
