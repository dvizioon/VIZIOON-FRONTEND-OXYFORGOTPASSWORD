import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, User, ArrowRight } from 'lucide-react';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { SearchableSelect } from '../components/UI/SearchableSelect';
import { useToastAlert } from '../components/UI/ToastAlert';
import { useMoodle } from '../hooks';

const ResetPassword: React.FC = () => {
  const { requestPasswordReset, getMoodleUsers } = useMoodle();
  const { showError, showSuccess } = useToastAlert();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'email' | 'username'>('email');
  const [showSelect, setShowSelect] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    moodleUrl: ''
  });
  const [availableUrls, setAvailableUrls] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingUrls, setLoadingUrls] = useState(false);

  const moodleApp = searchParams.get('moodleApp');

  useEffect(() => {
    if (moodleApp) {
      setFormData(prev => ({ ...prev, moodleUrl: moodleApp }));
    } else {
      loadAvailableUrls();
    }
  }, [moodleApp]);

  const loadAvailableUrls = async () => {
    setLoadingUrls(true);
    try {
      const response = await getMoodleUsers('simples');
      if (response.success && response.urls) {
        const urls = response.urls.map((item: { url: string }) => ({
          value: item.url,
          label: item.url
        }));
        setAvailableUrls(urls);
      }
    } catch (error) {
      showError('Erro ao carregar ambientes disponíveis');
    } finally {
      setLoadingUrls(false);
    }
  };

  const handleEnvironmentSelect = (url: string) => {
    setFormData(prev => ({ ...prev, moodleUrl: url }));
    const urlObj = new URL(window.location.href);
    urlObj.searchParams.set('moodleApp', url);
    window.history.replaceState({}, '', urlObj.toString());
    window.location.reload();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requestData = {
        moodleUrl: formData.moodleUrl,
        ...(activeTab === 'email' ? { email: formData.email } : { username: formData.username })
      };

      const response = await requestPasswordReset(requestData);
      
      if (response.success) {
        showSuccess(response.message || 'Se o usuário existir, um email de reset de senha será enviado');
        
        // Reset form
        setFormData({
          email: '',
          username: '',
          moodleUrl: moodleApp || ''
        });
      }
    } catch (error: any) {
      showError(error.message || 'Erro ao processar solicitação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <div className="flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-violet-100 overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-8 text-center rounded-t-2xl">
              <h1 className="text-2xl font-bold text-white mb-2">OXYGENI</h1>
              {moodleApp ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center">
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {moodleApp}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const url = new URL(window.location.href);
                      url.searchParams.delete('moodleApp');
                      window.history.replaceState({}, '', url.toString());
                      window.location.reload();
                    }}
                    className="text-violet-100 hover:text-white text-sm underline transition-colors"
                  >
                    Trocar ambiente
                  </button>
                </div>
              ) : (
                <p className="text-violet-100">Sistema de Reset de Senhas</p>
              )}
            </div>

            <div className="p-6">

              {!moodleApp && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                    Escolha seu Ambiente de Estudo
                  </h3>
                  
                  {loadingUrls ? (
                    <div className="flex items-center justify-center py-8">
                      <LoadingSpinner size="md" />
                      <span className="ml-2 text-gray-600">Carregando ambientes...</span>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 gap-3 mb-4">
                        {availableUrls.slice(0, 6).map((env) => (
                          <button
                            key={env.value}
                            onClick={() => handleEnvironmentSelect(env.value)}
                            className="p-4 border-2 border-gray-200 rounded-lg hover:border-violet-300 hover:bg-violet-50 transition-all duration-200 text-left group hover:animate__animated hover:animate__pulse hover:animate__faster"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900 group-hover:text-violet-700">
                                  {env.label}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Clique para acessar
                                </p>
                              </div>
                              <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center group-hover:bg-violet-200 group-hover:animate__animated group-hover:animate__bounceIn group-hover:animate__faster">
                                <ArrowRight className="w-4 h-4 text-violet-600" />
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                      
                      {availableUrls.length > 6 && (
                        <div className="text-center">
                          <button
                            type="button"
                            onClick={() => setShowSelect(!showSelect)}
                            className="text-violet-600 hover:text-violet-700 text-sm font-medium underline"
                          >
                            {showSelect ? 'Ocultar outros ambientes' : `Ver mais ${availableUrls.length - 6} ambientes`}
                          </button>
                        </div>
                      )}
                      
                      {showSelect && (
                        <div className="mt-4">
                          <SearchableSelect
                            label="Ou selecione manualmente"
                            placeholder="Buscar ambiente..."
                            value={formData.moodleUrl}
                            onChange={(value) => {
                              if (value) {
                                handleEnvironmentSelect(value);
                              }
                            }}
                            options={[{ value: '', label: 'Selecione o ambiente' }, ...availableUrls]}
                            loading={false}
                          />
                        </div>
                      )}
                      
                      <div className="mt-6 pt-4 border-t border-gray-200 relative">
                        <SearchableSelect
                          label="Ou busque diretamente pelo ambiente"
                          placeholder="Digite para buscar ambiente..."
                          value={formData.moodleUrl}
                          onChange={(value) => {
                            if (value) {
                              handleEnvironmentSelect(value);
                            }
                          }}
                          options={[{ value: '', label: 'Selecione o ambiente' }, ...availableUrls]}
                          loading={false}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {moodleApp && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => setActiveTab('email')}
                        className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                          activeTab === 'email'
                            ? 'bg-white text-violet-700 shadow-sm'
                            : 'text-gray-600 hover:text-violet-600'
                        }`}
                      >
                        <Mail className="w-4 h-4" />
                        <span>Email</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('username')}
                        className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                          activeTab === 'username'
                            ? 'bg-white text-violet-700 shadow-sm'
                            : 'text-gray-600 hover:text-violet-600'
                        }`}
                      >
                        <User className="w-4 h-4" />
                        <span>Usuário</span>
                      </button>
                    </div>

                    {activeTab === 'email' ? (
                      <Input
                        type="email"
                        label="Email"
                        placeholder="daniel@exemplo.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    ) : (
                      <Input
                        type="text"
                        label="Nome de Usuário"
                        placeholder="ex: CPF ( 2244400011 )"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        required
                      />
                    )}
                  </div>

                  <Button
                    type="submit"
                    loading={loading}
                    disabled={loadingUrls}
                    className="w-full"
                    size="lg"
                  >
                    <span>Enviar Link de Reset</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              © 2025 OXYGENI - CEUMA. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;