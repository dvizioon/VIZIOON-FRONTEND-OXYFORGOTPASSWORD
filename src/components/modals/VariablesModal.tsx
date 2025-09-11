import React, { useState } from 'react';
import { X, Search, Copy, Check } from 'lucide-react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';

interface Variable {
  category: string;
  key: string;
  description: string;
  example: string;
  usage: string;
}

interface VariablesModalProps {
  isOpen: boolean;
  onClose: () => void;
  variables: Variable[];
  onInsertVariable: (usage: string) => void;
}

export const VariablesModal: React.FC<VariablesModalProps> = ({
  isOpen,
  onClose,
  variables,
  onInsertVariable
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedVariable, setCopiedVariable] = useState<string | null>(null);

  const filteredVariables = variables.filter(variable =>
    variable.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    variable.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    variable.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedVariables = filteredVariables.reduce((acc, variable) => {
    if (!acc[variable.category]) {
      acc[variable.category] = [];
    }
    acc[variable.category].push(variable);
    return acc;
  }, {} as Record<string, Variable[]>);

  const copyVariable = async (usage: string) => {
    try {
      await navigator.clipboard.writeText(usage);
      setCopiedVariable(usage);
      setTimeout(() => setCopiedVariable(null), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  const handleInsert = (usage: string) => {
    onInsertVariable(usage);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header fixo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-violet-50">
          <div>
            <h2 className="text-xl font-semibold text-violet-900">Variáveis Disponíveis</h2>
            <p className="text-sm text-violet-600">Clique para copiar ou inserir no template</p>
          </div>
          <button
            onClick={onClose}
            className="text-violet-400 hover:text-violet-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo com scroll */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Pesquisar variáveis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="px-6 pb-6">
            {/* Card explicativo sobre delimitadores */}
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-violet-900 mb-3">Dica: Limitando Tamanho das Variáveis</h3>
                  <p className="text-violet-700 mb-4">
                    Você pode limitar o número de caracteres de qualquer variável adicionando um número entre parênteses:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-4 border border-violet-200">
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-sm font-mono text-violet-600 bg-violet-100 px-2 py-1 rounded">
                          {'{{user.email(10)}}'}
                        </code>
                        <span className="text-xs text-violet-500 font-medium">Exemplo</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Original:</span> joao.silva@exemplo.com<br/>
                        <span className="font-medium">Resultado:</span> joao.silva...
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-violet-200">
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-sm font-mono text-violet-600 bg-violet-100 px-2 py-1 rounded">
                          {'{{user.fullname(15)}}'}
                        </code>
                        <span className="text-xs text-violet-500 font-medium">Exemplo</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Original:</span> João Silva Santos<br/>
                        <span className="font-medium">Resultado:</span> João Silva Sant...
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-violet-100 rounded-lg">
                    <p className="text-sm text-violet-800">
                      <span className="font-semibold">Como usar:</span> Adicione <code className="bg-white px-1 rounded">(número)</code> após qualquer variável para limitar seu tamanho. Útil para layouts responsivos!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
            {Object.entries(groupedVariables).map(([category, vars]) => (
              <div key={category} className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 capitalize border-b border-gray-200 pb-2">
                  {category === 'user' ? 'Usuário' :
                   category === 'reset' ? 'Reset' :
                   category === 'system' ? 'Sistema' :
                   category === 'email' ? 'Email' :
                   category === 'message' ? 'Mensagem' :
                   category === 'date' ? 'Data/Hora' : category}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vars.map((variable) => (
                    <div key={variable.key} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-violet-300 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <code className="text-sm font-mono text-violet-600 bg-violet-100 px-2 py-1 rounded">
                          {variable.usage}
                        </code>
                        <div className="flex space-x-1 ml-2">
                          <button
                            onClick={() => copyVariable(variable.usage)}
                            className="p-1 text-gray-500 hover:text-violet-600 transition-colors"
                            title="Copiar variável"
                          >
                            {copiedVariable === variable.usage ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleInsert(variable.usage)}
                            className="p-1 text-gray-500 hover:text-violet-600 transition-colors"
                            title="Inserir no template"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-1 font-medium">{variable.description}</p>
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Exemplo:</span> {variable.example}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            </div>
          </div>

          {filteredVariables.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhuma variável encontrada</p>
            </div>
          )}
        </div>

        {/* Footer fixo */}
        <div className="flex-shrink-0 flex justify-end p-6 border-t border-gray-200 bg-gray-50">
          <Button onClick={onClose} variant="outline">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};