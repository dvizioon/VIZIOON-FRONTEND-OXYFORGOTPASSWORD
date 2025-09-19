import React, { useCallback } from 'react';
import { toast, ToastOptions } from 'react-toastify';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastAlertProps {
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
  position?: ToastOptions['position'];
}


// Hook para usar o ToastAlert
export const useToastAlert = () => {
  const showToast = useCallback((
    type: ToastType,
    message: string,
    options?: {
      title?: string;
      duration?: number;
      position?: ToastOptions['position'];
      clearPrevious?: boolean; // Nova opção para limpar toasts anteriores
    }
  ) => {
    // Limpar toasts anteriores se solicitado
    if (options?.clearPrevious !== false) {
      toast.dismiss();
    }

    const toastOptions: ToastOptions = {
      position: options?.position || 'top-right',
      autoClose: options?.duration || 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    };

    switch (type) {
      case 'success':
        return toast.success(message, toastOptions);
      case 'error':
        return toast.error(message, toastOptions);
      case 'warning':
        return toast.warn(message, toastOptions);
      case 'info':
        return toast.info(message, toastOptions);
      default:
        return toast(message, toastOptions);
    }
  }, []);

  const showSuccess = useCallback((message: string, options?: { title?: string; duration?: number; position?: ToastOptions['position']; clearPrevious?: boolean }) =>
    showToast('success', message, options), [showToast]);

  const showError = useCallback((message: string, options?: { title?: string; duration?: number; position?: ToastOptions['position']; clearPrevious?: boolean }) =>
    showToast('error', message, options), [showToast]);

  const showWarning = useCallback((message: string, options?: { title?: string; duration?: number; position?: ToastOptions['position']; clearPrevious?: boolean }) =>
    showToast('warning', message, options), [showToast]);

  const showInfo = useCallback((message: string, options?: { title?: string; duration?: number; position?: ToastOptions['position']; clearPrevious?: boolean }) =>
    showToast('info', message, options), [showToast]);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showToast,
  };
};

// Componente funcional para compatibilidade com o Alert antigo
export const ToastAlert: React.FC<ToastAlertProps> = ({ 
  type, 
  message, 
  title, 
  duration = 5000,
  position = 'top-right'
}) => {
  const { showToast } = useToastAlert();
  
  React.useEffect(() => {
    showToast(type, message, { title, duration, position });
  }, [type, message, title, duration, position, showToast]);

  return null; // Este componente não renderiza nada, apenas dispara o toast
};

export default ToastAlert;