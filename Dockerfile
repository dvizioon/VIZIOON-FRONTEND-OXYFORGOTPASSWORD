# Multi-stage build para React + Vite + TypeScript

# Stage 1: Build da aplicação
FROM node:20.19.5-alpine AS builder

# Definir diretório de trabalho
WORKDIR /frontend

# Configurar registry alternativo (devido ao ataque recente ao NPM)
RUN npm config set registry https://registry.npmmirror.com

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar TODAS as dependências (incluindo devDependencies)
RUN npm install

# Copiar código fonte
COPY . .

# Build da aplicação usando npx
RUN npx vite build

# Stage 2: Imagem de produção
FROM node:20.19.5-alpine AS production

# Configurar registry alternativo com configurações válidas
RUN npm config set registry https://registry.npmmirror.com && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-factor 2 && \
    npm config set fetch-retry-mintimeout 10000 && \
    npm config set fetch-retry-maxtimeout 60000

# Tentar instalar serve com fallback para diferentes registries
RUN npm install -g serve || \
    (npm config set registry https://registry.yarnpkg.com && npm install -g serve) || \
    (npm config set registry https://registry.npmjs.org && npm install -g serve)

# Definir diretório de trabalho
WORKDIR /frontend

# Copiar arquivos buildados do stage anterior
COPY --from=builder /frontend/dist ./dist

# Expor porta
EXPOSE 4000

# Comando para servir os arquivos estáticos do SPA
CMD ["serve", "-s", "dist", "-l", "4000", "--cors"]