import React, { useEffect, useState } from 'react';
import { ApiClient, Login } from '../domain/client';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('firstName');
    setIsLoggedIn(!!token);
    setFirstName(name);
  }, []);

  const login = async (email: string, password: string) => {
    const client = new ApiClient('https://localhost:7193');
    const loginData = new Login();
    loginData.email = email;
    loginData.password = password;

    try {
      const response = await client.login(loginData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('firstName', response.firstName);
      setIsLoggedIn(true);
      setFirstName(response.firstName);
    } catch (error) {
      console.error(error);
      setMessage('Fel vid inloggning.');
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('firstName');
    setIsLoggedIn(false);
    setFirstName(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, firstName, login, logout, message }}>
      {children}
    </AuthContext.Provider>
  );
}
