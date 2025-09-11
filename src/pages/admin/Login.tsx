import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuthContext } from '../../contexts/Auth/AuthContext';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { Alert } from '../../components/UI/Alert';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      await login(formData.email, formData.password, formData.rememberMe);
      navigate('/admin');
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: error.message || 'Credenciais inválidas'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-violet-100 overflow-hidden">
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">OXYGENI</h1>
            <p className="text-violet-100">OXYGENI - CEUMA</p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Input
                  type="email"
                  label="Email"
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
                  label="Senha"
                  placeholder="sua-senha"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
                <Lock className="absolute right-3 top-8 w-4 h-4 text-gray-400" />
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                  className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Lembrar de mim
                </label>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full"
                size="lg"
              >
                <span>Entrar no Painel</span>
                <ArrowRight className="w-4 h-4 ml-2" />
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
  );
};

export default AdminLogin;