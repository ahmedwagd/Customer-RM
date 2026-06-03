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

## 10. Swagger Integration

- Installed `@nestjs/swagger` (NestJS 11 compatible)
- Configured `SwaggerModule` in `main.ts` — title "CRM API", version "1.0", docs served at `GET /api/docs`
- Added `@ApiTags('App')` and `@ApiOperation` decorators to `app.controller.ts`
- Verified typecheck passes

## 11. API Folder Structure Docs

- Fetched the CMS-API reference structure from `https://github.com/ahmedwagd/CMS-API/tree/main/src`
- Updated `README.md` with full API tree under "API Structure" section (auth, commands, common, config, modules, prisma)
- Updated `AGENTS.md` — added "API Structure" tree, moved Swagger mention into repo state
- Both files now reflect the target structure consistently

## 12. API Implementation — Phase 1 (Shared Infrastructure)

### 12a. Dependencies
- Installed `class-validator`, `class-transformer` for DTO validation
- Installed `@nestjs/config` for env management with `ConfigModule.forRoot()`
- Installed `zod` (replaced initial `joi`) for env schema validation

### 12b. Config Module
- Created `src/config/config.module.ts` — uses `@nestjs/config` `ConfigModule.forRoot()` with Zod `validate` function
- Created `src/config/config.service.ts` — `AppConfigService` wrapping `@nestjs/config` with typed getters inferred from `EnvConfig` (via `z.infer`)
- Env vars validated: `DATABASE_URL` (required), `JWT_SECRET`, `JWT_REFRESH_SECRET` (min 16), `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `PORT`, `NODE_ENV`
- Marked as `@Global()` module, imported in `AppModule`

### 12c. Common Infra
- Created `src/common/filters/prisma-client-exception.filter.ts` — handles Prisma errors P2002 (409), P2025 (404), P2003 (400); uses typed `express.Response`
- Created `src/common/dto/pagination.dto.ts` — `PaginationDto` (page/limit/sortBy/sortOrder + skip helper) and `PaginatedResult<T>` generic wrapper

### 12d. Global App Setup
- `main.ts` — added `ValidationPipe` (whitelist, transform, forbidNonWhitelisted) + `PrismaClientExceptionFilter`
- `PrismaService` — now injects `AppConfigService` instead of reading `process.env.DATABASE_URL` directly
- `.env` — added all env vars: `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `PORT`, `NODE_ENV`

### 12e. Code Review Fixes
- Fixed `dotenv` not being loaded — removed manual `import 'dotenv/config'` (handled by `@nestjs/config`)
- Fixed `ConfigService` production-safety: falls back to dev defaults only in non-production
- Fixed `PrismaClientExceptionFilter` — replaced fragile inline response type with `import type { Response } from 'express'`

## 13. API Implementation — Phase 2 (Auth Module)

