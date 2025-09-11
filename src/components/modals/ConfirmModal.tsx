import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '../UI/Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger',
  loading = false
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconColor: 'text-red-500',
          bgColor: 'bg-red-50',
          buttonVariant: 'primary' as const
        };
      case 'warning':
        return {
          iconColor: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          buttonVariant: 'primary' as const
        };
      case 'info':
        return {
          iconColor: 'text-blue-500',
          bgColor: 'bg-blue-50',
          buttonVariant: 'primary' as const
        };
      default:
        return {
          iconColor: 'text-red-500',
          bgColor: 'bg-red-50',
          buttonVariant: 'primary' as const
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header fixo */}
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo com scroll */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className={`flex items-center space-x-3 p-4 rounded-lg ${styles.bgColor} mb-4`}>
            <AlertTriangle className={`w-6 h-6 ${styles.iconColor} flex-shrink-0`} />
            <p className="text-gray-700">{message}</p>
          </div>
        </div>

        {/* Footer fixo */}
        <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              {cancelText}
            </Button>
            <Button
              type="button"
              variant={styles.buttonVariant}
              onClick={onConfirm}
              loading={loading}
              className="flex-1"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};