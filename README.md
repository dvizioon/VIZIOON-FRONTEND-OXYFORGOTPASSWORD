# VIZIOON-FRONTEND-OXYPASS

## Sobre o Projeto

O VIZIOON-FRONTEND-OXYPASS é uma aplicação web frontend desenvolvida em React 18 com TypeScript, construída com Vite e estilizada com Tailwind CSS. A aplicação serve como interface administrativa para o sistema OxyPass, fornecendo funcionalidades completas de gerenciamento de usuários, web services, templates de email, auditoria e dashboard em tempo real.

## Funcionalidades Principais

- Sistema de Autenticação - Login seguro com JWT e proteção de rotas
- Dashboard Interativo - Estatísticas em tempo real com filtros avançados
- Gerenciamento de Usuários - CRUD completo com paginação e busca
- Web Services - Configuração e monitoramento de serviços
- Templates de Email - Editor avançado com preview em tempo real
- Sistema de Auditoria - Logs detalhados com filtros e exportação
- Integração Moodle - Sincronização e gerenciamento de cursos
- Design Responsivo - Interface adaptável para todos os dispositivos

## Início Rápido

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Docker (opcional)

### Instalação Local

```bash
# Clone o repositório
git clone https://github.com/dvizioon/VIZIOON-FRONTEND-OXYPASS
cd frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Execute em modo de desenvolvimento
npm run dev
```

A aplicação estará disponível em http://localhost:4000

### Instalação com Docker

```bash
# Build e execução com docker-compose
docker-compose up -d

# Para desenvolvimento
docker-compose --profile dev up -d
```

## Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Executar ESLint
```

## Stack Tecnológica

- Frontend: React 18.3.1 + TypeScript 5.5.3
- Build Tool: Vite 5.4.2
- Styling: Tailwind CSS 3.4.1
- Roteamento: React Router DOM 7.8.2
- HTTP Client: Axios 1.11.0
- Notificações: React Toastify 11.0.5
- Ícones: Lucide React 0.344.0
- Editor: CodeMirror (para templates)

## Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Layout/         # Layouts da aplicação
│   ├── modals/         # Modais específicos
│   └── UI/             # Componentes de interface
├── contexts/           # Contextos React
├── hooks/              # Custom hooks
├── lib/                # Utilitários e configurações
├── pages/              # Páginas da aplicação
├── routes/             # Configuração de rotas
├── types/              # Definições TypeScript
└── main.tsx           # Ponto de entrada
```

## Configuração

### Variáveis de Ambiente

Crie um arquivo .env na raiz do projeto:

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_PORT=4000
NODE_ENV=development
```

### API Integration

A aplicação se conecta ao backend através de endpoints REST configurados em src/lib/api.ts com interceptors automáticos para autenticação JWT.

## Docker

O projeto inclui configuração completa do Docker:

- Dockerfile - Build otimizado para produção
- docker-compose.yml - Orquestração de serviços
- .dockerignore - Arquivos excluídos do build

### Comandos Docker

```bash
# Build da imagem
docker build -t oxypass-frontend .

# Executar com docker-compose
docker-compose up -d

# Parar serviços
docker-compose down

# Ver logs
docker-compose logs -f oxypass-frontend
```

## Responsividade

Interface totalmente responsiva com breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Segurança

- Autenticação JWT com renovação automática
- Proteção de rotas sensíveis
- Validação de formulários
- Sanitização de inputs
- Headers de segurança

## Performance

- Code splitting automático
- Lazy loading de rotas
- Otimização de assets
- Cache de recursos
- Métricas de performance otimizadas

## Qualidade de Código

- ESLint configurado
- TypeScript strict mode
- Convenções de nomenclatura
- Componentes reutilizáveis
- Hooks customizados

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (git checkout -b feature/AmazingFeature)
3. Commit suas mudanças (git commit -m 'Add some AmazingFeature')
4. Push para a branch (git push origin feature/AmazingFeature)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

Desenvolvido pelo VIZIOON
