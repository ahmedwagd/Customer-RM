# Plan: Align Pages with Template Designs Using UI Components

## Overview

The `templates/` directory contains 10 HTML screen mockups (plus 2 unified layout variants) that represent the target visual design. The `apps/web/src/components/ui/` folder contains 17 reusable React components implementing Material Design 3 tokens from `DESIGN.md`. The existing 20 pages in `apps/web/src/pages/` need to be updated to match the template designs using these UI components.

---

## Phase 1: Dashboard (`Dashboard.tsx` → `crm_dashboard` template)

**Template:** `templates/crm_dashboard/code.html` (or unified layout variant)

**Current state:** Basic 3-stat-card layout + Recent Activity + Quick Actions buttons.

**Target state:**
- Hero section with greeting ("Good Morning, {user}"), subtitle, date range + export buttons
- 4 metric cards in a grid (Total Revenue, New Leads, Active Deals, Conversion Rate), each with:
  - Icon + label header
  - Metric value + trend indicator (up/down arrow with percentage)
  - Mini bar chart (5 bars using colored divs)
- 2-column layout below:
  - **Left (span 2):** Sales Performance chart card (SVG line chart placeholder) + Recent Activity feed (icon avatars, text, timestamps)
  - **Right (span 1):** Upcoming Tasks (checkboxes, priority icons) + Top Deals mini-table (company initial avatars, deal name, stage, value, progress bar)
- FAB (mobile only)

**UI components to use:** Card, Button, Skeleton, Icon, Avatar

**Key considerations:**
- The mini bar charts are purely visual (div-based), not real charts — no library needed
- Recent Activity list should match the template's icon+text+timestamp pattern
- Replace "Quick Actions" card with Upcoming Tasks + Top Deals
- Unify with template's color token usage (bg-surface-container-lowest, border-outline-variant, etc.)

---

## Phase 2: Contacts List (`contacts/index.tsx` → `contacts_list` template)

**Current state:** Uses DataTable with basic columns.

**Target state:**
- Page header: "Contacts" title, subtitle, Filters button, "Add Contact" primary button
- Full-width table inside a `rounded-xl border` container:
  - Columns: Avatar+Name+Title | Company | Email | Status badge | Last Contacted | Actions (more_vert)
  - Row hover effect
  - Top header row with `bg-surface-container-low`
- Pagination footer: "Showing X to Y of Z contacts" + page buttons with `bg-primary` active style
- FAB in bottom-right

**UI components to use:** DataTable, Avatar, Badge, Pagination, FAB, Button, SearchBar, Icon

**Key changes:**
- Add Avatar column (initials/image + name + title)
- Replace status text with Badge component (tertiary for Customer, secondary-fixed for Opportunity, etc.)
- Add proper Pagination component at bottom
- Add Filters + Add Contact buttons in header
- Wrap table in styled container

---

## Phase 3: Deals Pipeline (`deals/index.tsx` → `deals_pipeline` template)

**Current state:** Has pipeline view with basic columns and a table toggle.

**Target state:**
- Header: "Deals Pipeline" title + subtitle + Board/List toggle pills (segmented control)
- Kanban board (horizontal scroll) with columns:
  - New Lead | Discovery | Proposal | Negotiation | Closed Won
  - Each column header shows: stage name, deal count (badge), total value
  - Each column has a colored top border (e.g., primary-container for New Lead, tertiary for Closed Won)
- Deal cards within columns:
  - Status tag (e.g., "Active" green, "High Priority" blue, "Expiring Soon" red)
  - Deal title, company name, value (bold in primary color)
  - Owner avatar (image or initials badge)
  - Hover: border-primary-container, shadow-md, cursor-grab
- Drop zone (Proposal column has dashed "Drop here" placeholder)
- FAB with tooltip "Quick Add Deal"

**UI components to use:** Badge, Avatar, FAB, Chip, Icon

**Key changes:**
- Enhance column headers with deal count badge + total value
- Add status tags to deal cards
- Add owner avatars to cards
- Add colored top borders per column
- Add segmented toggle for Board/List view
- Add "Drop here" placeholder in Proposal column
- Add FAB tooltip

