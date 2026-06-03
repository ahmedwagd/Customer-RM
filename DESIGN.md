---
name: Luminous Enterprise
colors:
  surface: '#f7f9ff'
  surface-dim: '#d7dae0'
  surface-bright: '#f7f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4fa'
  surface-container: '#ebeef4'
  surface-container-high: '#e5e8ee'
  surface-container-highest: '#dfe3e8'
  on-surface: '#181c20'
  on-surface-variant: '#414754'
  inverse-surface: '#2d3135'
  inverse-on-surface: '#eef1f7'
  outline: '#727785'
  outline-variant: '#c1c6d6'
  surface-tint: '#005bc0'
  primary: '#005bbf'
  on-primary: '#ffffff'
  primary-container: '#1a73e8'
  on-primary-container: '#ffffff'
  inverse-primary: '#adc7ff'
  secondary: '#005ac1'
  on-secondary: '#ffffff'
  secondary-container: '#4d8efe'
  on-secondary-container: '#00285c'
  tertiary: '#006d2c'
  on-tertiary: '#ffffff'
  tertiary-container: '#008939'
  on-tertiary-container: '#ffffff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc7ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004493'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a41'
  on-secondary-fixed-variant: '#004494'
  tertiary-fixed: '#89fa9b'
  tertiary-fixed-dim: '#6ddd81'
  on-tertiary-fixed: '#002108'
  on-tertiary-fixed-variant: '#005320'
  background: '#f7f9ff'
  on-background: '#181c20'
  surface-variant: '#dfe3e8'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 57px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: -0.25px
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
  title-lg:
    fontFamily: Hanken Grotesk
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: 0.15px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.5px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.25px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.1px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.5px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-margin: 24px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

The design system is engineered for high-velocity enterprise workflows, specifically tailored for CRM and data-intensive environments. The brand personality is **reliable, intelligent, and unobtrusive**, ensuring that the user's data remains the focal point of the experience.

The aesthetic follows a **Modern Corporate** style influenced by Material Design 3. It prioritizes clarity through purposeful whitespace, a disciplined color application, and a systematic approach to elevation. The emotional response should be one of "productive calm"—reducing the cognitive load inherent in complex relationship management through familiar patterns and refined visual polish.

## Colors

The palette is anchored by "Google Blue" to signify action and primary importance. 

- **Primary (#1a73e8):** Used for primary buttons, active states, and critical progress indicators.
- **Secondary (#4285f4):** A softer blue used for decorative elements, secondary icons, and subtle brand accents.
- **Tertiary (#34a853):** Reserved for "Success" states, positive growth metrics, and "Won" deal statuses.
- **Neutral/Slate (#5f6368):** Used for body text and secondary information.
- **Surface Tones:** Use `#f8f9fa` for secondary containers and `#ffffff` for the main workspace to create a clear distinction between navigation/sidebars and the content canvas.

## Typography

This design system utilizes **Hanken Grotesk** for headlines to provide a modern, sharp, and professional character that mirrors the "Google Sans" aesthetic. For body copy and UI labels, **Inter** is employed for its exceptional legibility in data-heavy tables and functional interfaces.

- **Headlines:** Use Hanken Grotesk sparingly for page titles and major section headers.
- **Body:** Inter is the workhorse for all CRM data. Use `body-md` for standard grid content and `body-lg` for note-taking or communication logs.
- **Labels:** Use `label-lg` for form field headers and `label-sm` for all-caps overlines or status badges.

## Layout & Spacing

The design system utilizes a **12-column fluid grid** for desktop, transitioning to a **4-column grid** for mobile. 

- **The 8px Rule:** All spacing between elements must be a multiple of 8px. 
- **Margins:** Main content areas should maintain a 24px outer margin.
- **Gutters:** Standard horizontal spacing between columns is 16px.
- **Reflow:** On tablet, the sidebar collapses into a rail or hamburger menu. On mobile, all card-based content stacks vertically to ensure the 8px-12px rounded corners are visible and tactile.

## Elevation & Depth

This design system uses **Tonal Layers** supplemented by **Ambient Shadows** to define hierarchy.

1.  **Level 0 (Base):** `#ffffff` - The main canvas background.
2.  **Level 1 (Surface):** `#f8f9fa` - Sidebars, search bars, and inactive containers. No shadow.
3.  **Level 2 (Cards):** `#ffffff` with a subtle 1px border `#e0e0e0` or a soft shadow `0px 1px 3px rgba(0,0,0,0.1)`. Used for contact cards and lead lists.
4.  **Level 3 (Popovers/Modals):** Significant elevation using an ambient shadow: `0px 8px 24px rgba(0,0,0,0.12)`.

Avoid heavy dark shadows; instead, use tinted shadows that incorporate a hint of the primary blue to maintain a "clean" enterprise feel.

## Shapes

The shape language is defined by **Rounded (Level 2)** settings. This provides a approachable yet structured feel suitable for professional tools.

- **Standard Elements (Buttons, Inputs):** 8px (`0.5rem`) corner radius.
- **Medium Elements (Cards, Modals):** 16px (`1rem`) corner radius.
- **Large Elements (Drawers, Sheets):** 24px (`1.5rem`) corner radius on top-facing corners.
- **Search Bars:** Should be fully pill-shaped (rounded-xl or higher) to distinguish them from data entry fields.

## Components

- **Buttons:** Primary buttons use a solid `#1a73e8` fill with white text. Secondary buttons use an outlined style with a 1px `#dadce0` border.
- **Input Fields:** Use "Outlined" style from Material 3. The border turns `#1a73e8` and thickens to 2px on focus. Labels should float to the top border when active.
- **Cards:** Cards are the primary container for CRM leads. They should have a 1px border and 12px padding. In a list view, cards can be "flat" with a subtle divider; in a dashboard view, they should have Level 2 elevation.
- **Chips:** Used for "Lead Status" or "Tags." Use a light background (e.g., light green for "Converted") with a darker version of the same hue for text. Corner radius should be 8px.
- **Data Tables:** Highly condensed with 1px horizontal dividers only. Header rows should use `label-lg` with a slight gray background (`#f8f9fa`).
- **Floating Action Button (FAB):** A signature MD3 element. Place a primary-colored FAB in the bottom right for "Create New Lead" or "Add Task."