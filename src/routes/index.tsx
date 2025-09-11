import React, { Suspense } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "../contexts/Auth/AuthContext";
import { AdminLayout } from "../components/Layout/AdminLayout";
import { LoadingSpinner } from "../components/UI/LoadingSpinner";
import ProtectedRoute from "./Route";

// Lazy load pages para performance
const Login = React.lazy(() => import("../pages/admin/Login"));
const Dashboard = React.lazy(() => import("../pages/admin/Dashboard"));
const Users = React.lazy(() => import("../pages/admin/Users"));
const WebServices = React.lazy(() => import("../pages/admin/WebServices"));
const Templates = React.lazy(() => import("../pages/admin/Templates"));
const Auditing = React.lazy(() => import("../pages/admin/Auditing"));
const ResetPassword = React.lazy(() => import("../pages/ResetPassword"));
const ResetPasswordForm = React.lazy(() => import("../pages/ResetPasswordForm"));

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
    <BrowserRouter>
      <AuthProvider>
        <RouterRoutes>
          {/* ===== ROTAS PÚBLICAS ===== */}
          
          {/* Redirecionamento da home */}
          <Route 
            path="/" 
            element={<Navigate to="/admin/login" replace />} 
          />
          
          {/* Reset de senha */}
          <Route 
            path="/reset-password" 
            element={
              <SuspenseWrapper>
                <ResetPassword />
              </SuspenseWrapper>
            } 
          />
          
          <Route 
            path="/reset-password/:token" 
            element={
              <SuspenseWrapper>
                <ResetPasswordForm />
              </SuspenseWrapper>
            } 
          />

          {/* ===== ROTAS DE AUTENTICAÇÃO ===== */}
          
          {/* Redirecionamento do admin */}
          <Route 
            path="/admin" 
            element={<Navigate to="/admin/dashboard" replace />} 
          />
          
          {/* Login */}
          <Route 
            path="/admin/login" 
            element={
              <SuspenseWrapper>
                <Login />
              </SuspenseWrapper>
            } 
          />

          {/* ===== ROTAS ADMINISTRATIVAS (PROTEGIDAS) ===== */}
          
          {/* Dashboard principal */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <SuspenseWrapper>
                    <Dashboard />
                  </SuspenseWrapper>
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Gerenciamento de usuários */}
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <SuspenseWrapper>
                    <Users />
                  </SuspenseWrapper>
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Gerenciamento de web services */}
          <Route 
            path="/admin/webservices" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <SuspenseWrapper>
                    <WebServices />
                  </SuspenseWrapper>
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Gerenciamento de templates */}
          <Route 
            path="/admin/templates" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <SuspenseWrapper>
                    <Templates />
                  </SuspenseWrapper>
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Auditoria do sistema */}
          <Route 
            path="/admin/auditing" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <SuspenseWrapper>
                    <Auditing />
                  </SuspenseWrapper>
                </AdminLayout>
              </ProtectedRoute>
            } 
          />

          {/* ===== ROTA 404 ===== */}
          <Route 
            path="*" 
            element={<Navigate to="/admin/login" replace />} 
          />
        </RouterRoutes>
        
        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;