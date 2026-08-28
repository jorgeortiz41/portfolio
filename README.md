# jorgeortiz.dev — portfolio

A portfolio built around case studies rather than screenshots. Every project is
one MDX file; adding a file makes it appear on the index, in the sitemap, at its
own route, with its own accent colour and its own social card — no code change.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · MDX · Bun

## Getting started

Requires Node 20.9+ and [Bun](https://bun.sh) 1.4.

```bash
bun install
bun run dev
```

| Script              |                      |
| ------------------- | -------------------- |
| `bun run dev`       | Dev server on :3000  |
| `bun run build`     | Production build     |
| `bun run typecheck` | `tsc --noEmit`       |
| `bun run lint`      | ESLint (flat config) |
| `bun run format`    | Prettier             |

CI runs typecheck, lint, format:check and build on every PR.

## Deployment

Vercel builds this with Bun automatically — it detects `bun.lock` and runs
`bun install` then `bun run build`. No configuration needed.

**The lockfile is deliberately `lockfileVersion: 1`.** Vercel's build image
currently ships Bun 1.3.14, which cannot parse the version 2 format that Bun
1.4 writes:

```
error: Unknown lockfile version
UnknownLockfileVersion: failed to parse lockfile: 'bun.lock'
warn: Ignoring lockfile
```

The build still succeeds when that happens, which is what makes it easy to
miss — but Vercel resolves every dependency fresh, so the lockfile stops
pinning anything and production can drift from what was tested locally.

Bun 1.4 reads and _preserves_ a v1 lockfile through both `bun install` and
`bun add`, so this needs no ongoing maintenance. But do not regenerate the
lockfile from scratch with Bun 1.4 (`rm bun.lock && bun install`) — that writes
v2 and silently reintroduces the problem. If it needs regenerating, use Bun
1.3.x, or check the deploy log for the warning above afterwards.

Revisit once Vercel's build image ships Bun 1.4+.

## Adding a project

Create `content/projects/<slug>.mdx`. The filename is the URL.

```mdx
---
title: Project Name
tagline: One line of outcome language — what changed because this exists.
role: Sole engineer
period: "2026" # quote bare years, or YAML parses them as numbers
accent: 38 # hue in degrees, 0-360 — NOT a hex colour
featured: true # surfaces on the homepage
order: 1 # lower sorts first
stack: [Python, FastAPI]
summary: >-
  Used for search results and the social card.
metrics: # optional, max 4
  - label: OSINT sources
    value: "14"
links: # optional
  live: https://example.com
  repo: https://github.com/...
cover: # optional
  src: /cover.webp
  alt: Describe the image
  width: 1200
  height: 630
---

## Context

## Problem

## Approach

## Architecture

## Impact

## What I'd do differently
```

Frontmatter is validated with Zod at build time (`src/lib/schema.ts`). A missing
or malformed field **fails the build** with a message naming the file and field,
rather than rendering a half-blank card.

Keep the six headings. Recruiters scan for the problem → approach → impact
chain, and a consistent shape is what makes several case studies comparable.

## How the accent system works

A project declares **one hue**, never a colour. Lightness and chroma are held
per theme in `globals.css`, and the accent is composed as:

```css
oklch(var(--accent-l) var(--accent-c) var(--accent-h))
```

That guarantees legibility in both themes by construction. Measured across all
36 hue steps, worst-case contrast against the background is **5.26:1 in light**
and **9.64:1 in dark** — so any hue from 0 to 360 passes WCAG AA. A hardcoded
hex could not make that promise, because the background flips and the hex does
not.

Do not raise `--accent-l` in the light theme without re-running that sweep; at
0.52 the worst hue drops to 4.49:1 and fails.

`accentHex()` in `src/lib/accent.ts` converts the same hue to sRGB for the OG
images, since Satori cannot parse `oklch()`. It is verified byte-exact against
the browser's own conversion.

## Motion

Six effects run here, and each owns exactly one zone so they never compete:

| Effect                    | Owns                      |
| ------------------------- | ------------------------- |
| Decode / scramble         | Hero, first ~700ms        |
| Node-graph canvas         | Hero background only      |
| Kinetic variable type     | Display-size text         |
| Cursor-following previews | Project index rows        |
| View Transitions          | Navigation between routes |
| Per-project accent        | Colour, everywhere        |

Two rules keep this affordable:

**One driver each.** `ScrollDriver` runs the only scroll loop and writes a
single number (`--scroll-v`) that CSS consumes; `PointerProvider` runs the only
`pointermove` listener and the only pointer rAF loop. The magnetic cursor,
cursor previews and node graph all subscribe to it. Verified: zero additional
`pointermove` or `scroll` listeners register across four navigations.

**One ladder.** `src/lib/capabilities.ts` centralises every switch-off —
reduced motion, coarse pointer, low-power device — so no component invents its
own rule.

### Two constraints worth knowing before you edit motion

- **The hero animates weight only, never width.** `wght` 400→740 holds the
  headline at a constant height; `wdth` reflows it from 4 lines to 3 even at a
  6% delta, which would relayout the whole page on every frame of a fast scroll.
  The width axis is only safe on single-line display text.
- **`ScrambleText` renders the final text server-side** and scrambles _from_ it,
  never the reverse — otherwise crawlers index gibberish. It also carries a
  wall-clock deadline that force-completes the reveal, because `requestAnimation
Frame` is paused in background tabs and would otherwise leave the headline
  frozen mid-garble.

## Layout

```
src/app/          routes — all server components
src/components/   ui/ · motion/ · kinetic/ · hero/ · work/ · mdx/
src/lib/          content, schema, accent, capabilities, site config
src/data/         experience and skills (typed modules)
content/projects/ case studies (.mdx)
```

Client islands are limited to: theme toggle, index filter, and the motion
components. Everything else renders on the server.

## Environment

`NEXT_PUBLIC_SITE_URL` sets the absolute origin for `metadataBase`, the sitemap
and OG image URLs. On Vercel it falls back to
`VERCEL_PROJECT_PRODUCTION_URL`, and to `http://localhost:3000` locally.
