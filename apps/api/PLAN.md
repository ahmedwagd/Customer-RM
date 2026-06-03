# API Implementation Plan

## Current State

- **Prisma schema** — all models defined: User, Company, Contact, Deal, Task, Note, Activity, Tag, TagOnContact, TagOnDeal, TagOnCompany
- **PrismaModule/PrismaService** — fully wired, global, using `@prisma/adapter-pg`
- **AppModule** — imports PrismaModule; has a basic health-check controller
- **main.ts** — Swagger `/api/docs` configured, listens on `PORT` (default 3000)
- **`modules/`** — empty
- **`common/`** — empty
- **Auth** — not implemented

---

## Phase 1: Shared Infrastructure (`src/common/`)

### 1.1 ConfigModule
- `src/config/config.module.ts` / `config.service.ts`
- Load env vars with validation
- Expose `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `PORT`

### 1.2 Prisma error filter
- `src/common/filters/prisma-client-exception.filter.ts`
- Catch Prisma known errors and map to proper HTTP status codes

### 1.3 Global validation pipe
- `ValidationPipe` with `whitelist: true`, `transform: true` in `main.ts`

### 1.4 Base pagination DTO
- `src/common/dto/pagination.dto.ts`

---

## Phase 2: Auth Module (`src/auth/`)

### 2.1 Dependencies
- `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `argon2`

### 2.2 Endpoints
- `POST /auth/register` — create user + return tokens
- `POST /auth/login` — validate credentials + return tokens
- `POST /auth/refresh` — verify refresh token + issue new pair
- `POST /auth/logout` — invalidate refresh token

### 2.3 JWT strategy + guard
- `src/common/strategies/jwt.strategy.ts`
- `src/common/guards/jwt-auth.guard.ts`
- `src/common/decorators/current-user.decorator.ts`

---

## Phase 3: Domain Modules — CRUD Scaffold

Each module follows:

```
src/modules/<name>/
├── dto/
│   ├── create-<name>.dto.ts
│   ├── update-<name>.dto.ts
│   └── query-<name>.dto.ts
├── <name>.controller.ts
├── <name>.service.ts
└── <name>.module.ts
```

### 3.1 Contacts Module
- `GET /contacts` — list (paginated, filterable by status, company, tags, search)
- `GET /contacts/:id` — get with relations
- `POST /contacts` — create
- `PATCH /contacts/:id` — update
- `DELETE /contacts/:id` — delete

### 3.2 Companies Module
- `GET /companies` — list (paginated, searchable)
- `GET /companies/:id` — get with contacts, deals, tags
- `POST /companies` — create
- `PATCH /companies/:id` — update
- `DELETE /companies/:id` — delete

### 3.3 Deals Module
- `GET /deals` — list (paginated, filterable by stage, user, contact, company)
- `GET /deals/:id` — get with relations
- `POST /deals` — create
- `PATCH /deals/:id` — update (stage transitions)
- `DELETE /deals/:id` — delete

### 3.4 Tasks Module
- `GET /tasks` — list (paginated, filterable by completed, due date, assignee)
- `GET /tasks/:id` — get
- `POST /tasks` — create
- `PATCH /tasks/:id` — update (toggle completed)
- `DELETE /tasks/:id` — delete

### 3.5 Notes Module
- `GET /notes` — list (filterable by contactId, dealId)
- `POST /notes` — create
- `PATCH /notes/:id` — update
- `DELETE /notes/:id` — delete

### 3.6 Activities Module
- `GET /activities` — list (filterable by type, contactId, dealId, companyId, date range)
- `POST /activities` — create
- `DELETE /activities/:id` — delete

### 3.7 Tags Module
- `GET /tags` — list all
- `POST /tags` — create
- `PATCH /tags/:id` — update
- `DELETE /tags/:id` — delete
- `POST /tags/:tagId/contacts/:contactId` — attach
- `DELETE /tags/:tagId/contacts/:contactId` — detach
- Same for deals, companies

### 3.8 Users Module
- `GET /users` — list (admin, paginated)
- `GET /users/:id` — get by id
- `PATCH /users/:id` — update profile
- `DELETE /users/:id` — delete

---

## Phase 4: Seed Command

- `src/commands/seed.ts` — sample data for all models

---

## Phase 5: Polish & Testing

- Swagger decorators on all endpoints
- E2E tests for auth flow + CRUD
- Unit tests for critical services
