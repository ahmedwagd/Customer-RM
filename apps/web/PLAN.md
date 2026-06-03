# `apps/web` — Frontend Implementation Plan

## Overview

Build a full-featured CRM frontend on top of the existing scaffold (Vite + React 19 + Tailwind v4 + React Router v7). The API (NestJS/Prisma) provides 8 domain modules with JWT auth. The DESIGN.md specifies an MD3-inspired "Luminous Enterprise" design system already reflected in `src/index.css` tokens.

---

## Phase 1 — Core Infrastructure

### 1.1 API Client Layer
- **`src/api/client.ts`** — Thin fetch wrapper with base URL from env, JSON handling, error normalization
- **`src/api/auth.ts`** — `login`, `register`, `refresh`, `logout` — all interacting with `httpOnly` cookies (no manual token storage)
- **`src/api/contacts.ts`**, **`companies.ts`**, **`deals.ts`**, **`tasks.ts`**, **`notes.ts`**, **`activities.ts`**, **`tags.ts`**, **`users.ts`** — typed functions for each module's CRUD + filter/pagination params
- **`src/api/types.ts`** — Shared TypeScript types mirroring the Prisma models & DTOs (can later migrate to `packages/shared`)

### 1.2 Auth & Session
- **`src/hooks/useAuth.ts`** — React context provider wrapping auth state (`user`, `loading`, `login()`, `logout()`, etc.)
- Token refresh on 401 via an interceptor/helper; silent refresh on app mount
- Persist minimal user info (id, name, email, role, avatarUrl)

### 1.3 Routing & Layout Shell
- **`src/layouts/AppLayout.tsx`** — Authenticated layout with sidebar + top bar + main content area
- **`src/layouts/AuthLayout.tsx`** — Minimal centered layout for login/register
- **`src/components/Sidebar.tsx`** — Navigation rail/sidebar with links to all modules, active state, collapsible on mobile
- **`src/components/TopBar.tsx`** — User avatar, search, notifications placeholder
- **`src/components/ProtectedRoute.tsx`** — Redirects to `/login` if unauthenticated

### 1.4 Route Tree

```
/                   -> Home (public landing)
/login              -> Login page (public)
/register           -> Register page (public)

/dashboard          -> Dashboard (protected)
/contacts           -> Contact list (protected)
/contacts/new       -> Create contact (protected)
/contacts/:id       -> Contact detail (protected)
/contacts/:id/edit  -> Edit contact (protected)

/companies          -> Company list (protected)
/companies/new      -> Create company (protected)
/companies/:id      -> Company detail (protected)

/deals              -> Deal list / pipeline (protected)
/deals/new          -> Create deal (protected)
/deals/:id          -> Deal detail (protected)

/tasks              -> Task list (protected)
/tasks/new          -> Create task (protected)

/notes              -> Notes list (protected)
/activities         -> Activity timeline (protected)
/tags               -> Tag management (protected)
/users              -> User management (admin, protected)
```

---

## Phase 2 — Shared UI Components

Build from DESIGN.md specs. All in `src/components/ui/`.

| Component | Spec |
|-----------|------|
| **Button** | Primary (solid `#1a73e8`), secondary (outlined `#dadce0`), ghost; sizes sm/md/lg; loading state |
| **Input** | MD3 outlined style, floating label, error state, 8px radius |
| **Card** | 1px border, 12px padding, Level 2 shadow option, 16px radius |
| **DataTable** | Condensed, horizontal dividers only, sortable headers, `label-lg` header row on `#f8f9fa` bg |
| **Chip** | Light bg + darker text for status/tags, 8px radius |
| **FAB** | Bottom-right, primary fill, for "Create" actions |
| **Modal/Dialog** | Level 3 elevation (`0px 8px 24px`), 16px radius |
| **SearchBar** | Pill-shaped (full radius), used across list views |
| **Pagination** | Page controls, page size selector |
| **Avatar** | Image fallback to initials, used in TopBar and contact cards |
| **Dropdown** | For filters, status selectors |
| **Badge** | For counts, notification indicators |
| **Spinner/Skeleton** | Loading states for async data |

---

## Phase 3 — Page Implementation

### 3.1 Auth Pages (src/pages/auth/)
- **Login** — email + password form, error display, link to register
- **Register** — name + email + password + confirm, auto-login on success

