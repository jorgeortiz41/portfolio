import { z } from "zod";

/**
 * Frontmatter contract for a case study.
 *
 * This is the thing that makes "ready for more projects" real: a new .mdx file
 * either satisfies this schema and appears everywhere (index, sitemap, its own
 * route, its own accent, its own OG image), or it fails the build with a
 * pointed error. There is no third outcome where it renders half-blank.
 */

/**
 * A metric must be COUNTABLE.
 *
 * The panel drifted into holding descriptors — "Fully local", "K-band" — which
 * are not metrics and made the section mean something different on every
 * project. The regex enforces that a value starts with a digit, so the rule
 * cannot quietly erode as projects are added. A project with nothing countable
 * omits the panel entirely rather than padding it.
 */
export const metricSchema = z.object({
  /** Short mono label, e.g. "OSINT sources". */
  label: z.string().min(1),
  /** Must begin with a digit: "14", "0", "150", "3.2M". */
  value: z
    .string()
    .min(1)
    .regex(
      /^\d/,
      "metric values must be countable and start with a digit — descriptors belong in the stack or the body",
    ),
});

export const projectFrontmatterSchema = z.object({
  title: z.string().min(1),
  /** One line of outcome language. Shown on the index and under the title. */
  tagline: z.string().min(1).max(200),
  /** What you actually did. "Sole engineer", "Backend lead". */
  role: z.string().min(1),
  /** Free-form, e.g. "Jun — Aug 2026". */
  period: z.string().min(1),
  /**
   * Accent hue in degrees, 0-360 — never a hex. Lightness and chroma are held
   * per theme in globals.css, so any value here is legible in light and dark.
   * See the measured sweep documented above --accent-l.
   */
  accent: z.number().min(0).max(360),
  stack: z.array(z.string().min(1)).min(1),
  /** Featured projects surface on the homepage. */
  featured: z.boolean().default(false),
  /** Lower sorts first. */
  order: z.number().int(),
  summary: z.string().min(1),
  metrics: z.array(metricSchema).max(4).optional(),
  links: z
    .object({
      live: z.url().optional(),
      repo: z.url().optional(),
      demo: z.url().optional(),
    })
    .optional(),
  cover: z
    .object({
      src: z.string().min(1),
      alt: z.string().min(1),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
    })
    .optional(),
});

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
export type Metric = z.infer<typeof metricSchema>;

export type Project = ProjectFrontmatter & {
  slug: string;
  /** Raw MDX body, compiled lazily by the case-study route. */
  body: string;
};

/** Listing shape — everything except the body. */
export type ProjectSummary = Omit<Project, "body">;

/* ------------------------------------------------------------------ Posts */

/**
 * Frontmatter contract for an /intern post.
 *
 * These are written unattended by a scheduled Claude agent, three at a time,
 * three times a week — nobody proofreads the frontmatter before it lands. So
 * this schema is doing more work than the case-study one: it is the only thing
 * between a malformed generation and the live site. Every rule here exists
 * because a real generated file got it wrong.
 */

/**
 * YAML turns an unquoted `2026-08-28` into a Date, but a quoted "2026-08-28"
 * into a string — and a model writes it both ways on different runs. Normalise
 * to an ISO string first so the shape of the file cannot change the shape of
 * the parsed value.
 */
function isoDatePart(value: unknown): unknown {
  return value instanceof Date ? value.toISOString().slice(0, 10) : value;
}

function isoDateTime(value: unknown): unknown {
  return value instanceof Date ? value.toISOString() : value;
}

/**
 * Every post is a rewrite of reporting somebody else did. A post that cannot
 * name its source is a defect rather than a stylistic choice, so the citation
 * is required rather than merely encouraged.
 */
export const postSourceSchema = z.object({
  title: z.string().min(1),
  url: z.url(),
  publisher: z.string().min(1).optional(),
});

/** The agent's beat. Drives the accent hue and the index filter. */
export const POST_TOPICS = [
  "software-engineering",
  "web",
  "ai-ml",
  "puerto-rico",
] as const;

export type PostTopic = (typeof POST_TOPICS)[number];

/** Topic -> accent hue, reusing the same one-hue engine as the case studies. */
export const TOPIC_ACCENT: Record<PostTopic, number> = {
  "software-engineering": 265,
  web: 195,
  "ai-ml": 25,
  "puerto-rico": 150,
};

export const TOPIC_LABEL: Record<PostTopic, string> = {
  "software-engineering": "Software Engineering",
  web: "Web",
  "ai-ml": "AI & ML",
  "puerto-rico": "Puerto Rico",
};

export const postFrontmatterSchema = z.object({
  title: z.string().min(1),
  /** Publication date — also the filename prefix. */
  date: z.preprocess(isoDatePart, z.iso.date()),
  /** Shown on the index and used as the meta description. */
  summary: z.string().min(1).max(300),
  topic: z.enum(POST_TOPICS),
  tags: z.array(z.string().min(1)).default([]),
  sources: z.array(postSourceSchema).min(1),
  /** When the agent run that produced this file happened. */
  generatedAt: z.preprocess(isoDateTime, z.iso.datetime()).optional(),
  /** Drafts render in `next dev` but are excluded from production builds. */
  draft: z.boolean().default(false),
});

export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;
export type PostSource = z.infer<typeof postSourceSchema>;

export type Post = PostFrontmatter & {
  slug: string;
  /** Raw MDX body, compiled lazily by the post route. */
  body: string;
};

/** Listing shape — everything except the body. */
export type PostSummary = Omit<Post, "body">;
