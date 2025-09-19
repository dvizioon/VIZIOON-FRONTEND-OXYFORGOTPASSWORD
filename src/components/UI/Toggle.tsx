import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'purple' | 'red';
  label?: string;
  description?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  color = 'blue',
  label,
  description
}) => {
  const sizeClasses = {
    sm: 'w-8 h-4',
    md: 'w-11 h-6',
    lg: 'w-14 h-8'
  };

  const thumbSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-7 h-7'
  };

  const colorClasses = {
    blue: checked ? 'bg-blue-600' : 'bg-gray-300',
    green: checked ? 'bg-green-600' : 'bg-gray-300',
    purple: checked ? 'bg-purple-600' : 'bg-gray-300',
    red: checked ? 'bg-red-600' : 'bg-gray-300'
  };

  const thumbColorClasses = {
    blue: checked ? 'bg-blue-100' : 'bg-white',
    green: checked ? 'bg-green-100' : 'bg-white',
    purple: checked ? 'bg-purple-100' : 'bg-white',
    red: checked ? 'bg-red-100' : 'bg-white'
  };

  return (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        className={`
          ${sizeClasses[size]}
          ${colorClasses[color]}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          relative inline-flex flex-shrink-0 border-2 border-transparent rounded-full transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        `}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
      >
        <span
          className={`
            ${thumbSizeClasses[size]}
            ${thumbColorClasses[color]}
            ${checked ? 'translate-x-5' : 'translate-x-0'}
            pointer-events-none inline-block rounded-full shadow transform ring-0 transition ease-in-out duration-200
          `}
        />
      </button>
      
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>
              {label}
            </span>
          )}
          {description && (
            <span className={`text-xs ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Toggle;
