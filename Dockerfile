# Multi-stage build simples
FROM node:20.19.5-alpine AS builder

WORKDIR /frontend

# Copiar package files
COPY package*.json ./

# Install dependencies normalmente
RUN npm install

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage 2: Nginx para porta 4000 (compatível com docker-compose)
FROM nginx:alpine AS production

# Copiar arquivos buildados
COPY --from=builder /frontend/dist /usr/share/nginx/html

# Configurar nginx para porta 4000
RUN echo 'server { \
    listen 4000; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
    \
    add_header Access-Control-Allow-Origin "*" always; \
}' > /etc/nginx/conf.d/default.conf

# Remover configuração padrão do nginx
RUN rm /etc/nginx/conf.d/default.conf.default 2>/dev/null || true

EXPOSE 4000

CMD ["nginx", "-g", "daemon off;"]