### 13a. Dependencies
- Installed `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `argon2`, `uuid`
- Approved `argon2` native build scripts
- Installed `cookie-parser` for HTTP-only refresh token cookie support

### 13b. Schema Changes
- Added `hashedPassword` field to `User` model (required, `String`)
- Added `RefreshToken` model: `id`, `token` (unique), `userId`, `expiresAt`, `createdAt`; indexed on `userId`
- Migration: `add_auth_password_refresh_token`

### 13c. Auth Module
- Created DTOs: `register.dto.ts` (email, name, password, avatarUrl), `login.dto.ts` (email, password)
- Created `auth.service.ts` — `register()`, `login()`, `refresh()`, `logout()` methods
  - Password hashing via `argon2`
  - Access tokens via `@nestjs/jwt` (signed with `JWT_SECRET`, configurable expiry via `JWT_EXPIRES_IN`)
  - Refresh tokens via UUID (stored in DB, configurable expiry via `JWT_REFRESH_EXPIRES_IN`)
  - Token rotation: old refresh token deleted before issuing new pair
  - Race-safe delete using `deleteMany` (avoids P2025 on concurrent reuse)
- Created `auth.controller.ts` — `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`
- Created `auth.module.ts` — wires `PassportModule`, `JwtModule.registerAsync`, `JwtStrategy`

### 13d. JWT Infrastructure
- Created `src/common/strategies/jwt.strategy.ts` — extracts Bearer token, validates against `JWT_SECRET`, returns user (id, email, name, role, avatarUrl)
- Created `src/common/guards/jwt-auth.guard.ts` — `@UseGuards(JwtAuthGuard)` guard
- Created `src/common/decorators/current-user.decorator.ts` — `@CurrentUser()` param decorator with typed `CurrentUserType`

### 13e. HTTP-Only Refresh Token Cookie
- Installed `cookie-parser` middleware (registered in `main.ts`)
- Refresh token returned via `Set-Cookie` header instead of response body
- Cookie config: `httpOnly: true`, `secure: true` in production, `sameSite: 'strict'`, `path: '/auth'`
- `refresh` endpoint reads token from cookie (not request body)
- `logout` endpoint clears cookie and invalidates token in DB

### 13f. Code Review Fixes
- Fixed race condition in `refresh()`: `delete` → `deleteMany` (prevents 500 on concurrent token reuse)
- Fixed hardcoded 7-day refresh expiry: now reads `JWT_REFRESH_EXPIRES_IN` from config via `parseExpiry` helper (supports `d`/`h`/`m`/`s`)
- Removed deprecated `@types/uuid` (uuid@14 ships its own types)

## 14. API Implementation — Phase 3 (Domain Modules — CRUD Scaffold)

### 14a. Contacts Module
- `src/modules/contacts/` — DTOs (create, update, query), controller, service, module
- `GET /contacts` — paginated, filterable by status, companyId, search (name/email)
- `GET /contacts/:id` — includes company, deals, tasks, notes, activities, tags
- `POST /contacts` — create
- `PATCH /contacts/:id` — update
- `DELETE /contacts/:id` — delete

### 14b. Companies Module
- `src/modules/companies/` — same DTO/service/controller/module structure
- `GET /companies` — paginated, searchable by name
- `GET /companies/:id` — includes contacts, deals, activities, tags
- `POST /companies` — create
- `PATCH /companies/:id` — update
- `DELETE /companies/:id` — delete

### 14c. Deals Module
- `src/modules/deals/` — DTOs, service, controller, module
- `GET /deals` — paginated, filterable by stage, userId, contactId, companyId
- `GET /deals/:id` — includes contact, company, user, tasks, notes, activities, tags
- `POST /deals` — create (assigns authenticated user)
- `PATCH /deals/:id` — update (stage transitions)
- `DELETE /deals/:id` — delete

### 14d. Tasks Module
- `src/modules/tasks/` — DTOs, service, controller, module
- `GET /tasks` — paginated, filterable by completed, userId, contactId, dealId, dueDate
- `GET /tasks/:id` — get with relations
- `POST /tasks` — create (assigns authenticated user)
- `PATCH /tasks/:id` — update (supports completed toggle)
- `DELETE /tasks/:id` — delete

### 14e. Notes Module
- `src/modules/notes/` — DTOs, service, controller, module
- `GET /notes` — list (filterable by contactId, dealId)
- `POST /notes` — create (assigns authenticated user)
- `PATCH /notes/:id` — update
- `DELETE /notes/:id` — delete

### 14f. Activities Module
- `src/modules/activities/` — DTOs, service, controller, module
- `GET /activities` — list (filterable by type, contactId, dealId, companyId, dateFrom/dateTo)
- `POST /activities` — create (assigns authenticated user)
- `DELETE /activities/:id` — delete

### 14g. Tags Module
- `src/modules/tags/` — DTOs, service, controller, module
- `GET /tags` — list all with usage counts
- `POST /tags` — create (unique name enforcement)
- `PATCH /tags/:id` — update (conflict-safe rename)
- `DELETE /tags/:id` — delete
- `POST /tags/:tagId/contacts/:contactId` — attach
- `DELETE /tags/:tagId/contacts/:contactId` — detach
- Same for deals and companies (6 attach/detach endpoints total)

### 14h. Users Module
- `src/modules/users/` — DTOs, service, controller, module
- `GET /users` — list (paginated, filterable by role, search)
- `GET /users/:id` — get by id (excludes hashedPassword)
- `PATCH /users/:id` — update profile
- `DELETE /users/:id` — delete

### 14i. AppModule Registration
- All 8 domain modules imported into `AppModule`
- Typecheck passes clean

### 14j. Code Review Fixups
- **Tag catch blocks**: All 6 attach/detach methods now catch only specific Prisma error codes (`P2002` for unique constraint, `P2025` for not found), rethrowing unexpected errors instead of masking them with blanket catches
- **Redundant existence checks removed**: Eliminated `await this.findOne(id)` calls from all 14 `update()`/`remove()` methods across 7 services — the global `PrismaClientExceptionFilter` already maps Prisma's `P2025` to 404, making the upfront fetch unnecessary

## 15. Web Frontend — Phase 1 (Core Infrastructure)

### 15a. API Client Layer
- Created `src/api/client.ts` — fetch wrapper with `credentials: 'include'`, automatic `Authorization: Bearer` header injection, and 401-triggered token refresh via POST `/auth/refresh`
- Created `src/api/types.ts` — full TypeScript types for all 9 Prisma models + 4 enums (`DealStage`, `UserRole`, `ContactStatus`, `ActivityType`) using `as const` pattern (no runtime enums — `erasableSyntaxOnly` is enabled)
- Created `src/api/auth.ts` — `login()`, `register()`, `logout()` with `AuthResponse` returning access token
- Created typed API modules: `contacts.ts`, `companies.ts`, `deals.ts`, `tasks.ts`, `notes.ts`, `activities.ts`, `tags.ts`, `users.ts` — each with CRUD functions, filter/pagination parameter types, and DTO interfaces
- Barrel export via `src/api/index.ts`

### 15b. Auth & Session Management
- Created `src/contexts/AuthContext.ts` — exports `AuthContext` and `AuthContextValue` interface
- Created `src/contexts/AuthProvider.tsx` — React component that:
  - On mount: calls `/auth/refresh` via `tryRestoreSession()` to restore session from httpOnly cookie
  - Decodes JWT payload client-side to extract `sub` (user ID), then fetches full user via `GET /users/:id`
  - Provides `login`, `register`, `logout` callbacks — all throw on failure so forms can surface errors
  - Uses `AbortSignal` for cleanup on unmount during session restore
- Created `src/hooks/useAuth.ts` — `useAuth()` hook wrapping `AuthContext`
- Split across 3 files to satisfy `react-refresh/only-export-components` lint rule

### 15c. Routing & Layout Shell
- **ProtectedRoute** (`src/components/ProtectedRoute.tsx`) — shows spinner during session restore, redirects to `/login` if unauthenticated
- **AuthLayout** (`src/layouts/AuthLayout.tsx`) — centered single-column layout for login/register with CRM branding
- **AppLayout** (`src/layouts/AppLayout.tsx`) — Sidebar + TopBar + `<Outlet />` for authenticated pages
- **Sidebar** (`src/components/Sidebar.tsx`) — 9 NavLinks (Dashboard, Contacts, Companies, Deals, Tasks, Notes, Activities, Tags, Users) with active-state highlighting per MD3 `primary-fixed` color
- **TopBar** (`src/components/TopBar.tsx`) — user avatar initials, email display, logout button

### 15d. Route Tree & Page Stubs
- `App.tsx` — full route tree:
  - Public: `/` (Home), `/login`, `/register`
  - Protected (under `ProtectedRoute` + `AppLayout`): `/dashboard`, `/contacts`, `/companies`, `/deals`, `/tasks`, `/notes`, `/activities`, `/tags`, `/users`
- **Login** (`src/pages/auth/Login.tsx`) — email + password form with error display, link to register
- **Register** (`src/pages/auth/Register.tsx`) — name + email + password + confirm password form with match validation
- **Home** — existing landing page
- **Dashboard** — existing placeholder (will be built in Phase 3)
- 8 module placeholder pages — each with heading and "coming soon" message

### 15e. Dev Tooling
- `vite.config.ts` — added Vite dev proxy for 9 API route prefixes (`/auth`, `/contacts`, `/companies`, `/deals`, `/tasks`, `/notes`, `/activities`, `/tags`, `/users`) → `http://localhost:3000`

