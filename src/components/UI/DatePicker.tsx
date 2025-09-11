import React, { useState, useRef, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';

interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value = '',
  onChange,
  placeholder = 'Selecionar data',
  className = '',
  disabled = false,
  min,
  max
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value);
  const [displayValue, setDisplayValue] = useState('');
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Formatar data para exibição (sem usar Date para evitar timezone)
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts;
      return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
    }
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  // Atualizar valor de exibição quando value muda
  useEffect(() => {
    setSelectedDate(value);
    setDisplayValue(formatDateForDisplay(value));
    // Sincronizar o mês atual com a data selecionada
    if (value) {
      // Criar data no horário local para evitar problemas de timezone
      const [year, month, day] = value.split('-').map(Number);
      setCurrentMonth(new Date(year, month - 1, day));
    }
  }, [value]);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDateSelect = (date: string) => {
    // Usar a data diretamente sem conversões de timezone
    // date já vem no formato YYYY-MM-DD do calendário
    console.log('DatePicker selecionou:', date);
    setSelectedDate(date);
    setDisplayValue(formatDateForDisplay(date));
    onChange?.(date);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDate('');
    setDisplayValue('');
    onChange?.('');
  };

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const generateCalendarDays = () => {
    const today = new Date();
    const displayYear = currentMonth.getFullYear();
    const displayMonthIndex = currentMonth.getMonth();
    
    const firstDay = new Date(displayYear, displayMonthIndex, 1);
    const lastDay = new Date(displayYear, displayMonthIndex + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: JSX.Element[] = [];
    const currentDate = new Date(startDate);
    
    // Gerar 42 dias (6 semanas)
    for (let i = 0; i < 42; i++) {
      // Criar data string no formato YYYY-MM-DD sem problemas de timezone
      const yyyy = currentDate.getFullYear();
      const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
      const dd = String(currentDate.getDate()).padStart(2, '0');
      const dateString = `${yyyy}-${mm}-${dd}`;
      
      const isCurrentMonth = currentDate.getMonth() === displayMonthIndex;
      const isToday = currentDate.toDateString() === today.toDateString();
      const isSelected = dateString === selectedDate;
      const isDisabled = Boolean((min && dateString < min) || (max && dateString > max));
      
      // Debug para verificar seleção
      if (isSelected) {
        console.log('Dia selecionado encontrado:', {
          currentDate: currentDate.getDate(),
          dateString,
          selectedDate,
          isSelected
        });
      }
      
      days.push(
        <button
          key={dateString}
          onClick={() => {
            if (!isDisabled) {
              console.log('Botão clicado:', currentDate.getDate(), 'Data string:', dateString);
              handleDateSelect(dateString);
            }
          }}
          disabled={isDisabled}
          className={`
            w-8 h-8 text-xs rounded-md transition-colors
            ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
            ${isToday ? 'bg-blue-100 text-blue-600 font-semibold' : ''}
            ${isSelected ? 'bg-blue-600 text-white font-semibold' : ''}
            ${!isSelected && !isToday ? 'hover:bg-gray-100' : ''}
            ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {currentDate.getDate()}
        </button>
      );
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const getMonthName = () => {
    return currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newDate);
  };

  return (
    <div ref={datePickerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-3 py-2 text-sm border border-gray-300 rounded-md
          bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-colors duration-200
          ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'hover:border-gray-400'}
          ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className={displayValue ? 'text-gray-900' : 'text-gray-500'}>
              {displayValue || placeholder}
            </span>
          </div>
          {displayValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* Header do calendário */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <button
              type="button"
              onClick={() => navigateMonth('prev')}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 className="text-sm font-semibold text-gray-900 capitalize">
              {getMonthName()}
            </h3>
            <button
              type="button"
              onClick={() => navigateMonth('next')}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Dias da semana */}
          <div className="grid grid-cols-7 gap-1 p-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="text-xs text-gray-500 text-center py-1 font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Dias do mês */}
          <div className="grid grid-cols-7 gap-1 p-2">
            {generateCalendarDays()}
          </div>

          {/* Botões de ação */}
          <div className="flex items-center justify-between p-3 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                const todayString = `${year}-${month}-${day}`;
                handleDateSelect(todayString);
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Hoje
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              Limpar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
