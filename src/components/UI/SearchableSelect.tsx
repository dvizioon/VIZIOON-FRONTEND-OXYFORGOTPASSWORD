import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  loading?: boolean;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  placeholder = "Selecione uma opção",
  value,
  onChange,
  options,
  loading = false,
  error,
  required = false,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const filtered = options.filter(option =>
      option.value !== '' && // Remove a opção "Selecione o ambiente"
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Verifica se clicou fora do modal inteiro
      const modalOverlay = document.querySelector('[data-modal-overlay]');
      if (modalOverlay && event.target === modalOverlay) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="space-y-1" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled || loading}
          className={`w-full px-3 py-2 border rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-left flex items-center justify-between ${
            error 
              ? 'border-red-300 bg-red-50' 
              : 'border-gray-300 hover:border-violet-300 focus:border-violet-500 bg-white'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
            {loading ? (
              <div className="flex items-center">
                <LoadingSpinner size="sm" className="mr-2" />
                Carregando...
              </div>
            ) : (
              selectedOption?.label || placeholder
            )}
          </span>
          {!loading && (
            isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {isOpen && !loading && (
          <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 animate__animated animate__fadeIn animate__faster"
            data-modal-overlay
          >
            <div className="bg-white border border-gray-300 rounded-lg shadow-xl max-h-96 w-full max-w-md mx-4 overflow-hidden animate__animated animate__zoomIn animate__faster">
              {/* Header com botão fechar */}
              <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-violet-50">
                <h3 className="text-sm font-medium text-violet-800">{label || 'Selecionar Opção'}</h3>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-violet-600 hover:text-violet-800 transition-colors hover:animate__animated hover:animate__pulse hover:animate__faster"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.slice(0, 9).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`w-full px-3 py-2 text-left hover:bg-violet-50 focus:bg-violet-50 focus:outline-none transition-all duration-200 hover:animate__animated hover:animate__pulse hover:animate__faster ${
                      value === option.value ? 'bg-violet-100 text-violet-700 font-medium' : 'text-gray-900'
                    }`}
                  >
                    {option.label}
                  </button>
                ))
              ) : (
                <div className="px-3 py-8 text-gray-500 text-center animate__animated animate__flash animate__infinite animate__slower">
                  Nenhum resultado encontrado
                </div>
              )}
              <div className="px-3 py-2 text-center border-t border-gray-200 bg-gray-50">
                <span className="text-xs text-gray-500">
                  {filteredOptions.length > 9 
                    ? `Mostrando 9 de ${filteredOptions.length} resultados`
                    : `${filteredOptions.length} resultado${filteredOptions.length !== 1 ? 's' : ''} encontrado${filteredOptions.length !== 1 ? 's' : ''}`
                  }
                </span>
              </div>
            </div>
          </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};