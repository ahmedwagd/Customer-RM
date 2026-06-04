# Auth Session Persistence — Issue & Fix

## Symptoms

After a successful login and redirect to `/dashboard`, performing a **page reload** results in one of two behaviors:

| Page reloaded on | Observed behavior |
|---|---|
| `/dashboard` | Redirected back to `/login` |
| Any other protected page (`/contacts`, `/users`, `/companies`, etc.) | Raw `{"message":"Unauthorized","statusCode":401}` JSON displayed in the browser |

These symptoms occur because the application loses its authentication state on reload and cannot restore it.

---

## Root Cause Analysis

Two independent bugs cause these symptoms:

### Bug 1 — Refresh Cookie `SameSite=Strict`

**File:** `apps/api/src/auth/auth.controller.ts` (line 101)

```
cookieOptions → sameSite: 'strict'
```

#### Flow (what should happen on page reload)

1. Browser requests the SPA HTML
2. React mounts → `AuthProvider` calls `tryRestoreSession()`
3. Frontend sends `POST /auth/refresh` with `credentials: 'include'`
4. Backend reads the `refresh_token` cookie from the request
5. Backend validates the token, rotates it, and returns a new access token
6. Session is restored — user stays on the page

#### What actually happens

- The `refresh_token` cookie is set with `SameSite=Strict` by the backend during login
- Vite proxies the request to `localhost:3000`, but the cookie was set on the proxied origin (`localhost:5173`)
- On page reload, the browser's cookie handling with `SameSite=Strict` through the proxy causes the cookie to be dropped or not forwarded correctly
- The backend receives no cookie → returns `{ accessToken: null }`
- `tryRestoreSession()` returns `null` → `loading=false, user=null`
- `ProtectedRoute` sees `!isAuthenticated` → `<Navigate to="/login" replace />`

#### Fix

Change `sameSite` from `'strict'` to `'lax'`.

`SameSite=Lax` allows cookies on top-level navigations (page reloads are top-level navigations) while still providing CSRF protection — the cookie is not sent on cross-site POST/DELETE/PATCH requests initiated by a third-party site.

The `/auth/refresh` endpoint is a `POST` request. With `SameSite=Lax`, a cross-site POST will not include the cookie, so CSRF is still prevented. Same-origin requests (the normal use case) are unaffected.

---

### Bug 2 — Vite Proxy Collides with SPA Routes

**File:** `apps/web/vite.config.ts`

```
proxy:
  /auth    → http://localhost:3000
  /contacts → http://localhost:3000
  /companies → http://localhost:3000
  /deals    → http://localhost:3000
  /tasks    → http://localhost:3000
  /notes    → http://localhost:3000
  /activities → http://localhost:3000
  /tags     → http://localhost:3000
  /users    → http://localhost:3000
```

#### Flow on page reload at `/contacts`

1. Browser sends `GET /contacts`
2. Vite checks its proxy rules — **`/contacts` matches** a proxy entry
3. Vite forwards the request to `http://localhost:3000/contacts` (the NestJS API)
4. The API endpoint requires JWT auth → no `Authorization` header → returns `401 {"message":"Unauthorized"}`
5. The browser renders the raw JSON — the SPA never loads

#### Why `/dashboard` behaves differently

There is **no proxy rule** for `/dashboard`. Vite serves `index.html` (the SPA). React loads, but Bug 1 prevents session restore, so the user is redirected to `/login`.

#### Scope of the issue

| Route | Has proxy rule | Behavior on reload |
|---|---|---|
| `/dashboard` | No | SPA loads → redirects to `/login` (Bug 1) |
| `/contacts/**` | Yes | Raw 401 JSON |
| `/companies/**` | Yes | Raw 401 JSON |
| `/deals/**` | Yes | Raw 401 JSON |
| `/tasks` | Yes | Raw 401 JSON |
| `/notes` | Yes | Raw 401 JSON |
| `/activities` | Yes | Raw 401 JSON |
| `/tags` | Yes | Raw 401 JSON |
| `/users` | Yes | Raw 401 JSON |
| `/profile` | No | SPA loads → redirects to `/login` (Bug 1) |

#### Fix

Use a dedicated API prefix (`/api`) for all backend routes instead of matching SPA route names directly.

This requires a coordinated change across three layers:

| Layer | Change |
|---|---|
| NestJS backend (`main.ts`) | `app.setGlobalPrefix('api')` — all routes become `/api/auth/*`, `/api/contacts/*`, etc. |
| Vite proxy (`vite.config.ts`) | Replace all individual rules with a single `/api` → `http://localhost:3000` |
| Frontend API calls (`apps/web/src/api/`) | Prepend `/api` to every API path (e.g., `/auth/login` → `/api/auth/login`) |

---

## Fix Plan Summary

| # | File | Change |
|---|---|---|
| 1 | `apps/api/src/auth/auth.controller.ts` | `sameSite: 'strict'` → `'lax'` |
| 2 | `apps/api/src/main.ts` | Add `app.setGlobalPrefix('api')` |
| 3 | `apps/web/vite.config.ts` | Replace proxy rules with `/api` |
| 4 | `apps/web/src/api/auth.ts` | Prefix paths with `/api` |
| 5 | `apps/web/src/api/activities.ts` | Prefix paths with `/api` |
| 6 | `apps/web/src/api/companies.ts` | Prefix paths with `/api` |
| 7 | `apps/web/src/api/contacts.ts` | Prefix paths with `/api` |
| 8 | `apps/web/src/api/deals.ts` | Prefix paths with `/api` |
| 9 | `apps/web/src/api/notes.ts` | Prefix paths with `/api` |
| 10 | `apps/web/src/api/tags.ts` | Prefix paths with `/api` |
| 11 | `apps/web/src/api/tasks.ts` | Prefix paths with `/api` |
| 12 | `apps/web/src/api/users.ts` | Prefix paths with `/api` |

---

## Verification

1. Run `pnpm dev`
2. Login → redirected to `/dashboard`
3. Reload the page → **user stays on dashboard** (not redirected to login)
4. Reload on `/contacts`, `/users`, `/leads` → **SPA loads** (no raw 401 JSON)
5. Full CRUD operations work on all modules
