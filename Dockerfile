# Multi-stage build para React + Vite + TypeScript

# Stage 1: Build da aplicação
FROM node:20.19.5-alpine AS builder

# Definir diretório de trabalho
WORKDIR /frontend

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

# Instalar serve globalmente para servir arquivos estáticos
RUN npm install -g serve

# Definir diretório de trabalho
WORKDIR /frontend

# Copiar arquivos buildados do stage anterior
COPY --from=builder /frontend/dist ./dist

# Expor porta
EXPOSE 4000

# Comando para servir os arquivos estáticos do SPA
CMD ["serve", "-s", "dist", "-l", "4000", "--cors"]