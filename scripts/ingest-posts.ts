/**
 * Normalise agent output in `blogs/` into `content/posts/`.
 *
 * The scheduled task is meant to commit publish-ready MDX straight to a branch.
 * This script is the fallback for when it can't — when the files arrive as chat
 * attachments and get dropped into `blogs/` by hand. It validates rather than
 * guesses: a file that doesn't satisfy the schema is reported and left alone,
 * because inventing frontmatter for a post nobody has read is how wrong
 * metadata ends up on the live site.
 *
 *   bun run ingest          # report only
 *   bun run ingest --write  # move the files that pass
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import { postFrontmatterSchema } from "../src/lib/schema";

const ROOT = process.cwd();
const INBOX = path.join(ROOT, "blogs");
const OUT = path.join(ROOT, "content", "posts");

const write = process.argv.includes("--write");

type Result = { file: string; ok: boolean; detail: string; dest?: string };

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
}

function inspect(file: string): Result {
  const raw = fs.readFileSync(path.join(INBOX, file), "utf8");
  const { data, content } = matter(raw);

  if (Object.keys(data).length === 0) {
    return {
      file,
      ok: false,
      detail:
        "no frontmatter — the generator must emit it; this script will not invent a title, date, summary or sources",
    };
  }

  const parsed = postFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    return {
      file,
      ok: false,
      detail: parsed.error.issues
        .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
        .join("; "),
    };
  }

  const problems: string[] = [];
  if (/^#\s+\S/m.test(content)) problems.push('body has an "# H1"');
  if (/^#{2,3}\s*(?:a\s+)?(?:compelling\s+)?hook\s*$/im.test(content))
    problems.push('body has an instruction-echo "Hook" heading');
  if (/^\s*\*\*Sources?:\*\*/im.test(content))
    problems.push('body has a trailing "**Source:**" line');

  if (problems.length > 0) {
    return { file, ok: false, detail: problems.join("; ") };
  }

  const { date, title } = parsed.data;
  return {
    file,
    ok: true,
    detail: `${date} · ${parsed.data.topic}`,
    dest: `${date}-${slugify(title)}.mdx`,
  };
}

function main(): void {
  if (!fs.existsSync(INBOX)) {
    console.log("No blogs/ directory — nothing to ingest.");
    return;
  }

  const files = fs
    .readdirSync(INBOX)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  if (files.length === 0) {
    console.log("blogs/ is empty — nothing to ingest.");
    return;
  }

  const results = files.map(inspect);
  const passed = results.filter((r) => r.ok);
  const failed = results.filter((r) => !r.ok);

  for (const r of passed) {
    console.log(`✓ ${r.file}\n    -> content/posts/${r.dest}  (${r.detail})`);
  }
  for (const r of failed) {
    console.log(`✗ ${r.file}\n    ${r.detail}`);
  }

  if (write && passed.length > 0) {
    fs.mkdirSync(OUT, { recursive: true });
    for (const r of passed) {
      const dest = path.join(OUT, r.dest!);
      if (fs.existsSync(dest)) {
        console.log(`  skipped ${r.dest} — already exists`);
        continue;
      }
      fs.renameSync(path.join(INBOX, r.file), dest);
    }
    console.log(`\nMoved ${passed.length} file(s) into content/posts/.`);
  } else if (passed.length > 0) {
    console.log(`\n${passed.length} ready. Re-run with --write to move them.`);
  }

  if (failed.length > 0) {
    console.log(`\n${failed.length} file(s) need fixing before ingest.`);
    process.exitCode = 1;
  }
}

main();
