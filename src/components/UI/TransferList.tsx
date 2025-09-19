import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from 'lucide-react';
import { Button } from './Button';

export interface TransferItem {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
}

interface TransferListProps {
  title: string;
  leftTitle: string;
  rightTitle: string;
  leftItems: TransferItem[];
  rightItems: TransferItem[];
  onTransfer: (items: TransferItem[], direction: 'left' | 'right') => void;
  onSelectLeft?: (items: TransferItem[]) => void;
  onSelectRight?: (items: TransferItem[]) => void;
  leftSearchPlaceholder?: string;
  rightSearchPlaceholder?: string;
  className?: string;
}

export const TransferList: React.FC<TransferListProps> = ({
  title,
  leftTitle,
  rightTitle,
  leftItems,
  rightItems,
  onTransfer,
  onSelectLeft,
  onSelectRight,
  leftSearchPlaceholder = "Buscar...",
  rightSearchPlaceholder = "Buscar...",
  className = ""
}) => {
  const [leftSelected, setLeftSelected] = useState<string[]>([]);
  const [rightSelected, setRightSelected] = useState<string[]>([]);
  const [leftSearch, setLeftSearch] = useState('');
  const [rightSearch, setRightSearch] = useState('');

  // Filtrar itens baseado na busca
  const filteredLeftItems = leftItems.filter(item =>
    item.label.toLowerCase().includes(leftSearch.toLowerCase()) ||
    item.value.toLowerCase().includes(leftSearch.toLowerCase())
  );

  const filteredRightItems = rightItems.filter(item =>
    item.label.toLowerCase().includes(rightSearch.toLowerCase()) ||
    item.value.toLowerCase().includes(rightSearch.toLowerCase())
  );

  // Selecionar/deselecionar item da esquerda
  const handleLeftSelect = (itemId: string) => {
    const newSelected = leftSelected.includes(itemId)
      ? leftSelected.filter(id => id !== itemId)
      : [...leftSelected, itemId];
    
    setLeftSelected(newSelected);
    onSelectLeft?.(leftItems.filter(item => newSelected.includes(item.id)));
  };

  // Selecionar/deselecionar item da direita
  const handleRightSelect = (itemId: string) => {
    const newSelected = rightSelected.includes(itemId)
      ? rightSelected.filter(id => id !== itemId)
      : [...rightSelected, itemId];
    
    setRightSelected(newSelected);
    onSelectRight?.(rightItems.filter(item => newSelected.includes(item.id)));
  };

  // Selecionar todos os itens da esquerda
  const selectAllLeft = () => {
    const allIds = filteredLeftItems.map(item => item.id);
    setLeftSelected(allIds);
    onSelectLeft?.(filteredLeftItems);
  };

  // Selecionar todos os itens da direita
  const selectAllRight = () => {
    const allIds = filteredRightItems.map(item => item.id);
    setRightSelected(allIds);
    onSelectRight?.(filteredRightItems);
  };

  // Deselecionar todos os itens da esquerda
  const deselectAllLeft = () => {
    setLeftSelected([]);
    onSelectLeft?.([]);
  };

  // Deselecionar todos os itens da direita
  const deselectAllRight = () => {
    setRightSelected([]);
    onSelectRight?.([]);
  };

  // Mover itens selecionados da esquerda para direita
  const moveRight = () => {
    const selectedItems = leftItems.filter(item => leftSelected.includes(item.id));
    if (selectedItems.length > 0) {
      onTransfer(selectedItems, 'right');
      setLeftSelected([]);
      onSelectLeft?.([]);
    }
  };

  // Mover itens selecionados da direita para esquerda
  const moveLeft = () => {
    const selectedItems = rightItems.filter(item => rightSelected.includes(item.id));
    if (selectedItems.length > 0) {
      onTransfer(selectedItems, 'left');
      setRightSelected([]);
      onSelectRight?.([]);
    }
  };

  // Mover todos os itens da esquerda para direita
  const moveAllRight = () => {
    if (filteredLeftItems.length > 0) {
      onTransfer(filteredLeftItems, 'right');
      setLeftSelected([]);
      onSelectLeft?.([]);
    }
  };

  // Mover todos os itens da direita para esquerda
  const moveAllLeft = () => {
    if (filteredRightItems.length > 0) {
      onTransfer(filteredRightItems, 'left');
      setRightSelected([]);
      onSelectRight?.([]);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista da Esquerda */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">{leftTitle}</h3>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={selectAllLeft}
                  disabled={filteredLeftItems.length === 0}
                  className="text-xs"
                >
                  Todos
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={deselectAllLeft}
                  disabled={leftSelected.length === 0}
                  className="text-xs"
                >
                  Nenhum
                </Button>
              </div>
            </div>

            {/* Busca */}
            <div className="relative">
              <input
                type="text"
                placeholder={leftSearchPlaceholder}
                value={leftSearch}
                onChange={(e) => setLeftSearch(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              />
            </div>

            {/* Lista de Itens */}
            <div className="border border-gray-200 rounded-lg h-64 overflow-y-auto">
              {filteredLeftItems.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                  Nenhum item encontrado
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {filteredLeftItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        leftSelected.includes(item.id)
                          ? 'bg-violet-100 border border-violet-300'
                          : 'hover:bg-gray-50 border border-transparent'
                      } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => !item.disabled && handleLeftSelect(item.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          leftSelected.includes(item.id)
                            ? 'bg-violet-600 border-violet-600'
                            : 'border-gray-300'
                        }`}>
                          {leftSelected.includes(item.id) && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.label}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-xs text-gray-500">
              {leftSelected.length} de {filteredLeftItems.length} selecionados
            </div>
          </div>

          {/* Botões de Controle */}
          <div className="flex flex-col justify-center space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={moveRight}
              disabled={leftSelected.length === 0}
              className="flex items-center justify-center"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={moveAllRight}
              disabled={filteredLeftItems.length === 0}
              className="flex items-center justify-center"
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={moveAllLeft}
              disabled={filteredRightItems.length === 0}
              className="flex items-center justify-center"
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={moveLeft}
              disabled={rightSelected.length === 0}
              className="flex items-center justify-center"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>

          {/* Lista da Direita */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">{rightTitle}</h3>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={selectAllRight}
                  disabled={filteredRightItems.length === 0}
                  className="text-xs"
                >
                  Todos
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={deselectAllRight}
                  disabled={rightSelected.length === 0}
                  className="text-xs"
                >
                  Nenhum
                </Button>
              </div>
            </div>

            {/* Busca */}
            <div className="relative">
              <input
                type="text"
                placeholder={rightSearchPlaceholder}
                value={rightSearch}
                onChange={(e) => setRightSearch(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              />
            </div>

            {/* Lista de Itens */}
            <div className="border border-gray-200 rounded-lg h-64 overflow-y-auto">
              {filteredRightItems.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                  Nenhum item encontrado
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {filteredRightItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        rightSelected.includes(item.id)
                          ? 'bg-violet-100 border border-violet-300'
                          : 'hover:bg-gray-50 border border-transparent'
                      } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => !item.disabled && handleRightSelect(item.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          rightSelected.includes(item.id)
                            ? 'bg-violet-600 border-violet-600'
                            : 'border-gray-300'
                        }`}>
                          {rightSelected.includes(item.id) && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.label}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-xs text-gray-500">
              {rightSelected.length} de {filteredRightItems.length} selecionados
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
