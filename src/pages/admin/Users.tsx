import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
// import { AdminLayout } from '../../components/Layout/AdminLayout';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { SearchableSelect } from '../../components/UI/SearchableSelect';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';
import { useToastAlert } from '../../components/UI/ToastAlert';
// import { UserModal } from '../../components/modals/UserModal';
// import { ConfirmModal } from '../../components/modals/ConfirmModal';
import { ExportModal } from '../../components/modals/ExportModal';
import { UserViewModal } from '../../components/modals/UserViewModal';
import { useUsers } from '../../hooks';
import { useAuthContext } from '../../contexts/Auth/AuthContext';
import { User } from '../../types';

const AdminUsers: React.FC = () => {
  const { user: currentUser } = useAuthContext();
  const { getUsers, exportUsers } = useUsers();
  const { showError, showSuccess } = useToastAlert();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal states
  // const [userModal, setUserModal] = useState<{
  //   isOpen: boolean;
  //   user: User | null;
  // }>({ isOpen: false, user: null });

  // const [confirmModal, setConfirmModal] = useState<{
  //   isOpen: boolean;
  //   user: User | null;
  // }>({ isOpen: false, user: null });

  const [exportModal, setExportModal] = useState(false);

  const [viewModal, setViewModal] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({ isOpen: false, user: null });

  useEffect(() => {
    loadUsers();
  }, []);


  useEffect(() => {
    setCurrentPage(1); // Reset para primeira página quando filtros mudam
  }, [searchTerm]);
  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers(currentPage, itemsPerPage, searchTerm);
      setUsers(response.users || []);
    } catch (error: any) {
      showError(error.message || 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  // const handleCreateUser = () => {
  //   setUserModal({ isOpen: true, user: null });
  // };

  // const handleEditUser = (user: User) => {
  //   setUserModal({ isOpen: true, user });
  // };

  // const handleDeleteUser = (user: User) => {
  //   setConfirmModal({ isOpen: true, user });
  // };

  // const handleSaveUser = async (data: CreateUserData | UpdateUserData) => {
  //   try {
  //     if (userModal.user) {
  //       // Editando usuário existente
  //       await updateUser(userModal.user.id, data as UpdateUserData);
  //       setSuccess('Usuário atualizado com sucesso!');
  //       await loadUsers();
  //     } else {
  //       // Criando novo usuário
  //       await createUser(data as CreateUserData);
  //       setSuccess('Usuário criado com sucesso!');
  //       await loadUsers();
  //     }
  //   } catch (error: any) {
  //     throw error; // Deixa o modal tratar o erro
  //   }
  // };

  // const handleConfirmDelete = async () => {
  //   if (!confirmModal.user) return;

  //   try {
  //     await deleteUser(confirmModal.user.id);
  //     setSuccess('Usuário excluído com sucesso!');
  //     await loadUsers();
  //     setConfirmModal({ isOpen: false, user: null });
  //   } catch (error: any) {
  //     setError(error.message || 'Erro ao excluir usuário');
  //     setConfirmModal({ isOpen: false, user: null });
  //   }
  // };

  const handleViewUser = (user: User) => {
    setViewModal({ isOpen: true, user });
  };

  const handleExport = async (_data: any[], format: string) => {
    try {
      const blob = await exportUsers(format as 'csv' | 'xlsx');
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `usuarios.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showSuccess('Exportação realizada com sucesso!');
    } catch (error: any) {
      showError(error.message || 'Erro ao exportar usuários');
    }
  };

  const isCurrentUser = (user: User) => {
    return currentUser?.id === user.id;
  };
  const filteredUsers = users.filter(user =>
    (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginação
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
            <p className="text-gray-600">Visualize as informações dos usuários do sistema</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar usuários..."
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
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredUsers.length)} de {filteredUsers.length} registros
                {searchTerm && (
                  <span className="ml-2 text-violet-600">
                    (filtrado de {users.length} total)
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
                    Função
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Criado em
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Atualizado em
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          {isCurrentUser(user) && (
                            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              Você
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                        }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.updatedAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewUser(user)}
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {currentUsers.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {filteredUsers.length === 0 ? 'Nenhum usuário encontrado' : 'Nenhum resultado na página atual'}
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
                  Total: {filteredUsers.length} registros
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Modal - Desabilitado */}
        {/* <UserModal
          isOpen={userModal.isOpen}
          onClose={() => setUserModal({ isOpen: false, user: null })}
          onSave={handleSaveUser}
          user={userModal.user}
          currentUserId={currentUser?.id}
        /> */}

        {/* Export Modal */}
        <ExportModal
          isOpen={exportModal}
          onClose={() => setExportModal(false)}
          data={filteredUsers}
          title="Usuários"
          onExport={handleExport}
        />

        {/* View Modal */}
        <UserViewModal
          isOpen={viewModal.isOpen}
          onClose={() => setViewModal({ isOpen: false, user: null })}
          user={viewModal.user}
        />

        {/* Confirm Delete Modal - Desabilitado */}
        {/* <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ isOpen: false, user: null })}
          onConfirm={handleConfirmDelete}
          title="Excluir Usuário"
          message={`Tem certeza que deseja excluir o usuário "${confirmModal.user?.name}"? Esta ação não pode ser desfeita.`}
          confirmText="Excluir"
          type="danger"
        /> */}
      </div>
    </div>
  );
};

export default AdminUsers;