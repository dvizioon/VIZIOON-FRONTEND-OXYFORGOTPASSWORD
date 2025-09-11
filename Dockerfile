# Dockerfile assumindo que você já fez npm run build local
FROM node:20.19.5-alpine

WORKDIR /frontend

# Copiar apenas o que é necessário
COPY dist ./dist
COPY package.json ./

# Install apenas serve
RUN npm install -g serve

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S frontend -u 1001 && \
    chown -R frontend:nodejs /frontend

USER frontend

EXPOSE 4000

# Serve os arquivos buildados
CMD ["serve", "-s", "dist", "-l", "4000", "--cors"]