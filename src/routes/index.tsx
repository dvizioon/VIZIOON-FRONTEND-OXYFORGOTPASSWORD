import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route as ReactRoute, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/Auth/AuthContext';
import { Route } from './Route';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';

// Lazy load pages para performance
const AdminLogin = React.lazy(() => import('../pages/admin/Login'));
const AdminDashboard = React.lazy(() => import('../pages/admin/Dashboard'));
const AdminUsers = React.lazy(() => import('../pages/admin/Users'));
const AdminAuditing = React.lazy(() => import('../pages/admin/Auditing'));
const AdminTemplates = React.lazy(() => import('../pages/admin/Templates'));
const AdminWebServices = React.lazy(() => import('../pages/admin/WebServices'));
const AdminEmailEnvironments = React.lazy(() => import('../pages/admin/EmailEnvironments'));
const AdminEmailSend = React.lazy(() => import('../pages/admin/EmailSend'));
const ResetPassword = React.lazy(() => import('../pages/ResetPassword'));
const ResetPasswordForm = React.lazy(() => import('../pages/ResetPasswordForm'));
const NotFound = React.lazy(() => import('../pages/NotFound'));

// Componente Suspense para lazy loading
const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense
    fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    }
  >
    {children}
  </Suspense>
);

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
              {/* <ReactRoute 
                path="/reset-password" 
                element={
                  <Route requireAuth={false}>
                    <SuspenseWrapper>
                      <ResetPassword />
                    </SuspenseWrapper>
                  </Route>
                } 
              />
              <ReactRoute 
                path="/reset-password-form" 
                element={
                  <Route requireAuth={false}>
                    <SuspenseWrapper>
                      <ResetPasswordForm />
                    </SuspenseWrapper>
                  </Route>
                } 
              /> */}
          
          {/* Admin Routes */}
              <ReactRoute 
                path="/admin/login" 
                element={
                  <Route requireAuth={false}>
                    <SuspenseWrapper>
                      <AdminLogin />
                    </SuspenseWrapper>
                  </Route>
                } 
              />
          <ReactRoute 
            path="/admin/dashboard" 
            element={
              <Route requireAuth={true}>
                <SuspenseWrapper>
                  <AdminDashboard />
                </SuspenseWrapper>
              </Route>
            } 
          />
          <ReactRoute 
            path="/admin/users" 
            element={
              <Route requireAuth={true}>
                <SuspenseWrapper>
                  <AdminUsers />
                </SuspenseWrapper>
              </Route>
            } 
          />
          <ReactRoute 
            path="/admin/auditing" 
            element={
              <Route requireAuth={true}>
                <SuspenseWrapper>
                  <AdminAuditing />
                </SuspenseWrapper>
              </Route>
            } 
          />
          <ReactRoute 
            path="/admin/templates" 
            element={
              <Route requireAuth={true}>
                <SuspenseWrapper>
                  <AdminTemplates />
                </SuspenseWrapper>
              </Route>
            } 
          />
          <ReactRoute 
            path="/admin/webservices" 
            element={
              <Route requireAuth={true}>
                <SuspenseWrapper>
                  <AdminWebServices />
                </SuspenseWrapper>
              </Route>
            } 
          />
          {/* Rotas de Email */}
          <ReactRoute 
            path="/admin/email/environments" 
            element={
              <Route requireAuth={true}>
                <SuspenseWrapper>
                  <AdminEmailEnvironments />
                </SuspenseWrapper>
              </Route>
            } 
          />
          <ReactRoute 
            path="/admin/email/send" 
            element={
              <Route requireAuth={true}>
                <SuspenseWrapper>
                  <AdminEmailSend />
                </SuspenseWrapper>
              </Route>
            } 
          />
          
          {/* 404 Page */}
          <ReactRoute 
            path="*" 
            element={
              <SuspenseWrapper>
                <NotFound />
              </SuspenseWrapper>
            } 
          />
          
          {/* Default redirects */}
          <ReactRoute path="/" element={<Navigate to="/admin/login" replace />} />
          <ReactRoute path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;