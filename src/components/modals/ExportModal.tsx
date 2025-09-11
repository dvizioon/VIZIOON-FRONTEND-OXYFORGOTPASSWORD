import React, { useState, useEffect } from 'react';
import { X, Download, FileSpreadsheet, FileText, Check } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Button } from '../UI/Button';
import { SearchableSelect } from '../UI/SearchableSelect';
import { Alert } from '../UI/Alert';
import { LoadingSpinner } from '../UI/LoadingSpinner';

interface ExportField {
  key: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  required?: boolean;
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any[];
  title: string;
  onExport: (fields: string[], format: 'xlsx' | 'csv') => Promise<void>;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  data,
  title,
  onExport
}) => {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [format, setFormat] = useState<'xlsx' | 'csv'>('xlsx');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [availableFields, setAvailableFields] = useState<ExportField[]>([]);

  useEffect(() => {
    if (isOpen && data.length > 0) {
      // Extrair campos automaticamente do primeiro item dos dados
      const firstItem = data[0];
      const fields: ExportField[] = Object.keys(firstItem).map(key => ({
        key,
        label: getFieldLabel(key),
        type: getFieldType(firstItem[key]),
        required: ['id', 'created_at'].includes(key)
      }));
      
      setAvailableFields(fields);
      
      // Selecionar campos obrigatórios por padrão
      const defaultFields = fields
        .filter(field => field.required || ['username', 'email', 'description', 'status'].includes(field.key))
        .map(field => field.key);
      
      setSelectedFields(defaultFields);
    }
    setAlert(null);
  }, [isOpen, data]);

  const getFieldLabel = (key: string): string => {
    const labels: Record<string, string> = {
      id: 'ID',
      userId: 'ID do Usuário',
      username: 'Nome de Usuário',
      email: 'Email',
      webServiceId: 'ID do WebService',
      tokenUser: 'Token do Usuário',
      useToken: 'Usa Token',
      emailSent: 'Email Enviado',
      tokenExpiresAt: 'Token Expira Em',
      description: 'Descrição',
      status: 'Status',
      created_at: 'Data de Criação'
    };
    return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  const getFieldType = (value: any): 'string' | 'number' | 'date' | 'boolean' => {
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) return 'date';
    return 'string';
  };

  const handleFieldToggle = (fieldKey: string) => {
    const field = availableFields.find(f => f.key === fieldKey);
    if (field?.required) return; // Não permite desmarcar campos obrigatórios

    setSelectedFields(prev => 
      prev.includes(fieldKey)
        ? prev.filter(key => key !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  const handleSelectAll = () => {
    setSelectedFields(availableFields.map(field => field.key));
  };

  const handleDeselectAll = () => {
    setSelectedFields(availableFields.filter(field => field.required).map(field => field.key));
  };

  const downloadXLSX = (data: any[], fields: string[]) => {
    // Criar cabeçalhos
    const headers = fields.map(field => getFieldLabel(field));
    
    // Preparar dados formatados para XLSX
    const formattedData = data.map(row => {
      const formattedRow: any = {};
      fields.forEach(field => {
        const header = getFieldLabel(field);
        let value = row[field] || '';
        
        // Formatar dados para exportação
        if (field === 'created_at' && value) {
          value = new Date(value).toLocaleString('pt-BR');
        } else if (field === 'tokenExpiresAt' && value) {
          value = new Date(value).toLocaleString('pt-BR');
        } else if (field === 'updatedAt' && value) {
          value = new Date(value).toLocaleString('pt-BR');
        } else if (field === 'createdAt' && value) {
          value = new Date(value).toLocaleString('pt-BR');
        } else if (typeof value === 'boolean') {
          value = value ? 'Sim' : 'Não';
        } else if (field === 'status') {
          value = value === 'success' ? 'Sucesso' : 
                  value === 'error' ? 'Erro' : 
                  value === 'pending' ? 'Pendente' : value;
        } else if (field === 'role') {
          value = value === 'admin' ? 'Administrador' : 
                  value === 'user' ? 'Usuário' : value;
        } else if (field === 'type') {
          value = value === 'html' ? 'HTML' : 
                  value === 'text' ? 'Texto' : value;
        }
        
        formattedRow[header] = value;
      });
      return formattedRow;
    });

    // Criar workbook e worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Configurar larguras das colunas
    const colWidths = headers.map(header => {
      const maxLength = Math.max(header.length, 15);
      return { wch: Math.min(Math.max(maxLength + 2, 10), 50) };
    });
    worksheet['!cols'] = colWidths;
    
    // Adicionar worksheet ao workbook
    const sheetName = title || 'Dados';
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Baixar arquivo
    const fileName = `${title.toLowerCase()}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const handleExport = async () => {
    if (selectedFields.length === 0) {
      setAlert({
        type: 'error',
        message: 'Selecione pelo menos um campo para exportar'
      });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      if (format === 'xlsx') {
        downloadXLSX(data, selectedFields);
      } else {
        await onExport(selectedFields, format);
      }
      setAlert({
        type: 'success',
        message: `Dados exportados com sucesso em formato ${format.toUpperCase()}!`
      });
      
      // Fechar modal após sucesso
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: error.message || 'Erro ao exportar dados'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatOptions = [
    { value: 'xlsx', label: 'Excel (.xlsx)' },
    { value: 'csv', label: 'CSV (.csv)' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header fixo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Download className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Exportar {title}</h2>
              <p className="text-sm text-gray-600">{data.length} registros disponíveis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo com scroll */}
        <div className="flex-1 overflow-y-auto p-6">
          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              className="mb-6"
            />
          )}

          <div className="space-y-6">
            {/* Formato de Exportação */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Formato de Exportação
              </label>
              <div className="grid grid-cols-2 gap-3">
                {formatOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormat(option.value as 'xlsx' | 'csv')}
                    className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                      format === option.value
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {option.value === 'xlsx' ? (
                        <FileSpreadsheet className="w-5 h-5" />
                      ) : (
                        <FileText className="w-5 h-5" />
                      )}
                      <span className="font-medium">{option.label}</span>
                      {format === option.value && (
                        <Check className="w-4 h-4 text-green-600 ml-auto" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Seleção de Campos */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Campos para Exportar ({selectedFields.length}/{availableFields.length})
                </label>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    Selecionar Todos
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleDeselectAll}
                  >
                    Desmarcar Todos
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                {availableFields.map((field) => (
                  <label
                    key={field.key}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedFields.includes(field.key)
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    } ${field.required ? 'opacity-75' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFields.includes(field.key)}
                      onChange={() => handleFieldToggle(field.key)}
                      disabled={field.required}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          {field.label}
                        </span>
                        {field.required && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                            Obrigatório
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 capitalize">
                        {field.type === 'date' ? 'Data' : 
                         field.type === 'boolean' ? 'Sim/Não' :
                         field.type === 'number' ? 'Número' : 'Texto'}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Informações */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Informações da Exportação:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Campos obrigatórios não podem ser desmarcados</li>
                <li>• Datas serão formatadas no padrão brasileiro (DD/MM/AAAA)</li>
                <li>• Valores booleanos serão convertidos para "Sim/Não"</li>
                <li>• O arquivo será baixado automaticamente após a exportação</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer fixo */}
        <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleExport}
              loading={loading}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar {format.toUpperCase()}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};