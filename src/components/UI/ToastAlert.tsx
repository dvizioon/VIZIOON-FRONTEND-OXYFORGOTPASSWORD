import React from 'react';
import { toast, ToastOptions } from 'react-toastify';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastAlertProps {
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
  position?: ToastOptions['position'];
}

// Componente para renderizar o conteúdo do toast
const ToastContent: React.FC<{ type: ToastType; title?: string; message: string }> = ({ 
  type, 
  title, 
  message 
}) => {
  const config = {
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-500',
      titleColor: 'text-green-800',
      messageColor: 'text-green-700'
    },
    error: {
      icon: XCircle,
      iconColor: 'text-red-500',
      titleColor: 'text-red-800',
      messageColor: 'text-red-700'
    },
    warning: {
      icon: AlertCircle,
      iconColor: 'text-yellow-500',
      titleColor: 'text-yellow-800',
      messageColor: 'text-yellow-700'
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-500',
      titleColor: 'text-blue-800',
      messageColor: 'text-blue-700'
    }
  };

  const { icon: Icon, iconColor, titleColor, messageColor } = config[type];

  return (
    <div className="flex items-start">
      <Icon className={`w-5 h-5 ${iconColor} mt-0.5 mr-3 flex-shrink-0`} />
      <div className="flex-1">
        {title && (
          <h4 className={`text-sm font-medium ${titleColor} mb-1`}>
            {title}
          </h4>
        )}
        <p className={`text-sm ${messageColor}`}>
          {message}
        </p>
      </div>
    </div>
  );
};

// Hook para usar o ToastAlert
export const useToastAlert = () => {
  const showToast = (
    type: ToastType,
    message: string,
    options?: {
      title?: string;
      duration?: number;
      position?: ToastOptions['position'];
    }
  ) => {
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

    const content = (
      <ToastContent 
        type={type} 
        title={options?.title} 
        message={message} 
      />
    );

    switch (type) {
      case 'success':
        return toast.success(content, toastOptions);
      case 'error':
        return toast.error(content, toastOptions);
      case 'warning':
        return toast.warn(content, toastOptions);
      case 'info':
        return toast.info(content, toastOptions);
      default:
        return toast(content, toastOptions);
    }
  };

  return {
    showSuccess: (message: string, options?: { title?: string; duration?: number; position?: ToastOptions['position'] }) =>
      showToast('success', message, options),
    showError: (message: string, options?: { title?: string; duration?: number; position?: ToastOptions['position'] }) =>
      showToast('error', message, options),
    showWarning: (message: string, options?: { title?: string; duration?: number; position?: ToastOptions['position'] }) =>
      showToast('warning', message, options),
    showInfo: (message: string, options?: { title?: string; duration?: number; position?: ToastOptions['position'] }) =>
      showToast('info', message, options),
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
