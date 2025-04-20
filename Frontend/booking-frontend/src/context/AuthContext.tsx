import { createContext } from 'react';

export interface AuthContextType {
  isLoggedIn: boolean;
  firstName: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  message: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
