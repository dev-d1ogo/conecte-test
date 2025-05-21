---
# 🩺 Conecte Saúde
**Conecte** é uma plataforma de agendamento médico entre pacientes e médicos, com autenticação, gerenciamento de horários em tempo real via WebSocket. Algumas funcionalidades estão mockadas, porém nenhuma que atrapalhe o fluxo principal de agendamento.

---

## Variáveis de Ambiente

### Backend (`conecte-api/.env`)

```env
# Banco de Dados
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=conecte_db

# Prisma
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}"

# JWT
JWT_SECRET=conecte
JWT_EXPIRES_IN=24h
```

> Se for rodar fora do Docker, altere `postgres` para `localhost` na `DATABASE_URL`.

### Frontend (`conecte-web/.env`)

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=conect
NEXTAUTH_DEBUG=true
```

---

## 🚀 Como executar

### ✅ 1. Com Docker Compose (recomendado)

```bash
docker-compose up -d
```

A aplicação será acessível em:

- Frontend: [http://localhost:3001](http://localhost:3001)
- Backend: [http://localhost:3000](http://localhost:3000)
- PostgreSQL: na porta 5435 do host

> ⚠️ O CORS da API está liberado **apenas para `http://localhost:3001`**, certifique-se de rodar o frontend nessa porta.

📌 **O seed será executado automaticamente** após a aplicação subir pela primeira vez, criando:

- 1 médico (`doutor@exemplo.com` / `123456`)
- 2 pacientes (`paciente1@exemplo.com`, `paciente2@exemplo.com` / `123456`)
- Horários disponíveis para o médico
- 2 agendamentos preenchidos

---

### 2. Rodando manualmente (sem Docker Compose completo)

#### 1. Subir apenas o banco de dados:

```bash
docker compose up postgres
```

#### 2. Rodar o backend:

- Ajuste `DATABASE_URL` para usar `localhost`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5435/conecte_db"
```

- Execute:

```bash
cd conecte-api
npm install
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```

#### 3. (Opcional) Executar seed manualmente:

```bash
cd conecte-api
npx ts-node prisma/seed.ts
```

#### 4. Rodar o frontend:

```bash
cd conecte-web
pnpm install
pnpm run dev -- --port 3001
```

---

## WebSocket: Agendamentos em tempo real

- A API emite eventos via WebSocket ao criar um novo agendamento (`scheduling:created`)
- O frontend escuta esses eventos e atualiza os dados automaticamente.

### Exemplo de uso:

```ts
socket.on("scheduling:created", (data) => {
	// Atualiza os agendamentos em tempo real
});
```

---

## Arquitetura do Projeto

### Frontend – **Presentation Controller Pattern**

A aplicação web em Next.js foi estruturada com base no padrão **Presentation Controller Pattern**, com separação clara entre:

- **View**: componentes visuais puros e reutilizáveis (`components/views`)
- **Controller**: responsáveis por orquestrar o estado e lógica de tela (`SlotsController`, `AppointmentsController`)
- **API Service**: camada de infraestrutura que lida com requisições HTTP (`api-service.ts`)

---

### Backend – **Clean Architecture + Hexagonal Architecture + DDD**

A API em NestJS foi desenvolvida seguindo os princípios da:

- **Clean Architecture**
- **Hexagonal Architecture (Ports & Adapters)**
- **DDD – Domain-Driven Design**

Com práticas como:

- DTOs + validações com `zod`
- Application Services para lógica orquestradora
- Repositórios baseados em interfaces
- Tratamento centralizado de erros personalizados

---

## 📂 Estrutura do Projeto

```
conecte/
├── conecte-api/       # Backend NestJS
├── conecte-web/       # Frontend Next.js
├── docker-compose.yml # Orquestração dos serviços
```

---

## 🐳 Resumo do Docker Compose

```yaml
services:
  postgres:
    image: postgres:15
    ports:
      - "5435:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./conecte-api
    ports:
      - "3000:3000"
    depends_on:
      - postgres

  frontend:
    build: ./conecte-web
    ports:
      - "3001:3001"
    environment:
      - PORT=3001
    depends_on:
      - backend

volumes:
  postgres_data:
```

---

## Requisitos

- Docker + Docker Compose
- Node.js >= 18 (caso rode localmente)
- NPM ou PNPM

---
