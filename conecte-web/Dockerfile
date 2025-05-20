# Etapa única usando imagem leve do Node.js
FROM node:20-alpine

# Instala pnpm
RUN npm install -g pnpm

# Cria diretório da aplicação
WORKDIR /app

# Copia apenas os arquivos de dependência primeiro (melhora cache)
COPY pnpm-lock.yaml ./
COPY package.json ./

# Instala dependências
RUN pnpm install --frozen-lockfile

# Copia o restante da aplicação
COPY . .

# Build da aplicação
RUN pnpm build

# Define variáveis de ambiente
ENV NODE_ENV=production

# Expõe a porta
EXPOSE 3000

# Inicia a aplicação
CMD ["pnpm", "start"]
