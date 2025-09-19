import React, { useState, useRef, useEffect } from 'react';
import { User, ChevronDown, LogOut, Settings, UserCircle } from 'lucide-react';
import { useAuthContext } from '../../contexts/Auth/AuthContext';
import { useI18n } from '../../hooks/useI18n';

interface UserDropdownProps {
  className?: string;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ className = '' }) => {
  const { user, logout } = useAuthContext();
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
      >
        <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-violet-600" />
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-gray-900">{user?.name || 'Usuário'}</p>
          <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                <UserCircle className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{user?.name || 'Usuário'}</p>
                <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>
          
          <div className="py-2">
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>{t('profile')}</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
