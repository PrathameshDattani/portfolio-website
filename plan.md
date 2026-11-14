# plan.md — F1-Themed Developer Portfolio

> **For Claude Code:** This file is the single source of truth for building the site. Read the whole plan before you write any code. Build in the order given in §12 (Build Phases), and finish each phase's acceptance checklist before you start the next. Every `{{PLACEHOLDER}}` is content the owner will fill in later. Do **not** invent real data for them. Keep them in `content/*.ts` files so the owner can edit them in one place.

---

## 0. Placeholder Index (owner fills these)

All personal content lives in `/content`. Components never hardcode personal data.

| Placeholder | Where it lives | Notes |
|---|---|---|
| `{{FULL_NAME}}` | `content/profile.ts` | Shown as the "driver name" |
| `{{SHORT_NAME}}` | `content/profile.ts` | 3-letter driver code, e.g. `ABC` |
| `{{DRIVER_NUMBER}}` | `content/profile.ts` | Personal "race number" (1–99) |
| `{{TAGLINE}}` | `content/profile.ts` | One-liner under the hero |
| `{{ROLE_TITLE}}` | `content/profile.ts` | e.g. "Software Engineer" |
| `{{LOCATION}}` | `content/profile.ts` | Shown as "Home Circuit" |
| `{{BIO_SHORT}}` / `{{BIO_LONG}}` | `content/profile.ts` | About page |
| `{{PROFILE_IMAGE}}` | `public/images/profile.*` | Helmet-visor framed portrait |
| `{{RESUME_PDF}}` | `public/resume.pdf` | Download button |
| `{{EMAIL}}`, `{{GITHUB_URL}}`, `{{LINKEDIN_URL}}`, `{{X_URL}}`, `{{OTHER_LINKS}}` | `content/socials.ts` | |
| `{{PROJECTS[]}}` | `content/projects.ts` | Schema in §6 |
| `{{EXPERIENCE[]}}` | `content/experience.ts` | Schema in §6 |
| `{{EDUCATION[]}}` | `content/education.ts` | Schema in §6 |
| `{{SKILLS[]}}` | `content/skills.ts` | Schema in §6 |
| `{{ACHIEVEMENTS[]}}` | `content/achievements.ts` | Schema in §6 |
| `{{PUBLICATIONS[]}}` | `content/publications.ts` | Optional |
| `{{BLOG_POSTS}}` | `content/blog/*.mdx` | Optional |
| `{{TEAM_NAME}}` | `content/profile.ts` | Your personal "constructor" brand name |
| `{{PRIMARY_LIVERY_COLOR}}` | `content/theme.ts` | Overrides the default accent |
| `{{SITE_URL}}`, `{{OG_IMAGE}}`, `{{ANALYTICS_ID}}` | `content/site.ts` | SEO and analytics |
| `{{CONTACT_FORM_ENDPOINT}}` | `.env.local` | Formspree, Resend or a custom endpoint |

Seed every content file with **2–3 clearly fake sample entries** (e.g. "Sample Project Alpha") so the UI renders fully while the owner fills in real data.

---

## 1. Concept & Creative Direction

**Core metaphor:** the portfolio is a race weekend, and the owner is the driver.

| Real section | F1 metaphor | Route |
|---|---|---|
| Landing / Hero | **Starting Grid**: five red lights, then lights out | `/` |
| About | **Driver Profile**: helmet, number, stats card | `/driver` |
| Projects | **Race Calendar**: each project is a Grand Prix | `/races` |
| Project detail | **Race Report**: circuit map, telemetry, debrief | `/races/[slug]` |
| Experience | **Career Seasons**: each role is a season with a team | `/seasons` |
| Skills | **Garage / Car Setup**: components and telemetry | `/garage` |
| Achievements | **Trophy Cabinet / Podium** | `/podium` |
| Blog (optional) | **Paddock Notes** | `/paddock` |
| Contact | **Pit Wall Radio**: team-radio styled form | `/pit-wall` |
| 404 | **DNF**: red flag, car in the gravel | `not-found` |
| Loading | **Formation Lap** | `loading.tsx` |

**Tone:** precise, fast, engineered. Think of a modern F1 broadcast graphics package mixed with a pit-wall telemetry screen. Avoid cartoonish racing clichés. The F1 references should feel premium and data-driven.