### 15f. Code Review Fixes (Round 2)
- **Silent auth failure**: `fetchUserFromToken` now throws on failure instead of returning null; `login()`/`register()` propagate errors to forms; mount path uses try/catch with graceful fallback
- **Dead field removed**: Removed `user?: User` from `AuthResponse` — the API only returns `{ accessToken }`
- **File rename**: `src/api/note.ts` → `src/api/notes.ts` for plural consistency
- **Confirm password**: Added confirm password field with client-side match validation on Register page
- **Typecheck, lint, build**: All pass clean

## 16. Web Frontend — Phase 2 (Shared UI Components)

### 16a. UI Component Library
- Created `src/components/ui/` with 15 files (14 components + barrel export `index.ts`)
- All components use Tailwind v4 `@theme` tokens from `index.css` (no hardcoded raw colors)

| Component | File | Features |
|-----------|------|----------|
| **Button** | `Button.tsx` | 4 variants (primary/secondary/ghost/danger), 3 sizes (sm/md/lg), loading spinner |
| **Input** | `Input.tsx` | MD3 outlined style, floating label via `peer-placeholder-shown`, error state, 8px radius |
| **Card** | `Card.tsx` | 1px border, 16px radius, optional `shadow-card` elevation, clickable variant |
| **DataTable** | `DataTable.tsx` | Typed generic `<T>`, key constrained to `keyof T & string`, sortable headers, horizontal dividers only |
| **Chip** | `Chip.tsx` | 5 color variants, removable with `e.stopPropagation()`, 8px radius |
| **FAB** | `FAB.tsx` | Fixed bottom-right, brand-primary fill, `shadow-modal` elevation, scale animation on click |
| **Modal** | `Modal.tsx` | Escape key + backdrop click to close, shadow-modal, 16px radius |
| **SearchBar** | `SearchBar.tsx` | Pill-shaped (full radius), inline SVG search icon, focus ring |
| **Pagination** | `Pagination.tsx` | Prev/Next, page numbers with ellipsis, page size selector, resets to page 1 on limit change |
| **Avatar** | `Avatar.tsx` | Image → initials fallback (`??` for empty name), 3 sizes |
| **Dropdown** | `Dropdown.tsx` | Native `<select>`, label, placeholder, error state, focus ring |
| **Badge** | `Badge.tsx` | 5 color variants, pill shape |
| **Spinner** | `Spinner.tsx` | 3 sizes, CSS border-based animation |
| **Skeleton** | `Skeleton.tsx` | Text/circular/rectangular + `TableSkeleton`/`CardSkeleton` presets |

