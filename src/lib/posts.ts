import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";

import {
  postFrontmatterSchema,
  TOPIC_ACCENT,
  type Post,
  type PostSummary,
  type PostTopic,
} from "@/lib/schema";

const CONTENT_DIR = path.join(process.cwd(), "content", "posts");

/** `2026-08-28-some-title.mdx` -> `some-title`. */
const FILENAME = /^(\d{4}-\d{2}-\d{2})-([a-z0-9-]+)\.mdx$/;

/**
 * Body rules the frontmatter schema cannot express.
 *
 * Both of these are defects observed in real generated files, not hypotheticals.
 * A build error is the only thing that reliably stops a generator repeating a
 * mistake, since nobody reads the file before it ships.
 */
function checkBody(filename: string, body: string): string[] {
  const problems: string[] = [];

  // The page renders the title from frontmatter. An H1 in the body duplicates
  // it on screen and gives the document two competing top-level headings.
  const h1 = body.match(/^#\s+\S.*$/m);
  if (h1) {
    problems.push(
      `body contains an "# H1" (${h1[0].trim()}) — the title comes from frontmatter, so remove it`,
    );
  }

  // The generator has promoted its own instructions into section headings
  // ("a short intro hook" -> "## A Compelling Hook"). Headings must describe
  // the section's content, never restate the brief.
  const echo = body.match(/^#{2,3}\s*(?:a\s+)?(?:compelling\s+)?hook\s*$/im);
  if (echo) {
    problems.push(
      `body contains the instruction-echo heading "${echo[0].trim()}" — name headings after what the section says`,
    );
  }

  // Sources belong in frontmatter so they render as real links, not as a line
  // of bold markdown formatted differently on every run.
  const trailing = body.match(/^\s*\*\*Sources?:\*\*/im);
  if (trailing) {
    problems.push(
      `body ends with a "${trailing[0].trim()}" line — move those citations into the "sources" frontmatter array`,
    );
  }

  return problems;
}

function readPostFile(filename: string): Post {
  const named = FILENAME.exec(filename);
  if (!named) {
    throw new Error(
      `Bad post filename content/posts/${filename} — expected YYYY-MM-DD-kebab-slug.mdx`,
    );
  }
  const [, filenameDate, slug] = named as unknown as [string, string, string];

  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  const parsed = postFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    // Fail loudly at build time rather than rendering a half-blank post.
    throw new Error(
      `Invalid frontmatter in content/posts/${filename}:\n` +
        parsed.error.issues
          .map((i) => `  • ${i.path.join(".") || "(root)"}: ${i.message}`)
          .join("\n"),
    );
  }

  // A filename that disagrees with the frontmatter means the URL and the
  // rendered dateline say different things. Cheap to check, confusing to hit.
  if (parsed.data.date !== filenameDate) {
    throw new Error(
      `content/posts/${filename} is dated ${filenameDate} in its filename but ${parsed.data.date} in its frontmatter — they must match.`,
    );
  }

  const problems = checkBody(filename, content);
  if (problems.length > 0) {
    throw new Error(
      `Invalid body in content/posts/${filename}:\n` +
        problems.map((p) => `  • ${p}`).join("\n"),
    );
  }

  return { ...parsed.data, slug, body: content };
}

/**
 * Cached for the request/render pass: the index, the sitemap, the RSS feed and
 * every generateStaticParams all read the same directory, and posts arrive at
 * roughly 150 a year rather than the seven case studies.
 */
const readAll = cache((): Post[] => {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const posts = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map(readPostFile)
    // Newest first — a dated publication reads in reverse chronological order.
    .sort(
      (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
    );

  const seen = new Map<string, string>();
  for (const post of posts) {
    const clash = seen.get(post.slug);
    if (clash) {
      throw new Error(
        `Duplicate post slug "${post.slug}" in content/posts (${clash} and ${post.date}). Slugs must be unique.`,
      );
    }
    seen.set(post.slug, post.date);
  }

  return posts;
});

/**
 * Drafts stay visible in `next dev` so a post can be reviewed before it ships,
 * and disappear from production builds.
 */
function isVisible(post: Post): boolean {
  return !post.draft || process.env.NODE_ENV !== "production";
}

/** Listings: everything but the MDX body. */
export function getAllPosts(): PostSummary[] {
  return readAll()
    .filter(isVisible)
    .map(({ body: _body, ...rest }) => rest);
}

export function getPost(slug: string): Post | undefined {
  return readAll()
    .filter(isVisible)
    .find((p) => p.slug === slug);
}

export function getPostSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

/** Topics actually in use, most-used first — drives the index filter. */
export function getPostTopics(): PostTopic[] {
  const counts = new Map<PostTopic, number>();
  for (const post of getAllPosts()) {
    counts.set(post.topic, (counts.get(post.topic) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([topic]) => topic);
}

export function topicAccent(topic: PostTopic): number {
  return TOPIC_ACCENT[topic];
}
