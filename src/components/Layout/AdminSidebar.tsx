import React, { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText,
  Globe,
  Shield,
  Menu,
  X,
  ExternalLink,
  Mail,
  ChevronDown,
  ChevronRight,
  Settings,
  Send,
} from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { useSystem } from '../../hooks/userSystem/useSystem';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  isDesktop?: boolean;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  isOpen, 
  onClose, 
  collapsed = false, 
  onToggleCollapse,
  isDesktop = false
}) => {
  const { t } = useI18n();
  const { getSystemInfo } = useSystem();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [systemInfo, setSystemInfo] = useState({ ms: 'OxyForgotPassword', version: '1.0.0' });

  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        const info = await getSystemInfo();
        setSystemInfo(info);
      } catch (error) {
        // Manter valores padrão se der erro
        console.log('Não foi possível carregar informações do sistema');
      }
    };

    fetchSystemInfo();
  }, [getSystemInfo]);

  const toggleMenu = useCallback((menuName: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuName) 
        ? prev.filter(item => item !== menuName)
        : [...prev, menuName]
    );
  }, []);
  
  const menuItems = [
    {
      name: t('dashboard'),
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      exact: true
    },
    {
      name: t('users'),
      href: '/admin/users',
      icon: Users
    },
    {
      name: 'Auditoria',
      href: '/admin/auditing',
      icon: Shield
    },
    {
      name: 'Templates',
      href: '/admin/templates',
      icon: FileText
    },
    {
      name: 'Web Services',
      href: '/admin/webservices',
      icon: Globe
    },
    {
      name: 'Email',
      icon: Mail,
      hasSubmenu: true,
      submenu: [
        {
          name: 'Ambientes',
          href: '/admin/email/environments',
          icon: Settings
        },
        {
          name: 'Enviar',
          href: '/admin/email/send',
          icon: Send
        }
      ]
    }
  ];

  // Desktop sidebar (sem posicionamento absoluto)
  if (isDesktop) {
    return (
      <div className="flex flex-col h-full">
        {/* Header do sidebar */}
        <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-violet-600 to-purple-600">
          {!collapsed && <h1 className="text-lg font-bold text-white">OxyForgotPassword</h1>}
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

        {/* Navegação */}
        <nav className="flex-1 px-4 pt-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isExpanded = expandedMenus.includes(item.name);
              
              if (item.hasSubmenu && item.submenu) {
                return (
                  <li key={item.name}>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={`flex items-center ${collapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-100 hover:text-violet-600 w-full`}
                      title={collapsed ? item.name : undefined}
                    >
                      <Icon className="w-5 h-5" />
                      {!collapsed && (
                        <>
                          <span className="font-medium">{item.name}</span>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 ml-auto" />
                          ) : (
                            <ChevronRight className="w-4 h-4 ml-auto" />
                          )}
                        </>
                      )}
                    </button>
                    
                    {!collapsed && isExpanded && (
                      <ul className="ml-8 mt-2 space-y-1 border-l-2 border-gray-100 pl-4">
                        {item.submenu.map((subItem) => {
                          const SubIcon = subItem.icon;
                          return (
                            <li key={subItem.name}>
                              <NavLink
                                to={subItem.href}
                                onClick={onClose}
                                className={({ isActive }) =>
                                  `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                                    isActive
                                      ? 'bg-violet-100 text-violet-700 border-l-2 border-violet-500 ml-[-2px]'
                                      : 'text-gray-500 hover:bg-gray-50 hover:text-violet-600'
                                  }`
                                }
                              >
                                <SubIcon className="w-5 h-5" />
                                <span className="font-medium">{subItem.name}</span>
                              </NavLink>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              }
              
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    end={item.exact}
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

        {/* Footer do sidebar */}
        {!collapsed && (
          <div className="p-4">
            <div className="bg-violet-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <a 
                  href="mailto:suporte@oxyforgotpassword.com" 
                  className="flex items-center text-xs text-violet-500 hover:text-violet-700 transition-colors"
                  title="Abrir suporte"
                >
                  Suporte
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
                <span className="text-xs text-violet-400">v{systemInfo?.version || '0.0.3.0'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Mobile sidebar (com posicionamento absoluto)
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-all duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col lg:hidden`}>
        <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-violet-600 to-purple-600">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className="text-white hover:text-violet-200 transition-colors p-1"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-bold text-white">OxyForgotPassword</h1>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-violet-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-4 pt-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isExpanded = expandedMenus.includes(item.name);
              
              if (item.hasSubmenu && item.submenu) {
                return (
                  <li key={item.name}>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-100 hover:text-violet-600 w-full"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 ml-auto" />
                      ) : (
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <ul className="ml-8 mt-2 space-y-1 border-l-2 border-gray-100 pl-4">
                        {item.submenu.map((subItem) => {
                          const SubIcon = subItem.icon;
                          return (
                            <li key={subItem.name}>
                              <NavLink
                                to={subItem.href}
                                onClick={onClose}
                                className={({ isActive }) =>
                                  `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                                    isActive
                                      ? 'bg-violet-100 text-violet-700 border-l-2 border-violet-500 ml-[-2px]'
                                      : 'text-gray-500 hover:bg-gray-50 hover:text-violet-600'
                                  }`
                                }
                              >
                                <SubIcon className="w-5 h-5" />
                                <span className="font-medium">{subItem.name}</span>
                              </NavLink>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              }
              
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    end={item.exact}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-violet-100 text-violet-700 border-r-2 border-violet-600'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-violet-600'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4">
          <div className="bg-violet-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <a 
                href="mailto:suporte@oxyforgotpassword.com" 
                className="flex items-center text-xs text-violet-500 hover:text-violet-700 transition-colors"
                title="Abrir suporte"
              >
                Suporte
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
              <span className="text-xs text-violet-400">v{systemInfo.version}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};