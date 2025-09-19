import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/Auth/AuthContext';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';

interface RouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const Route: React.FC<RouteProps> = ({ 
  children, 
  requireAuth = false, 
  redirectTo = '/admin/login' 
}) => {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};