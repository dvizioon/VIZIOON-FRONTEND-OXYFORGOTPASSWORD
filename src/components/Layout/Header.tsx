import React from 'react';
import { LogOut, User, Menu } from 'lucide-react';
import { useAuthContext } from '../../contexts/Auth/AuthContext';
import { Button } from '../UI/Button';

interface HeaderProps {
  title?: string;
  showAuth?: boolean;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  showAuth = false, 
  onMenuClick, 
  showMenuButton = false 
}) => {
  const { user, logout } = useAuthContext();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          {showMenuButton && onMenuClick && (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg text-gray-600 hover:text-violet-600 hover:bg-violet-50 transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          {title && (
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          )}
        </div>
        
        {showAuth && user && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{user.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-600 hover:text-red-600"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Sair
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};