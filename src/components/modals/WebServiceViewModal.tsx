import React from 'react';
import { X, Globe, Server, Key, User, Shield, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../UI/Button';
import { WebService } from '../../types';
import { formatDate } from '../../lib/utils';

interface WebServiceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  webService: WebService | null;
}

export const WebServiceViewModal: React.FC<WebServiceViewModalProps> = ({
  isOpen,
  onClose,
  webService
}) => {
  if (!isOpen || !webService) return null;

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header fixo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-violet-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-violet-100 rounded-lg">
              {getStatusIcon(webService.isActive)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Detalhes do WebService</h2>
              <p className="text-sm text-gray-600">ID: {webService.id}</p>
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
              <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border ${getStatusColor(webService.isActive)}`}>
                {getStatusIcon(webService.isActive)}
                <span className="font-semibold">{getStatusText(webService.isActive)}</span>
              </div>
            </div>

            {/* Informações do Serviço */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Server className="w-5 h-5 mr-2 text-violet-600" />
                Informações do Serviço
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Serviço</label>
                  <p className="text-sm text-gray-900 bg-white p-3 rounded border">{webService.serviceName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID do Serviço</label>
                  <p className="text-sm text-gray-900 bg-white p-3 rounded border font-mono">{webService.id}</p>
                </div>
              </div>
            </div>

            {/* Informações de Conexão */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-600" />
                Conexão
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Protocolo</label>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      webService.protocol === 'https' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {webService.protocol.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-base text-gray-900 break-all">{webService.url}</p>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Completa</label>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-base font-mono text-gray-900 break-all">
                    {webService.protocol}://{webService.url}{webService.route}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rota</label>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-base font-mono text-gray-900">{webService.route}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações de Autenticação */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-600" />
                Autenticação
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Token</label>
                  <p className="text-sm text-gray-900 bg-white p-3 rounded border font-mono">
                    {webService.token ? `${webService.token.substring(0, 20)}...` : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usuário Moodle</label>
                  <p className="text-sm text-gray-900 bg-white p-3 rounded border flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    {webService.moodleUser || 'Não configurado'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Senha Moodle</label>
                  <p className="text-sm text-gray-900 bg-white p-3 rounded border flex items-center">
                    <Key className="w-4 h-4 mr-2 text-gray-400" />
                    {webService.moodlePassword ? '••••••••' : 'Não configurado'}
                  </p>
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
                  <p className="text-sm text-gray-900 bg-white p-3 rounded border flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {formatDate(webService.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Última Atualização</label>
                  <p className="text-sm text-gray-900 bg-white p-3 rounded border flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    {formatDate(webService.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Estatísticas */}
          </div>
        </div>
      </div>
    </div>
  );
};