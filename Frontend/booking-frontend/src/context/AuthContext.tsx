import { createContext } from 'react';

export interface AuthContextType {
  isLoggedIn: boolean;
  firstName: string | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  message: string | null;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
