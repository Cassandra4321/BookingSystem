import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function AdminRoute({ children }: Props) {
  const { isLoggedIn, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <p>Laddar...</p>;
  }

  if (!isLoggedIn || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
