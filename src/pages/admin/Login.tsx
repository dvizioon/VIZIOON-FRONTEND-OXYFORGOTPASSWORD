import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuthContext } from '../../contexts/Auth/AuthContext';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { useToastAlert } from '../../components/UI/ToastAlert';
import { ParticlesBackground } from '../../components/UI/ParticlesBackground';
import { useI18n } from '../../hooks/useI18n';
import { LanguageSelector } from '../../components/UI/LanguageSelector';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const { t } = useI18n();
  const { showSuccess, showError } = useToastAlert();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);

  // Verificar se usuário já está logado
  useEffect(() => {
    const checkAuth = () => {
      const rememberMe = localStorage.getItem('rememberMe') === 'true';
      const token = rememberMe 
        ? localStorage.getItem('authToken') 
        : sessionStorage.getItem('authToken');
      
      if (token) {
        // Usuário já está logado, redirecionar para dashboard
        navigate('/admin/dashboard');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password, formData.rememberMe);
      showSuccess('Login realizado com sucesso!');
      navigate('/admin/dashboard');
    } catch (error: any) {
      showError(error.message || 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

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
              <Database className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4">{t('welcome')} ao oxyRecover</h2>
            <p className="text-xl text-white/90 mb-8">
              {t('platformDescription')}
            </p>
            <button className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg backdrop-blur-sm transition-all duration-300 border border-white/30 hover:border-white/50">
              {t('learnMore')}
            </button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">oxyRecover</h1>
            <p className="text-gray-600">{t('platformDescription')}</p>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('enter')} no oxyRecover</h1>
            <p className="text-gray-600">{t('createAndManage')}</p>
          </div>


          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="email"
                  label={t('email')}
                  placeholder="seu-email@ceuma.br"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
                <Mail className="absolute right-3 top-8 w-4 h-4 text-gray-400" />
              </div>

              <div className="relative">
                <Input
                  type="password"
                  label={t('password')}
                  placeholder="sua-senha"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
                <Lock className="absolute right-3 top-8 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                  className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{t('rememberMe')}</span>
              </label>
              
              <a href="/reset-password" className="text-sm text-violet-600 hover:text-violet-700 font-medium">
                {t('forgotPassword')}
              </a>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              <span>{t('access')} oxyRecover</span>
              <ArrowRight className="w-4 h-4 ml-2" />
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

export default AdminLogin;