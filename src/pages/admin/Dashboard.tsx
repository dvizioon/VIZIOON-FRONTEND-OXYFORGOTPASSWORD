import React, { useState, useEffect } from 'react';
import { Users, Mail, Activity, Server, ChevronLeft, ChevronRight, Calendar, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { AdminLayout } from '../../components/Layout/AdminLayout';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';
import { useToastAlert } from '../../components/UI/ToastAlert';
import { Button } from '../../components/UI/Button';
import { DatePicker } from '../../components/UI/DatePicker';
import { useWebServices, useUsers, useAuditing, useSystem } from '../../hooks';

const formatDateBR = (isoDate: string) => {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-');
  if (!y || !m || !d) return isoDate;
  return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
};

interface DashboardStats {
  totalUsers: number;
  totalWebServices: number;
  totalEmails: number;
  activeServices: number;
}

// interface SystemInfo {
//   ms: string;
//   version: string;
// }
const AdminDashboard: React.FC = () => {
  const { getDashboardStats, getSystemInfo } = useSystem();
  const { getWebServices } = useWebServices();
  const { getUsers } = useUsers();
  const { getAuditLogs, getAuditStats } = useAuditing();
  const { showError } = useToastAlert();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalWebServices: 0,
    totalEmails: 0,
    activeServices: 0
  });
  const [webServices, setWebServices] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para paginação e filtros
  const [auditPage, setAuditPage] = useState(1);
  const [webServicesPage, setWebServicesPage] = useState(1);
  const [dateFilter, setDateFilter] = useState('');
  const [auditTotal, setAuditTotal] = useState(0);
  const [webServicesTotal, setWebServicesTotal] = useState(0);

  useEffect(() => {
    loadDashboardData();
    loadSystemInfo();
  }, []);

  useEffect(() => {
    loadAuditLogs();
  }, [auditPage, dateFilter]);

  useEffect(() => {
    loadWebServicesData();
  }, [webServicesPage]);

  const loadSystemInfo = async () => {
    try {
      const response = await getSystemInfo();
      setSystemInfo(response);
    } catch (error) {
      console.error('Erro ao carregar informações do sistema:', error);
    }
  };

  const loadAuditLogs = async () => {
    try {
      // Se há filtro de data, buscar logs daquela data específica
      let startDate, endDate;
      if (dateFilter) {
        // Criar data no horário local para evitar problemas de timezone
        const selectedDate = new Date(dateFilter + 'T00:00:00');
        
        // Definir início do dia (00:00:00) em UTC
        startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0).toISOString();
        // Definir fim do dia (23:59:59) em UTC
        endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59).toISOString();
      }
      
      const response = await getAuditLogs(auditPage, 5, undefined, undefined, startDate, endDate);
      setAuditLogs(response.auditing || []);
      setAuditTotal(response.pagination?.total || 0);
    } catch (error) {
      console.error('Erro ao carregar logs de auditoria:', error);
    }
  };

  const loadWebServicesData = async () => {
    try {
      const response = await getWebServices(webServicesPage, 5);
      setWebServices(response.webServices || []);
      setWebServicesTotal(response.pagination?.total || response.webServices?.length || 0);
    } catch (error) {
      console.error('Erro ao carregar web services:', error);
    }
  };
  
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Carregar dados das APIs
      const [statsResponse, webServicesResponse, usersResponse, auditLogsResponse] = await Promise.allSettled([
        getDashboardStats().catch(() => null), // Tenta carregar stats da API, se falhar usa null
        getWebServices(),
        getUsers(1, 1), // Pega apenas 1 usuário para contar o total
        getAuditLogs(1, 10) // Pega os últimos 10 logs
      ]);

      // Processar estatísticas
      let calculatedStats = {
        totalUsers: 0,
        totalWebServices: 0,
        totalEmails: 0,
        activeServices: 0
      };

      // Se a API de stats estiver disponível, usa ela
      if (statsResponse.status === 'fulfilled' && statsResponse.value) {
        calculatedStats = statsResponse.value;
      } else {
        // Senão, calcula baseado nos dados disponíveis
        if (usersResponse.status === 'fulfilled' && usersResponse.value) {
          calculatedStats.totalUsers = usersResponse.value.total || usersResponse.value.users?.length || 0;
        }
        
        if (webServicesResponse.status === 'fulfilled' && webServicesResponse.value) {
          const services = webServicesResponse.value.webServices || [];
          calculatedStats.totalWebServices = services.length;
          calculatedStats.activeServices = services.filter((s: any) => s.isActive).length;
        }
        
        if (auditLogsResponse.status === 'fulfilled' && auditLogsResponse.value) {
          const logs = auditLogsResponse.value.auditing || [];
          calculatedStats.totalEmails = logs.filter((log: any) => log.emailSent).length;
        }
      }

      setStats(calculatedStats);

      // Os dados de web services e audit logs são carregados separadamente com paginação
      
    } catch (error: any) {
      showError(error.message || 'Erro ao carregar dados do dashboard');
      // Valores padrão em caso de erro
      setStats({
        totalUsers: 0,
        totalWebServices: 0,
        totalEmails: 0,
        activeServices: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Funções de paginação
  const goToAuditPage = (page: number) => {
    setAuditPage(Math.max(1, page));
  };

  const goToWebServicesPage = (page: number) => {
    setWebServicesPage(Math.max(1, page));
  };

  const handleDateFilterChange = (date: string) => {
    console.log('DatePicker enviou:', date);
    setDateFilter(date);
    setAuditPage(1); // Reset para primeira página quando filtro muda
  };

  const clearDateFilter = () => {
    setDateFilter('');
    setAuditPage(1);
  };

  const handleAuditItemClick = (log: any) => {
    // Navegar para a página de auditoria com filtros
    const searchParams = new URLSearchParams();
    
    // Priorizar o ID do log para busca na tabela
    if (log.id) {
      searchParams.set('search', log.id);
      searchParams.set('searchType', 'id');
    } else if (log.email) {
      searchParams.set('search', log.email);
      searchParams.set('searchType', 'email');
    } else if (log.username) {
      searchParams.set('search', log.username);
      searchParams.set('searchType', 'username');
    } else if (log.phone) {
      searchParams.set('search', log.phone);
      searchParams.set('searchType', 'phone');
    }
    
    // Adicionar data se disponível
    if (log.created_at) {
      const logDate = new Date(log.created_at).toISOString().split('T')[0];
      searchParams.set('date', logDate);
    }
    
    // Navegar para auditoria com os parâmetros
    navigate(`/admin/auditing?${searchParams.toString()}`);
  };

  // Filtrar logs por data selecionada (filtro adicional no frontend)
  const filteredAuditLogs = auditLogs.filter(log => {
    if (!dateFilter) return true; // Se não há filtro de data, mostrar todos
    
    // Usar uma abordagem mais simples: comparar apenas a parte da data
    const logDate = new Date(log.created_at);
    const logDateString = logDate.toISOString().split('T')[0];
    
    console.log('Filtro frontend:', {
      logCreatedAt: log.created_at,
      logDateString,
      dateFilter,
      matches: logDateString === dateFilter
    });
    
    return logDateString === dateFilter;
  });

  // Calcular páginas totais
  const auditTotalPages = Math.ceil(filteredAuditLogs.length / 5);
  const webServicesTotalPages = Math.ceil(webServicesTotal / 5);

  // Filtrar logs de erro de email
  const emailErrorLogs = filteredAuditLogs.filter(log => {
    // Apenas logs com status 'error'
    if (log.status !== 'error') return false;
    
    // Verificar se é relacionado a email/reset de senha
    const description = log.description?.toLowerCase() || '';
    const isEmailRelated = (
      description.includes('email') || 
      description.includes('envio') ||
      description.includes('usuário não encontrado') ||
      description.includes('user not found') ||
      description.includes('falha') ||
      description.includes('erro') ||
      description.includes('error') ||
      description.includes('invalid') ||
      description.includes('inválido') ||
      description.includes('expirado') ||
      description.includes('expired')
    );
    
    return isEmailRelated;
  });

  const statCards = [
    {
      title: 'Usuários Totais',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'WebServices',
      value: stats.totalWebServices,
      icon: Server,
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-700'
    },
    {
      title: 'Emails Enviados',
      value: stats.totalEmails,
      icon: Mail,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Serviços Ativos',
      value: stats.activeServices,
      icon: Activity,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">OxyPass</h1>
              <p className="text-gray-600">Painel Administrativo</p>
              {systemInfo && (
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span>Versão: {systemInfo.version || 'N/A'}</span>
                  <span>•</span>
                  <span>Uptime: {systemInfo.uptime || 'N/A'}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {card.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${card.bgColor}`}>
                    <Icon className={`w-6 h-6 ${card.textColor}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-sm text-gray-500">Dados atualizados</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Últimas Atividades */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
              <h3 className="text-lg font-semibold text-gray-900">Últimas Atividades</h3>
              <div className="flex items-center space-x-2">
                <DatePicker
                  value={dateFilter}
                  onChange={handleDateFilterChange}
                  placeholder="Filtrar por data"
                  className="w-full sm:w-40"
                />
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              {filteredAuditLogs.length > 0 ? (
                filteredAuditLogs.map((log, index) => (
                  <button
                    key={index}
                    onClick={() => handleAuditItemClick(log)}
                    className="w-full flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
                  >
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                        log.status === 'success' ? 'bg-green-500' : 
                        log.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                          {log.username}
                        </p>
                        <p className="text-xs text-gray-500 break-words line-clamp-2 group-hover:text-gray-700 transition-colors">
                          {log.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                      <span className={`text-xs font-medium ${
                        log.status === 'success' ? 'text-green-600' : 
                        log.status === 'error' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {new Date(log.created_at).toLocaleDateString('pt-BR')}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  {dateFilter ? `Nenhuma atividade encontrada para ${formatDateBR(dateFilter)}` : 'Nenhuma atividade recente'}
                </p>
              )}
            </div>

            {/* Paginação */}
            {auditTotalPages > 1 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-gray-200 gap-3">
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToAuditPage(auditPage - 1)}
                    disabled={auditPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    Página {auditPage} de {auditTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToAuditPage(auditPage + 1)}
                    disabled={auditPage === auditTotalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-xs text-gray-500 text-center">
                  Total: {filteredAuditLogs.length} registros
                </span>
              </div>
            )}
          </div>

          {/* WebServices Cadastrados */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">WebServices Cadastrados</h3>
            <div className="space-y-3 mb-4">
              {webServices.length > 0 ? (
                webServices.map((service, index) => (
                  <div key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                        service.isActive ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{service.serviceName}</p>
                        <p className="text-xs text-gray-500 break-all">{service.protocol}://{service.url}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium flex-shrink-0 ml-2 ${service.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {service.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Nenhum WebService cadastrado</p>
              )}
            </div>

            {/* Paginação */}
            {webServicesTotalPages > 1 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-gray-200 gap-3">
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToWebServicesPage(webServicesPage - 1)}
                    disabled={webServicesPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    Página {webServicesPage} de {webServicesTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToWebServicesPage(webServicesPage + 1)}
                    disabled={webServicesPage === webServicesTotalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-xs text-gray-500 text-center">
                  Total: {webServicesTotal} registros
                </span>
              </div>
            )}
          </div>

          {/* Erros de Envio de Email */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">Erros de Envio de Email</h3>
            </div>
            
            <div className="space-y-3">
              {emailErrorLogs.length > 0 ? (
                emailErrorLogs.slice(0, 5).map((log, index) => (
                  <div key={index} className="flex items-start justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-red-900 truncate">
                          {log.username || 'Usuário não identificado'}
                        </p>
                        <p className="text-xs text-red-700 break-words line-clamp-2">
                          {log.description}
                        </p>
                        {log.email && (
                          <p className="text-xs text-red-600 truncate mt-1">
                            {log.email}
                          </p>
                        )}
                        {log.phone && (
                          <p className="text-xs text-red-600 truncate">
                            {log.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0 ml-2">
                      <span className="text-xs font-medium text-red-600">
                        {new Date(log.created_at).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="text-xs text-red-500">
                        {new Date(log.created_at).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-500">Nenhum erro de envio de email</p>
                  <p className="text-xs text-gray-400 mt-1">Todos os emails estão sendo enviados com sucesso</p>
                </div>
              )}
            </div>

            {emailErrorLogs.length > 5 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Mostrando 5 de {emailErrorLogs.length} erros
                </p>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default AdminDashboard;