import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, Eye, EyeOff, Info, Shield } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { useToastAlert } from '../components/UI/ToastAlert';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';
import { useMoodle } from '../hooks';

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  bgColor: string;
}

const ResetPasswordForm: React.FC = () => {
  const { validateResetToken, changePassword, loading: hookLoading } = useMoodle();
  const { showError, showSuccess } = useToastAlert();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [tokenData, setTokenData] = useState<any>(null);
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmPassword: false
  });
  const [validatingToken, setValidatingToken] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    if (score <= 2) return { score, label: 'Fraca', color: 'text-red-600', bgColor: 'bg-red-500' };
    if (score <= 4) return { score, label: 'Média', color: 'text-yellow-600', bgColor: 'bg-yellow-500' };
    return { score, label: 'Forte', color: 'text-green-600', bgColor: 'bg-green-500' };
  };

  const passwordStrength = calculatePasswordStrength(passwords.newPassword);
  const strengthPercentage = (passwordStrength.score / 6) * 100;

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      validateToken(tokenParam);
    } else {
      showError('Token não fornecido');
      setValidatingToken(false);
    }
  }, [searchParams]);

  const validateToken = async (tokenValue: string) => {
    try {
      const response = await validateResetToken(tokenValue);
      if (response.success) {
        setTokenData(response.data);
      } else {
        showError(response.message || 'Token inválido ou expirado');
      }
    } catch (error: any) {
      showError(error.message || 'Erro ao validar token');
    } finally {
      setValidatingToken(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      showError('As senhas não coincidem');
      return;
    }

    if (passwords.newPassword.length < 6) {
      showError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await moodleApi.changePassword(token, passwords.newPassword);
      
      if (response.success) {
        setSuccess(true);
        showSuccess(response.message || 'Senha redefinida com sucesso!');

        // Redirect after success
        setTimeout(() => {
          if (response.user?.url) {
            window.location.href = `https://${response.user.url}`;
          } else {
            navigate('/');
          }
        }, 3000);
      }
    } catch (error: any) {
      showError(error.message || 'Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'newPassword' | 'confirmPassword') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (validatingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
        <div className="flex items-center justify-center px-4 py-8">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-gray-600">Validando token de reset...</p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
        <div className="flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl border border-violet-100 overflow-hidden text-center p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Sucesso!</h1>
              <p className="text-gray-600 mb-6">
                Sua senha foi redefinida com sucesso. Você será redirecionado em alguns segundos...
              </p>
              <LoadingSpinner size="md" className="mx-auto" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
        <div className="flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl border border-violet-100 overflow-hidden p-8 text-center">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
              >
                Voltar ao Início
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <div className="flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-violet-100 overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-8 text-center">
              <h1 className="text-2xl font-bold text-white mb-2">OXYGENI</h1>
              <div className="flex items-center justify-center">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {tokenData.moodleUrl}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/';
                }}
                className="text-violet-100 hover:text-white text-sm underline transition-colors mt-3"
              >
                Trocar ambiente
              </button>
            </div>

            <div className="p-6">

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <Input
                    type={showPasswords.newPassword ? 'text' : 'password'}
                    label="Nova Senha"
                    placeholder="Digite sua nova senha"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('newPassword')}
                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.newPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Barra de Segurança da Senha */}
                {passwords.newPassword && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Segurança da senha:</span>
                      <span className={`text-sm font-medium ${passwordStrength.color}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.bgColor}`}
                        style={{ width: `${strengthPercentage}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Shield className={`w-4 h-4 ${passwordStrength.color}`} />
                      <span className="text-xs text-gray-600">
                        {strengthPercentage < 50 ? 'Tente adicionar números, símbolos e letras maiúsculas' : 
                         strengthPercentage < 83 ? 'Boa! Sua senha está ficando mais segura' : 
                         'Excelente! Senha muito segura'}
                      </span>
                    </div>
                  </div>
                )}

                <div className="relative">
                  <Input
                    type={showPasswords.confirmPassword ? 'text' : 'password'}
                    label="Confirmar Nova Senha"
                    placeholder="Confirme sua nova senha"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirmPassword')}
                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="relative">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-gray-700">Requisitos da senha</span>
                    <div 
                      className="relative"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    >
                      <Info className="w-4 h-4 text-gray-400 hover:text-violet-600 cursor-help transition-colors" />
                      
                      {showTooltip && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 animate__animated animate__fadeIn animate__faster">
                          <div className="bg-gray-900 text-white text-sm rounded-lg py-4 px-5 shadow-xl max-w-sm w-80">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${passwords.newPassword.length >= 6 ? 'bg-green-400' : 'bg-gray-400'}`} />
                                <span className="flex-1">Mínimo de 6 caracteres</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${passwords.newPassword === passwords.confirmPassword && passwords.newPassword ? 'bg-green-400' : 'bg-gray-400'}`} />
                                <span className="flex-1">Senhas devem coincidir</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(passwords.newPassword) ? 'bg-green-400' : 'bg-gray-400'}`} />
                                <span className="flex-1">Pelo menos 1 letra maiúscula</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${/[0-9]/.test(passwords.newPassword) ? 'bg-green-400' : 'bg-gray-400'}`} />
                                <span className="flex-1">Pelo menos 1 número</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${/[^A-Za-z0-9]/.test(passwords.newPassword) ? 'bg-green-400' : 'bg-gray-400'}`} />
                                <span className="flex-1">Pelo menos 1 símbolo</span>
                              </div>
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full"
                  size="lg"
                >
                  Redefinir Senha
                </Button>
              </form>
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

export default ResetPasswordForm;