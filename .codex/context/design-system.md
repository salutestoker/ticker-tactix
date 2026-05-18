# Design System Notes

## Project Context

This design system is for the Ticker Tactix web app built with:

- Laravel official React/Inertia starter kit or Breeze React stack
- Inertia, using the latest compatible package line for the installed Laravel starter kit
- React 19 or newer compatible React release
- TypeScript
- Tailwind CSS v4
- MySQL
- Discord authentication

Codex should use this file as the primary visual and component reference when building the frontend. The goal is to preserve the uploaded mockup direction while creating reusable, scalable components for the Laravel/Inertia/React app.

The uploaded `design/` folder should be treated as the source of truth for visual references and production assets.

Relevant design assets include:

- `design/mockup--less-details.jpg`
- `design/mockup--more-details.jpg`
- `design/assets/images/bg-hero.jpg`
- `design/assets/images/bg-footer.jpg`
- `design/assets/images/bg-footer-top.jpg`
- `design/assets/images/bg-footer-bottom.png`
- `design/assets/images/logo-ticker-tactix-2026.png`
- `design/assets/images/logo-ticker-tactix-alien.png`
- `design/assets/icons/svg/*`
- `design/assets/icons/react/*`

Use the React icon components from `design/assets/icons/react/` when possible. Use SVG files from `design/assets/icons/svg/` only when a static SVG import is more appropriate.

---

## Visual Direction

### Brand Personality

Ticker Tactix should feel like a futuristic trading command system.

The brand should communicate:

- Structured, rules-based trading
- Calm decision-making under pressure
- Intelligence without clutter
- Premium but not corporate
- Tactical, technical, and cinematic
- Sci-fi inspired, but still readable and product-focused
- Serious enough for traders, but visually memorable

The visual language should feel like a nighttime control interface, trading dashboard, or mission system. Avoid generic SaaS styling. The interface should feel custom, atmospheric, and intentional.

Use the mockups as the main visual reference:

- Dark midnight background
- Neon gradient accents
- Thin glowing borders
- HUD-style cards and tables
- Pixel/sci-fi inspired typography
- Layered background scenery
- Soft bloom/glow effects
- Modular matrix-style sections

---

## Color Palette

### Core Colors

Use these named colors consistently across the app.

| Token | Hex |
| --- | --- |
| `midnight-blue` | `#010929` |
| `seafoam-green` | `#00FA92` |
| `main-blue` | `#3764f5` |
| `main-blue-bright` | `#0012cb` |
| `violet` | `#8e35a9` |
| `violet-light` | `#b543d7` |
| `gold` | `#f3bf38` |
| `white` | `#ffffff` |

### Suggested Supporting Colors

Use these only as supporting interface colors derived from the mockups.

| Token | Value |
| --- | --- |
| `ink` | `#020617` |
| `panel` | `#050b2f` |
| `panel-deep` | `#030720` |
| `panel-soft` | `rgba(5, 11, 47, 0.72)` |
| `border-blue` | `rgba(55, 100, 245, 0.45)` |
| `border-green` | `rgba(0, 250, 146, 0.45)` |
| `border-violet` | `rgba(181, 67, 215, 0.45)` |
| `border-gold` | `rgba(243, 191, 56, 0.45)` |
| `text-primary` | `rgba(255, 255, 255, 0.92)` |
| `text-secondary` | `rgba(255, 255, 255, 0.68)` |
| `text-muted` | `rgba(255, 255, 255, 0.44)` |

### Main Usage

Use `midnight-blue` as the primary page background.

Use `seafoam-green` for:

- Primary CTAs
- Positive indicators
- Active states
- Module access badges
- Important highlights

Use `main-blue` for:

- Section backgrounds
- Glow effects
- Secondary accents
- Data-panel borders
- Links and hover states

Use `main-blue-bright` for:

- Footer gradients
- Strong atmospheric blue lighting
- Large section transitions

Use `violet` and `violet-light` for:

- Secondary CTAs
- Gradient headings
- Premium/pro access states
- Direction/system accents
- Playbook and deployment styling

Use `gold` for:

- Licensed/community deployment accents
- Special badges
- Warning/rare status indicators
- Highlight rows where needed

Use `white` sparingly for high-contrast text only.

---

## Gradients

Use gradients heavily but intentionally. Gradients should appear in headings, section dividers, borders, buttons, glows, and small accent lines.

### Brand Gradients

| Token | Value |
| --- | --- |
| `gradient-violet-blue-green` | `linear-gradient(90deg, #b543d7 0%, #3764f5 50%, #00FA92 100%)` |
| `gradient-green-blue-violet` | `linear-gradient(90deg, #00FA92 0%, #3764f5 50%, #b543d7 100%)` |
| `gradient-bright-blue-midnight` | `linear-gradient(180deg, #0012cb 0%, #010929 100%)` |

### Usage Guidelines

Use gradient text for large display headings, such as:

- `MODULE MATRIX`
- `DEPLOYMENT MATRIX`
- Major page hero titles
- Section titles

Use gradient borders for:

- Feature cards
- Matrix tables
- System overview cards
- Playbook/module cards

Use background gradients for:

- Hero overlays
- Footer transitions
- Section-to-section atmosphere

Avoid using large full-page rainbow gradients. The overall feel should stay dark, with neon gradients acting as controlled highlights.

---

## Typography

### Font Families

#### Body Font

Use Corbel for standard body text.

Fallback stack:

`Corbel, "Segoe UI", Arial, sans-serif`

Corbel is an Adobe font. When implementing, make sure it is loaded through the chosen font strategy before relying on it in production.

Use Corbel for:

- Paragraphs
- Descriptions
- Table body text
- Supporting copy
- Form labels
- Footer links
- Card descriptions

#### Heading and Button Font

Use Orbitron Semibold for headings, navigation, buttons, labels, badges, and UI display text.

Fallback stack:

`Orbitron, sans-serif`

Use Orbitron Semibold Italic selectively for high-impact accent copy.

Use Orbitron for:

- Hero headlines
- Section titles
- Buttons
- Navigation labels
- Matrix column headers
- System labels
- Tags and badges
- Card titles
- Module/playbook names

#### Quote and Unique Display Font

Use Source Code Pro Light for quotes, code-like captions, and unique technical details.

Fallback stack:

`"Source Code Pro", monospace`

Use Source Code Pro for:

- Testimonials
- Technical captions
- Version labels
- Small data readouts
- Code-like interface details
- Backtest/version metadata

---

## Type Scale

Use a responsive type scale that preserves the dramatic hierarchy from the mockups.

### Display Hero

Use for the biggest hero text.

- Font family: Orbitron
- Font weight: 600
- Font size: `clamp(2.75rem, 8vw, 7.5rem)`
- Line height: `0.9`
- Letter spacing: `0.04em`
- Text transform: uppercase

### Section Heading

Use for section titles like `MODULE MATRIX` and `DEPLOYMENT MATRIX`.

- Font family: Orbitron
- Font weight: 600
- Font size: `clamp(2rem, 5vw, 4.5rem)`
- Line height: `0.95`
- Letter spacing: `0.08em`
- Text transform: uppercase

### Eyebrow Label

Use above major headings.

- Font family: Orbitron
- Font weight: 600
- Font size: `0.75rem`
- Line height: `1`
- Letter spacing: `0.35em`
- Text transform: uppercase

### Card Title

- Font family: Orbitron
- Font weight: 600
- Font size: `0.95rem`
- Line height: `1.2`
- Letter spacing: `0.04em`
- Text transform: uppercase

### Body Text

- Font family: Corbel
- Font size: `1rem`
- Line height: `1.55`

### Small Interface Text

- Font family: Orbitron
- Font weight: 600
- Font size: `0.7rem`
- Line height: `1.3`
- Letter spacing: `0.08em`
- Text transform: uppercase

### Quote Text

- Font family: Source Code Pro
- Font weight: 300
- Font size: `clamp(0.95rem, 2vw, 1.25rem)`
- Line height: `1.6`

---

## Spacing Scale

Use a consistent spacing scale based on Tailwind defaults.

Preferred spacing rhythm:

| Token | Value |
| --- | --- |
| `xs` | `0.25rem` |
| `sm` | `0.5rem` |
| `md` | `1rem` |
| `lg` | `1.5rem` |
| `xl` | `2rem` |
| `2xl` | `3rem` |
| `3xl` | `4rem` |
| `4xl` | `6rem` |
| `5xl` | `8rem` |

### Section Spacing

Major homepage sections should feel cinematic and breathable.

Use:

- Mobile section padding: `py-16`
- Tablet section padding: `md:py-24`
- Desktop section padding: `lg:py-32`

Hero sections can use larger vertical spacing.

Use:

- `min-h-screen`
- `pt-24`
- `pb-24`
- Centered content with atmospheric background layers

### Component Spacing

Cards and panels should use generous but tight HUD-style spacing.

Use:

- Small card padding: `p-4`
- Standard card padding: `p-5` or `p-6`
- Large feature card padding: `p-8`
- Table cell padding: `px-4 py-3`
- Button padding: `px-5 py-3`

---

## Border Radius

The design uses mostly sharp sci-fi panels with slight rounding. Avoid overly soft SaaS-style rounded corners.

| Use Case | Radius |
| --- | --- |
| Small UI | `rounded-sm` |
| Cards | `rounded-md` |
| Large panels | `rounded-lg` |
| Buttons | `rounded-sm` or `rounded-md` |
| Modals | `rounded-xl` |

Default component radius should be `rounded-md`.

Avoid `rounded-2xl` and pill shapes unless intentionally creating a special badge or slider control.

---

## Borders and Glow

### Border Style

Most panels should have thin, semi-transparent neon borders.

Recommended border:

`border border-main-blue/40`

Use border colors by category:

| Category | Color |
| --- | --- |
| Market/Data | `main-blue` |
| Direction/Structure | `violet-light` |
| Participation/Access | `seafoam-green` |
| Volatility/Price | `gold` |
| Playbooks | `seafoam-green` or `gold` |
| Locked/Pro | `violet-light` |

### Glow Style

Use glow effects subtly.

Standard panel glow:

`shadow-[0_0_24px_rgba(55,100,245,0.18),inset_0_0_18px_rgba(55,100,245,0.08)]`

Active or featured glow:

`shadow-[0_0_32px_rgba(0,250,146,0.2),inset_0_0_20px_rgba(0,250,146,0.08)]`

Avoid heavy drop shadows that look like standard SaaS cards. Prefer glows, inner borders, and subtle atmospheric blur.

---

## Backgrounds

### Page Background

Use `midnight-blue` as the default body background.

Recommended body styling:

- Background: `#010929`
- Text color: `#ffffff`

### Hero Background

Use:

- `design/assets/images/bg-hero.jpg`

The hero should feel layered and cinematic.

Recommended layering:

1. Base midnight background
2. Hero background image
3. Dark gradient overlay
4. Optional blue/violet radial glows
5. Foreground content

Example conceptual structure:

```tsx
<section className="relative isolate min-h-screen overflow-hidden bg-midnight-blue">
  <img
    src="/design/assets/images/bg-hero.jpg"
    alt=""
    className="absolute inset-0 -z-30 h-full w-full object-cover"
  />

  <div className="absolute inset-0 -z-20 bg-gradient-to-b from-midnight-blue/20 via-midnight-blue/70 to-midnight-blue" />

  <div className="relative z-10">
    {/* Hero content */}
  </div>
</section>
```

### Footer Background

Use:

- `design/assets/images/bg-footer-top.jpg`
- `design/assets/images/bg-footer.jpg`
- `design/assets/images/bg-footer-bottom.png`

The footer should preserve the blue atmospheric glow from the mockups.

Footer content should remain readable with dark overlays.

---

## Layout

### Page Width

Use a centered max-width container.

Recommended values:

| Layout | Width |
| --- | --- |
| Standard container | `max-w-7xl` |
| Narrow content | `max-w-3xl` |
| Matrix/table sections | `max-w-7xl` or `max-w-screen-2xl` |

Default page gutters:

`px-4 sm:px-6 lg:px-8`

### Section Pattern

Most sections should follow this structure:

1. Eyebrow label
2. Large gradient heading
3. Short explanatory paragraph
4. Feature cards, matrix, flow diagram, or table
5. Optional CTA

Keep copy short and direct. The visual system should do part of the storytelling.

---

## Components

## shadcn/ui Primitive Policy

Use shadcn/ui selectively as an owned source-code primitive layer, not as the visible design system.

Good uses:

- Accessible interaction primitives: dialog, alert dialog, dropdown menu, popover, tooltip, sheet, tabs, select, checkbox, switch, slider, and sonner.
- Low-level form/control sources that can be fully restyled: input, textarea, table, badge, button.
- Admin UI behavior where keyboard support, focus management, and predictable state handling matter more than custom interaction code.

Avoid:

- Shipping default shadcn visual styling.
- Using shadcn blocks as page designs.
- Letting default cards, rounded pills, gray palettes, or generic SaaS layouts override the HUD direction.
- Installing every component up front.

Implementation pattern:

1. Add only the primitives required for the feature.
2. Configure shadcn to write generated sources under `resources/js/Components/Primitives`.
3. Build branded wrappers under `resources/js/Components/UI`, such as `HudButton`, `HudPanel`, `MatrixTable`, `AccessBadge`, `Field`, `SelectField`, and `CommandDialog`.
4. Style wrappers with Ticker Tactix tokens, fonts, neon borders, compact radii, and focus states from this document.
5. Import wrappers in app pages and feature components. Import raw shadcn primitives directly only when building or extending wrappers.

Preferred setup:

- Use the Radix base.
- Use non-interactive CLI flags when running shadcn commands in agent workflows.
- Keep `components.json`, generated primitive files, and project wrappers under version control.

---

## Buttons

Buttons should use Orbitron Semibold, uppercase text, and compact sci-fi proportions.

### Primary Button

Use for main CTAs such as `Explore Modules`.

Visual style:

- Seafoam green background
- Midnight text
- Thin seafoam glow
- Slightly squared corners
- Uppercase Orbitron text

Recommended classes:

```tsx
className="
  inline-flex items-center justify-center
  rounded-sm
  bg-seafoam-green
  px-5 py-3
  font-heading text-xs font-semibold uppercase tracking-[0.16em]
  text-midnight-blue
  shadow-[0_0_24px_rgba(0,250,146,0.28)]
  transition
  hover:brightness-110
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-seafoam-green
  focus-visible:ring-offset-2
  focus-visible:ring-offset-midnight-blue
"
```

### Secondary Button

Use for secondary CTAs such as `Explore Playbooks`.

Visual style:

- Violet background or violet border
- White or midnight text depending on fill
- Subtle violet glow

Recommended classes:

```tsx
className="
  inline-flex items-center justify-center
  rounded-sm
  bg-violet-light
  px-5 py-3
  font-heading text-xs font-semibold uppercase tracking-[0.16em]
  text-white
  shadow-[0_0_24px_rgba(181,67,215,0.24)]
  transition
  hover:brightness-110
"
```

### Ghost Button

Use inside cards and tables.

Recommended classes:

```tsx
className="
  inline-flex items-center justify-center
  rounded-sm
  border border-main-blue/50
  bg-main-blue/10
  px-4 py-2
  font-heading text-[0.65rem] font-semibold uppercase tracking-[0.12em]
  text-white
  transition
  hover:border-seafoam-green/70
  hover:bg-seafoam-green/10
  hover:text-seafoam-green
"
```

### Button Rules

- Do not use large rounded pill buttons.
- Do not use default browser button styles.
- Use uppercase labels.
- Buttons should feel like interface controls, not marketing SaaS buttons.
- Button hover states should increase glow, border brightness, or text color.

---

## Forms

Forms should feel like dark terminal inputs.

### Input Fields

Use:

- Dark panel background
- Thin blue/violet border
- White text
- Muted placeholder
- Seafoam or blue focus ring

Recommended classes:

```tsx
className="
  w-full
  rounded-md
  border border-main-blue/40
  bg-midnight-blue/70
  px-4 py-3
  font-body text-base text-white
  placeholder:text-white/35
  outline-none
  transition
  focus:border-seafoam-green/70
  focus:ring-2
  focus:ring-seafoam-green/20
"
```

### Labels

Use Orbitron for labels.

Recommended classes:

```tsx
className="
  mb-2 block
  font-heading text-xs font-semibold uppercase tracking-[0.18em]
  text-white/70
"
```

### Validation

Use clear but restrained validation states.

- Error border: red/pink
- Success border: seafoam green
- Warning border: gold

Avoid loud full red backgrounds.

---

## Cards and Panels

### Standard Panel

Use for reusable content blocks.

Recommended classes:

```tsx
className="
  rounded-md
  border border-main-blue/40
  bg-panel-soft
  p-5
  shadow-[0_0_28px_rgba(55,100,245,0.12),inset_0_0_18px_rgba(55,100,245,0.06)]
  backdrop-blur
"
```

### Feature Card

Use for module features and system concepts.

Recommended classes:

```tsx
className="
  rounded-md
  border border-seafoam-green/35
  bg-midnight-blue/80
  p-6
  shadow-[0_0_28px_rgba(0,250,146,0.12)]
"
```

### Locked or Pro Card

Use violet styling.

Recommended classes:

```tsx
className="
  rounded-md
  border border-violet-light/45
  bg-violet/10
  p-6
  shadow-[0_0_28px_rgba(181,67,215,0.14)]
"
```

### Card Content Rules

Cards should usually include:

- Icon
- Small label or title
- Short description
- Optional status badge or CTA

Keep content concise. Avoid long paragraphs inside cards.

---

## Navigation

### Header

The header should feel minimal and cinematic.

Desktop navigation should include:

- Logo
- Primary nav links
- Optional auth/account action

Mobile navigation should use a compact menu icon.

Header style:

- Transparent or midnight overlay
- Fixed or sticky only if it does not interfere with hero visuals
- Thin bottom border only after scroll, if implemented
- Orbitron uppercase nav labels
- Small font size with wide tracking

Example nav link style:

```tsx
className="
  font-heading text-xs font-semibold uppercase tracking-[0.18em]
  text-white/65
  transition
  hover:text-seafoam-green
"
```

### Logo

Use:

- `design/assets/images/logo-ticker-tactix-2026.png`
- `design/assets/images/logo-ticker-tactix-alien.png`

Use the alien mark where a compact symbol is needed.

---

## Data Displays

Ticker Tactix uses a lot of matrix/table-style content. Tables should look like HUD panels, not default admin tables.

### Matrix Tables

Use for:

- Module Matrix
- Deployment Matrix
- Admin lists where appropriate
- Playbook comparisons
- Feature access grids

Visual style:

- Dark panel background
- Thin blue/violet border
- Uppercase Orbitron headers
- Corbel body copy
- Colored badges
- Subtle row dividers
- Hover row glow

Table wrapper classes:

```tsx
className="
  overflow-hidden
  rounded-md
  border border-main-blue/40
  bg-midnight-blue/80
  shadow-[0_0_32px_rgba(55,100,245,0.14)]
"
```

Header cell classes:

```tsx
className="
  px-4 py-3
  font-heading text-[0.65rem] font-semibold uppercase tracking-[0.16em]
  text-white/60
"
```

Body cell classes:

```tsx
className="
  border-t border-main-blue/20
  px-4 py-3
  font-body text-sm text-white/75
"
```

### Badges

Badges should be small, uppercase, and color-coded.

#### Core Access Badge

```tsx
className="
  rounded-sm
  border border-seafoam-green/50
  bg-seafoam-green/10
  px-2 py-1
  font-heading text-[0.6rem] uppercase tracking-[0.12em]
  text-seafoam-green
"
```

#### Pro Access Badge

```tsx
className="
  rounded-sm
  border border-violet-light/50
  bg-violet-light/10
  px-2 py-1
  font-heading text-[0.6rem] uppercase tracking-[0.12em]
  text-violet-light
"
```

#### Licensed Badge

```tsx
className="
  rounded-sm
  border border-gold/50
  bg-gold/10
  px-2 py-1
  font-heading text-[0.6rem] uppercase tracking-[0.12em]
  text-gold
"
```

---

## System Overview Flow

The system overview section should represent the Ticker Tactix trading framework as a connected flow.

The visual should follow this sequence:

1. Market Data
2. Direction
3. Participation
4. Volatility and Structure
5. Playbooks

Each step should be a bordered HUD card with:

- Icon
- Category title
- Three to four short bullet items
- Color-coded border
- Directional arrows between cards on desktop

Suggested category colors:

| Category | Color |
| --- | --- |
| Market Data | `main-blue` |
| Direction | `violet-light` |
| Participation | `seafoam-green` |
| Volatility and Structure | `gold` |
| Playbooks | `seafoam-green` |

On mobile, stack the cards vertically and replace horizontal arrows with subtle vertical connectors.

---

## Module Matrix

The Module Matrix section should show specialized site components that power the Ticker Tactix system.

Use a large gradient title:

`MODULE MATRIX`

Suggested supporting cards above the matrix:

- Backtested System Logic
- Structured Command Center
- Versioned Access Model

Matrix columns should include:

- Module
- Purpose
- What It Does
- Key Output
- Version
- Access

Module rows should use icons from the custom icon library.

Suggested module examples:

- Momentum Cycles
- Volatility Regime
- Structure Mapping
- Participation Metrics
- Sentiment Scanner
- Signal Engine
- Backtest Lab
- Data Pipeline

Access types:

- Core
- Pro
- Locked
- Coming Soon

Use `Core` as seafoam, `Pro` as violet, and locked states as muted/violet.

---

## Playbook Deployment Matrix

The Deployment Matrix section should show available trading frameworks/playbooks.

Use a large gradient title:

`DEPLOYMENT MATRIX`

Matrix columns should include:

- Category
- Playbook / Framework
- Access
- Market
- Best For
- Avg Hold
- Price
- Action

Suggested categories:

- Market Environment
- Core Playbooks
- Pro Playbooks
- Joint Community Deployments

Access types:

- Base Access
- Core Access
- Pro Access
- Licensed to SIGMA

Actions should use compact ghost buttons.

Examples:

- Coming Soon
- Join Beta Testing
- Unlock XBP Tactix
- Join SIGMA

Prices should be displayed in seafoam green when available.

---

## Testimonials

Testimonials should appear as a dark glowing slider/card section.

Use Source Code Pro Light for the quote text.

The card should include:

- Quote mark icon or stylized quotation
- Quote text
- User avatar placeholder or icon
- User role/name
- Slider arrows
- Pagination dots

Testimonial card style:

```tsx
className="
  mx-auto
  max-w-3xl
  rounded-md
  border border-main-blue/50
  bg-midnight-blue/80
  p-6
  shadow-[0_0_36px_rgba(55,100,245,0.2)]
"
```

Slider arrows should be small square HUD controls with blue/violet borders.

---

## Footer

The footer should preserve the atmospheric blue landscape from the mockups.

Use footer image assets from:

- `design/assets/images/bg-footer-top.jpg`
- `design/assets/images/bg-footer.jpg`
- `design/assets/images/bg-footer-bottom.png`

Footer content should include columns such as:

- System
- Resources
- Community
- Legal

Footer text should be small, uppercase or semi-uppercase, and subtle.

The tagline should appear near the bottom:

`TRADE WITH STRUCTURE, NOT EMOTION.`

Use Orbitron with wide tracking.

---

## Icon System

Use the custom icon set in:

- `design/assets/icons/react/`
- `design/assets/icons/svg/`

Prefer React icon components for the React/Inertia frontend.

The React icon barrel file exists at:

`design/assets/icons/react/index.ts`

Use imports from the index where possible.

Example:

```tsx
import {
  MomentumCyclesIcon,
  VolatilityPulseIcon,
  PlaybooksBookOpenIcon,
} from '@/design/assets/icons/react';
```

Adjust the import alias based on the final app structure.

### Icon Style

Icons should be:

- Stroke-based
- Neon-friendly
- Simple and geometric
- Usually rendered at `20px`, `24px`, or `32px`
- Colored according to the card/category context

Do not mix in random third-party icon styles unless absolutely necessary. If Lucide icons are used for generic UI controls, keep them visually secondary to the custom Ticker Tactix icons.

---

## Component Naming Recommendations

Use clear React component names that reflect the design system.

Suggested site components:

- `AppShell`
- `SiteHeader`
- `SiteFooter`
- `HeroSection`
- `SectionHeading`
- `GradientText`
- `HudPanel`
- `HudCard`
- `HudButton`
- `HudBadge`
- `SystemOverviewFlow`
- `SystemFlowCard`
- `ModuleMatrix`
- `ModuleMatrixRow`
- `DeploymentMatrix`
- `DeploymentMatrixRow`
- `TestimonialSlider`
- `IconFrame`
- `PageBackground`

Suggested admin components:

- `AdminShell`
- `AdminSidebar`
- `AdminHeader`
- `AdminPanel`
- `AdminTable`
- `AdminFormSection`
- `AdminTextInput`
- `AdminTextarea`
- `AdminSelect`
- `AdminToggle`
- `AdminStatusBadge`

---

## Admin UI Direction

The admin UI should use the same design system but with slightly more practical spacing and less atmospheric background imagery.

Admin should still feel branded, but usability comes first.

Use:

- Midnight background
- Dark panels
- Thin neon borders
- Orbitron labels/headings
- Corbel body/form text
- Matrix-style tables
- Clear form controls
- Compact badges for status/access/version

Avoid making admin screens overly cinematic. They should feel like a clean command center.

Admin data tables should support:

- Search
- Filters
- Status badges
- Edit actions
- Delete/archive actions
- Created/updated metadata

---

## Tailwind Theme Guidance

When configuring Tailwind CSS v4, expose brand tokens as reusable theme values.

If shadcn/ui is installed, map its CSS variables to the same brand system instead of maintaining a separate neutral palette. `--background`, `--foreground`, `--primary`, `--border`, `--ring`, and related variables should resolve to Ticker Tactix colors or semantic derivatives of them.

Suggested theme tokens:

```css
@theme {
  --font-body: Corbel, "Segoe UI", Arial, sans-serif;
  --font-heading: Orbitron, sans-serif;
  --font-mono-display: "Source Code Pro", monospace;

  --color-midnight-blue: #010929;
  --color-seafoam-green: #00FA92;
  --color-main-blue: #3764f5;
  --color-main-blue-bright: #0012cb;
  --color-violet: #8e35a9;
  --color-violet-light: #b543d7;
  --color-gold: #f3bf38;
  --color-white: #ffffff;

  --color-panel: #050b2f;
  --color-panel-deep: #030720;
}
```

Use utility classes like:

- `bg-midnight-blue`
- `text-seafoam-green`
- `border-main-blue/40`
- `font-heading`
- `font-body`
- `font-mono-display`

---

## Accessibility

Maintain the futuristic visual style while preserving accessibility.

Rules:

- Text must remain readable against dark backgrounds.
- Avoid using neon glow as the only indicator of state.
- Buttons and links need visible focus states.
- Interactive elements need accessible labels.
- Tables should use semantic table markup where appropriate.
- Decorative background images should use empty `alt=""`.
- Important images, charts, or diagrams should include meaningful alt text.
- Do not put critical text directly into images.

Minimum recommendations:

- Body text should generally be `text-white/70` or brighter.
- Small muted text should not go below `text-white/45`.
- Primary CTAs should have strong contrast.
- Focus states should use visible rings.

---

## Motion and Interaction

Motion should feel subtle, tactical, and interface-driven.

Use motion for:

- Soft card hover glow
- Button brightness changes
- Slider transitions
- Section fade-ins
- Background parallax if performant
- Small icon pulse effects for active states

Avoid:

- Bouncy animations
- Overly playful easing
- Excessive motion on data tables
- Slow transitions that make the app feel heavy

Recommended transition timing:

| Use Case | Timing |
| --- | --- |
| Fast UI | `150ms` |
| Standard hover | `200ms` |
| Section reveal | `400ms` to `700ms` |

Recommended easing:

- `ease-out`
- `ease-in-out`

---

## Responsive Behavior

The design should be fully responsive.

### Mobile

- Stack system overview cards vertically.
- Use horizontal scroll for complex matrices only when necessary.
- Keep hero text large but readable.
- Reduce section padding.
- Use compact buttons.
- Avoid tiny table text where possible.

### Tablet

- Use two-column card grids.
- Keep matrices readable with responsive wrappers.
- Use simplified flow connectors.

### Desktop

- Use full matrix layouts.
- Use horizontal system overview flow.
- Allow more atmospheric spacing.
- Use larger display typography.

---

## Implementation Rules for Codex

When building UI from this design system:

1. Prefer reusable components over one-off styling.
2. Use the colors, fonts, assets, and icon set defined here.
3. Match the mockup mood closely: dark, futuristic, neon, structured.
4. Avoid generic SaaS components unless restyled into the HUD system.
5. Use semantic HTML.
6. Use TypeScript types for component props.
7. Keep components small and composable.
8. Use Tailwind utility classes for styling.
9. Use CSS variables/theme tokens for brand colors.
10. Use the uploaded design assets instead of recreating them from scratch.
11. Use shadcn only for accessible primitives and owned source components; wrap/restyle it before app use.
12. Do not introduce unrelated colors, fonts, or icon styles.
13. Preserve accessibility and responsive behavior.
14. Use gradients and glow effects intentionally, not everywhere.
15. Favor clean readability over excessive decoration.
16. For admin views, keep the branded command-center style but prioritize usability.

---

## Design References

Primary visual references:

- `design/mockup--less-details.jpg`
- `design/mockup--more-details.jpg`

Primary production assets:

- `design/assets/images/bg-hero.jpg`
- `design/assets/images/bg-footer.jpg`
- `design/assets/images/bg-footer-top.jpg`
- `design/assets/images/bg-footer-bottom.png`
- `design/assets/images/logo-ticker-tactix-2026.png`
- `design/assets/images/logo-ticker-tactix-alien.png`
- `design/assets/icons/react/*`
- `design/assets/icons/svg/*`

The mockups should be treated as the visual north star. The final implementation does not need to match every pixel exactly, but it should preserve the same brand atmosphere, hierarchy, layout rhythm, and component language.