---

## Phase 4: New Contact Form (`contacts/NewContact.tsx` → `create_new_contact` template)

**Current state:** Basic form with Input fields.

**Target state:**
- Top bar: "Back to Customers" link, "New Contact" title, Discard + Add Contact action buttons
- Bento grid layout (12-column):
  - **Left (col-span-4):** Profile picture upload area (circle with person icon, edit button overlay, instructions) + Quick Tip card
  - **Right (col-span-8):** Form card with:
    - Name section (First Name + Last Name in 2-col grid) with floating labels
    - Company selection input with icon + dropdown arrow
    - Contact Details (Email + Phone in 2-col grid) with mail/call icons
    - Professional Info (LinkedIn + Relationship Type dropdown in 2-col grid)
    - Internal Notes textarea
- Bottom metadata: Lead Score Preview bar + Status badge (Drafting)

**UI components to use:** Input, Button, Dropdown, Avatar, Icon, Badge

**Key changes:**
- Complete form layout restructure to bento grid pattern
- Add profile image upload area with edit overlay
- Add Quick Tip infobox
- Add Lead Score + Status metadata row
- Replace basic inputs with Input component (floating labels, icons)

---

## Phase 5: New Deal Form (`deals/NewDeal.tsx` → `create_new_deal` template)

**Current state:** Basic form.

**Target state:**
- Breadcrumb nav: "Deals Pipeline > Initiate New Deal"
- 12-column bento layout:
  - **Left (col-span-8):** Deal Identification card (Deal Name + Associated Company with recent chips) + File attachment drop zone (dashed border, icon, text)
  - **Right (col-span-4):** Deal Value card (amount + close date with calendar icon) + Pipeline Status card (stage dropdown + probability slider) + AI Insights gradient card
- Sticky bottom bar: Discard changes + Save Deal buttons

**UI components to use:** Input, Button, Slider, Dropdown, Breadcrumbs, Icon, Chip

**Key changes:**
- Add breadcrumb navigation
- Add attachment drop zone
- Add Deal Value + Expected Close Date card
- Add Pipeline Stage dropdown + Probability Slider
- Add AI Insights gradient card (atmospheric design)
- Add sticky bottom action bar

---

## Phase 6: Tasks & Activity (`tasks/index.tsx` → `tasks_activity` template)

**Current state:** Basic task list with inline modal CRUD.

**Target state:**
- Header: "Tasks & Activity" title + subtitle + My Tasks / Team Tasks tab toggle
- 12-column grid:
  - **Left (col-span-8):** Task list inside card with:
    - Toolbar (filter icon + "Filter: All Tasks", "8 items remaining", "Mark all as done")
    - Scrollable task items with: checkbox, title, date, priority badge, linked opportunity, hover actions (edit/delete)
  - **Right (col-span-4):** Mini calendar (month view with navigation) + Upcoming Meetings agenda (date badges, meeting name, time, location) + Image banner overlay
- FAB with tooltip "Create Task"

**UI components to use:** Button, Badge, Avatar, FAB, Icon, Modal

**Key changes:**
- Add tab toggle (My Tasks / Team Tasks)
- Restructure to 2-column layout
- Add mini calendar component (custom, not from library)
- Add Upcoming Meetings section
- Add task toolbar with count + "Mark all as done" action
- Add hover action icons (edit/delete) on task items
- Add priority badges (High/Medium/Low with colored backgrounds)
- Add linked opportunity reference

---

## Phase 7: Create New Lead (`contacts/NewContact.tsx` — consider adding a dedicated leads page)

**Template:** `templates/create_new_lead/code.html`

**Note:** There is no existing leads page. If needed, create a new page matching the template's bento layout: Contact Details card (name, title, email, phone) + Additional Notes + Sidebar (Company info, Lead Intelligence image card, Priority Setting).

---

## Design Token Alignment

All pages should consistently use Tailwind v4 theme tokens from `apps/web/src/index.css`:

| Token | CSS Class |
|-------|-----------|
| Surface | `bg-surface` |
| Surface container low | `bg-surface-container-low` |
| Surface container lowest | `bg-surface-container-lowest` |
| On surface | `text-on-surface` |
| On surface variant | `text-on-surface-variant` |
| Outline variant | `border-outline-variant` |
| Primary | `text-primary` / `bg-primary` |
| Primary container | `bg-primary-container` / `text-on-primary-container` |
| Secondary container | `bg-secondary-container` |
| Tertiary | `text-tertiary` |
| Error | `text-error` / `bg-error` |

Typography tokens from `index.css` (`font-headline-lg`, `font-title-lg`, `font-body-md`, `font-label-lg`, etc.)

---

## Execution Order

| Phase | Priority | Page | Estimated Effort |
|-------|----------|------|------------------|
| 1 | High | Dashboard | Large |
| 2 | High | Contacts List | Medium |
| 3 | High | Deals Pipeline | Large |
| 4 | Medium | New Contact | Large |
| 5 | Medium | New Deal | Large |
| 6 | Medium | Tasks & Activity | Large |
| 7 | Low | New Lead (if needed) | Medium |

Each phase should be done incrementally, preserving existing functionality (API integration, navigation, breadcrumbs) while updating the visual layout to match templates.

---

## Phase 8: Tags, Auth, Notes, Users, Activities Pages

### Common Changes Across All Pages
1. Replace `text-brand-neutral` → `text-on-surface-variant` (theme token)
2. Replace raw `<button>` → `Button` component where appropriate
3. Replace hardcoded focus colors (`focus:border-[#1a73e8]`) → `focus:ring-2 focus:ring-primary-container`
4. Add `rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm` container wrappers for list/card areas
5. Use `Icon` component instead of raw text/emoji icons

### 8a. Tags Page (`apps/web/src/pages/tags/index.tsx`)
**Changes:**
- Import `Icon` component
- Cards: `rounded-xl` instead of `rounded-lg`
- Replace Edit/Delete `<button>` links → `Button variant="ghost" size="sm"` with `Icon name="edit"` / `Icon name="delete"`
- Replace `text-brand-neutral` → `text-on-surface-variant`

### 8b. Auth Pages (`apps/web/src/pages/auth/Login.tsx`, `Register.tsx`)
**Changes:**
- Import `Button`, `Input` from `../../components/ui`
- Replace raw `<input>` → `Input` component
- Replace raw submit `<button>` → `Button variant="primary"` full-width
- Replace `text-brand-neutral` → `text-on-surface-variant`
- Replace `focus:border-[#1a73e8]` → theme token classes
- Already wrapped in AuthLayout ✓

### 8c. Notes Page (`apps/web/src/pages/notes/index.tsx`)
**Changes:**
- Import `Icon` component
- Replace Edit/Delete `<button>` links → `Button variant="ghost" size="sm"` with icons
- Replace `text-brand-neutral` → `text-on-surface-variant`
- Textarea: add `rounded-xl` + theme border tokens

### 8d. Users Page (`apps/web/src/pages/users/index.tsx`)
**Changes:**
- Add `rounded-xl border border-outline-variant overflow-hidden bg-surface-container-lowest` wrapper around DataTable + Pagination
- Add "Showing X to Y of Z" text + Pagination in bottom bar (matching contacts page pattern)
- Replace `text-brand-neutral` → `text-on-surface-variant`

### 8e. Activities Page (`apps/web/src/pages/activities/index.tsx`)
**Changes:**
- Import `Icon` component
- Replace emoji (`activityTypeIcons`) → `Icon name={...}` mapping
- Replace inline `border-l-[color]` → proper border-l color classes
- Replace `bg-surface-container-lowest` cards with `rounded-xl border border-outline-variant shadow-sm`
- Replace `text-brand-neutral` → `text-on-surface-variant`

**Order:** tags → activities → notes → users → auth (Login + Register)

**Verification:** Run `pnpm --filter=web typecheck` and `pnpm --filter=web lint` after all changes.
