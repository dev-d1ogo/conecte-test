# Etapa 1: Build da aplicação com pnpm
FROM node:20 AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-lock.yaml ./
COPY package.json ./

RUN pnpm install

COPY . .

RUN pnpm build

# Imagem leve para produção
FROM node:20-alpine

RUN npm install -g pnpm
WORKDIR /app

COPY --from=builder /app ./

ENV NODE_ENV=production

EXPOSE 3000

CMD ["pnpm", "start"]