### 3.2 Dashboard (src/pages/dashboard/)
- KPI cards (total contacts, active deals, tasks due, etc.) — fetched from aggregate API or computed client-side
- Recent activity feed (latest 10 activities across all entities)
- Quick-action buttons (Create Contact, Add Deal, Log Activity)

### 3.3 Contacts (src/pages/contacts/)
- **List** — DataTable with columns (name, email, company, status, created), search bar, status filter, pagination, FAB for create
- **Detail** — Full contact info card, linked deals table, tasks list, notes timeline, activity log, tag chips, edit/delete actions
- **Create/Edit** — Form with validation (firstName, lastName, email, phone, title, status, source, company dropdown)

### 3.4 Companies (src/pages/companies/)
- **List** — DataTable (name, domain, contact count), search, pagination
- **Detail** — Company info, linked contacts list, deals table, activity log
- **Create/Edit** — Form (name, domain, logo, notes)

### 3.5 Deals (src/pages/deals/)
- **Pipeline view** — Kanban-style columns per `DealStage` (New → Qualified → Proposal → Negotiation → Closed Won / Closed Lost)
- **List view** — DataTable fallback
- **Detail** — Deal info, linked contact/company, tasks, notes, activity
- **Create/Edit** — Form (title, value, currency, stage, closeDate, contact, company)

### 3.6 Tasks (src/pages/tasks/)
- **List** — DataTable with completion toggle, filter by completed/dueDate
- **Create/Edit** — Form (title, description, dueDate, contact, deal)

### 3.7 Notes & Activities
- **Notes** — Simple list with create/edit inline or modal
- **Activities** — Timeline view (type icon, subject, timestamp), filter by type/entity

### 3.8 Tags (src/pages/tags/)
- List with color indicator, usage count, create/edit inline
- Ability to attach/detach tags from contacts, deals, companies

### 3.9 Users (src/pages/users/)
- Admin-only: DataTable of users, role management, disable accounts

---

## Phase 4 — Polish & Cross-Cutting

### 4.1 Error & Loading States
- Global error boundary (`src/components/ErrorBoundary.tsx`)
- Toast/snackbar notifications for success/error feedback
- Skeleton loaders on all list/detail pages

### 4.2 Search & Filtering
- Reusable `useFilters` hook for pagination/search/sort URL state (query params)
- Debounced search input on list pages

### 4.3 Responsive Design
- Sidebar collapses to hamburger/rail on tablet/mobile (per DESIGN.md)
- Cards stack vertically on mobile
- DataTables scroll horizontally on narrow screens

### 4.4 Shared Package
- Migrate TypeScript types (model interfaces, DTOs, enums) to `packages/shared/src/`
- Shared constants (deal stages, contact statuses, activity types)
- Shared validation schemas (if using Zod or similar)

---

## Implementation Order

| Step | What | Depends On |
|------|------|------------|
| 1 | API client + types (`src/api/`) | — |
| 2 | Auth context + ProtectedRoute + TopBar/Sidebar layout | Step 1 |
| 3 | Login + Register pages | Steps 1-2 |
| 4 | Shared UI components (Button, Input, Card, Chip, Modal, DataTable, Pagination, etc.) | — |
| 5 | Dashboard page | Steps 1-2, 4 |
| 6 | Contacts CRUD (list, detail, create/edit) | Steps 1-2, 4 |
| 7 | Companies CRUD | Steps 1-2, 4 |
| 8 | Deals pipeline + CRUD | Steps 1-2, 4 |
| 9 | Tasks CRUD | Steps 1-2, 4 |
| 10 | Notes + Activities pages | Steps 1-2, 4 |
| 11 | Tags management | Steps 1-2, 4 |
| 12 | Users management (admin) | Steps 1-2, 4 |
| 13 | Polish: error handling, skeletons, responsive | Steps 3-12 |
| 14 | Extract shared types to `packages/shared` | Step 13 |

---

## Key Design Decisions

- **No state management library** — React Context + custom hooks is sufficient for this scope; avoids Redux/Zustand overhead
- **No component library** — Build components per DESIGN.md; only ~10-15 primitives needed
- **No SSR** — Vite SPA is fine; API is on separate port
- **Vite proxy** — Configure `vite.config.ts` proxy to `localhost:3000` for dev to avoid CORS issues
- **Tailwind v4** — Use `@theme` tokens already in `index.css`; no `tailwind.config.js`
- **Types** — Start in `src/api/types.ts`, extract to `packages/shared` in final phase
