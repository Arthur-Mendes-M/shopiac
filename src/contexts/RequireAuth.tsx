// RequireAuth.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const LoadingPlaceholder = () => <div>Carregando...</div>;

export const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // espere o provider inicializar — não redirecione enquanto loading true
    return <LoadingPlaceholder />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