### 16b. Google Fonts
- Added `<link>` tags in `index.html` for **Hanken Grotesk** (400, 500, 600, 700) and **Inter** (400, 500, 600)
- Added preconnect hints to `fonts.googleapis.com` and `fonts.gstatic.com` with `crossorigin`
- Fonts served via `display=swap`

### 16c. Code Review Fixes (Round 3)
- **Form submission risk**: Added `type="button"` to all non-submit buttons (Modal close, 3 Pagination buttons)
- **Loading UX**: Button now replaces children with spinner when `loading=true` instead of rendering both
- **Modal UX**: Added backdrop `onClick={onClose}` for dismiss-on-click-outside behavior
- **DataTable type safety**: Changed `Column.key` from `string` to `keyof T & string` — prevents accessing non-existent fields at compile time
- **Pagination edge case**: Limit change now resets to page 1 via `onPageChange(1)` to prevent out-of-range pages
- **Avatar edge case**: Empty/whitespace name renders `??` instead of blank circle
- **Event propagation**: Chip remove button calls `e.stopPropagation()` to prevent parent click handlers from firing
- **Typecheck, lint**: All pass clean

## 17. Web Frontend — Phase 3 (Page Implementation)

### 17a. Route Expansion (`App.tsx`)
- Added nested routes for all module CRUD operations:
  - Contacts: `/contacts/new`, `/contacts/:id`, `/contacts/:id/edit`
  - Companies: `/companies/new`, `/companies/:id`
  - Deals: `/deals/new`, `/deals/:id`
