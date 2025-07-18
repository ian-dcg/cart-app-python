FROM node:18-alpine

# Configurar diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json (se existir)
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o código do projeto
COPY . .

# Expor a porta 3000
EXPOSE 3000

# Comando para rodar em modo de desenvolvimento
CMD ["npm", "run", "dev"]
