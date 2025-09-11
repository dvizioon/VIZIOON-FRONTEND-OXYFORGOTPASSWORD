# Multi-stage build para otimizar o tamanho da imagem final

# Stage 1: Build da aplicação
FROM node:20.19.5 AS builder

# Definir diretório de trabalho
WORKDIR /frontend

# Copiar arquivos de dependências
COPY package*.json ./

# Limpar cache e instalar todas as dependências (incluindo dev dependencies)
RUN npm cache clean --force && npm ci

# Copiar código fonte
COPY . .

# Build da aplicação usando npx diretamente
RUN npx vite build

# Stage 2: Imagem de produção
FROM node:20.19.5-alpine AS production

# Instalar serve globalmente
RUN npm install -g serve

# Definir diretório de trabalho
WORKDIR /frontend

# Copiar arquivos buildados do stage anterior
COPY --from=builder /frontend/dist ./dist

# Expor porta
EXPOSE 4000

# Comando para servir os arquivos estáticos
CMD ["serve", "-s", "dist", "-l", "4000"]
