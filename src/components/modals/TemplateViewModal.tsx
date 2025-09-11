import React from 'react';
import { X, Mail, FileText, Code, Calendar, Clock, CheckCircle, XCircle, Star } from 'lucide-react';
import { Button } from '../UI/Button';
import { Template } from '../../types';

interface TemplateViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: Template | null;
}

export const TemplateViewModal: React.FC<TemplateViewModalProps> = ({
  isOpen,
  onClose,
  template
}) => {
  if (!isOpen || !template) return null;

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Ativo' : 'Inativo';
  };

  const getTypeColor = (type: string) => {
    return type === 'html' 
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTypeText = (type: string) => {
    return type === 'html' ? 'HTML' : 'Texto';
  };

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
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-violet-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-violet-100 rounded-lg">
              {getStatusIcon(template.isActive)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-semibold text-gray-900">Detalhes do Template</h2>
                {template.isDefault && (
                  <Star className="w-5 h-5 text-yellow-500" />
                )}
              </div>
              <p className="text-sm text-gray-600">ID: {template.id}</p>
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
          <div className="space-y-6">
            {/* Status e Tipo */}
            <div className="flex items-center justify-center space-x-4">
              <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border ${getStatusColor(template.isActive)}`}>
                {getStatusIcon(template.isActive)}
                <span className="font-semibold">{getStatusText(template.isActive)}</span>
              </div>
              <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border ${getTypeColor(template.type)}`}>
                {template.type === 'html' ? <Code className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                <span className="font-semibold">{getTypeText(template.type)}</span>
              </div>
              {template.isDefault && (
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border bg-yellow-100 text-yellow-800 border-yellow-200">
                  <Star className="w-4 h-4" />
                  <span className="font-semibold">Padrão</span>
                </div>
              )}
            </div>

            {/* Informações Básicas */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-violet-600" />
                Informações Básicas
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Template</label>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-base font-medium text-gray-900">{template.name}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-base text-gray-900">{template.description}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assunto do Email</label>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    <p className="text-base text-gray-900">{template.subject}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview do Conteúdo */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Code className="w-5 h-5 mr-2 text-blue-600" />
                Preview do Conteúdo
              </h3>
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                {template.type === 'html' ? (
                  <iframe
                    srcDoc={previewContent}
                    className="w-full h-96 border-0"
                    title="Preview HTML"
                  />
                ) : (
                  <div className="p-4 max-h-96 overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap font-mono text-gray-800">
                      {previewContent}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Código Fonte */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Code className="w-5 h-5 mr-2 text-green-600" />
                Código Fonte
              </h3>
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-4 max-h-64 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap font-mono text-gray-800 bg-gray-50 p-3 rounded">
                    {template.content}
                  </pre>
                </div>
              </div>
            </div>

            {/* Informações de Data */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                Histórico
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Criado em</label>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <p className="text-base text-gray-900">{new Date(template.createdAt).toLocaleString('pt-BR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Última Atualização</label>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    <p className="text-base text-gray-900">{new Date(template.updatedAt).toLocaleString('pt-BR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer fixo */}
        <div className="flex-shrink-0 flex justify-end p-6 border-t border-gray-200 bg-gray-50">
          <Button onClick={onClose} variant="outline">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};