- No route changes needed for Tasks/Notes/Activities/Tags/Users (modals suffice)

### 17b. Dashboard (`src/pages/Dashboard.tsx`)
- Live KPI cards: fetches total contacts, total deals, pending tasks via `useEffect` with `Promise.all`
- Recent activity feed: latest 10 activities with type icon, subject, timestamp
- Quick-action buttons: Create Contact, Add Deal, View Tasks
- Loading state shows `—` for KPI values; empty state shows "No recent activity"

### 17c. Contacts Module (4 files)
- **List** (`contacts/index.tsx`) — DataTable (name, email, company, status chip, created date), SearchBar, status filter Dropdown, Pagination, FAB, action links (Edit/Delete). Loading via Spinner. Uses `cancelled` flag pattern for cleanup.
- **Create** (`contacts/NewContact.tsx`) — Form with firstName/lastName (required), email, phone, title, status, company dropdown (fetched from API), source, description. Navigates to list on success.
- **Detail** (`contacts/ContactDetail.tsx`) — Full card-based layout: details panel (side), tags, description, linked deals, tasks, notes, activity log. Delete with confirmation.
- **Edit** (`contacts/EditContact.tsx`) — Pre-filled form, fetches contact + companies in parallel. Navigates to detail on save.

### 17d. Companies Module (3 files)
- **List** (`companies/index.tsx`) — DataTable (name, domain, contact count, created), SearchBar, Pagination, FAB, View/Delete actions.
- **Create** (`companies/NewCompany.tsx`) — Simple form (name, domain, notes textarea).
- **Detail** (`companies/CompanyDetail.tsx`) — Card layout with details panel, notes, linked contacts list, deals list, activity log.

### 17e. Deals Module (3 files)
- **Pipeline** (`deals/index.tsx`) — Dual view toggle (Pipeline/Table). Pipeline uses 6-column Kanban grid per `DealStage` (New → Qualified → Proposal → Negotiation → Closed Won/Lost). Native HTML5 drag-and-drop for stage transitions. Column headers show stage label + deal count. Table view uses DataTable fallback.
- **Create** (`deals/NewDeal.tsx`) — Form (title, value, currency, stage, closeDate, contact/company dropdowns, description).
- **Detail** (`deals/DealDetail.tsx`) — Stage indicator with color, "Advance Stage" button (moves to next stage in order), details panel, linked tasks/notes/activity.

### 17f. Tasks Module (`tasks/index.tsx`)
- DataTable with completion checkbox toggle, title (strikethrough when done), due date
- "Show completed" toggle filter
- Create/Edit via Modal with title, description, dueDate fields
- Pagination support

### 17g. Notes Module (`notes/index.tsx`)
- Card grid layout sorted by most recent
- Create/Edit via Modal with content textarea
- Displays user name + date on each card

