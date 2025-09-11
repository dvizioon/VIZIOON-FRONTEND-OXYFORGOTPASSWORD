import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Header } from './Header';
import { AdminSidebar } from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header fixo */}
      <div className="flex-shrink-0">
        <Header 
          title={title || "Painel Administrativo"} 
          showAuth 
          onMenuClick={() => setSidebarOpen(true)}
          showMenuButton
        />
      </div>
      
      {/* Container principal */}
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <div className={`flex-1 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'} flex flex-col overflow-hidden transition-all duration-300`}>
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};