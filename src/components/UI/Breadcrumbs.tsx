import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const location = useLocation();
  const { t } = useI18n();

  // Função para gerar breadcrumbs automaticamente baseado na rota
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Mapeamento de rotas para labels amigáveis
    const routeLabels: { [key: string]: string } = {
      'admin': t('breadcrumbAdmin'),
      'dashboard': t('breadcrumbDashboard'),
      'users': t('breadcrumbUsers'),
      'create': t('breadcrumbCreate'),
      'edit': t('breadcrumbEdit'),
      'view': t('breadcrumbView'),
      'settings': t('settings'),
      'profile': t('profile')
    };

    // Sempre começar com Home
    breadcrumbs.push({
      label: t('breadcrumbHome'),
      href: '/admin/dashboard'
    });

    // Construir breadcrumbs baseado nos segmentos da URL
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Pular o primeiro segmento se for 'admin' (já temos Home)
      if (segment === 'admin' && index === 0) {
        return;
      }

      breadcrumbs.push({
        label: routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
        href: isLast ? undefined : currentPath,
        current: isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  if (breadcrumbItems.length <= 1) {
    return null; // Não mostrar breadcrumbs se só tiver Home
  }

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
            )}
            
            {item.href && !item.current ? (
              <Link
                to={item.href}
                className="text-sm font-medium text-gray-500 hover:text-violet-600 transition-colors duration-200 flex items-center"
              >
                {index === 0 && <Home className="w-4 h-4 mr-1" />}
                {item.label}
              </Link>
            ) : (
              <span
                className={`text-sm font-medium flex items-center ${
                  item.current
                    ? 'text-gray-900'
                    : 'text-gray-500'
                }`}
                aria-current={item.current ? 'page' : undefined}
              >
                {index === 0 && <Home className="w-4 h-4 mr-1" />}
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};