### 17h. Activities Module (`activities/index.tsx`)
- Timeline grouped by date with `border-l-4` colored cards
- Left-border color per activity type (email=primary, call=secondary, meeting=tertiary, system=outline)
- Type filter Dropdown
- Shows subject, details, user/contact/company references, timestamp

### 17i. Tags Module (`tags/index.tsx`)
- Card list with color dot indicator and usage count
- "New Tag" Button opens Modal with name + 10-color palette picker
- Edit/Delete inline actions

### 17j. Users Module (`users/index.tsx`)
- DataTable with name (with "(you)" indicator), email, role (clickable Chip toggles between ADMIN→MANAGER→MEMBER), joined date
- Admin-only delete action (hidden for current user)
- Search + Pagination

### 17k. Code Patterns
- **Data fetching**: `useEffect` with `cancelled` flag pattern (no `useCallback`/custom hook — avoids React 19 lint rule `react-hooks/set-state-in-effect`)
- **Loading**: `loading` state starts `true`, only set to `false` in async `.then()`/`.catch()` callbacks (never synchronously in effect body)
- **Type safety**: Form state typed with explicit generic to avoid literal narrowing from `as const` enums
- **Consistent API**: All pages use the existing typed API functions from `src/api/`
- **UI components**: All pages use components from `src/components/ui/` (DataTable, Button, Input, Dropdown, Modal, Card, Chip, FAB, Pagination, SearchBar, Spinner)
- **Theme tokens**: All styles use Tailwind v4 `@theme` tokens from `index.css` (no raw colors)

## 18. Code Review Fixes — Phase 3 Cleanup

### 18a. Delete doesn't refresh list
- **Contacts** (`contacts/index.tsx`) — `handleDelete` now re-fetches contact list via `listContacts().then(setData)` after successful delete
- **Companies** (`companies/index.tsx`) — same pattern with `listCompanies().then(setData)`

### 18b. Dashboard missing `cancelled` flag
- `Dashboard.tsx` — converted `async/await` block inside `useEffect` to `.then()` chain with `cancelled` flag guard, matching the codebase pattern used by all other list pages

### 18c. Duplicate DataTable key in Companies columns
- `companies/index.tsx` — changed contacts count column key from `'id'` to `'updatedAt'` to avoid React `Encountered two children with the same key` warning

### 18d. Enum consistency
- `users/index.tsx` — changed `currentUser?.role === 'ADMIN'` string literal to `currentUser?.role === UserRole.ADMIN` (enum was already imported)

## 19. API Implementation — Phase 4 (Seed Command)

### 19a. Seed Script
- Created `src/commands/seed.ts` — standalone CLI script that populates all 9 Prisma models with realistic sample data:
  - 3 users (ADMIN, MANAGER, MEMBER) with `argon2`-hashed passwords (`password123`)
  - 3 companies (Acme Corp, Globex Inc., Initech)
  - 6 contacts spread across users/companies with various statuses (ACTIVE, LEAD, INACTIVE)
  - 5 deals at different stages (NEW → CLOSED_WON)
  - 5 tasks, some completed, linked to contacts/deals
  - 4 notes with contextual content
  - 4 activities of different types (CALL, EMAIL, MEETING, SYSTEM)
  - 5 tags (VIP, Hot Lead, Partner, Technology, Finance) with unique colors
  - 14 tag associations across contacts, deals, and companies

### 19b. Script Details
- Uses same `PrismaPg` adapter + `Pool` pattern as `PrismaService` for consistency
- Loads `DATABASE_URL` via `dotenv/config`
- Cleans existing data in dependency-safe order before seeding
- Wrapped in `try/finally` to guarantee `pool.end()` on both success and failure
- Run via `pnpm --filter=api seed` (added to `package.json` scripts)

### 19c. Code Review Fixes
- Added `dotenv` explicitly to dependencies (was already present)
- Fixed pool connection leak on error: wrapped seed logic in `try/finally` so `pool.end()` always executes
- Typecheck and build both pass clean

## 20. Web Frontend — Phase 4 (Polish & Cross-Cutting)