### ⚠️ IP / Legal guardrails (must follow)
- Do **NOT** use the official F1 logo, the "Formula 1" wordmark, the proprietary Formula1 Display font, any team logo or livery, any driver likeness, or any official broadcast graphics.
- Every livery, circuit outline and graphic must be **original**. Circuit maps should be stylised and invented, not traced from real tracks.
- Use generic motorsport language ("Grand Prix", "pit wall", "DRS", "sector") freely. These are common terms.
- Add a footer line: *"Fan-made, motorsport-inspired design. Not affiliated with Formula 1 or any team."*

---

## 2. Tech Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript (strict)** | SSG, routing, image optimisation |
| Styling | **Tailwind CSS v4** + CSS variables for tokens | Speed + themeable tokens |
| Animation | **Framer Motion** (UI) + **GSAP + ScrollTrigger** (scroll set-pieces) | |
| 3D (optional, Phase 6) | **React Three Fiber + drei** | Hero car/helmet; must lazy-load |
| Icons | **lucide-react** | |
| Content | Typed TS files in `/content`; **MDX** (`next-mdx-remote` or `@next/mdx`) for blog and race reports | |
| Forms | **react-hook-form + zod** → `{{CONTACT_FORM_ENDPOINT}}` | |
| Sound (optional) | **Howler.js**, **off by default**, with a toggle | |
| Lint/format | ESLint + Prettier | |
| Testing | Playwright smoke tests + `@axe-core/playwright` | |
| Deploy | Vercel | |

Package manager: **pnpm**.

---

## 3. Design System

### 3.1 Color tokens (`app/globals.css`, exposed to Tailwind)

```css
:root {
  --asphalt-950: #0A0A0B;   /* page background */
  --asphalt-900: #121214;   /* surfaces */
  --asphalt-800: #1C1C20;   /* cards */
  --asphalt-700: #2A2A30;   /* borders */
  --kerb-white:  #F4F4F5;   /* primary text */
  --tyre-grey:   #9CA3AF;   /* secondary text */

  --livery:      {{PRIMARY_LIVERY_COLOR}};  /* default #E10600-ish red; owner overrides */
  --livery-2:    #FF8A00;   /* secondary accent */

  /* Semantic, borrowed from timing screens */
  --sector-purple: #A855F7; /* fastest overall → "best" highlights */
  --sector-green:  #22C55E; /* personal best → success */
  --sector-yellow: #EAB308; /* warning / in progress */
  --flag-red:      #EF4444; /* errors */
  --drs-cyan:      #06B6D4; /* links / interactive */

  /* Tyre compounds → used for skill proficiency */
  --tyre-soft:   #EF4444;
  --tyre-medium: #EAB308;
  --tyre-hard:   #F4F4F5;
  --tyre-inter:  #22C55E;
  --tyre-wet:    #3B82F6;
}
```

Dark mode is the **only** mode by default. A light "Daylight Race" theme can come later as a stretch goal.

### 3.2 Typography (free fonts only)
- **Display / headings:** `Orbitron` or `Titillium Web` (bold, wide, technical). Choose one and use it everywhere.
- **Body:** `Inter` or `Barlow`.
- **Data / telemetry / numbers:** `JetBrains Mono` with `font-variant-numeric: tabular-nums`.
- Load fonts through `next/font`.
- Type scale: 12 / 14 / 16 / 20 / 24 / 32 / 48 / 72 / 96. Hero name at 96 on desktop, 48 on mobile.
- Headings: uppercase, letter-spacing `0.04em`, italic skew of `-6deg` on key display text for a sense of speed.

### 3.3 Visual language
- **Speed skew:** primary buttons and section labels use `transform: skewX(-12deg)`, with the inner text counter-skewed.
- **Livery stripes:** diagonal accent stripes (CSS gradients) on section dividers and card edges.
- **Carbon-fibre texture:** a subtle SVG pattern at 4–6% opacity on surfaces.
- **Timing-tower lists:** ranked rows with position number, colour bar, name and "gap" column.
- **Chequered flag:** only as a micro-accent (footer, completion states). Never as a large background.
- **Grid:** 12 columns, 1280px max width, 24px gutters. Section spacing 128px desktop, 80px mobile.
- **Radius:** small (4–6px). F1 graphics are sharp, not bubbly.

### 3.4 Motion principles
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` (fast out, smooth settle).
- Durations: micro 150ms, UI 300ms, set-pieces ≤ 1.2s.
- Page transitions: a horizontal "wipe" in livery colour (≈400ms), like a car passing the camera.
- **Respect `prefers-reduced-motion`:** turn off the lights sequence, parallax and the 3D scene, and replace them with fades.

---

## 4. Global Components (`/components`)

| Component | Description |
|---|---|
| `StartLights` | 5 lights fill red one by one (~1s apart), then go out. Fires `onLightsOut`. Skippable (click/Esc) and shown only on first visit per session (`sessionStorage`). |
| `NavBar` | Sticky top bar styled like a broadcast ticker. Left: `{{SHORT_NAME}}` + `{{DRIVER_NUMBER}}` badge. Links use F1 names, with the plain label on hover/tooltip ("Races · Projects"). Mobile: full-screen menu that slides in like a pit-lane panel. |
| `TimingTower` | Vertical ranked list (reused for projects, skills, achievements). |
| `TelemetryChart` | Animated SVG line/area chart that draws on scroll. |
| `SpeedometerGauge` | Radial gauge, 0–100 → proficiency. |
| `TyreBadge` | Coloured tyre chip (S/M/H/I/W) for skill level or status. |
| `SectorBar` | Three-segment progress bar, purple/green/yellow. |
| `LiveryCard` | Card with a diagonal stripe edge, carbon texture and hover lift + glow. |
| `CircuitMap` | Generates an original stylised track path from a seed or SVG; a "car dot" animates along the path. |
| `SectionHeader` | Skewed label ("SECTOR 1"), title, subtitle. |
| `RadioMessage` | Team-radio bubble: "📻 {{SHORT_NAME}}:" with a waveform animation. |
| `FlagBanner` | Toasts styled as yellow / green / red / chequered flags. |
| `PageTransition` | Livery wipe between routes. |
| `Footer` | Socials, resume link, a small chequered strip, the disclaimer, and "Last updated: {{BUILD_DATE}}" set automatically at build time. |
| `SoundToggle` | Optional engine/UI sounds, off by default. |
| `CommandPalette` (stretch) | ⌘K "Race Control" for quick navigation. |

---

## 5. Pages — Detailed Specs

### 5.1 `/` — Starting Grid (Home)
1. **Intro:** `StartLights` overlay → lights out → hero reveals with a livery wipe.
2. **Hero:**
   - Big skewed `{{FULL_NAME}}`, `{{DRIVER_NUMBER}}` as a huge outlined numeral behind it.
   - `{{ROLE_TITLE}}` · `{{TEAM_NAME}}` · `{{LOCATION}}` as a broadcast lower-third.
   - `{{TAGLINE}}` typed out like a team-radio message.
   - CTAs: **"View Race Calendar"** → `/races`, **"Download Spec Sheet"** → `{{RESUME_PDF}}`.
   - Background: subtle animated speed lines, or an optional R3F car/helmet (Phase 6).
3. **Quick Stats strip** (timing-screen style): years coding, projects shipped, internships, `{{CUSTOM_STAT}}`. All values come from `content/profile.ts → stats[]`.
4. **Featured Races:** the 3 projects with `featured: true`, shown as `LiveryCard`s.
5. **Current Season:** latest experience entry, short.
6. **Pit Wall CTA:** contact teaser.

### 5.2 `/driver` — Driver Profile (About)
- Layout like an F1 driver card: portrait inside a helmet-visor mask (`{{PROFILE_IMAGE}}`), number, 3-letter code, flag emoji for `{{LOCATION}}`.
- "Driver Stats" table: `{{STATS}}` (e.g. CGPA as "Qualifying Pace", projects as "Starts", awards as "Podiums"). Labels are configurable in content.
- `{{BIO_LONG}}` in prose.
- "Career Highlights" mini timeline.
- "Off-Track" interests: `{{INTERESTS[]}}`.
- Education rendered as "Junior Formulae" (like F2/F3 feeder series) from `education.ts`.

### 5.3 `/races` — Race Calendar (Projects)
- Header: "{{CURRENT_YEAR}} RACE CALENDAR".
- Filter chips = categories (`{{PROJECT_CATEGORIES}}`, e.g. AI/ML, Backend, DevOps, Research), styled as tyre compounds.
- View toggle: **Calendar grid** (cards, round number "R01, R02…") ↔ **Timing Tower** (ranked list).
- Each card shows round number, project name as "{{NAME}} Grand Prix", a generated mini circuit, tech stack as sponsor-style chips, status flag (🟢 Finished / 🟡 In progress / 🏁 Shipped), and links.

### 5.4 `/races/[slug]` — Race Report (Project detail)
Generated statically from `projects.ts` + optional `content/races/[slug].mdx`.
- **Hero:** circuit map with an animated car dot, "Round XX · {{PROJECT_NAME}} Grand Prix", dates, role.
- **Race Summary:** problem / solution / result.
- **Sectors:** split the story into Sector 1 (Problem & research), Sector 2 (Architecture & build), Sector 3 (Results & learnings), each with a `SectorBar` colour.
- **Telemetry:** metrics from `metrics[]` (e.g. latency, accuracy, users) as gauges/charts. Hide the block if there are no metrics.
- **Car Setup:** tech stack grouped (Engine = backend, Aero = frontend, Electronics = infra/AI).
- **Architecture diagram:** image slot `{{ARCH_DIAGRAM}}`.
- **Gallery:** screenshots/video `{{MEDIA[]}}`.
- **Post-Race Debrief:** learnings.
- Prev/Next race navigation.

### 5.5 `/seasons` — Career Seasons (Experience)
- Vertical timeline: each entry is a "season" with the team = company.
- Card: team name, an original livery colour per entry (`color` field), role as "Seat: Race Driver / Test Driver" (Intern = "Test & Reserve Driver"), dates, bullet results as "Race Results", tech chips.
- Scroll-driven: a car icon moves down the timeline track (GSAP ScrollTrigger).
- Bottom: "Championship Standings", a summary table of total stats.

### 5.6 `/garage` — Garage / Car Setup (Skills)
- Interactive top-down **original** car schematic (SVG) split into zones:
  - **Power Unit** → languages
  - **Aerodynamics** → frontend
  - **Chassis** → backend & APIs
  - **Electronics / ECU** → AI/ML & agents
  - **Pit Crew Tools** → DevOps, cloud, containers
  - **Data & Telemetry** → databases & vector stores
- Hovering or clicking a zone shows the skills panel: name, `TyreBadge` level, `SpeedometerGauge` proficiency, years used.
- Alternative "Data View" toggle: sortable timing-tower table of all skills.
- Skills come from `skills.ts`, grouped by `zone`.

### 5.7 `/podium` — Trophy Cabinet (Achievements)
- Top-3 featured achievements on a 3D-ish **podium** (P1 centre, tallest).
- Below: grid of trophies/medals (`achievements.ts`): hackathons, certifications, scholarships, publications, ranks.
- Each card shows trophy icon, event as "Grand Prix", position (P1/P2/P3/Finisher), date, link/proof.
- Optional `{{PUBLICATIONS[]}}` section styled as "Technical Regulations" documents.

### 5.8 `/paddock` — Paddock Notes (Blog, optional, Phase 7)
- MDX posts, list styled as a news ticker, reading-time shown as "Lap time".
- Post page: clean article layout, code highlighting (`shiki`), table of contents as "Sectors".
- If `ENABLE_BLOG=false` in `content/site.ts`, hide the route and nav link.

### 5.9 `/pit-wall` — Pit Wall Radio (Contact)
- Looks like a pit-wall monitor: left side shows a "live" status (availability `{{AVAILABILITY_STATUS}}`, timezone, response time).
- The form is styled as team radio. Fields: name, email, subject ("Box box / Collab / Hiring / Just saying hi"), message.
- Validate with zod. Submit → `{{CONTACT_FORM_ENDPOINT}}`. Success shows a green flag toast with the message "Copy that, message received." Failure shows a red flag.
- Direct links: email, GitHub, LinkedIn as "Radio Channels".
- Honeypot field + basic rate limiting for spam.

### 5.10 `not-found` — DNF
- Red flag animation, a car in the gravel trap (SVG), the text "DNF: This page retired from the race", and a button "Return to Pit Lane" → `/`.

### 5.11 `loading.tsx` — Formation Lap
- A car dot completes a small looping circuit outline.

---

## 6. Content Schemas (`/content/types.ts`)

```ts
export type Profile = {
  fullName: string; shortName: string; driverNumber: number;
  roleTitle: string; teamName: string; location: string;
  tagline: string; bioShort: string; bioLong: string;
  stats: { label: string; value: string | number; f1Label?: string }[];
  interests: string[];
  availability: "open" | "limited" | "closed";
};

