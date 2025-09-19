import React, { useState, useEffect } from 'react';
import { X, Eye, Code, Save } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { oneDark } from '@codemirror/theme-one-dark';
import { Template, CreateTemplateData, UpdateTemplateData } from '../../types';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { SearchableSelect } from '../UI/SearchableSelect';
import { FloatingPreview } from '../UI/FloatingPreview';
// import { useTemplates } from '../../hooks/userTemplates/useTemplates';

// Componente Toggle inline para evitar problemas de importação
const Toggle: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'purple' | 'red';
  label?: string;
  description?: string;
}> = ({
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
    md: 'w-10 h-5',
    lg: 'w-12 h-6'
  };

  const thumbSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const colorClasses = {
    blue: checked ? 'bg-blue-500' : 'bg-gray-300',
    green: checked ? 'bg-green-500' : 'bg-gray-300',
    purple: checked ? 'bg-purple-500' : 'bg-gray-300',
    red: checked ? 'bg-red-500' : 'bg-gray-300'
  };

  return (
    <div className="flex items-start space-x-3">
      <button
        type="button"
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
      >
        <div
          className={`${thumbSizeClasses[size]} bg-white rounded-full shadow-md transform transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
      <div className="flex-1">
        {label && (
          <label className="text-sm font-medium text-gray-700 cursor-pointer">
            {label}
          </label>
        )}
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
};

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateTemplateData | UpdateTemplateData) => Promise<void>;
  template?: Template | null;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  template
}) => {
  // const { getTemplateVariables } = useTemplates();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subject: '',
    content: '',
    categoria: 'valid' as 'valid' | 'suspended' | 'unconfirmed',
    type: 'html' as 'html' | 'text',
    isActive: true,
    isDefault: false
  });
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Opções para o tipo de conteúdo
  const typeOptions = [
    { value: 'html', label: 'HTML' },
    { value: 'text', label: 'Texto' }
  ];

  // Opções para a categoria
  const categoriaOptions = [
    { value: 'valid', label: 'Usuário Válido' },
    { value: 'suspended', label: 'Usuário Suspenso' },
    { value: 'unconfirmed', label: 'Usuário Não Confirmado' }
  ];

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        description: template.description || '',
        subject: template.subject,
        content: template.content || '',
        categoria: template.categoria || 'valid',
        type: template.type,
        isActive: template.isActive !== undefined ? template.isActive : true,
        isDefault: template.isDefault || false
      });
    } else {
      setFormData({
        name: '',
        description: '',
        subject: '',
        content: '',
        categoria: 'valid',
        type: 'html',
        isActive: true,
        isDefault: false
      });
    }
  }, [template, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar template:', error);
    } finally {
      setLoading(false);
    }
  };

  // Adicionar estilos CSS para scroll horizontal
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .cm-editor .cm-scroller {
        overflow: auto !important;
      }
      .cm-editor .cm-content {
        min-width: 100%;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-violet-50 to-purple-50 animate-in slide-in-from-top duration-300">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-violet-100 rounded-lg">
              <Code className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {template ? 'Editar Template de Email' : 'Criar Template de Email'}
              </h2>
              <p className="text-sm text-gray-600">
                {template ? 'Modifique as informações do template' : 'Preencha os dados para criar um novo template'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-180px)] animate-in slide-in-from-bottom duration-500">
          {/* Form Section */}
          <div className="w-1/3 p-4 border-r border-gray-200 overflow-y-auto animate-in slide-in-from-left duration-700">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome */}
              <div className="animate-in slide-in-from-left duration-500 delay-100">
                <Input
                  label="Nome do Template"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: Reset de Senha - Usuário Válido"
                  required
                />
              </div>

              {/* Descrição */}
              <div className="animate-in slide-in-from-left duration-500 delay-200">
                <Input
                  label="Descrição"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descrição opcional do template"
                />
              </div>

              {/* Assunto */}
              <div className="animate-in slide-in-from-left duration-500 delay-300">
                <Input
                  label="Assunto do Email"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="Ex: Redefinir Senha - oxyRecover"
                  required
                />
              </div>

              {/* Categoria */}
              <div className="animate-in slide-in-from-left duration-500 delay-400">
                <SearchableSelect
                  label="Categoria"
                  value={formData.categoria}
                  onChange={(value) => handleInputChange('categoria', value)}
                  options={categoriaOptions}
                  placeholder="Selecione a categoria do template"
                />
              </div>

              {/* Tipo */}
              <div className="animate-in slide-in-from-left duration-500 delay-500">
                <SearchableSelect
                  label="Tipo de Conteúdo"
                  value={formData.type}
                  onChange={(value) => handleInputChange('type', value)}
                  options={typeOptions}
                  placeholder="Selecione o tipo de conteúdo"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-3 animate-in slide-in-from-left duration-500 delay-600">
                <Toggle
                  checked={formData.isActive}
                  onChange={(checked) => handleInputChange('isActive', checked)}
                  label="Template ativo"
                  description="Este template estará disponível para uso"
                  color="green"
                />

                <Toggle
                  checked={formData.isDefault}
                  onChange={(checked) => handleInputChange('isDefault', checked)}
                  label="Template padrão"
                  description="Será usado como padrão para esta categoria"
                  color="purple"
                />
              </div>

              {/* Preview Button */}
              {formData.type === 'html' && (
                <div className="animate-in slide-in-from-left duration-500 delay-700">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPreview(!showPreview)}
                    className="w-full transition-all duration-200 hover:scale-105"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {showPreview ? 'Ocultar Preview' : 'Mostrar Preview'}
                  </Button>
                </div>
              )}
            </form>
          </div>

          {/* Editor Section */}
          <div className="w-2/3 relative animate-in slide-in-from-right duration-700">
            {formData.type === 'html' ? (
              <div className="h-full border border-gray-200 rounded-lg overflow-hidden">
                <CodeMirror
                  value={formData.content}
                  onChange={(value) => handleInputChange('content', value)}
                  extensions={[html()]}
                  theme={oneDark}
                  height="100%"
                  basicSetup={{
                    lineNumbers: true,
                    foldGutter: true,
                    dropCursor: false,
                    allowMultipleSelections: false,
                    indentOnInput: true,
                    bracketMatching: true,
                    closeBrackets: true,
                    autocompletion: true,
                    highlightSelectionMatches: true
                  }}
                  style={{
                    height: '100%',
                    maxHeight: '100%',
                    overflow: 'auto',
                    width: '100%',
                    maxWidth: '100%'
                  }}
                />
              </div>
            ) : (
              <div className="h-full border border-gray-200 rounded-lg overflow-hidden">
                <textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  className="w-full h-full p-4 border-0 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono text-sm"
                  placeholder="Digite o conteúdo do template..."
                  autoFocus
                  style={{
                    height: '100%',
                    maxHeight: '100%',
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    width: '100%',
                    maxWidth: '100%'
                  }}
                />
              </div>
            )}

            {/* Preview Modal */}
            <FloatingPreview
              isOpen={showPreview && formData.type === 'html'}
              onClose={() => setShowPreview(false)}
              content={formData.content}
              title="Preview HTML"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50 animate-in slide-in-from-bottom duration-500">
          <div className="text-sm text-gray-500">
            {template ? 'Modificando template existente' : 'Criando novo template'}
          </div>
          <div className="flex space-x-3 animate-in slide-in-from-right duration-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="transition-all duration-200 hover:scale-105"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              loading={loading}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 transition-all duration-200 hover:scale-105"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Salvando...' : 'Salvar Template'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;
