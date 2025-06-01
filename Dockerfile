FROM node:16-alpine

WORKDIR /app

# Copiar arquivos de configuração
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependências
RUN npm install

# Copiar o código fonte
COPY src/ ./src/

# Criar diretório de uploads
RUN mkdir -p uploads

# Compilar TypeScript
RUN npm run build

# Variáveis de ambiente
ENV PORT=3000
ENV NODE_ENV=production
ENV DB_HOST=db
ENV DB_PORT=3306
ENV DB_USERNAME=username-mevo
ENV DB_PASSWORD=pass123
ENV DB_DATABASE=financial_operations

# Expor porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
