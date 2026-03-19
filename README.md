# ConectaPet

Aplicação web de adoção de animais com monorepo dividido em backend (NestJS + Prisma + PostgreSQL) e frontend (Next.js + Tailwind CSS).

## Stack

- Backend: NestJS, Prisma, Passport JWT, Bcrypt
- Frontend: Next.js (App Router), TypeScript, Tailwind CSS
- Banco de dados: PostgreSQL (Docker)

## Estrutura

- backend: API REST com autenticação e regras de autorização por roles
- frontend: interface web pública e dashboard protegido
- docker-compose.yml: sobe PostgreSQL local

## Pré-requisitos

- Docker Desktop
- Node.js 20+
- npm 10+

## 1. Configurar variáveis de ambiente

Na raiz do projeto:

1. Copie .env.example para .env
2. Ajuste os valores se necessário

No backend:

1. Copie backend/.env.example para backend/.env
2. Ajuste se necessário

No frontend:

1. Crie frontend/.env.local com o conteúdo:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 2. Subir o PostgreSQL com um único comando Docker

```bash
docker compose up -d
```

## 3. Instalar dependências

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd ../frontend
npm install
```

## 4. Gerar cliente Prisma e executar migrações

```bash
cd ../backend
npx prisma generate
npx prisma migrate dev --name init
```

## 4.1 Popular banco com dados mockados (seed)

Para inserir dados de demonstração e testar o fluxo completo da aplicação:

```bash
cd backend
npm run prisma:seed
```

O seed cria:

- 1 ONG
- 2 ADOTANTES
- pets com status disponivel e adotado
- solicitacoes de adocao com status PENDING, APPROVED e REJECTED

Usuarios de teste (somente ambiente local/dev):

- ONG: ong@conectapet.dev
- ADOTANTE: adotante1@conectapet.dev
- ADOTANTE: adotante2@conectapet.dev
- Senha para todos: 123456

## 5. Iniciar os servidores em desenvolvimento

Terminal 1 (backend):

```bash
cd backend
npm run start:dev
```

Terminal 2 (frontend):

```bash
cd frontend
npm run dev
```

## URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Endpoints principais

Autenticação:

- POST /auth/register
- POST /auth/login

Pets:

- GET /pets (público, pets não adotados)
- POST /pets (ONG)
- PATCH /pets/:id (ONG dona)
- GET /pets/my-pets (ONG)

Adoções:

- POST /adoptions (ADOTANTE)
- GET /adoptions/my-requests (ADOTANTE)
- GET /adoptions/ong-requests (ONG)
- PATCH /adoptions/:id/status (ONG dona do pet)

## Segurança implementada

- Hash de senha com Bcrypt (salt rounds 12)
- JWT com payload contendo userId e role
- Guard de autenticação JWT
- Guard de autorização por role (ONG e ADOTANTE)
- Validação de DTO com class-validator e ValidationPipe global (whitelist + forbidNonWhitelisted)
- Validação de ownership para edição de pet e atualização de status de adoção
