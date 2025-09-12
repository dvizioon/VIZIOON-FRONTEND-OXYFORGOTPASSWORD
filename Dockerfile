# Multi-stage build para otimizar o tamanho da imagem final

# Stage 1: Build da aplicação
# Usar Node.js Alpine para menor tamanho
FROM node:18-alpine AS builder

# Definir diretório de trabalho
WORKDIR /frontend

# Copiar arquivos de dependências
COPY package*.json ./

# Limpar cache e instalar todas as dependências (incluindo dev dependencies)
# Usar npm install se package-lock.json não existir, senão usar npm ci
RUN npm cache clean --force && if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copiar código fonte
COPY . .

# Build da aplicação e do servidor
RUN npm run build:all

# Stage 2: Imagem de produção
FROM node:20.19.5-alpine AS production

# Definir diretório de trabalho
WORKDIR /frontend

# Copiar package.json e package-lock.json para instalar apenas dependências de produção
COPY package*.json ./

# Instalar apenas dependências de produção
# Usar npm install se package-lock.json não existir, senão usar npm ci
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi && npm cache clean --force

# Copiar arquivos buildados do stage anterior (frontend + servidor)
COPY --from=builder /frontend/dist ./dist

# Expor porta
EXPOSE 3000

# Comando para executar nosso servidor Express
CMD ["node", "dist/server.js"]
