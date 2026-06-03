# CRM — Customer Management System

A full-stack customer relationship management application built with a modern monorepo architecture.

## Tech Stack

- **Monorepo**: [Turbo](https://turbo.build/)
- **Backend**: [NestJS](https://nestjs.com/)
- **Frontend**: [React](https://react.dev/)
- **ORM**: [Prisma](https://www.prisma.io/) with PostgreSQL adapter
- **Database**: PostgreSQL 18 hosted on [Neon](https://neon.tech/)

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```

## Key Configurations

| Concern | File |
|---------|------|
| Prisma schema | `apps/api/prisma/schema.prisma` |
| Prisma config (migration URL) | `apps/api/prisma.config.ts` |
| Prisma client adapter | `apps/api/src/prisma/prisma.service.ts` |
| Prisma client module | `apps/api/src/prisma/prisma.module.ts` |
| Tailwind CSS (v4) theme | `apps/web/src/index.css` — `@theme` block with DESIGN.md tokens |
| Design tokens source of truth | `DESIGN.md` — Material 3 tokens, typography, spacing, radii |

## Prisma 7

This project uses Prisma 7 with the adapter pattern:
- `@prisma/adapter-pg` + `pg` Pool provides the connection at runtime.
- `prisma.config.ts` provides the migration URL for `prisma migrate` commands.
- The `url` property is removed from `schema.prisma` (Prisma 7 convention).

## Getting Started

```bash
pnpm install
pnpm dev
```
