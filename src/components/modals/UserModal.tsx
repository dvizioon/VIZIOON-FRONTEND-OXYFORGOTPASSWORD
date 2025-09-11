import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Shield } from 'lucide-react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { SearchableSelect } from '../UI/SearchableSelect';
import { Alert } from '../UI/Alert';
import { User as UserType, CreateUserData, UpdateUserData } from '../../types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateUserData | UpdateUserData) => Promise<void>;
  user?: UserType | null;
  currentUserId?: string | number;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  user,
  currentUserId
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user'
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'error'; message: string } | null>(null);

  const isEditing = !!user;
  const isCurrentUser = user?.id === currentUserId;

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role as 'admin' | 'user'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user'
      });
    }
    setAlert(null);
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      if (isEditing) {
        const updateData: UpdateUserData = {
          name: formData.name,
          email: formData.email,
          role: formData.role
        };
        
        // Só incluir senha se foi preenchida
        if (formData.password.trim()) {
          updateData.password = formData.password;
        }

        await onSave(updateData);
      } else {
        if (!formData.password.trim()) {
          setAlert({
            type: 'error',
            message: 'Senha é obrigatória para novos usuários'
          });
          return;
        }

        const createData: CreateUserData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        };

        await onSave(createData);
      }
      
      onClose();
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: error.message || 'Erro ao salvar usuário'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const roleOptions = [
    { value: 'user', label: 'Usuário' },
    { value: 'admin', label: 'Administrador' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header fixo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
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
              label="Nome"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              placeholder="Nome completo"
            />
            <User className="absolute right-3 top-8 w-4 h-4 text-gray-400" />
          </div>

          <div className="relative">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              placeholder="email@exemplo.com"
            />
            <Mail className="absolute right-3 top-8 w-4 h-4 text-gray-400" />
          </div>

          <div className="relative">
            <Input
              label={isEditing ? "Nova Senha (deixe vazio para manter)" : "Senha"}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required={!isEditing}
              placeholder={isEditing ? "Nova senha (opcional)" : "Senha"}
              minLength={6}
            />
            <Lock className="absolute right-3 top-8 w-4 h-4 text-gray-400" />
          </div>

          <div className="relative">
            <SearchableSelect
              label="Função"
              placeholder="Selecione a função"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'user' }))}
              options={roleOptions}
              disabled={isCurrentUser} // Não pode alterar própria função
            />
          </div>

          {isCurrentUser && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Nota:</strong> Você não pode alterar sua própria função.
              </p>
            </div>
          )}
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