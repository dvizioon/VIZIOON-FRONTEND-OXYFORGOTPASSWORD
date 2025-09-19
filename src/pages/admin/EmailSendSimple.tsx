import React, { useState, useEffect } from 'react';
import { Mail, Send, Globe, CheckCircle } from 'lucide-react';
import { AdminLayout } from '../../components/Layout/AdminLayout';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { TransferList, TransferItem } from '../../components/UI/TransferList';
import { useToastAlert } from '../../components/UI/ToastAlert';
import { useMoodle } from '../../hooks/userMoodle';
import api from '../../lib/api';

const AdminEmailSendSimple: React.FC = () => {
  const { showSuccess, showError } = useToastAlert();
  const { getMoodleUrls } = useMoodle();
  const [loading, setLoading] = useState(false);
  const [moodleUrls, setMoodleUrls] = useState<Array<{url: string}>>([]);
  
  const [availableEnvironments, setAvailableEnvironments] = useState<TransferItem[]>([]);
  const [selectedEnvironments, setSelectedEnvironments] = useState<TransferItem[]>([]);
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });

  // Carregar URLs do Moodle
  useEffect(() => {
    const loadMoodleUrls = async () => {
      try {
        const response = await getMoodleUrls();
        setMoodleUrls(response.urls);
        
        // Converter URLs para TransferItems
        const environments = response.urls.map((env: {url: string}, index: number) => ({
          id: `env-${index}`,
          label: env.url,
          value: env.url
        }));
        setAvailableEnvironments(environments);
      } catch (error) {
        console.error('Erro ao carregar URLs do Moodle:', error);
        showError('Erro ao carregar ambientes');
      }
    };

    loadMoodleUrls();
  }, [getMoodleUrls, showError]);

  // Função para gerenciar transferência de ambientes
  const handleEnvironmentTransfer = (items: TransferItem[], direction: 'left' | 'right') => {
    if (direction === 'right') {
      // Movendo da esquerda para direita (selecionando)
      setSelectedEnvironments([...selectedEnvironments, ...items]);
      setAvailableEnvironments(availableEnvironments.filter(env => !items.some(item => item.id === env.id)));
    } else {
      // Movendo da direita para esquerda (deselecionando)
      setAvailableEnvironments([...availableEnvironments, ...items]);
      setSelectedEnvironments(selectedEnvironments.filter(env => !items.some(item => item.id === env.id)));
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar se pelo menos um campo (email OU username) foi preenchido
      if (!formData.email && !formData.username) {
        showError('Por favor, preencha pelo menos o email ou username');
        return;
      }

      // Validar se pelo menos um ambiente foi selecionado
      if (selectedEnvironments.length === 0) {
        showError('Por favor, selecione pelo menos um ambiente');
        return;
      }

      // Enviar email para todos os ambientes selecionados
      const promises = selectedEnvironments.map(async (environment) => {
        try {
          const response = await api.post('/v1/moodle/request-password-reset', {
            environment: environment.value,
            email: formData.email,
            username: formData.username
          });
          return { environment: environment.value, success: true, data: response.data };
        } catch (error: any) {
          return { environment: environment.value, success: false, error: error.response?.data?.message || 'Erro desconhecido' };
        }
      });

      const results = await Promise.all(promises);
      
      // Verificar resultados
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      if (successful.length > 0) {
        showSuccess(`Email enviado com sucesso para ${successful.length} ambiente(s)`);
      }

      if (failed.length > 0) {
        const failedEnvs = failed.map(f => f.environment).join(', ');
        showError(`Falha ao enviar para: ${failedEnvs}`);
      }

    } catch (error: any) {
      console.error('Erro ao enviar email:', error);
      showError(error.response?.data?.message || 'Erro ao enviar email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Email - Enviar">
      <div className="w-full h-full">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Send className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Enviar Email</h1>
                <p className="text-gray-600">Envie emails de reset de senha para usuários</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* TransferList para Seleção de Ambientes */}
          <TransferList
            title="Seleção de Ambientes"
            leftTitle="Ambientes Disponíveis"
            rightTitle="Ambientes Selecionados"
            leftItems={availableEnvironments}
            rightItems={selectedEnvironments}
            onTransfer={handleEnvironmentTransfer}
            leftSearchPlaceholder="Buscar ambientes..."
            rightSearchPlaceholder="Buscar selecionados..."
          />

          {/* Formulário de Envio */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Enviar Email
              </h2>
              <p className="text-sm text-gray-600 mt-1">Preencha os dados do usuário</p>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSendEmail} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email do usuário
                  </label>
                  <Input
                    type="email"
                    placeholder="usuario@exemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username (opcional)
                  </label>
                  <Input
                    type="text"
                    placeholder="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full"
                  />
                </div>

                {/* Resumo dos Ambientes Selecionados */}
                {selectedEnvironments.length > 0 && (
                  <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-violet-800 mb-2">
                      Ambientes Selecionados ({selectedEnvironments.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEnvironments.map((env, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-800"
                        >
                          <Globe className="w-3 h-3 mr-1" />
                          {env.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading || selectedEnvironments.length === 0}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Email
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEmailSendSimple;
