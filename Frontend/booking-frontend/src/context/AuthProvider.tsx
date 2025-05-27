import React, { useEffect, useState } from 'react';
import { Login } from '../domain/client';
import { AuthContext } from './AuthContext';
import { apiClient } from '../services/Api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token') ?? '';
    const name = localStorage.getItem('firstName') ?? '';
    const admin = localStorage.getItem('isAdmin') ?? 'false';
    const user = localStorage.getItem('userId') ?? '';

    setIsLoggedIn(token !== '');
    setFirstName(name);
    setIsAdmin(admin === 'true');
    setUserId(user);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const loginData = new Login();
    loginData.email = email;
    loginData.password = password;

    try {
      const response = await apiClient.login(loginData);
      if (
        !response.token ||
        !response.firstName ||
        response.isAdmin === undefined ||
        !response.userId
      ) {
        throw new Error('Ogiltligt svar från servern.');
      }

      localStorage.setItem('token', response.token);
      localStorage.setItem('firstName', response.firstName);
      localStorage.setItem('isAdmin', response.isAdmin.toString());
      localStorage.setItem('userId', response.userId);

      setIsLoggedIn(true);
      setFirstName(response.firstName);
      setUserId(response.userId);
      setIsAdmin(response.isAdmin);
    } catch (error) {
      console.error(error);
      setMessage('Fel vid inloggning.');
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('firstName');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userId');

    setIsLoggedIn(false);
    setFirstName(null);
    setIsAdmin(false);
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        firstName,
        isAdmin,
        userId,
        login,
        logout,
        message,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
