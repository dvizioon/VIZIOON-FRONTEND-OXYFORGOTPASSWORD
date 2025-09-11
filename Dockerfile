# Multi-stage build para otimizar o tamanho da imagem final

# Stage 1: Build da aplicação
FROM node:18-alpine AS builder

# Definir diretório de trabalho
WORKDIR /frontend

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar todas as dependências (incluindo dev dependencies para o build)
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage 2: Imagem de produção
FROM node:18-alpine AS production

# Definir diretório de trabalho
WORKDIR /frontend

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Copiar arquivos buildados do stage anterior
COPY --from=builder /frontend/dist ./dist

# Expor porta
EXPOSE 4000

# Comando para iniciar a aplicação
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4000"]
