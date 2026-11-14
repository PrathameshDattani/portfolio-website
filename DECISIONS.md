# Design & build decisions

Decisions not fully specified in `plan.md`, made to fit "premium broadcast telemetry".

## Design
- **Display font: Titillium Web** (over Orbitron). Wide and technical without the sci-fi feel; it also has true italics for the speed-skewed headings.
- **Body: Inter. Data: JetBrains Mono** with tabular numerals everywhere numbers change.
- **`--livery-ink`**: a lighter, mixed version of the livery colour used for *small* text. Pure `#E10600` on near-black falls below 4.5:1 contrast, so it is only used for large text, fills and accents.
- **Film grain** overlay at 3.5% opacity adds depth to the flat dark surfaces. It is hidden under reduced motion.
- **Podium colours**: P2 and P3 use neutral silver (`#C9CBD1`) and bronze (`#C7884A`). The plan's palette had no tokens for them.
- **Proficiency colours** follow timing-screen semantics: ≥85 purple (best), ≥65 green, otherwise yellow.
- **Architecture diagram and gallery sections are hidden** when a project has no media, rather than showing an empty placeholder box.
- **Status flags**: Shipped = chequered, Finished = green, In progress = yellow. The flag swatch always comes with a text label.

## Motion
- **Lenis smooth scrolling** (not in the plan) gives the "super smooth" feel. It is disabled under `prefers-reduced-motion`.
- The **page wipe** reveals the new page: a dark panel trailed by livery stripes sweeps off-screen. The page wrapper only fades; it never transforms, so fixed overlays inside pages keep working.
- The **start lights** step at 700 ms per light, followed by a random 0.5 to 1.2 s hold. A blocking inline script hides the overlay before paint when the intro was already seen this session, so there is no flash.
- **Hero "Live timing" panel**: the car laps an original circuit generated from the driver number. Speed, gear and throttle readouts are written straight to the DOM every frame, with no React re-renders.
- Circuit cars only animate while visible (IntersectionObserver). On cards they accelerate and brake smoothly on hover.
- **GSAP + ScrollTrigger** are dynamically imported, and only on pages that use them (telemetry chart, seasons timeline).

## Scope
- **Phase 6** (3D hero, sound) is not built. `enable3D` and `enableSound` stay `false`.
- **Phase 7** (blog) is not built. `enableBlog` is `false`, and turning it on only adds the nav link. The `/paddock` route still needs the MDX pipeline.
- **Race report MDX** (`content/races/*.mdx`) is not wired up. Race reports render from `projects.ts` fields.
- **Contact**: the built-in `/api/contact` route validates, rate-limits (5 per 10 minutes per IP, in memory) and logs messages. Setting `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT` (e.g. Formspree) sends the form there instead. The client also enforces a 60 s cooldown.
- **`/dev/components`** showcase returns 404 in production builds.

## Known gaps
- **JS budget**: first-load JS is about 155 to 200 KB (gzip), above the 150 KB target. Most of it is Framer Motion. Moving to `LazyMotion` + `m` components would be the next step.
- `next lint` is deprecated in Next 15.5, but it still works.
