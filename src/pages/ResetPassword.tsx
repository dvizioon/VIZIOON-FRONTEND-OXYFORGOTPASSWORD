import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { useToastAlert } from '../components/UI/ToastAlert';
import { ParticlesBackground } from '../components/UI/ParticlesBackground';
import { useI18n } from '../hooks/useI18n';
import { LanguageSelector } from '../components/UI/LanguageSelector';
import api from '../lib/api';

const ResetPassword: React.FC = () => {
  const { t } = useI18n();
  const { showSuccess, showError } = useToastAlert();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/v1/moodle/reset-password', {
        email: email
      });

      if (response.data.success) {
        setEmailSent(true);
        showSuccess(t('resetEmailSent'));
      } else {
        throw new Error(response.data.message || 'Erro ao enviar e-mail');
      }
    } catch (error: any) {
      showError(error.response?.data?.message || error.message || 'Erro ao enviar e-mail de redefinição');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('resetEmailSent')}</h1>
            <p className="text-gray-600 mb-6">{t('checkYourEmail')}</p>
            <Button
              onClick={() => window.location.href = '/admin/login'}
              className="w-full"
            >
              Voltar ao Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Image/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10">
          <ParticlesBackground />
        </div>
        <div className="relative z-20 flex flex-col justify-center items-center text-white p-12 w-full h-full">
          {/* Language Selector */}
          <div className="absolute top-6 right-6 z-30">
            <LanguageSelector />
          </div>
          
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
              <Mail className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4">{t('resetPasswordTitle')}</h2>
            <p className="text-xl text-white/90 mb-8">
              {t('resetPasswordDescription')}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Reset Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">oxyRecover</h1>
            <p className="text-gray-600">{t('resetPasswordDescription')}</p>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('resetPasswordTitle')}</h1>
            <p className="text-gray-600">{t('resetPasswordDescription')}</p>
          </div>


          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="email"
                  label={t('email')}
                  placeholder="seu-email@ceuma.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail className="absolute right-3 top-8 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              <span>{t('sendResetEmail')}</span>
            </Button>
          </form>

          <div className="mt-8 text-center">
            <a 
              href="/admin/login" 
              className="inline-flex items-center text-sm text-violet-600 hover:text-violet-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Login
            </a>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              {t('copyright')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;