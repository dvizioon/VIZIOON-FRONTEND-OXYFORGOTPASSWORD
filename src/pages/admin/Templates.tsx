import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Mail, ToggleLeft, ToggleRight, Star, Eye, List, ChevronLeft, ChevronRight } from 'lucide-react';
// import { AdminLayout } from '../../components/Layout/AdminLayout';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { SearchableSelect } from '../../components/UI/SearchableSelect';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';
import { useToastAlert } from '../../components/UI/ToastAlert';
import { TemplateModal } from '../../components/modals/TemplateModal';
import { VariablesModal } from '../../components/modals/VariablesModal';
import { ConfirmModal } from '../../components/modals/ConfirmModal';
import { TemplateViewModal } from '../../components/modals/TemplateViewModal';
import { useTemplates } from '../../hooks';
import { Template, CreateTemplateData, UpdateTemplateData } from '../../types';

interface Variable {
  category: string;
  key: string;
  description: string;
  example: string;
  usage: string;
}

const AdminTemplates: React.FC = () => {
  const { getTemplates, createTemplate, updateTemplate, deleteTemplate, toggleTemplateStatus, getTemplateVariables, setDefaultTemplate } = useTemplates();
  const { showError, showSuccess } = useToastAlert();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [variables, setVariables] = useState<Variable[]>([]);
  // const [loadingVariables, setLoadingVariables] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Modal states
  const [templateModal, setTemplateModal] = useState<{
    isOpen: boolean;
    template: Template | null;
  }>({ isOpen: false, template: null });
  
  const [variablesModal, setVariablesModal] = useState(false);
  
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    template: Template | null;
  }>({ isOpen: false, template: null });
  
  const [viewModal, setViewModal] = useState<{
    isOpen: boolean;
    template: Template | null;
  }>({ isOpen: false, template: null });

  useEffect(() => {
    loadTemplates();
    loadVariables();
  }, []);


  useEffect(() => {
    setCurrentPage(1); // Reset para primeira página quando filtros mudam
  }, [searchTerm]);

  const getDefaultVariables = (): Variable[] => [
    { category: 'user', key: 'user.fullname', description: 'Nome completo do usuário', example: 'João Silva', usage: '{{user.fullname}}' },
    { category: 'user', key: 'user.email', description: 'Email do usuário', example: 'joao@exemplo.com', usage: '{{user.email}}' },
    { category: 'user', key: 'user.username', description: 'Nome de usuário', example: 'joao.silva', usage: '{{user.username}}' },
    { category: 'reset', key: 'reset.link', description: 'Link de redefinição', example: 'https://exemplo.com/reset', usage: '{{reset.link}}' },
    { category: 'reset', key: 'reset.token', description: 'Token de reset', example: 'abc123def456', usage: '{{reset.token}}' },
    { category: 'reset', key: 'reset.expires_at', description: 'Tempo de expiração', example: '24 horas', usage: '{{reset.expires_at}}' },
    { category: 'system', key: 'system.site_name', description: 'Nome do site', example: 'OXYGENI - CEUMA', usage: '{{system.site_name}}' },
    { category: 'system', key: 'system.support_email', description: 'Email de suporte', example: 'suporte@ceuma.br', usage: '{{system.support_email}}' },
    { category: 'email', key: 'email.subject', description: 'Assunto do email', example: 'Redefinição de Senha', usage: '{{email.subject}}' },
    { category: 'message', key: 'message.title', description: 'Título da mensagem', example: 'Redefinição de Senha', usage: '{{message.title}}' },
    { category: 'message', key: 'message.content', description: 'Conteúdo da mensagem', example: 'Você solicitou...', usage: '{{message.content}}' },
    { category: 'date', key: 'date.current', description: 'Data atual', example: '25/01/2025', usage: '{{date.current}}' },
    { category: 'time', key: 'time.current', description: 'Hora atual', example: '14:30:00', usage: '{{time.current}}' }
  ];

  const enhanceVariablesWithDelimiters = (baseVariables: Variable[]): Variable[] => {
    const enhancedVariables: Variable[] = [];
    
    baseVariables.forEach(variable => {
      // Adicionar variável original
      enhancedVariables.push(variable);
      
      // Adicionar versão com delimitador para variáveis de texto
      const textVariables = ['user.fullname', 'user.email', 'system.site_name', 'message.content', 'message.title'];
      if (textVariables.includes(variable.key)) {
        enhancedVariables.push({
          ...variable,
          key: `${variable.key}(limit)`,
          description: `${variable.description} (com limite de caracteres)`,
          example: `${variable.example} → ${variable.example.substring(0, 10)}...`,
          usage: `{{${variable.key}(30)}}`
        });
      }
    });
    
    return enhancedVariables;
  };

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await getTemplates();
      if (response.success) {
        setTemplates(response.templates || []);
      }
    } catch (error: any) {
      showError(error.message || 'Erro ao carregar templates');
    } finally {
      setLoading(false);
    }
  };

  const loadVariables = async () => {
    try {
      const response = await getTemplateVariables();
      if (response.success && response.variables) {
        const enhancedVars = enhanceVariablesWithDelimiters(response.variables);
        setVariables(enhancedVars);
      }
    } catch (error) {
      // Em caso de erro, usar variáveis padrão
      const defaultVars = getDefaultVariables();
      const enhancedVars = enhanceVariablesWithDelimiters(defaultVars);
      setVariables(enhancedVars);
    }
  };


  const handleCreateTemplate = () => {
    setTemplateModal({ isOpen: true, template: null });
  };

  const handleEditTemplate = (template: Template) => {
    setTemplateModal({ isOpen: true, template });
  };

  const handleDeleteTemplate = (template: Template) => {
    setConfirmModal({ isOpen: true, template });
  };

  const handleViewTemplate = (template: Template) => {
    setViewModal({ isOpen: true, template });
  };

  const handleSaveTemplate = async (data: CreateTemplateData | UpdateTemplateData) => {
    try {
      if (templateModal.template) {
        // Editando template existente
        const response = await updateTemplate(templateModal.template.id, data as UpdateTemplateData);
        if (response.success) {
          showSuccess(response.message || 'Template atualizado com sucesso!');
          await loadTemplates();
        }
      } else {
        // Criando novo template
        const response = await createTemplate(data as CreateTemplateData);
        if (response.success) {
          showSuccess(response.message || 'Template criado com sucesso!');
          await loadTemplates();
        }
      }
    } catch (error: any) {
      throw error; // Deixa o modal tratar o erro
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmModal.template) return;

    try {
      const response = await deleteTemplate(confirmModal.template.id);
      if (response.success) {
        showSuccess(response.message || 'Template excluído com sucesso!');
        await loadTemplates();
        setConfirmModal({ isOpen: false, template: null });
      }
    } catch (error: any) {
      showError(error.message || 'Erro ao excluir template');
      setConfirmModal({ isOpen: false, template: null });
    }
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginação
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTemplates = filteredTemplates.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const toggleTemplate = async (id: string) => {
    try {
      const response = await toggleTemplateStatus(id);
      if (response.success) {
        // Atualizar com os dados retornados pela API
        setTemplates(prev => prev.map(template => 
          template.id === id ? response.template : template
        ));
        showSuccess(response.message || 'Status do template alterado com sucesso!');
      }
    } catch (error: any) {
      if (error.message === 'Failed to fetch') {
        showError('Erro de conexão com o servidor. Verifique sua internet e tente novamente.');
      } else {
        showError(error.message || 'Erro ao alterar status do template');
      }
    }
  };

  const setAsDefault = async (id: string) => {
    try {
      const response = await setDefaultTemplate(id);
      if (response.success) {
        // Recarregar todos os templates para garantir que apenas um seja padrão
        await loadTemplates();
        showSuccess('Template definido como padrão!');
      }
    } catch (error: any) {
      if (error.message === 'Failed to fetch') {
        showError('Erro de conexão com o servidor. Verifique sua internet e tente novamente.');
      } else {
        showError(error.message || 'Erro ao definir template padrão');
      }
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
    <div>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Templates de Email</h1>
            <p className="text-gray-600">Gerencie os templates de email do sistema</p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setVariablesModal(true)}
            >
              <List className="w-4 h-4 mr-2" />
              Variáveis
            </Button>
            <Button onClick={handleCreateTemplate}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Template
            </Button>
          </div>
        </div>


        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar templates..."
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
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredTemplates.length)} de {filteredTemplates.length} registros
                {searchTerm && (
                  <span className="ml-2 text-violet-600">
                    (filtrado de {templates.length} total)
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
                    Template
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assunto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-violet-500 mr-3" />
                        <div>
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">{template.name}</div>
                            {template.isDefault && (
                              <Star className="w-4 h-4 text-yellow-500 ml-2" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{template.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{template.subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        template.type === 'html' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {template.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleTemplate(template.id)}
                        className="flex items-center space-x-2"
                      >
                        {template.isActive ? (
                          <ToggleRight className="w-6 h-6 text-green-500" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-gray-400" />
                        )}
                        <span className={`text-sm ${
                          template.isActive ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {template.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {!template.isDefault && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setAsDefault(template.id)}
                            title="Definir como padrão"
                          >
                            <Star className="w-4 h-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewTemplate(template)}
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditTemplate(template)}
                          title="Editar template"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {!template.isDefault && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteTemplate(template)}
                            title="Excluir template"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {currentTemplates.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {filteredTemplates.length === 0 ? 'Nenhum template encontrado' : 'Nenhum resultado na página atual'}
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
                  Total: {filteredTemplates.length} registros
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Template Modal */}
        <TemplateModal
          isOpen={templateModal.isOpen}
          onClose={() => setTemplateModal({ isOpen: false, template: null })}
          onSave={handleSaveTemplate}
          template={templateModal.template}
        />

        {/* Variables Modal */}
        <VariablesModal
          isOpen={variablesModal}
          onClose={() => setVariablesModal(false)}
          variables={variables}
          onInsertVariable={() => {}} // Não precisa inserir aqui, só visualizar
        />

        {/* View Modal */}
        <TemplateViewModal
          isOpen={viewModal.isOpen}
          onClose={() => setViewModal({ isOpen: false, template: null })}
          template={viewModal.template}
        />

        {/* Confirm Delete Modal */}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ isOpen: false, template: null })}
          onConfirm={handleConfirmDelete}
          title="Excluir Template"
          message={`Tem certeza que deseja excluir o template "${confirmModal.template?.name}"? Esta ação não pode ser desfeita.`}
          confirmText="Excluir"
          type="danger"
        />
      </div>
    </div>
  );
};

export default AdminTemplates;