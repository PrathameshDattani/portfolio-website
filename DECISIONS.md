# Design & build decisions

## Direction: "Night race, cinematic" (v2 redesign)
The first build leaned on literal F1 decoration: skewed labels, DRS tags, tyre badges, typing radio bubbles, gauges and cartoon SVGs. It read as gimmicky. v2 keeps the race-weekend metaphor in the copy and in a few signature moments, and otherwise follows editorial / award-site conventions:

- **Type:** Archivo on its variable *width* axis (`wdth 125`) for wide motorsport display type, Geist for body, Geist Mono for data and labels.
- **Palette:** near-black, off-white and one accent (the livery colour), used sparingly. The timing colours (purple, green, yellow) only appear as small functional cues.
- **Layout:** large type, hairline rules and generous space, with no boxed cards.

## Signature pieces
- **Hero night track** (`components/hero/night-track.ts`): raw three.js, dynamically imported. It renders wet tarmac with floodlight pools, kerbs, taillight streaks of the cars ahead, trackside floodlights, mirrored reflections in the wet surface, plus bloom and a lens pass (chromatic aberration, vignette, grain). The scene pauses off-screen and in hidden tabs. Under reduced motion it renders one still frame.
- **Start lights**: the gantry hangs *over the live track*. When the lights go out, the camera launches (speed ramp + FOV kick) and the name reveals. The km/h readout comes straight from the scene's speed. Plays once per session and is skippable with Esc.
- **Aerial circuit renders** (`components/track/TrackRender.tsx`): a canvas 2D "night aerial" of each procedurally generated circuit. Mown grass, run-off, gravel on corner exits, kerbs only where curvature is high, white lines, start grid, garages, grandstands and floodlight pools. The car brakes into corners and leaves a light trail.
- **Motion system**: masked word reveals, scroll-scrubbed statement text, magnetic buttons with a text-roll hover, a custom cursor (fine pointers only), a curtain page transition carrying the destination's name, and a marquee.

## Removed in v2
GSAP, the car-schematic SVG, the helmet illustration, gauges, tyre badges, sector bars, the timing tower, radio bubbles, livery cards and skewed labels.

## Scope (unchanged)
- **Not built:** the blog (Phase 7) and sound. MDX race reports are not wired up either; reports render from `projects.ts`.
- **3D:** the hero itself now uses WebGL (always on, lazy). The plan's optional 3D car/helmet (`enable3D`) is not built.
- **Contact:** `/api/contact` validates, rate-limits and logs messages. Set `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT` for Formspree or similar.

## Known gaps
- **JS budget:** first-load JS is about 155 to 200 KB gzip, mostly Framer Motion. three.js loads separately, only on the home page.
- **No photography:** the site has no real photos yet. A real portrait (`profileImage`) and project screenshots (`media[]`) would add the most realism from here.
