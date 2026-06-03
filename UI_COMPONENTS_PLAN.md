# UI Components Plan — Align with Template

## Overview

The template at `templates/create_new_deal/` demonstrates a modern Material Design 3 "Create New Deal" screen. This plan aligns existing components with the template and adds missing functionality.

## Current State

### Existing Components (`apps/web/src/components/ui/`)
- ✅ Button.tsx - Basic variants (primary, secondary, ghost, danger)
- ✅ Input.tsx - Floating label style
- ✅ Card.tsx - Basic card with optional elevation
- ✅ Chip.tsx - Tag-style component with remove support
- ✅ FAB.tsx - Primary floating action button
- ✅ Modal.tsx - Dialog with header/footer
- ✅ SearchBar.tsx - Pill-shaped with icon
- ✅ DataTable.tsx - Sortable table with pagination
- ✅ Badge.tsx - Status badges
- ✅ Avatar.tsx - User initials/image
- ✅ Spinner.tsx - Loading indicator
- ✅ Skeleton.tsx - Loading placeholders (TableSkeleton, CardSkeleton)
- ✅ Pagination.tsx - Pagination controls

### Layout Components
- ✅ Sidebar.tsx - Navigation sidebar
- ✅ TopBar.tsx - Header with search

## Gaps & Required Changes

### 1. Icon System (HIGH PRIORITY)
Template uses Material Symbols Outlined extensively. Current SearchBar uses inline SVG.

**Action:** Create `Icon.tsx` component that wraps Material Symbols with proper setup.
- Add Google Fonts link in index.html
- Create `<Icon name="add" />` wrapper component
- Replace inline SVGs with Icon component

### 2. Input Improvements (MEDIUM PRIORITY)
Template shows enhanced inputs with leading/trailing icons.

**Action:** Add optional `icon` prop to Input.tsx/Dropdown.tsx
- Leading icon support for inputs
- Icon positioning (absolute left-3)

### 3. Card Section Header Pattern (MEDIUM PRIORITY)
Template uses card sections with icon + heading (e.g., "Deal Identification" with description icon).

**Action:** Consider adding CardSection component or documentation pattern:
```tsx
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg shadow-sm">
  <h3 className="font-title-lg text-title-lg mb-stack-md flex items-center gap-2 text-primary">
    <Icon name="description" /> Deal Identification
  </h3>
</div>
```

### 4. Quick Selection Chips (MEDIUM PRIORITY)
Template shows "Recent" chips with add icons for quick selection.

**Action:** Enhance Chip component to support leading/trailing icons.

### 5. Gradient/AI Assistant Card (LOW PRIORITY)
Template uses gradient card for AI insights.

**Action:** Add `GradientCard` variant or example pattern using Tailwind gradients.

### 6. Range Slider Component (LOW PRIORITY)
Template uses styled range input for probability.

**Action:** Create `Slider.tsx` component with value display.

### 7. Breadcrumbs (MEDIUM PRIORITY)
Template shows breadcrumb navigation.

**Action:** Breadcrumbs.tsx exists but needs Material Symbol chevron_right integration.

### 8. Spacing Tokens (CHECK)
Template uses `p-stack-lg` (24px) and `gap-gutter` (16px) custom spacing.

**Action:** Ensure index.css has these custom tokens defined as utilities.

## Component Hierarchy Recommendation

```
components/ui/
├── icons.tsx           (NEW - Material Symbols wrapper)
├── Button.tsx
├── Input.tsx          (enhance with icon support)
├── Dropdown.tsx       (enhance with icon support)
├── Card.tsx
├── Chip.tsx           (enhance with icon support)
├── FAB.tsx
├── Modal.tsx
├── SearchBar.tsx
├── DataTable.tsx
├── Badge.tsx
├── Avatar.tsx
├── Spinner.tsx
├── Skeleton.tsx
├── Pagination.tsx
├── Breadcrumbs.tsx
├── Slider.tsx         (NEW - for probability/input range)
└── FileUpload.tsx     (NEW - for drag-drop upload area)
```

## Implementation Order

1. **Icon Component** - Foundation for all icon usage
2. **Input/Dropdown Icons** - Enable icon-enhanced form fields
3. **Slider** - For probability and numeric ranges
4. **FileUpload** - For document upload patterns
5. **Breadcrumbs** - Integrate Icon component
6. **Chip Icons** - Enable quick-action chips
7. **GradientCard Example** - Documentation/suggestion

## Design Token Alignment

| Token | Template Value | Current CSS | Status |
|-------|---------------|-------------|--------|
| `p-stack-sm` | 8px | Not defined | Add |
| `p-stack-md` | 16px | Not defined | Add |  
| `p-stack-lg` | 24px | Not defined | Add |
| `gap-gutter` | 16px | Not defined | Add |
| `rounded-xl` | 1rem (16px) | Defined | OK |
| `rounded-lg` | 0.5rem (8px) | Defined as `radius` | OK |

## Notes

- All colors are already aligned with DESIGN.md tokens
- Typography scales match DESIGN.md
- Border radius follows MD3 rounded (8px) standard
- No new dependencies required (Material Symbols is a web font)