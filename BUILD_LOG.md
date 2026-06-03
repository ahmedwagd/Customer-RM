# Build Log — CRM Monorepo

## 1. Prisma Schema

- Created `apps/api/prisma/schema.prisma` with 8 models and 2 enums
- Models: User, Company, Contact, Deal, Task, Note, Activity, Tag
- Enums: DealStage (NEW, QUALIFIED, PROPOSAL, NEGOTIATION, CLOSED_WON, CLOSED_LOST), ActivityType (EMAIL, CALL, MEETING, SYSTEM)
- Join tables: TagOnContact, TagOnDeal, TagOnCompany (many-to-many with cascade deletes)
- Optional foreign keys on all relation fields
- Applied via `prisma migrate dev --name init_crm_models`

## 2. Prisma 7 Config Fix

- Rewrote `apps/api/prisma.config.ts` to use Prisma 7's `defineConfig` with `env("DATABASE_URL")` for the datasource URL
- Added `dotenv` dependency to api package
- Removed old `process.env.DATABASE_URL` approach

## 3. Field Name Conflict Fix

- Renamed scalar `notes` field on Contact and Deal to `description` (conflicted with relation field `notes`)

## 4. PrismaService Fix

- Initially had TS errors because `prisma generate` hadn't run — `$connect`/`$disconnect` resolve correctly after generation
- Removed `OnModuleInit` and `onModuleInit` — Prisma 7 auto-connects on first query via adapter
- Removed `$disconnect` — replaced with `pool.end()` on the underlying pg Pool for proper cleanup
- Stored pool as `private readonly pool` field

## 5. Code Review Fixes

### 5a. FK Indexes
- Added `@@index` on all foreign key columns across Contact, Deal, Task, Note, Activity
- Migration: `add_indexes_contact_status_enum_occurred_at`

### 5b. Rename timestamp → occurredAt
- Renamed `Activity.timestamp` to `Activity.occurredAt` to avoid confusion with `createdAt`

### 5c. ContactStatus Enum
- Added `ContactStatus` enum: LEAD, ACTIVE, INACTIVE, LOST
- Changed `Contact.status` from free-text `String` to typed enum

### 5d. UserRole Enum
- Added `UserRole` enum: ADMIN, MANAGER, MEMBER
- Changed `User.role` from free-text `String` to typed enum
- Migration: `add_user_role_enum`

## Final Schema State

- **Enums (4)**: DealStage, UserRole, ContactStatus, ActivityType
- **Models (9)**: User, Company, Contact, Deal, Task, Note, Activity, Tag, + 3 join tables (TagOnContact, TagOnDeal, TagOnCompany)
- **Indexes**: FK columns indexed on all child models
- **Migrations**: 3 total (init, index/enum cleanup, user_role_enum)

## 6. README Rewrite

- Replaced informal notes with a professional markdown README
- Added structured sections: Tech Stack, Environment Variables, Getting Started
- Kept sensitive credentials behind an `env` block with a clear warning note
- Formatted for readability with lists, code blocks, and consistent heading hierarchy

## 7. Prisma 7 Upgrade (from v6)

- Upgraded `@prisma/client` and `prisma` to v7.8.0
- Replaced `@prisma/adapter-pg` + `pg` Pool for runtime direct DB connection
- Removed `url` from `schema.prisma` (Prisma 7 convention — datasource URL lives in `prisma.config.ts`)
- Created `apps/api/prisma.config.ts` with `defineConfig` + `env("DATABASE_URL")`
- Updated `prisma.service.ts`: passes `adapter` (via `PrismaPg`) to `PrismaClient` constructor
- Excluded `prisma.config.ts` from both `tsconfig.json` and `tsconfig.build.json`
- Added explicit `DATABASE_URL` guard to `prisma.config.ts` for clear error messages

## 8. Config / Docs Update

- Updated `README.md` — added Prisma 7 adapter pattern section, key config files table, and getting started command
- Updated `AGENTS.md` — reflected Prisma 7 setup, key file paths, Tailwind v4 `@theme` convention
- Fixed `index.html` title from `"web"` to `"CRM — Customer Management System"`

## 9. Security / Git Hygiene

- **Credential leak fix**: Replaced live `DATABASE_URL` in `README.md` with placeholder
- **API key leak fix**: Added `.opencode/` to `.gitignore` and removed from git tracking (previously committed)
- **Push**: Forced pushed amended commit to `origin/main` at `https://github.com/ahmedwagd/Customer-RM.git`
