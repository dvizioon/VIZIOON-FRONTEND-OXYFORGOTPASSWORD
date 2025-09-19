import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Header } from './Header';
import { AdminSidebar } from './AdminSidebar';
import { Breadcrumbs } from '../UI/Breadcrumbs';
import { useI18n } from '../../hooks/useI18n';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const location = useLocation();
  const { t } = useI18n();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Função para obter o nome da rota baseado no pathname
  const getRouteName = () => {
    if (title) return title; // Se title for passado explicitamente, usa ele
    
    const path = location.pathname;
    switch (path) {
      case '/admin/dashboard':
        return t('dashboard');
      case '/admin/users':
        return t('users');
      default:
        return t('system');
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header fixo */}
      <div className="flex-shrink-0">
        <Header 
          title={getRouteName()} 
          showAuth 
          onMenuClick={() => setSidebarOpen(true)}
          showMenuButton
        />
      </div>
      
      {/* Container principal com flexbox */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg transition-all duration-300 flex-shrink-0 hidden lg:flex flex-col`}>
          <AdminSidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            isDesktop={true}
          />
        </div>
        
        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Breadcrumbs */}
          <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
            <Breadcrumbs />
          </div>
          
          <main className="flex-1 overflow-y-auto p-6 min-w-0">
            <div className="max-w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
      
      {/* Mobile Sidebar */}
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isDesktop={false}
      />
    </div>
  );
};