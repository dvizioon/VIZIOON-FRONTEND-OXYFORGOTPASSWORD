import React, { useState } from 'react';
import { X, User, Mail, Server, Clock, CheckCircle, XCircle, AlertCircle, Copy } from 'lucide-react';
import { Button } from '../UI/Button';
import { AuditLog } from '../../types';
import { copyToClipboard } from '../../lib/utils';

interface AuditingViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditLog: AuditLog | null;
}

export const AuditingViewModal: React.FC<AuditingViewModalProps> = ({
  isOpen,
  onClose,
  auditLog
}) => {
  const [copySuccess, setCopySuccess] = useState(false);

  if (!isOpen || !auditLog) return null;

  const handleCopyToken = async () => {
    if (auditLog.tokenUser) {
      try {
        await copyToClipboard(auditLog.tokenUser);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (error) {
        console.error('Erro ao copiar token:', error);
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Sucesso';
      case 'error':
        return 'Erro';
      case 'pending':
        return 'Pendente';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Função para determinar o status correto baseado na descrição
  const getCorrectedStatus = (auditLog: AuditLog) => {
    // Se a descrição indica que o usuário não foi encontrado, forçar status como 'error'
    if (auditLog.description && 
        (auditLog.description.toLowerCase().includes('usuário não encontrado') ||
         auditLog.description.toLowerCase().includes('user not found') ||
         auditLog.description.toLowerCase().includes('não encontrado'))) {
      return 'error';
    }
    return auditLog.status;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header fixo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              {getStatusIcon(getCorrectedStatus(auditLog))}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Detalhes da Auditoria</h2>
              <p className="text-sm text-gray-600">ID: {auditLog.id}</p>
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
            {/* Status */}
            <div className="flex items-center justify-center">
              <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border ${getStatusColor(getCorrectedStatus(auditLog))}`}>
                {getStatusIcon(getCorrectedStatus(auditLog))}
                <span className="font-semibold">{getStatusText(getCorrectedStatus(auditLog))}</span>
              </div>
            </div>

            {/* Informações do Usuário */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Informações do Usuário
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome de Usuário</label>
                  <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                    {auditLog.username || 'Desconhecido'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                    {auditLog.email || 'Desconhecido'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID do Usuário</label>
                  <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                    {auditLog.userId || 'Desconhecido'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Token do Usuário</label>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-900 bg-white p-2 rounded border font-mono flex-1">
                      {auditLog.tokenUser ? `${auditLog.tokenUser.substring(0, 20)}...` : 'Desconhecido'}
                    </p>
                    {auditLog.tokenUser && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyToken}
                        title="Copiar token completo"
                        className="flex-shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  {copySuccess && (
                    <p className="text-xs text-green-600 mt-1">Token copiado!</p>
                  )}
                </div>
              </div>
            </div>

            {/* Informações do WebService */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Server className="w-5 h-5 mr-2 text-violet-600" />
                WebService
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID do WebService</label>
                  <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                    {auditLog.webServiceId || 'Desconhecido'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Token Usado</label>
                  <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      auditLog.useToken ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {auditLog.useToken ? 'Sim' : 'Não'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Informações do Email */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-green-600" />
                Email
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Enviado</label>
                  <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      auditLog.emailSent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {auditLog.emailSent ? 'Sim' : 'Não'}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Token Expira Em</label>
                  <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                    {auditLog.tokenExpiresAt ? new Date(auditLog.tokenExpiresAt).toLocaleString('pt-BR') : 'Desconhecido'}
                  </p>
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h3>
              <p className="text-sm text-gray-900 bg-white p-3 rounded border leading-relaxed">
                {auditLog.description || 'Nenhuma descrição disponível'}
              </p>
            </div>

            {/* Informações de Data */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-600" />
                Data e Hora
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Criado em</label>
                <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                  {new Date(auditLog.created_at).toLocaleString('pt-BR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </p>
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