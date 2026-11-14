# F1-themed developer portfolio

A motorsport-inspired portfolio built with Next.js 15, Tailwind CSS v4, Framer Motion and GSAP. The site is a race weekend and you are the driver.

| Route | Section |
|---|---|
| `/` | Starting Grid: lights-out intro, hero, stats, featured projects |
| `/driver` | Driver Profile: about, stats, education |
| `/races` and `/races/[slug]` | Race Calendar and Race Reports: projects |
| `/seasons` | Career Seasons: experience |
| `/garage` | Garage: skills on an interactive car |
| `/podium` | Trophy Cabinet: achievements and publications |
| `/pit-wall` | Pit Wall Radio: contact form |

## Run it

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build && pnpm start
```

If `pnpm` isn't installed, `npx pnpm@9 <command>` works too.

## Fill in your content

Every piece of personal data lives in `/content`. Components never hardcode it. Replace the sample entries:

| File | What goes in it |
|---|---|
| `content/profile.ts` | Name, 3-letter code, driver number, role, team name, location, tagline, bios, stats, interests, highlights, availability, timezone |
| `content/socials.ts` | Email, GitHub, LinkedIn, X, other links |
| `content/projects.ts` | Projects. `round` sets the order, `featured: true` puts up to 3 on the home page, `circuitSeed` picks the generated track shape |
| `content/experience.ts` | Roles, newest first. `color` is the team's livery colour |
| `content/education.ts` | Education ("Junior Formulae") |
| `content/skills.ts` | Skills. `zone` places them on the car, `tyre` is the level (see the legend on `/garage`), `proficiency` runs 0 to 100 |
| `content/achievements.ts` | Achievements. Mark three as `featured` for the podium |
| `content/publications.ts` | Optional. Leave the array empty to hide the section |
| `content/theme.ts` | Your livery colour (`livery`) and secondary accent |
| `content/site.ts` | Site URL, analytics and feature flags |

Files:
- **Resume:** replace `public/resume.pdf`.
- **Photo:** add `public/images/profile.jpg` and set `profileImage: "/images/profile.jpg"`. Without one, an original helmet illustration is shown.
- **Project media:** set `archDiagram` and `media[]` on a project. Those sections stay hidden until set.

## Feature flags (`content/site.ts`)

| Flag | Default | Effect |
|---|---|---|
| `enableIntroLights` | `true` | Five-light start sequence on first visit per session |
| `enableEasterEgg` | `true` | Type `box box` anywhere for a pit stop |
| `showDisclaimer` | `true` | Fan-made disclaimer in the footer |
| `enableBlog` | `false` | Adds the Paddock nav link (blog not yet built) |
| `enable3D`, `enableSound` | `false` | Reserved, not yet built |

Analytics: set `analyticsId` to your Plausible domain.

## Contact form

The form posts to `/api/contact` by default. That route validates and logs messages; add an email provider (e.g. Resend) at the `TODO` in `app/api/contact/route.ts`.

To use Formspree or another service instead, copy `.env.example` to `.env.local` and set:

```
NEXT_PUBLIC_CONTACT_FORM_ENDPOINT=https://formspree.io/f/yourid
```

## Tests

```bash
pnpm build
npx playwright install chromium   # first time only
pnpm test
```

The smoke tests check that every route returns 200 with one `h1`, the 404 page, the intro skip and the form. The a11y tests run axe on every route.

## Deploy (Vercel)

1. Push the repo to GitHub and import it in Vercel. It detects Next.js automatically.
2. Set `url` in `content/site.ts` to your domain. Sitemap, robots, OG image and JSON-LD all use it.
3. Add `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT` in Vercel's environment variables if you use an external form service.

## Legal

This is an original, fan-made, motorsport-inspired design. It uses no official F1 logos, fonts, team liveries or driver likenesses, and every circuit is procedurally generated. The footer disclaimer stays on by default.

See `DECISIONS.md` for design choices and known gaps.
