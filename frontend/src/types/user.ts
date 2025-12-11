export enum UserRole {
  USER = 'user',
  ERM = 'erm',
  SUPER_ADMIN = 'super_admin'
}

export interface User {
  id: number;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string; // ISO date string
}

export interface UserCreate {
  email: string;
  full_name?: string;
  password: string;
  role?: UserRole;
}

export interface UserUpdate {
  email?: string;
  full_name?: string;
  role?: UserRole;
  password?: string;
}
