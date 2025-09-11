import React, { useState, useEffect } from 'react';
import { Search, Eye, ChevronLeft, ChevronRight, FileSpreadsheet, Trash2, User } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
// import { AdminLayout } from '../../components/Layout/AdminLayout';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { SearchableSelect } from '../../components/UI/SearchableSelect';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';
import { useToastAlert } from '../../components/UI/ToastAlert';
import { ExportModal } from '../../components/modals/ExportModal';
import { AuditingViewModal } from '../../components/modals/AuditingViewModal';
import { ConfirmModal } from '../../components/modals/ConfirmModal';
import { useAuditing, useMoodle } from '../../hooks';
import { AuditLog } from '../../types';
import { truncateText } from '../../lib/utils';

const AdminAuditing: React.FC = () => {
  const { getAuditLogs, exportAuditLogs, deleteAuditLog } = useAuditing();
  const { findMoodleUser } = useMoodle();
  const { showError, showSuccess } = useToastAlert();
  const [searchParams, setSearchParams] = useSearchParams();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [exportModal, setExportModal] = useState(false);
  const [viewModal, setViewModal] = useState<{
    isOpen: boolean;
    auditLog: AuditLog | null;
  }>({ isOpen: false, auditLog: null });
  
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    auditLog: AuditLog | null;
  }>({ isOpen: false, auditLog: null });
  
  const [moodleUserModal, setMoodleUserModal] = useState<{
    isOpen: boolean;
    user: any | null;
    webService: any | null;
  }>({ isOpen: false, user: null, webService: null });

  // Ler parâmetros da URL ao carregar a página
  useEffect(() => {
    const search = searchParams.get('search');
    const searchType = searchParams.get('searchType');
    const date = searchParams.get('date');
    
    if (search) {
      setSearchTerm(search);
    }
    
    // Limpar parâmetros da URL após aplicar
    if (search || date) {
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    loadAuditoria();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset para primeira página quando filtros mudam
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    loadAuditoria();
  }, [currentPage, itemsPerPage]);
  const loadAuditoria = async () => {
    try {
      setLoading(true);
      const response = await getAuditLogs(currentPage, itemsPerPage, searchTerm, statusFilter as 'success' | 'error' | 'pending' | undefined);
      console.log('Auditing response:', response);
      setAuditLogs(response.auditing || []);
      setTotalItems(response.pagination?.total || 0);
    } catch (error: any) {
      showError(error.message || 'Erro ao carregar logs de auditoria');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (log.id || '').toString().includes(searchTerm) ||
                         (log.username || '').toLowerCase().includes(searchLower) ||
                         (log.email || '').toLowerCase().includes(searchLower) ||
                         (log.phone || '').includes(searchTerm) ||
                         (log.description || '').toLowerCase().includes(searchLower);
    const matchesStatus = !statusFilter || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Paginação
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleExport = async (_fields: string[], format: 'xlsx' | 'csv') => {
    try {
      const blob = await exportAuditLogs(format as 'csv' | 'xlsx');
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `auditoria.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Erro ao exportar auditoria:', error);
      throw error;
    }
  };

  // Função removida - usando hook exportAuditLogs

  const handleViewAuditLog = (auditLog: AuditLog) => {
    setViewModal({ isOpen: true, auditLog });
  };

  const handleDeleteAuditLog = (auditLog: AuditLog) => {
    setDeleteModal({ isOpen: true, auditLog });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.auditLog) return;

    try {
      await deleteAuditLog(deleteModal.auditLog.id);
      showSuccess('Log de auditoria excluído com sucesso!');
      await loadAuditoria();
      setDeleteModal({ isOpen: false, auditLog: null });
    } catch (error: any) {
      showError(error.message || 'Erro ao excluir log de auditoria');
      setDeleteModal({ isOpen: false, auditLog: null });
    }
  };

  const handleFindMoodleUser = async (auditLog: AuditLog) => {
    try {
      // Extrair URL do webServiceId ou usar uma URL padrão
      const moodleUrl = 'ead.ceuma.br'; // Você pode ajustar isso conforme necessário
      
      const response = await findMoodleUser({
        moodleUrl,
        email: auditLog.email
      });
      
      if (response.success) {
        setMoodleUserModal({
          isOpen: true,
          user: response.user,
          webService: response.webService
        });
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setMoodleUserModal({
          isOpen: true,
          user: null,
          webService: null
        });
      } else {
        showError('Erro ao buscar usuário no Moodle');
      }
    }
  };

  // Função removida - usando hook exportAuditLogs

  const itemsPerPageOptions = [
    { value: '5', label: '5 por página' },
    { value: '10', label: '10 por página' },
    { value: '25', label: '25 por página' },
    { value: '50', label: '50 por página' },
    { value: '100', label: '100 por página' }
  ];
  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'success', label: 'Sucesso' },
    { value: 'error', label: 'Erro' },
    { value: 'pending', label: 'Pendente' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Sucesso';
      case 'error':
        return 'Erro';
      case 'pending':
        return 'Pendente';
      default:
        return status;
    }
  };

  // Função para determinar o status correto baseado na descrição
  const getCorrectedStatus = (auditLog: AuditLog) => {
    // Se a descrição indica que o usuário não foi encontrado, forçar status como 'error'
    if (auditLog.description && 
        (auditLog.description.toLowerCase().includes('usuário não encontrado') ||
         auditLog.description.toLowerCase().includes('user not found') ||
         auditLog.description.toLowerCase().includes('não encontrado'))) {
      return 'error';
    }
    return auditLog.status;
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Auditoria</h1>
            <p className="text-gray-600">Logs de atividades do sistema</p>
          </div>
          <Button 
            variant="outline"
            onClick={() => setExportModal(true)}
            disabled={filteredLogs.length === 0}
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>


        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="sm:w-48">
                <SearchableSelect
                  placeholder="Filtrar por status"
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value)}
                  options={statusOptions}
                />
              </div>
              <div className="sm:w-48">
                <SearchableSelect
                  placeholder="Itens por página"
                  value={itemsPerPage.toString()}
                  onChange={(value) => {
                    setItemsPerPage(parseInt(value));
                    setCurrentPage(1);
                  }}
                  options={itemsPerPageOptions}
                />
              </div>
            </div>
            
            {/* Informações da paginação */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredLogs.length)} de {filteredLogs.length} registros
                {(searchTerm || statusFilter) && (
                  <span className="ml-2 text-violet-600">
                    (filtrado de {auditLogs.length} total)
                  </span>
                )}
              </div>
              <div>
                Página {currentPage} de {totalPages}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Token Usado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email Enviado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentLogs.map((log) => (
                  <tr 
                    key={log.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewAuditLog(log)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{log.username}</div>
                        <div className="text-sm text-gray-500">{log.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div 
                        className="text-sm text-gray-900 max-w-xs cursor-help" 
                        title={log.description}
                      >
                        {truncateText(log.description, 20)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(getCorrectedStatus(log))}`}>
                        {getStatusText(getCorrectedStatus(log))}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        log.useToken ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {log.useToken ? 'Usado' : 'Aguardando'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        log.emailSent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {log.emailSent ? 'Sim' : 'Não'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.created_at).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewAuditLog(log);
                          }}
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFindMoodleUser(log);
                          }}
                          title="Buscar usuário no Moodle"
                        >
                          <User className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAuditLog(log);
                          }}
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {currentLogs.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {filteredLogs.length === 0 ? 'Nenhum log encontrado' : 'Nenhum resultado na página atual'}
              </p>
            </div>
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Anterior
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {/* Primeira página */}
                    {currentPage > 3 && (
                      <>
                        <Button
                          variant={1 === currentPage ? "primary" : "ghost"}
                          size="sm"
                          onClick={() => goToPage(1)}
                        >
                          1
                        </Button>
                        {currentPage > 4 && <span className="px-2 text-gray-500">...</span>}
                      </>
                    )}
                    
                    {/* Páginas ao redor da atual */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(currentPage - 2 + i, totalPages));
                      if (pageNum < 1 || pageNum > totalPages) return null;
                      if (currentPage <= 3) {
                        const page = i + 1;
                        if (page > totalPages) return null;
                        return (
                          <Button
                            key={page}
                            variant={page === currentPage ? "primary" : "ghost"}
                            size="sm"
                            onClick={() => goToPage(page)}
                          >
                            {page}
                          </Button>
                        );
                      }
                      if (currentPage >= totalPages - 2) {
                        const page = totalPages - 4 + i;
                        if (page < 1 || page > totalPages) return null;
                        return (
                          <Button
                            key={page}
                            variant={page === currentPage ? "primary" : "ghost"}
                            size="sm"
                            onClick={() => goToPage(page)}
                          >
                            {page}
                          </Button>
                        );
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === currentPage ? "primary" : "ghost"}
                          size="sm"
                          onClick={() => goToPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    
                    {/* Última página */}
                    {currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && <span className="px-2 text-gray-500">...</span>}
                        <Button
                          variant={totalPages === currentPage ? "primary" : "ghost"}
                          size="sm"
                          onClick={() => goToPage(totalPages)}
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Próxima
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                
                <div className="text-sm text-gray-600">
                  Total: {filteredLogs.length} registros
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Export Modal */}
        <ExportModal
          isOpen={exportModal}
          onClose={() => setExportModal(false)}
          data={filteredLogs}
          title="Auditoria"
          onExport={handleExport}
        />

        {/* View Modal */}
        <AuditingViewModal
          isOpen={viewModal.isOpen}
          onClose={() => setViewModal({ isOpen: false, auditLog: null })}
          auditLog={viewModal.auditLog}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, auditLog: null })}
          onConfirm={handleConfirmDelete}
          title="Excluir Log de Auditoria"
          message={`Tem certeza que deseja excluir o log de auditoria ID "${deleteModal.auditLog?.id}"? Esta ação não pode ser desfeita.`}
          confirmText="Excluir"
          type="danger"
        />

        {/* Moodle User Modal */}
        {moodleUserModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Usuário no Moodle
              </h3>
              
              {moodleUserModal.user ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-3">Usuário Encontrado</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div><span className="font-medium">ID:</span> {moodleUserModal.user.id || 'N/A'}</div>
                      <div><span className="font-medium">Username:</span> {moodleUserModal.user.username || 'N/A'}</div>
                      <div className="md:col-span-2"><span className="font-medium">Nome Completo:</span> {moodleUserModal.user.fullname || 'N/A'}</div>
                      <div><span className="font-medium">Primeiro Nome:</span> {moodleUserModal.user.firstname || 'N/A'}</div>
                      <div><span className="font-medium">Sobrenome:</span> {moodleUserModal.user.lastname || 'N/A'}</div>
                      <div className="md:col-span-2"><span className="font-medium">Email:</span> {moodleUserModal.user.email || 'N/A'}</div>
                      <div><span className="font-medium">ID Number:</span> {moodleUserModal.user.idnumber || 'N/A'}</div>
                      <div><span className="font-medium">Status:</span> 
                        <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
                          moodleUserModal.user.suspended === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {moodleUserModal.user.suspended === 0 ? 'Ativo' : 'Suspenso'}
                        </span>
                      </div>
                      <div><span className="font-medium">Confirmado:</span> 
                        <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
                          moodleUserModal.user.confirmed === 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {moodleUserModal.user.confirmed === 1 ? 'Sim' : 'Não'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Informações Adicionais */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-3">Informações Adicionais</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div><span className="font-medium">Endereço:</span> {moodleUserModal.user.address || 'N/A'}</div>
                      <div><span className="font-medium">Telefone 1:</span> {moodleUserModal.user.phone1 || 'N/A'}</div>
                      <div><span className="font-medium">Telefone 2:</span> {moodleUserModal.user.phone2 || 'N/A'}</div>
                      <div><span className="font-medium">Departamento:</span> {moodleUserModal.user.department || 'N/A'}</div>
                      <div><span className="font-medium">Instituição:</span> {moodleUserModal.user.institution || 'N/A'}</div>
                      <div><span className="font-medium">Cidade:</span> {moodleUserModal.user.city || 'N/A'}</div>
                      <div className="md:col-span-2"><span className="font-medium">País:</span> {moodleUserModal.user.country || 'N/A'}</div>
                    </div>
                  </div>
                  
                  {moodleUserModal.webService && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-medium text-purple-800 mb-2">WebService</h4>
                      <div className="text-sm">
                        <div><span className="font-medium">Nome:</span> {moodleUserModal.webService.serviceName}</div>
                        <div><span className="font-medium">URL:</span> {moodleUserModal.webService.url}</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 mb-2">Usuário Não Encontrado</h4>
                  <p className="text-sm text-red-600">
                    Este usuário não foi encontrado no sistema Moodle ou é desconhecido.
                  </p>
                </div>
              )}
              
              <div className="flex justify-end mt-6">
                <Button
                  variant="primary"
                  onClick={() => setMoodleUserModal({ isOpen: false, user: null, webService: null })}
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAuditing;