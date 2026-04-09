# EV News Intelligence Design System (DESIGN.md)

This document defines the visual language and implementation rules for EV News Intelligence. It synthesizes the precision of Linear, the density of Supabase, and the premium typography of Stripe into a dark-mode-native "Intelligence" aesthetic.

---

## 1. Visual Theme & Atmosphere
- **Concept**: Strategic Intelligence Dashboard.
- **Vibe**: Engineering-grade precision, quiet authority, high information density.
- **Canvas**: Native dark-mode. Content emerges from darkness using luminance rather than shadows.
- **Signature Movement**: Glassmorphism (translucency) and subtle border glows.

## 2. Color Palette

### Backgrounds & Surfaces
| Token | Hex/RGBA | Role | Inspiration |
|-------|----------|------|-------------|
| `--bg-marketing` | `#08090a` | Deepest background (Hero/LP) | Linear |
| `--bg-panel` | `#0f1011` | Sidebar, navigation, panels | Linear |
| `--bg-surface` | `rgba(255, 255, 255, 0.03)` | Card/Component background | Linear |
| `--bg-surface-hover` | `rgba(255, 255, 255, 0.05)` | Hover states | Linear |

### Accents & Brand
| Token | Hex | Role | Inspiration |
|-------|-----|------|-------------|
| `--brand-emerald` | `#3ecf8e` | Primary brand color, logo, success | Supabase |
| `--brand-link` | `#00c573` | Interactive links | Supabase |
| `--brand-glow` | `rgba(62, 207, 142, 0.15)` | Focus rings, border highlights | Supabase |

### Typography Colors
| Token | Hex | Role | Inspiration |
|-------|-----|------|-------------|
| `--text-primary` | `#f7f8f8` | Headings, primary content | Linear |
| `--text-secondary` | `#d0d6e0` | Body text, descriptions | Linear |
| `--text-muted` | `#62666d` | Timestamps, metadata | Linear |

## 3. Typography Rules

### Font Families
- **Primary**: `Inter Variable` (with `"cv01", "ss03"` features enabled).
- **Monospace**: `Berkeley Mono` or `Roboto Mono` for data and technical labels.

### Typography Hierarchy
| Role | Size | weight | line-height | letter-spacing | Notes |
|------|------|--------|-------------|----------------|-------|
| **Hero Title** | 72px | 500 | **1.00** | -0.05em | Supabase density |
| **Section Title** | 48px | 500 | 1.10 | -0.04em | Linear precision |
| **Card Title** | 20px | 590 | 1.30 | -0.02em | Linear signature weight |
| **Body text** | 16px | 400 | 1.60 | normal | Readability |
| **Data Label** | 12px | 510 | 1.00 | 0.05em (caps) | Technical voice |

## 4. Component Styles

### Buttons
- **Primary CTA**: Full Pill (9999px), `--brand-emerald` background, black text.
- **Secondary**: 6px radius, `rgba(255,255,255,0.05)` background, `--text-primary` text, 1px semi-transparent border.
- **Icon Button**: 50% radius (circle), subtle glow on hover.

### Cards (The "Intelligence" Card)
- **Background**: `rgba(255,255,255,0.02)` (translucent).
- **Border**: `1px solid rgba(255,255,255,0.08)`.
- **Backdrop**: `blur(12px)`.
- **Interactive**: Hover increases border opacity to `0.15` and background to `0.05`.

### Header (Strategic Navigation)
- **Style**: Sticky position, `--bg-panel` background with `backdrop-filter: blur(12px)`.
- **Border**: `1px solid rgba(255,255,255,0.05)` (Bottom only).
- **Layout**: 
  - Left: Brand Logomark (Minimalist).
  - Center/Right: Navigation links (Inter 14px weight 510, `--text-secondary`).
  - Far Right: Primary Pill CTA ("Launch App" or "Login").
- **Interactive**: Links change to `--text-primary` and add a subtle underline or brand-glow on hover.

### Footer (Information Hierarchy)
- **Style**: Static, `--bg-marketing` background.
- **Border**: `1px solid rgba(255,255,255,0.05)` (Top only).
- **Structure**: 
  - Multi-column (Product, Resources, Company).
  - Column Headers: Inter 12px weight 590, `--text-primary`, uppercase.
  - Links: Inter 14px weight 400, `--text-muted`, hover: `--text-primary`.
- **Bottom Bar**: Legal notices and social links in micro-typography (12px).

