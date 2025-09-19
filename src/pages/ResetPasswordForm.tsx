import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Key, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { useToastAlert } from '../components/UI/ToastAlert';
import { ParticlesBackground } from '../components/UI/ParticlesBackground';
import { useI18n } from '../hooks/useI18n';
import { LanguageSelector } from '../components/UI/LanguageSelector';
import api from '../lib/api';

const ResetPasswordForm: React.FC = () => {
  const { t } = useI18n();
  const { showSuccess, showError } = useToastAlert();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [validatingToken, setValidatingToken] = useState(true);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      showError(t('invalidResetToken'));
      setTokenValid(false);
      setValidatingToken(false);
      return;
    }

    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await api.post('/v1/moodle/validate-reset-token', {
        token: token
      });

      if (response.data.success) {
        setTokenValid(true);
      } else {
        setTokenValid(false);
        showError(t('resetTokenExpired'));
      }
    } catch (error: any) {
      setTokenValid(false);
      showError(error.response?.data?.message || t('invalidResetToken'));
    } finally {
      setValidatingToken(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      showError(t('passwordsDoNotMatch'));
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      showError(t('passwordTooShort'));
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/v1/moodle/change-password', {
        token: token,
        newPassword: formData.newPassword
      });

      if (response.data.success) {
        showSuccess(t('passwordResetSuccess'));
        
        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          navigate('/admin/login');
        }, 3000);
      } else {
        throw new Error(response.data.message || 'Erro ao redefinir senha');
      }
    } catch (error: any) {
      showError(error.response?.data?.message || error.message || 'Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validando token...</p>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Token Inválido</h1>
            <p className="text-gray-600 mb-6">Este link de redefinição é inválido ou expirou.</p>
            <Button
              onClick={() => navigate('/reset-password')}
              className="w-full"
            >
              Solicitar Novo Reset
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
              <Lock className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4">{t('resetPasswordForm')}</h2>
            <p className="text-xl text-white/90 mb-8">
              {t('resetPasswordFormDescription')}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Reset Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">OxyForgotPassword</h1>
            <p className="text-gray-600">{t('resetPasswordFormDescription')}</p>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('resetPasswordForm')}</h1>
            <p className="text-gray-600">{t('resetPasswordFormDescription')}</p>
          </div>


          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  label={t('newPassword')}
                  placeholder="Nova senha"
                  value={formData.newPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8 w-4 h-4 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  label={t('confirmPassword')}
                  placeholder="Confirmar nova senha"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-8 w-4 h-4 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              <span>Redefinir Senha</span>
            </Button>
          </form>

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

export default ResetPasswordForm;