# Multi-stage build para otimizar o tamanho da imagem final

# Stage 1: Build da aplicação
FROM node:20.19.5-alpine AS builder

# Definir diretório de trabalho
WORKDIR /frontend

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar todas as dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage 2: Imagem de produção
FROM node:20.19.5-alpine AS production

# Definir diretório de trabalho
WORKDIR /frontend

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar apenas dependências de produção + serve para servir arquivos estáticos
RUN npm ci --only=production && npm install -g serve

# Copiar arquivos buildados do stage anterior
COPY --from=builder /frontend/dist ./dist

# Expor porta
EXPOSE 4000

# Comando para servir os arquivos estáticos
CMD ["serve", "-s", "dist", "-l", "4000"]