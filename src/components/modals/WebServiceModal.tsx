import React, { useState, useEffect } from 'react';
import { X, Globe, User, Key, Server, Edit3, Save } from 'lucide-react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { SearchableSelect } from '../UI/SearchableSelect';
import { Alert } from '../UI/Alert';
import { WebService, CreateWebServiceData, UpdateWebServiceData } from '../../types';

interface WebServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateWebServiceData | UpdateWebServiceData) => Promise<void>;
  webService?: WebService | null;
}

export const WebServiceModal: React.FC<WebServiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  webService
}) => {
  const [formData, setFormData] = useState({
    protocol: 'https',
    url: '',
    token: '',
    moodlePassword: '',
    moodleUser: '',
    serviceName: '',
    route: ''
  });
  const [isEditingRoute, setIsEditingRoute] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'error'; message: string } | null>(null);

  const isEditing = !!webService;
  const defaultRoute = '/webservice/rest/server.php';

  useEffect(() => {
    if (webService) {
      setFormData({
        protocol: webService.protocol,
        url: webService.url,
        token: webService.token,
        moodlePassword: (webService as any).moodlePassword || '',
        moodleUser: webService.moodleUser,
        serviceName: webService.serviceName,
        route: webService.route
      });
      setIsEditingRoute(false);
    } else {
      setFormData({
        protocol: 'https',
        url: '',
        token: '',
        moodlePassword: '',
        moodleUser: '',
        serviceName: '',
        route: defaultRoute
      });
      setIsEditingRoute(false);
    }
    setAlert(null);
  }, [webService, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      if (isEditing) {
        const updateData: UpdateWebServiceData = {
          protocol: formData.protocol,
          url: formData.url,
          token: formData.token,
          serviceName: formData.serviceName,
          ...(formData.moodleUser && { moodleUser: formData.moodleUser }),
          ...(formData.route && { route: formData.route }),
          ...(formData.moodlePassword && { moodlePassword: formData.moodlePassword })
        };
        await onSave(updateData);
      } else {
        const createData: CreateWebServiceData = {
          protocol: formData.protocol,
          url: formData.url,
          token: formData.token,
          serviceName: formData.serviceName,
          ...(formData.moodleUser && { moodleUser: formData.moodleUser }),
          ...(formData.route && { route: formData.route })
        };
        await onSave(createData);
      }
      
      onClose();
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: error.message || 'Erro ao salvar WebService'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRouteEditToggle = () => {
    setIsEditingRoute(!isEditingRoute);
  };
  if (!isOpen) return null;

  const protocolOptions = [
    { value: 'https', label: 'HTTPS' },
    { value: 'http', label: 'HTTP' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header fixo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Editar WebService' : 'Novo WebService'}
          </h2>
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
              className="mb-4"
            />
          )}

          <div className="relative">
            <Input
              label="Nome do Serviço"
              type="text"
              value={formData.serviceName}
              onChange={(e) => setFormData(prev => ({ ...prev, serviceName: e.target.value }))}
              required
              placeholder="Ex: EAD CEUMA"
            />
            <Server className="absolute right-3 top-8 w-4 h-4 text-gray-400" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <SearchableSelect
                label="Protocolo"
                placeholder="Selecione protocolo"
                value={formData.protocol}
                onChange={(value) => setFormData(prev => ({ ...prev, protocol: value }))}
                options={protocolOptions}
              />
            </div>
            <div className="col-span-2 relative">
              <Input
                label="URL"
                type="text"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                required
                placeholder="ead.ceuma.br"
              />
              <Globe className="absolute right-3 top-8 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="relative flex items-end space-x-2">
            <div className="flex-1">
              <Input
                label="Rota"
                type="text"
                value={formData.route}
                onChange={(e) => setFormData(prev => ({ ...prev, route: e.target.value }))}
                required
                placeholder="/webservice/rest/server.php"
                readOnly={!isEditingRoute}
                className={!isEditingRoute ? 'bg-gray-50 text-gray-600' : ''}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRouteEditToggle}
              className="mb-0 p-2 h-10"
            >
              {isEditingRoute ? (
                <Save className="w-4 h-4 text-green-600" />
              ) : (
                <Edit3 className="w-4 h-4 text-gray-600" />
              )}
            </Button>
          </div>

          <div className="relative">
            <Input
              label="Usuário Moodle"
              type="text"
              value={formData.moodleUser}
              onChange={(e) => setFormData(prev => ({ ...prev, moodleUser: e.target.value }))}
              placeholder="admin"
            />
            <User className="absolute right-3 top-8 w-4 h-4 text-gray-400" />
          </div>

          <div className="relative">
            <Input
              label="Senha Moodle"
              type="password"
              value={formData.moodlePassword}
              onChange={(e) => setFormData(prev => ({ ...prev, moodlePassword: e.target.value }))}
              placeholder="Senha do usuário Moodle"
            />
            <Key className="absolute right-3 top-8 w-4 h-4 text-gray-400" />
          </div>

          <div className="relative">
            <Input
              label="Token"
              type="password"
              value={formData.token}
              onChange={(e) => setFormData(prev => ({ ...prev, token: e.target.value }))}
              required
              placeholder="Token de acesso do WebService"
            />
            <Key className="absolute right-3 top-8 w-4 h-4 text-gray-400" />
          </div>

          <div className="bg-violet-50 rounded-lg p-4 mt-6">
            <h3 className="text-sm font-medium text-violet-800 mb-2">Informações:</h3>
            <ul className="text-sm text-violet-700 space-y-1">
              <li>• O token é obrigatório para autenticação</li>
              <li>• Usuário e senha do Moodle são opcionais</li>
              <li>• A URL deve ser acessível pelo sistema</li>
              <li>• Clique no ícone para editar a rota padrão</li>
            </ul>
          </div>
        </div>

        {/* Footer fixo */}
        <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-gray-50">
          <form onSubmit={handleSubmit}>
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
              type="submit"
              loading={loading}
              className="flex-1"
            >
              {isEditing ? 'Salvar' : 'Criar'}
            </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};