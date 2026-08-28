import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import {
  projectFrontmatterSchema,
  type Project,
  type ProjectSummary,
} from "@/lib/schema";

const CONTENT_DIR = path.join(process.cwd(), "content", "projects");

function readProjectFile(filename: string): Project {
  const slug = filename.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  const parsed = projectFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    // Fail loudly at build time rather than rendering a half-blank card.
    throw new Error(
      `Invalid frontmatter in content/projects/${filename}:\n` +
        parsed.error.issues
          .map((i) => `  • ${i.path.join(".") || "(root)"}: ${i.message}`)
          .join("\n"),
    );
  }

  return { ...parsed.data, slug, body: content };
}

function readAll(): Project[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const projects = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map(readProjectFile)
    .sort((a, b) => a.order - b.order);

  // Duplicate `order` values sort nondeterministically, so the index silently
  // reshuffles between builds. Cheap to check, annoying to debug.
  const seen = new Map<number, string>();
  for (const project of projects) {
    const clash = seen.get(project.order);
    if (clash) {
      throw new Error(
        `Duplicate order ${project.order} in content/projects: "${clash}" and "${project.slug}". Orders must be unique.`,
      );
    }
    seen.set(project.order, project.slug);
  }

  return projects;
}

/** Listings: everything but the MDX body. */
export function getAllProjects(): ProjectSummary[] {
  return readAll().map(({ body: _body, ...rest }) => rest);
}

/**
 * Everything, bodies included. Only the companion's knowledge dossier wants
 * this — the routes all read one project at a time. Exists so the dossier does
 * not have to map `getProject()` over every slug, which would re-read and
 * re-parse the whole directory once per project.
 */
export function getAllProjectsWithBody(): Project[] {
  return readAll();
}

export function getFeaturedProjects(): ProjectSummary[] {
  return getAllProjects().filter((p) => p.featured);
}

export function getProject(slug: string): Project | undefined {
  return readAll().find((p) => p.slug === slug);
}

export function getProjectSlugs(): string[] {
  return readAll().map((p) => p.slug);
}

/**
 * Stack tags for the index filter, most-used first.
 *
 * Only tags shared by at least two projects are returned. A filter chip that
 * narrows seven projects to one is a worse affordance than the list itself —
 * showing every tag produced three rows of chips, most of which matched a
 * single item.
 */
export function getAllStackTags(minProjects = 2): string[] {
  const counts = new Map<string, number>();
  for (const project of readAll()) {
    for (const tag of project.stack) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .filter(([, count]) => count >= minProjects)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);
}
