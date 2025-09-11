# Dockerfile simples - usa build local
FROM node:20.19.5-alpine

WORKDIR /frontend

# Verificar se dist existe e copiar (ignorar .dockerignore se necessário)
COPY ./dist ./dist

# Install serve globalmente
RUN npm install -g serve

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S frontend -u 1001 && \
    chown -R frontend:nodejs /frontend

USER frontend

EXPOSE 4000

# Servir arquivos na porta 4000
CMD ["serve", "-s", "dist", "-l", "4000", "--cors"]