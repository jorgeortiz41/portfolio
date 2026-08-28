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

## The Wire (`/wire`)

Posts written by a scheduled Claude agent — researched, drafted, committed and
opened as a PR without a human in the loop. The section says so plainly: the
point is not the writing, it is that the pipeline runs unattended. A human only
merges.

Posts live in `content/posts/<YYYY-MM-DD>-<slug>.mdx`. The date prefix is part
of the filename because the generator used to emit `blog-post-1.md` every run
and collide with itself.

```yaml
---
title: "When the Robots Broke GitHub: Inside the August 17 Outage"
date: "2026-08-21" # must match the filename's date prefix
summary: "One or two sentences. Shown on the index and as the meta description."
topic: software-engineering # | web | ai-ml | puerto-rico  (drives the accent hue)
tags: [github, infrastructure]
sources: # at least one — required
  - title: "GitHub outage disrupts developers worldwide"
    url: "https://www.geekwire.com/..."
    publisher: "GeekWire"
draft: false # true renders in `next dev`, never in production
---
```

Validation is stricter here than for case studies, because nobody proofreads a
file before it ships. Beyond the frontmatter schema, the loader rejects a body
containing an `# H1` (the page renders the title), a trailing `**Source:**` line
(citations belong in frontmatter), or an instruction-echo heading such as
`## A Compelling Hook` — all three are mistakes real generated files made.

Getting agent output in:

```bash
bun run ingest          # validate whatever is sitting in blogs/
bun run ingest --write  # move the files that pass into content/posts/
```

`blogs/` is a gitignored drop-zone for the fallback path, when files arrive as
chat attachments rather than as a pull request. `ingest` never invents
frontmatter — a file without it is reported, not guessed at.

The prompt the scheduled agent runs on is kept in
[`docs/scheduled-task-prompt.md`](docs/scheduled-task-prompt.md) — the canonical
copy, since the task itself lives on claude.ai and can drift.

## The companion (`/api/chat` + `src/components/companion/`)

A 16x16 pixel sprite paces the bottom of every page, drops route-aware quips,
and opens into a chat that answers as Jorge.

**The split that makes it safe to put in front of a recruiter.** Facts and
personality come from different places, and the model is not allowed to mix
them:

|          | Source                      | Rule                                                                                |
| -------- | --------------------------- | ----------------------------------------------------------------------------------- |
| Facts    | `src/lib/chat/knowledge.ts` | Assembled from the site's own content. The model may phrase and connect, never add. |
| Opinions | `src/data/persona.ts`       | Hand-written, flagged in the prompt as flavour. Edit freely — it is the character.  |

The dossier ends by declaring itself closed: anything not in it is unknown, and
the correct answer is to say so. That is the same rule ARGUS runs on, which
feels appropriate.

**No retrieval, deliberately.** The whole corpus — bio, six roles, seven case
studies with full bodies, the post index — is ~4,600 words / ~7.5k tokens. It
fits in one system prompt with room to spare, and that prompt is byte-identical
for every visitor, so it is a cache read after the first request of each window.
Embeddings and a vector store would add three moving parts, a second failure
mode, and worse answers, since chunking loses the argument that makes a case
study worth reading. Revisit if the corpus triples.

**Cost control.** `src/lib/chat/budget.ts` gives each visitor a rolling token
allowance and the process a daily ceiling. Spend it and the sprite falls asleep
and the input locks, in character, rather than erroring. It is in-memory, so on
Vercel it is per-instance and resets on a cold start — a real guard against
ordinary traffic, explicitly not a security control. Swapping in a shared store
is a change to that one file.

**Quips never hit the API.** They are local strings in `persona.ts`. An ambient
bubble has to be free and instant; a visible pause before a joke is not a joke.

**Editing the sprite** means editing `src/components/companion/sprite.ts`, which
is ASCII art — sixteen strings of sixteen characters per state, each character
mapped to a theme token, so it inverts correctly between light and dark with no
second asset. A dev-only assert rejects a frame with the wrong dimensions or an
unmapped character, because a mistyped character is otherwise skipped silently.

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

Seven effects run here, and each owns exactly one zone so they never compete:

| Effect                    | Owns                      |
| ------------------------- | ------------------------- |
| Decode / scramble         | Hero, first ~700ms        |
| Node-graph canvas         | Hero background only      |
| Kinetic variable type     | Display-size text         |
| Cursor-following previews | Project index rows        |
| Pixel companion           | Bottom edge of every page |
| View Transitions          | Navigation between routes |
| Per-project accent        | Colour, everywhere        |

Two rules keep this affordable:

**One driver each.** `ScrollDriver` runs the only scroll loop and writes a
single number (`--scroll-v`) that CSS consumes; `PointerProvider` runs the only
`pointermove` listener and the only pointer rAF loop. The magnetic cursor,
cursor previews and node graph all subscribe to it. Verified: zero additional
`pointermove` or `scroll` listeners register across four navigations.

`ScrollDriver` also hands out the signed per-frame delta via `subscribeScroll`,
for the one consumer that needs scroll in JS rather than CSS — the companion,
which walks in the direction you scroll and so needs a sign that `--scroll-v`
deliberately discards. Note that it _polls_ `scrollY` instead of listening for
`scroll`, which turns out to be load-bearing rather than incidental: some
embedded and automated browsers scroll the document without ever dispatching a
`scroll` event to `window`, and a listener-based version silently does nothing.

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
src/app/          routes — all server components, plus api/chat
src/components/   ui/ · motion/ · kinetic/ · hero/ · work/ · intern/ · mdx/ · companion/
src/lib/          content, schema, accent, capabilities, site config, chat/
src/data/         experience, skills, bio and persona (typed modules)
content/projects/ case studies (.mdx)
content/posts/    agent-written posts (.mdx)
scripts/          ingest-posts.ts
```

Client islands are limited to: theme toggle, index filter, the motion
components and the companion. Everything else renders on the server.

## Environment

`NEXT_PUBLIC_SITE_URL` sets the absolute origin for `metadataBase`, the sitemap
and OG image URLs. On Vercel it falls back to
`VERCEL_PROJECT_PRODUCTION_URL`, and to `http://localhost:3000` locally.

`ANTHROPIC_API_KEY` powers the companion's chat. It is optional: without it the
build succeeds, the sprite still walks and the local quips still fire, and the
chat answers in character that its brain is unplugged. `CHAT_MODEL` overrides
the default model. See `.env.example`.