export type Project = {
  slug: string; round: number; name: string;
  category: string[]; summary: string;
  problem: string; solution: string; result: string;
  role: string; start: string; end?: string;
  status: "finished" | "in-progress" | "shipped";
  featured?: boolean;
  stack: { engine?: string[]; aero?: string[]; electronics?: string[] };
  metrics?: { label: string; value: number; unit?: string; max?: number }[];
  links?: { github?: string; live?: string; paper?: string; demo?: string };
  media?: { src: string; alt: string; type: "image" | "video" }[];
  archDiagram?: string;
  circuitSeed?: number; // deterministic original track shape
  learnings?: string[];
};

export type Experience = {
  company: string; role: string; seat: "Race Driver" | "Test & Reserve Driver" | "Engineer";
  start: string; end?: string; location?: string;
  color: string; results: string[]; stack: string[];
};

export type Education = { institution: string; degree: string; start: string; end?: string; score?: string; notes?: string[] };

export type Skill = {
  name: string;
  zone: "power-unit" | "aero" | "chassis" | "electronics" | "pit-crew" | "telemetry";
  tyre: "soft" | "medium" | "hard" | "inter" | "wet"; // see legend in §3.1
  proficiency: number; // 0–100
  years?: number;
};

export type Achievement = {
  title: string; event: string; position?: "P1" | "P2" | "P3" | "Finisher";
  date: string; description?: string; link?: string; featured?: boolean;
};
```

**Tyre legend** (show on the Garage page): Soft = expert/daily driver, Medium = strong, Hard = solid fundamentals, Inter = currently learning, Wet = experimental.

---

## 7. Project Structure

```
/app
  layout.tsx            # fonts, NavBar, Footer, PageTransition, metadata
  page.tsx              # Starting Grid
  driver/page.tsx
  races/page.tsx
  races/[slug]/page.tsx # generateStaticParams from content
  seasons/page.tsx
  garage/page.tsx
  podium/page.tsx
  paddock/page.tsx
  paddock/[slug]/page.tsx
  pit-wall/page.tsx
  not-found.tsx
  loading.tsx
  api/contact/route.ts  # only if not using a 3rd-party endpoint
  sitemap.ts
  robots.ts
  opengraph-image.tsx   # dynamic OG: name + number on livery
/components
  /ui        (Button, Chip, Card, Toast…)
  /f1        (StartLights, TimingTower, CircuitMap, TyreBadge, SectorBar, SpeedometerGauge, TelemetryChart, RadioMessage, FlagBanner)
  /layout    (NavBar, Footer, PageTransition)
  /three     (optional R3F scene, dynamic import, ssr:false)
/content     (profile.ts, socials.ts, projects.ts, experience.ts, education.ts, skills.ts, achievements.ts, publications.ts, site.ts, theme.ts, types.ts, /races/*.mdx, /blog/*.mdx)
/lib         (circuit-generator.ts, utils.ts, motion.ts, sound.ts)
/public      (images/, resume.pdf, textures/, sounds/, favicon set)
/tests       (smoke.spec.ts, a11y.spec.ts)
```

---

## 8. Signature Interactions (the "wow" list)

1. **Lights-out intro** on first visit (skippable, reduced-motion safe).
2. **Procedural circuit generator** (`lib/circuit-generator.ts`): from `circuitSeed`, build a smooth closed spline (Catmull-Rom through ~8–12 jittered polar points) and render it as an SVG path, so every project gets a unique, original track.
3. **Car dot along path**: use `getPointAtLength`, animated on hover/scroll.
4. **Scroll-drawn telemetry lines**: `stroke-dashoffset` driven by ScrollTrigger.
5. **Livery page wipe** between routes.
6. **DRS hover**: on primary CTAs, a "DRS OPEN" flap animates and the button stretches slightly.
7. **Sector-colour feedback**: form fields show green/purple/yellow states.
8. **Easter egg**: typing `box box` anywhere triggers a pit-stop animation and a stopwatch showing the time since page load as "pit stop time".
9. **Optional 3D hero** (R3F): low-poly **original** car or helmet. Rotates slowly; mouse-parallax. Lazy-load and gate on device capability.

---

## 9. Accessibility Requirements (non-negotiable)

- WCAG 2.1 AA contrast. Check `--tyre-grey` on `--asphalt-900` in particular.
- All motion respects `prefers-reduced-motion`.
- The lights intro is skippable via keyboard and never traps focus.
- Never rely on colour alone (tyres/flags always carry a text label too).
- Semantic landmarks, one `h1` per page, skip-to-content link, visible focus rings (livery outline).
- F1 jargon must always come with the plain meaning (e.g. `aria-label="Projects"` on "Races", and a visible subtitle).
- The garage SVG must work by keyboard (zones are focusable buttons).

---

## 10. Performance Budget

- Lighthouse ≥ 95 for Performance, Accessibility, Best Practices and SEO (mobile).
- LCP < 2.0s, CLS < 0.05, initial JS < 150 KB gzipped (excluding the lazy 3D chunk).
- GSAP, R3F and Howler are dynamically imported where used.
- Images go through `next/image`, AVIF/WebP, with explicit sizes.
- Pages are fully static (SSG) except the contact API.

---

## 11. SEO & Meta

- `metadata` per page with the F1 title + plain title, e.g. "Race Calendar · Projects | {{FULL_NAME}}".
- Dynamic OG image: driver number + name on a livery background.
- JSON-LD `Person` schema from `profile.ts` + `socials.ts`.
- `sitemap.ts` and `robots.ts` built from content.
- Analytics: `{{ANALYTICS_ID}}` (Vercel Analytics or Plausible), privacy-friendly with no cookie banner needed.

---

## 12. Build Phases (execute in order)

### Phase 1: Foundation
- Scaffold Next.js + TS + Tailwind + ESLint/Prettier with pnpm.
- Design tokens, fonts, global styles, carbon texture.
- `/content` folder with types + fake seed data.
- `layout.tsx` with NavBar, Footer and an empty page shell for every route.
- ✅ *Accept:* every route renders, nav works, tokens apply, `pnpm build` passes.

### Phase 2: Core Components
- Build every `/components/f1` and `/components/ui` piece, plus `circuit-generator.ts`.
- Add a hidden `/dev/components` showcase page (excluded from sitemap; removed or guarded in production).
- ✅ *Accept:* every component renders in the showcase with reduced-motion handled.

### Phase 3: Pages
- Home → Driver → Races (+ detail) → Seasons → Garage → Podium → Pit Wall → 404/Loading.
- ✅ *Accept:* all pages render fully from seed content; no hardcoded personal data.

### Phase 4: Motion & Signature Interactions
- Lights intro, page wipe, ScrollTrigger telemetry, car-along-path, DRS hover, easter egg.
- ✅ *Accept:* smooth at 60fps on a mid-range laptop; reduced-motion fallback works.

### Phase 5: Contact, SEO, Analytics
- Form with zod + endpoint, OG image, JSON-LD, sitemap, robots, analytics.
- ✅ *Accept:* form submits successfully against the test endpoint; Lighthouse SEO = 100.

### Phase 6: Polish & Optional 3D
- R3F hero (if enabled in `site.ts → enable3D`), sound toggle, micro-interactions.
- ✅ *Accept:* 3D chunk lazy-loads and the performance budget still holds.

### Phase 7: Blog (optional)
- MDX pipeline, Paddock list/detail, shiki, ToC.

### Phase 8: QA & Deploy
- Playwright smoke test (every route returns 200 and has an h1) and axe a11y test.
- Responsive check at 360 / 768 / 1024 / 1440 / 1920.
- Deploy to Vercel; set `{{SITE_URL}}`.
- ✅ *Accept:* all tests green, Lighthouse targets met, no console errors.

---

## 13. Feature Flags (`content/site.ts`)

```ts
export const site = {
  url: "{{SITE_URL}}",
  enableIntroLights: true,
  enable3D: false,
  enableSound: false,
  enableBlog: false,
  enableEasterEgg: true,
  showDisclaimer: true,
};
```

---

## 14. Rules for Claude Code

1. Never hardcode personal info. Always read it from `/content`.
2. Keep every placeholder visible as `{{LIKE_THIS}}` or as clearly fake sample data.
3. No official F1, team or driver IP (see §1 guardrails).
4. TypeScript strict; no `any`.
5. Accessibility and reduced-motion support are required in every component, not optional.
6. Commit at the end of every phase with message `phase-N: <summary>`.
7. When a design decision isn't specified here, pick the option that best fits "premium broadcast telemetry." Note it in `DECISIONS.md` instead of asking.
8. At the end, generate a `README.md` explaining how the owner fills each placeholder, how to toggle the feature flags, and how to deploy.

---

## 15. Open Questions for the Owner (answer before or during Phase 1)

- Primary livery colour? (`{{PRIMARY_LIVERY_COLOR}}`, default red)
- Driver number and 3-letter code?
- Personal "team" brand name?
- Include the blog? Include the 3D hero? Sounds?
- Contact backend: Formspree, Resend, or a custom route?
- Custom domain?