### 20a. Shared Package (`packages/shared/`)
- Configured `packages/shared/` with `tsconfig.json` and `package.json` (ESM, workspace `"shared": "workspace:*"`)
- Created `packages/shared/src/types.ts` — all model interfaces, enums (`DealStage`, `UserRole`, `ContactStatus`, `ActivityType`) with `as const` pattern, pagination types
- Created `packages/shared/src/constants.ts` — shared lookup maps for deal stages (`dealStageLabels`, `dealStageColors`, `dealStageOrder`), contact statuses (`contactStatusLabels`, `contactStatusColors`), activity types (`activityTypeLabels`, `activityTypeIcons`, `activityTypeColors`), and user roles (`userRoleLabels`, `userRoleColors`)
- Created barrel export `packages/shared/src/index.ts`
- Updated `apps/web/src/api/types.ts` to re-export from `shared` package
- Added `"shared": "workspace:*"` to `apps/web/package.json`

### 20b. Toast/Snackbar System
- Created `src/contexts/ToastContext.ts` — `Toast` interface and `ToastContext` with `toast()`, `dismiss()` methods
- Created `src/contexts/ToastProvider.tsx` — manages toast state, auto-dismiss after 4s, renders `ToastComponent` in fixed bottom-right container
- Created `src/components/Toast.tsx` — animated slide-in-right toast with type-specific colors (success=tertiary, error=error-container, info=surface-container-high) and dismiss button
- Created `src/hooks/useToast.ts` — `useToast()` hook consuming `ToastContext`
- Added CSS keyframes `slide-in-right` and `slide-in-left` to `src/index.css` as Tailwind v4 `@utility` directives
- Replaced all silent `catch {}` blocks across 15 page files with `toast()` calls showing success/error feedback
- Replaced `confirm()` dialogs with toast-driven delete feedback on all CRUD operations

### 20c. Error Boundary
- Created `src/components/ErrorBoundary.tsx` — class component catching render errors, displays "Something went wrong" fallback with error message and "Try Again" button
- Wrapped `<App />` in `ErrorBoundary` in `src/main.tsx`

### 20d. Skeleton Loaders (all pages)
- Replaced `<Spinner size="md" />` with appropriate skeleton layouts across every page:

| Page | Skeleton Type |
|------|---------------|
| Contacts list | `TableSkeleton` (8 rows, 5 cols) |
| Companies list | `TableSkeleton` (8 rows, 4 cols) |
| Deals pipeline | 6 skeleton column cards with `Skeleton` placeholders |
| Tasks list | `TableSkeleton` (8 rows, 3 cols) |
| Notes list | Grid of 6 `CardSkeleton` components |
| Activities list | 5 skeleton activity cards with `border-l` decoration |
| Tags list | Grid of 6 skeleton tag cards with color dot + name + count |
| Users list | `TableSkeleton` (8 rows, 4 cols) |
| Dashboard | 3 skeleton KPI cards + 5 skeleton activity feed rows |
| Contact detail | Structured 2-column skeleton layout with 7 detail rows |
| Company detail | Structured 2-column skeleton layout with 4 detail rows |
| Deal detail | Structured 2-column skeleton layout with 5 detail rows |
| Edit contact | 6 skeleton form fields |

### 20e. Debounced Search + useFilters Hook
- Created `src/hooks/useDebounce.ts` — generic `useDebounce<T>(value, delay)` hook (300ms default)
- Created `src/hooks/useFilters.ts` — `useFilters()` hook managing `{ search, page, limit, sortBy, sortOrder }` state; `setFilter()` resets to page 1 on filter changes
- Applied `useDebounce` to search inputs on contacts, companies, and users list pages to avoid excessive API calls

