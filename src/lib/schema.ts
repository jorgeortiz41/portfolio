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
