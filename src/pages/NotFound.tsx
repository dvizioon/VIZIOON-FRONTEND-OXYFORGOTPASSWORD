import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { useI18n } from '../hooks/useI18n';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo do Serviço */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">OxyForgotPassword</h1>
        </div>

        {/* Código 404 */}
        <div className="mb-8">
          <h2 className="text-8xl font-bold text-violet-600 mb-4">404</h2>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">{t('pageNotFound')}</h3>
          <p className="text-gray-600 mb-6">{t('pageNotFoundDescription')}</p>
        </div>

        {/* Botões de Ação */}
        <div className="space-y-4">
          <Button
            onClick={() => navigate('/admin/dashboard')}
            className="w-full"
            size="lg"
          >
            <Home className="w-5 h-5 mr-2" />
            {t('goToDashboard')}
          </Button>
          
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('goBack')}
          </Button>
        </div>

      </div>
    </div>
  );
};

export default NotFound;