### 20f. Responsive Sidebar
- **Sidebar** (`src/components/Sidebar.tsx`) — now accepts `open`/`onClose` props; renders as fixed overlay on mobile (`md:hidden` backdrop) with slide-in animation (`-translate-x-full` / `translate-x-0`); static inline on `md:` breakpoint
- **TopBar** (`src/components/TopBar.tsx`) — accepts `onMenuToggle` prop; renders hamburger SVG button visible only on mobile (`md:hidden`); email hidden on small screens (`hidden sm:inline`)
- **AppLayout** (`src/layouts/AppLayout.tsx`) — manages `sidebarOpen` state via `useState(false)`; passes toggle to TopBar and open/close to Sidebar

### 20g. Main.tsx Integration
- Updated `src/main.tsx` — wraps component tree in `ToastProvider` then `ErrorBoundary`:
  `StrictMode > BrowserRouter > AuthProvider > ToastProvider > ErrorBoundary > App`

### 20h. Build Verification
- TypeScript: `pnpm --filter=web run typecheck` passes clean
- Production build: `pnpm --filter=web run build` succeeds (320 KB JS gzipped to 89 KB)
- All 15 pages updated with skeleton loaders, toast notifications, and shared constants

## 21. User Profile

### 21a. Backend — Profile Endpoints
- Added `GET /users/me` — returns current user profile with stats (`_count: contacts, deals, tasks`)
- Added `PATCH /users/me` — updates current user's name, email, avatarUrl (no role)
- Created `UpdateProfileDto` — accepts `name?`, `email?`, `avatarUrl?: string | null` (allows clearing avatar)
- Both endpoints use `@CurrentUser()` decorator to identify the authenticated user

### 21b. Frontend — Profile Page
- Created `src/pages/profile/index.tsx` — view/edit toggle page showing:
  - Avatar initials, name, email, role badge (per `userRoleColors`)
  - Stats cards: contacts count, deals count, tasks count
  - Detail section: member since, last updated dates
  - Edit mode: inline form for avatar URL, name, email with save/cancel
  - Skeleton loading state matching the codebase pattern
  - `cancelled` flag pattern for effect cleanup
- Added `/profile` route to `App.tsx`
- Auth context now exposes `setUser` to refresh context user after profile update

### 21c. TopBar Profile Link
- Avatar initials and email in TopBar now link to `/profile` (replaced static display)
- Link uses `no-underline` + hover color transition for clean appearance

### 21d. Code Review Fixes
- **Cancellation flag**: Profile effect uses `let cancelled = false` pattern (was missing, pre-existing pages use this pattern)
- **Avatar clear**: `avatarUrl` accepts `string | null` — empty string sends `null` to backend, clearing the field (was silently ignored)
- **Type isolation**: `UsersService.updateProfile()` accepts `UpdateProfileDto` directly instead of flowing through `UpdateUserDto` typed method


## 22. UI Components Alignment (Template Based)

### 22a. Dependencies & Infrastructure
- Installed react-icons and @radix-ui/react-slider for the web frontend.
- Integrated Material Symbols Outlined via Google Fonts in index.html to match template iconography.
- Defined custom Tailwind v4 @utility tokens for spacing (p-stack-*, m-stack-*, gap-stack-*, gap-gutter) and container margins to ensure consistent 8px-rule layout.

### 22b. New Components
- Icon Component (src/components/ui/Icon.tsx): A wrapper for Material Symbols that supports filled states and custom styling.
- Slider Component (src/components/ui/Slider.tsx): Implemented using Radix UI for a highly accessible, styled range slider with live value display.

### 22c. Enhanced Existing Components
- Input & Dropdown: Added support for leading icons (e.g., search, calendar, currency symbols) with appropriate padding and absolute positioning.
- Chip: Enhanced to support both leading and trailing icons.
- Card: Added a new Section Header pattern allowing cards to have an integrated icon and title header.
- Breadcrumbs: Updated to use the new Icon component for chevron separators.

### 22d. Verification
- Ran pnpm typecheck to ensure all new props and components are type-safe.
- Verified CSS utility applications in index.css.
