import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Server, 
  FileText, 
  Activity,
  Shield,
  Menu,
  X
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  isOpen, 
  onClose, 
  collapsed = false, 
  onToggleCollapse 
}) => {
  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      exact: true
    },
    {
      name: 'Usuários',
      href: '/admin/users',
      icon: Users
    },
    {
      name: 'WebServices',
      href: '/admin/webservices',
      icon: Server
    },
    {
      name: 'Templates Email',
      href: '/admin/templates',
      icon: FileText
    },
    {
      name: 'Auditoria',
      href: '/admin/auditing',
      icon: Activity
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 ${collapsed ? 'w-16' : 'w-64'} bg-white shadow-lg transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:fixed lg:top-16 lg:bottom-0 lg:h-auto ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col`}>
        <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-violet-600 to-purple-600 lg:hidden">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className="text-white hover:text-violet-200 transition-colors p-1"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-bold text-white">OxyPass</h1>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-violet-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-between h-16 px-4 bg-gradient-to-r from-violet-600 to-purple-600">
          {!collapsed && <h1 className="text-lg font-bold text-white">OxyPass</h1>}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="text-white hover:text-violet-200 transition-colors p-1"
              title={collapsed ? 'Expandir menu' : 'Recolher menu'}
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 mt-8 px-4 lg:mt-0 lg:pt-8 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    end={item.exact}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center ${collapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-violet-100 text-violet-700 border-r-2 border-violet-600'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-violet-600'
                      }`
                    }
                    title={collapsed ? item.name : undefined}
                  >
                    <Icon className="w-5 h-5" />
                    {!collapsed && <span className="font-medium">{item.name}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {!collapsed && (
          <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-violet-50 rounded-lg p-3">
            <p className="text-xs text-violet-500">v0.0.2.6</p>
          </div>
        </div>
        )}
      </div>
    </>
  );
};