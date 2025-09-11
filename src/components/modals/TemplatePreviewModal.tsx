import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../UI/Button';

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: {
    name: string;
    subject: string;
    type: 'html' | 'text';
    content: string;
  };
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  isOpen,
  onClose,
  template
}) => {
  if (!isOpen) return null;

  const previewContent = template.content
    .replace(/\{\{user\.fullname\}\}/g, 'João Silva')
    .replace(/\{\{user\.email\}\}/g, 'joao@exemplo.com')
    .replace(/\{\{user\.username\}\}/g, 'joao.silva')
    .replace(/\{\{reset\.link\}\}/g, 'https://exemplo.com/reset?token=abc123')
    .replace(/\{\{reset\.token\}\}/g, 'abc123def456')
    .replace(/\{\{reset\.expires_at\}\}/g, '24 horas')
    .replace(/\{\{system\.site_name\}\}/g, 'OXYGENI - CEUMA')
    .replace(/\{\{system\.support_email\}\}/g, 'suporte@ceuma.br')
    .replace(/\{\{email\.subject\}\}/g, template.subject)
    .replace(/\{\{message\.title\}\}/g, 'Redefinição de Senha')
    .replace(/\{\{message\.content\}\}/g, 'Você solicitou a redefinição de sua senha.')
    .replace(/\{\{date\.current\}\}/g, new Date().toLocaleDateString('pt-BR'))
    .replace(/\{\{time\.current\}\}/g, new Date().toLocaleTimeString('pt-BR'));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header fixo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Preview do Template</h2>
            <p className="text-sm text-gray-600">{template.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo com scroll */}
        <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Assunto:</h3>
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-sm">{template.subject}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Conteúdo:</h3>
            <div className="border rounded-lg bg-white">
              {template.type === 'html' ? (
                <div 
                  className="p-4"
                  dangerouslySetInnerHTML={{ __html: previewContent }}
                />
              ) : (
                <pre className="p-4 text-sm whitespace-pre-wrap font-mono">
                  {previewContent}
                </pre>
              )}
            </div>
          </div>
        </div>
        </div>

        {/* Footer fixo */}
        <div className="flex-shrink-0 flex justify-end p-6 border-t border-gray-200 bg-gray-50">
          <Button onClick={onClose} variant="outline">
            Fechar Preview
          </Button>
        </div>
      </div>
    </div>
  );
};