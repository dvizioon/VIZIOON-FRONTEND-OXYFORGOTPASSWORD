import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Globe, ToggleLeft, ToggleRight, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { AdminLayout } from '../../components/Layout/AdminLayout';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { SearchableSelect } from '../../components/UI/SearchableSelect';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';
import { useToastAlert } from '../../components/UI/ToastAlert';
import { WebServiceModal } from '../../components/modals/WebServiceModal';
import { ConfirmModal } from '../../components/modals/ConfirmModal';
import { WebServiceViewModal } from '../../components/modals/WebServiceViewModal';
import { useWebServices } from '../../hooks';
import { useI18n } from '../../hooks/useI18n';
import { WebService, CreateWebServiceData, UpdateWebServiceData } from '../../types';


const AdminWebServices: React.FC = () => {
  const { getWebServices, createWebService, updateWebService, deleteWebService, toggleWebServiceStatus } = useWebServices();
  const { showError, showSuccess } = useToastAlert();
  const { t } = useI18n();
  const [webServices, setWebServices] = useState<WebService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Modal states
  // const [exportModal, setExportModal] = useState(false);
  const [viewModal, setViewModal] = useState<{
    isOpen: boolean;
    webService: WebService | null;
  }>({ isOpen: false, webService: null });
  
  const [webServiceModal, setWebServiceModal] = useState<{
    isOpen: boolean;
    webService: WebService | null;
  }>({ isOpen: false, webService: null });
  
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    webService: WebService | null;
  }>({ isOpen: false, webService: null });

  useEffect(() => {
    loadWebServices();
  }, []);


  useEffect(() => {
    setCurrentPage(1); // Reset para primeira página quando filtros mudam
  }, [searchTerm]);

  useEffect(() => {
    loadWebServices();
  }, [currentPage, itemsPerPage]);
  const loadWebServices = async () => {
    try {
      setLoading(true);
      const response = await getWebServices(currentPage, itemsPerPage, searchTerm);
      console.log('WebServices response:', response);
      setWebServices(response.webServices || []);
    } catch (error: any) {
      console.error('Erro ao carregar WebServices:', error);
      showError(error.message || 'Erro ao carregar WebServices');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWebService = () => {
    setWebServiceModal({ isOpen: true, webService: null });
  };

  const handleEditWebService = (webService: WebService) => {
    setWebServiceModal({ isOpen: true, webService });
  };

  const handleDeleteWebService = (webService: WebService) => {
    setConfirmModal({ isOpen: true, webService });
  };

  const handleSaveWebService = async (data: CreateWebServiceData | UpdateWebServiceData) => {
    try {
      if (webServiceModal.webService) {
        // Editando WebService existente
        await updateWebService(webServiceModal.webService.id, data as UpdateWebServiceData);
        showSuccess('WebService atualizado com sucesso!');
        await loadWebServices();
      } else {
        // Criando novo WebService
        await createWebService(data as CreateWebServiceData);
        showSuccess('WebService criado com sucesso!');
        await loadWebServices();
      }
    } catch (error: any) {
      throw error; // Deixa o modal tratar o erro
    }
  };

  const handleViewWebService = (webService: WebService) => {
    setViewModal({ isOpen: true, webService });
  };

  const handleConfirmDelete = async () => {
    if (!confirmModal.webService) return;

    try {
      await deleteWebService(confirmModal.webService.id);
      showSuccess('WebService excluído com sucesso!');
      await loadWebServices();
      setConfirmModal({ isOpen: false, webService: null });
    } catch (error: any) {
      showError(error.message || 'Erro ao excluir WebService');
      setConfirmModal({ isOpen: false, webService: null });
    }
  };
  const filteredWebServices = webServices.filter(service =>
    service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginação
  const totalPages = Math.ceil(filteredWebServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWebServices = filteredWebServices.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const toggleService = async (id: string) => {
    try {
      await toggleWebServiceStatus(id);
      setWebServices(prev => prev.map(service => 
        service.id === id ? { ...service, isActive: !service.isActive } : service
      ));
    } catch (error: any) {
      showError(error.message || 'Erro ao alterar status do WebService');
    }
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
    <AdminLayout title="WebServices">
      <div className="w-full h-full">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('webServices')}</h1>
                <p className="text-gray-600">Gerencie os WebServices do Moodle</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button onClick={handleCreateWebService}>
                <Plus className="w-4 h-4 mr-2" />
                Novo WebService
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar WebServices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
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
                  options={[
                    { value: '5', label: '5 por página' },
                    { value: '10', label: '10 por página' },
                    { value: '25', label: '25 por página' },
                    { value: '50', label: '50 por página' }
                  ]}
                />
              </div>
            </div>
            
            {/* Informações da paginação */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredWebServices.length)} de {filteredWebServices.length} registros
                {searchTerm && (
                  <span className="ml-2 text-violet-600">
                    (filtrado de {webServices.length} total)
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
                    Serviço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Atualizado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentWebServices.map((service) => (
                  <tr 
                    key={service.id} 
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Globe className="w-5 h-5 text-violet-500 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{service.serviceName}</div>
                          <div className="text-sm text-gray-500">{service.route}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{service.protocol}://{service.url}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleService(service.id)}
                        className="flex items-center space-x-2"
                      >
                        {service.isActive ? (
                          <ToggleRight className="w-6 h-6 text-green-500" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-gray-400" />
                        )}
                        <span className={`text-sm ${
                          service.isActive ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {service.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(service.updatedAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewWebService(service)}
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditWebService(service)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteWebService(service)}
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

          {currentWebServices.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {filteredWebServices.length === 0 ? 'Nenhum WebService encontrado' : 'Nenhum resultado na página atual'}
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
                  Total: {filteredWebServices.length} registros
                </div>
              </div>
            </div>
          )}
        </div>

        {/* WebService Modal */}
        <WebServiceModal
          isOpen={webServiceModal.isOpen}
          onClose={() => setWebServiceModal({ isOpen: false, webService: null })}
          onSave={handleSaveWebService}
          webService={webServiceModal.webService}
        />

        {/* View Modal */}
        <WebServiceViewModal
          isOpen={viewModal.isOpen}
          onClose={() => setViewModal({ isOpen: false, webService: null })}
          webService={viewModal.webService}
        />

        {/* Confirm Delete Modal */}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ isOpen: false, webService: null })}
          onConfirm={handleConfirmDelete}
          title="Excluir WebService"
          message={`Tem certeza que deseja excluir o WebService "${confirmModal.webService?.serviceName}"? Esta ação não pode ser desfeita.`}
          confirmText="Excluir"
          type="danger"
        />
      </div>
    </AdminLayout>
  );
};

export default AdminWebServices;