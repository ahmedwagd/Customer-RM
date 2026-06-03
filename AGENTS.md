# AGENTS.md — CRM Monorepo

## Repo State

Scaffold complete — core infra wired. Workspace layout:

- `apps/web` — React frontend (Vite + React TS, Tailwind v4, React Router)
- `apps/api` — NestJS backend (Prisma 7, adapter-based PostgreSQL client, Swagger at `/api/docs`)
- `packages/shared` — shared types/utils (stub)

## Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Monorepo | Turbo                               |
| Backend  | NestJS                              |
| Frontend | React                               |
| ORM      | Prisma 7 + PostgreSQL (Neon)        |
| Design   | Material Design 3 (see `DESIGN.md`) |

## API Structure

```
apps/api/src/
├── auth/                  # Auth module — JWT, refresh tokens
│   ├── dto/
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── commands/              # CLI commands (seed)
├── common/                # Shared infra — decorators, guards, interceptors, strategies
├── config/                # App configuration (env-based)
├── modules/               # Domain modules (appointments, clinic, users, etc.)
│   └── */                 # Each module: dto/, entities/, controller, module, service
├── prisma/                # Prisma client adapter + seeding
├── app.controller.ts
├── app.module.ts
└── main.ts
```

## Key Files

- `DESIGN.md` — design tokens, brand guidelines, component specs. The source of truth for UI implementation.
- `templates/` - as UI Copomponents reference.
- `turbo.json` — Turborepo pipeline config; run `pnpm dev` / `pnpm build` / `pnpm lint` etc.
- `apps/api/prisma/schema.prisma` — Prisma schema (no `url` field; v7 convention).
- `apps/api/prisma.config.ts` — Prisma config: migration URL sourced from `DATABASE_URL` env var.
- `apps/api/src/prisma/prisma.service.ts` — Injectable `PrismaClient` using `@prisma/adapter-pg` + `pg.Pool`.
- `apps/api/src/prisma/prisma.module.ts` — Global `PrismaModule` exporting `PrismaService`.
- `apps/api/.env` — `DATABASE_URL` (gitignored; do not expose or log).
- `apps/web/src/index.css` — Tailwind v4 `@theme` block with DESIGN.md tokens (colors, fonts, radii, shadows) + `@layer base` font rules.
- `README.md` — contains the live `DATABASE_URL`; do not expose, commit, or log.
- `.opencode/opencode.json` — Stitch MCP service enabled (Google AI UI design tool). Used for generating screens from prompts.

## Workspace Commands

| Command                                | Description                                    |
| -------------------------------------- | ---------------------------------------------- |
| `pnpm dev`                             | Run all workspaces in dev mode                 |
| `pnpm build`                           | Build all packages                             |
| `pnpm lint`                            | Lint all packages                              |
| `pnpm test`                            | Test all packages                              |
| `pnpm typecheck`                       | Type-check all packages                        |
| `pnpm turbo <task> --filter=<package>` | Run a task for a specific package              |
| `pnpm --filter=<package> add <dep>`    | Add dependency to a specific workspace package |

## Prisma 7 Notes

- `prisma generate` and `prisma migrate` read config from `prisma.config.ts`.
- `prisma.config.ts` is excluded from TypeScript compilation (`tsconfig.json` + `tsconfig.build.json`).
- Runtime connection uses `@prisma/adapter-pg` with `pg.Pool` — no `datasource.url` in schema.
- Run `pnpm --filter=api exec prisma <command>` to invoke Prisma CLI for the API package.

## OpenCode Config

- `.opencode/` is OpenCode local config directory (gitignored; `node_modules/`, `package.json`, `package-lock.json` are excluded from repo).
- `.agents/` is where OpenCode agents/subagents are stored.

## Conventions

- All spacing follows the 8px rule (multiples of 8).
- Colors follow Material 3 surface/primary/tonal palette from `DESIGN.md`.
- Typography: Hanken Grotesk for headlines, Inter for body/labels.
- Corner radii: 8px standard, 16px cards/modals, full-pill for search bars.
- Tailwind v4: use `@theme` CSS blocks (not `tailwind.config.js`) for custom tokens.
