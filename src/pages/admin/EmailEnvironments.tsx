import React, { useState, useEffect } from 'react';
import { Globe, Settings, AlertCircle, ExternalLink } from 'lucide-react';
import { AdminLayout } from '../../components/Layout/AdminLayout';
import { Button } from '../../components/UI/Button';
import { useToastAlert } from '../../components/UI/ToastAlert';
import { useMoodle } from '../../hooks/userMoodle';
import { useI18n } from '../../hooks/useI18n';

const AdminEmailEnvironments: React.FC = () => {
  const { showError } = useToastAlert();
  const { getMoodleUrls, loadingUrls } = useMoodle();
  const { t } = useI18n();
  const [moodleUrls, setMoodleUrls] = useState<Array<{url: string}>>([]);

  // Carregar URLs do Moodle
  useEffect(() => {
    const loadMoodleUrls = async () => {
      try {
        const response = await getMoodleUrls();
        setMoodleUrls(response.urls);
      } catch (error) {
        console.error('Erro ao carregar URLs do Moodle:', error);
        showError('Erro ao carregar ambientes');
      }
    };

    loadMoodleUrls();
  }, [getMoodleUrls, showError]); // Dependências corretas

  return (
    <AdminLayout title="Email - Ambientes">
      <div className="w-full h-full">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('activeEnvironments')}</h1>
                <p className="text-gray-600">{t('selectEnvironmentForEmail')}</p>
              </div>
            </div>
            
          </div>
        </div>

        {/* Lista de Ambientes - 100% da tela */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{t('availableMoodleEnvironments')}</h2>
            <p className="text-sm text-gray-600 mt-1">{t('selectEnvironmentDescription')}</p>
          </div>
          
          <div className="p-6 h-full">
            {loadingUrls ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                <span className="ml-3 text-gray-600">{t('loadingEnvironments')}</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 h-full">
                {moodleUrls.map((env, index) => (
                  <div 
                    key={index}
                    className="group p-8 rounded-xl border-2 border-gray-200 hover:border-violet-400 hover:shadow-xl transition-all duration-300 cursor-pointer bg-white hover:bg-gradient-to-br hover:from-violet-50 hover:to-blue-50 flex flex-col h-full"
                    onClick={() => {
                      const url = env.url.startsWith('http') ? env.url : `https://${env.url}`;
                      window.open(url, '_blank');
                    }}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:from-violet-200 group-hover:to-blue-200 transition-all duration-300">
                          <Globe className="w-8 h-8 text-violet-600 group-hover:text-violet-700" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-violet-700 transition-colors">{t('moodle')}</h3>
                          <p className="text-sm text-gray-500">{t('activeEnvironment')}</p>
                        </div>
                      </div>
                      <div className="w-4 h-4 bg-green-500 rounded-full group-hover:bg-green-400 transition-colors"></div>
                    </div>
                    
                    <div className="space-y-4 mb-8 flex-grow">
                      <h4 className="font-medium text-gray-900 text-xl group-hover:text-violet-800 transition-colors break-all">{env.url}</h4>
                      <p className="text-sm text-gray-600">{t('environmentUrl')}</p>
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-gray-100 group-hover:border-violet-200 transition-colors">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full group-hover:bg-violet-100 group-hover:border-violet-300 group-hover:text-violet-700 transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          const url = env.url.startsWith('http') ? env.url : `https://${env.url}`;
                          window.open(url, '_blank');
                        }}
                      >
                        <ExternalLink className="w-5 h-5 mr-2" />
                        {t('goToEnvironment')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!loadingUrls && moodleUrls.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noEnvironmentsFound')}</h3>
                <p className="text-gray-600">{t('noActiveMoodleEnvironments')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEmailEnvironments;