## 5. Layout Principles

### Bento Grid (Density System)
- Use non-uniform grid layouts for dashboards.
- Mix 1x1, 2x1, and 2x2 cards to create visual interest.
- Spacing: Exactly `16px` (gap-4) between intelligence cards.

### Cinematic Whitespace
- Section-to-section margin: `96px` to `128px`.
- Internal container padding: `24px`.

## 6. Depth & Elevation
- **Luminance Stacking**: Deeper elements = `#08090a`. Elevated elements = `#0f1011` or slightly more opaque surface.
- **Shadows**: Avoid traditional shadows. Use borders and background steps for depth.

## 7. Do's and Don'ts
- **DO**: Use `-letter-spacing` on large titles.
- **DO**: Use weights like `510` or `590` (Inter Variable) for nuanced emphasis.
- **DO**: Use `rgba` for borders to let background show through.
- **DON'T**: Use pure black (`#000000`) or pure white (`#ffffff`).
- **DON'T**: Use bright colors for decorative purposes; reserve Emerald for signaling.

## 9. Icons & Assets

- **Library**: [Lucide React](https://lucide.dev/) (consistent stroke width and minimalist aesthetic).
- **Icon Weight**: `1.5px` (Standard) for a sophisticated, technical look.
- **Sizing**:
  - `14px / 16px`: Secondary metadata, inline links.
  - `20px`: Standard action buttons, sidebar items.
  - `24px`: Section headers, primary navigation.
- **Color States**:
  - **Dead**: `--text-muted` (low visual priority).
  - **Live**: `--text-secondary` (active state).
  - **Focus**: `--brand-emerald` (signals interactive success or selection).

## 10. Animation & Transitions

Motion should feel intentional and responsive—never decorative.
- **Easing**: 
  - `cubic-bezier(0.16, 1, 0.3, 1)` (Out-Expo) for entry and scale effects.
  - `cubic-bezier(0.4, 0, 0.2, 1)` (Standard) for linear translations.
- **Durations**:
  - Hover/State changes: `150ms`.
  - Component appearance: `300ms` (with slight Y-offset of `4px`).
  - Page transitions: `400ms` fade-in.
- **Reduced Motion**: Respect `prefers-reduced-motion`—fallback to simple opacity fades.

## 11. Charts & Data Visualization

As an intelligence tool, data must be beautiful and dense.
- **Line Charts**: `2px` stroke width, no background area fill (or very subtle gradient).
- **Grid Lines**: `1px solid rgba(255, 255, 255, 0.03)`.
- **Typography**: Berkeley Mono for axis labels and tooltips.
- **Chart Palette**: 
  - Primary: `--brand-emerald` (Solid).
  - Comparative: `#3b82f6` (Blue) or `#8b5cf6` (Violet).

## 12. Forms & Interactive Elements

- **Inputs**: 
  - **Normal**: `bg-white/03`, `border-white/10`, `rounded-md`.
  - **Focus**: `border-brand-emerald/50`, `ring-4 ring-brand-emerald/10`.
- **Search Bar**: Keyboard shortcut hint (`⌘K`) in `--text-muted` right-aligned.
- **Selects**: Use custom glassmorphic dropdowns with `backdrop-filter: blur(16px)`.

## 13. Responsive Strategy

- **Executive Summary View**: On mobile (< 768px), complex grids collapse into a single vertical stream of intelligence cards.
- **Navigation**: Desktop Sidebar moves to a Floating Bottom Bar or a full-screen overlay menu.
- **Scaling**: Fluid typography using `clamp()` for hero titles.

## 14. Implementation Guide (Tailwind / CSS)

### Reusable Utilities (`globals.css`)
```css
.intelligence-card {
  @apply bg-white/03 border border-white/08 backdrop-blur-md rounded-lg transition-all duration-200;
}
.intelligence-card:hover {
  @apply bg-white/05 border-white/15;
}
.text-hero-dense {
  @apply leading-[1] tracking-[-0.05em];
}
```

## 15. Agent Instructions (for Coding)

When generating UI components:
1. Always enable `font-feature-settings: 'cv01', 'ss03'` for Inter.
2. Use `backdrop-filter: blur(x)` for any elevated surfaces.
3. Ensure large titles have `leading-none` or `line-height: 1`.
4. Use Tailwind's `border-white/10` style shortcuts for semi-transparent borders.
5. Refer to the `.intelligence-card` class for all dashboard units.
