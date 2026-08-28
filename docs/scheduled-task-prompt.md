# Replacement prompt for the blog scheduled task

Paste this over the existing task prompt on claude.ai. The research brief is
unchanged — only the output contract is different. It now writes publish-ready
MDX into the repo instead of bare `.md` files delivered as attachments.

---

Research the past week's news (roughly the last 7 days) in these areas: Software
Engineering, Full Stack Web Development, AI/ML, and Puerto Rico (tech/business/
economy news relevant to Puerto Rico). Use web search to find notable, recent,
relevant stories, launches, trends, or discussions in each area.

Then write three full blog post drafts, each based on a different notable news
item you found (prioritize a mix across the topic areas rather than three posts
on the same story). Each article should be a complete, well-structured,
medium-length blog post of roughly 800-1200 words: a short intro that hooks the
reader, well-organized body sections with subheadings, and a brief conclusion or
takeaway.

## Where the files go

Clone `jorgeortiz41/portfolio`. Write each article to
`content/posts/<YYYY-MM-DD>-<kebab-slug>.mdx`, where the date is today's date and
the slug is derived from the title. Read `src/lib/schema.ts` first and match
`postFrontmatterSchema` field for field.

Each file must open with YAML frontmatter:

```yaml
---
title: "The article's title"
date: "2026-08-28" # must equal the filename's date prefix
summary: "One or two sentences, under 300 characters. Shown on the index."
topic: software-engineering # exactly one of: software-engineering | web | ai-ml | puerto-rico
tags: [kebab-case, three-to-five]
sources: # at least one, required
  - title: "Headline of the article you based this on"
    url: "https://..."
    publisher: "Publication name"
generatedAt: "2026-08-28T07:00:00Z"
draft: false
---
```

## Rules for the body

These are enforced by the build. A file that breaks one of them fails CI.

- **No `# H1`.** The page renders the title from frontmatter; an H1 duplicates it
  on screen and gives the document two competing top-level headings.
- **No `**Source:**` line at the end.** Citations go in the `sources` frontmatter
  array, where they render as real links.
- **Name every `##` heading after what that section actually says.** Never emit a
  heading that restates an instruction from this prompt. A section called
  "A Compelling Hook" is a bug, not a heading.
- Leave a blank line after the closing `---` of the frontmatter.

## Delivering

Push branch `posts/<YYYY-MM-DD>` and open a pull request against `main`. **Do not
push to `main` directly.** CI runs typecheck, lint, format and build on the PR,
and the content schema fails the build on a malformed post — so a bad generation
shows up as a red check rather than a broken site.

In your reply, list the three article titles and which topic and news item each
is based on, and link the PR.

---

## If the task cannot push to GitHub

If the scheduled task has no write access to the repo, keep the existing
`SendUserFile` delivery but still write the files in the MDX format above. Then
locally:

```bash
# drop the three .mdx files into blogs/, then:
bun run ingest          # validates them, reports anything malformed
bun run ingest --write  # moves the ones that pass into content/posts/
```
