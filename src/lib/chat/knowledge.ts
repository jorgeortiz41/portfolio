import { bio } from "@/data/bio";
import { experience } from "@/data/experience";
import { skills } from "@/data/skills";
import { getAllProjectsWithBody } from "@/lib/content";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

/**
 * Every fact the companion is allowed to state, as one block of text.
 *
 * Assembled from the site's own content, so the chatbot cannot drift from the
 * pages it sits on top of. Add a project, edit a role, rewrite the bio — the
 * dossier updates with it and there is nothing to re-sync.
 *
 * WHY THERE IS NO RETRIEVAL HERE. The whole corpus — bio, six roles, five skill
 * groups, seven case studies with their full bodies, and the post index — is
 * about 4,600 words. That is roughly 7-8k tokens, which fits in one system
 * prompt with room to spare, and the prompt is byte-identical for every visitor
 * so it is served from cache after the first request of each window. Embeddings,
 * a vector store and a retrieval step would add three moving parts, a second
 * failure mode and a worse answer (chunking loses the case-study argument that
 * makes the projects worth reading). If the corpus ever triples, revisit.
 *
 * Built once at module load: these are file reads, and the content cannot change
 * without a redeploy.
 */

function section(heading: string, body: string): string {
  return `## ${heading}\n\n${body.trim()}\n`;
}

function buildDossier(): string {
  const identity = [
    `Name: ${site.name}`,
    `Role: ${site.role}`,
    `Focus: ${site.focus}`,
    `Location: ${site.location}`,
    `Email: ${site.email}`,
    `GitHub: ${site.socials.github}`,
    `LinkedIn: ${site.socials.linkedin}`,
    `Résumé: available at ${site.resume} on this site.`,
  ].join("\n");

  const roles = experience
    .map((role) =>
      [
        `### ${role.title} — ${role.company} (${role.period})`,
        role.link ? `Company: ${role.link}` : null,
        role.summary,
        `Stack: ${role.stack.join(", ")}`,
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n\n");

  const toolkit = skills
    .map((group) => `${group.category}: ${group.items.join(", ")}`)
    .join("\n");

  // Full bodies. The case-study prose is where the actual engineering reasoning
  // lives, and it is the difference between the bot reciting a stack list and
  // being able to explain why a decision was made.
  const projects = getAllProjectsWithBody()
    .map((project) =>
      [
        `### ${project.title} (${project.period}) — /projects/${project.slug}`,
        project.tagline,
        `Role: ${project.role}`,
        `Stack: ${project.stack.join(", ")}`,
        project.metrics?.length
          ? `Metrics: ${project.metrics.map((m) => `${m.value} ${m.label}`).join("; ")}`
          : null,
        project.links?.repo ? `Repo: ${project.links.repo}` : null,
        project.links?.live ? `Live: ${project.links.live}` : null,
        "",
        project.body.trim(),
      ]
        .filter((line) => line !== null)
        .join("\n"),
    )
    .join("\n\n---\n\n");

  // Titles and summaries only, and flagged hard. These are written unattended by
  // a scheduled agent three times a week; treating them as Jorge's opinions
  // would put words in his mouth that he has never read.
  const posts = getAllPosts()
    .slice(0, 12)
    .map((post) => `- "${post.title}" (${post.date}) — ${post.summary}`)
    .join("\n");

  return [
    "# DOSSIER — the complete set of verified facts about Jorge Ortiz",
    "",
    section("Identity", identity),
    section(
      "Biography (Jorge's own words, from the About page)",
      bio.join("\n\n"),
    ),
    section("Experience", roles),
    section("Toolkit", toolkit),
    section("Projects — full case studies", projects),
    section(
      "The /intern blog — NOT written by Jorge",
      [
        "This site has a section at /intern containing posts written unattended by a",
        "scheduled Claude agent, three times a week. Jorge built the pipeline; he did",
        "not write the posts and does not necessarily agree with them. Never attribute",
        "these opinions to him. You may mention the section exists and that the",
        "automation is his work. Recent titles:",
        "",
        posts || "(no posts published yet)",
      ].join("\n"),
    ),
    section(
      "Closed world",
      [
        "The dossier above is COMPLETE. It is everything you know about Jorge.",
        "",
        "If a question is not answerable from it — another job, a technology not",
        "listed, a grade, a date, a preference, a number — you do not know, and the",
        "only correct move is to say so and point at the email address. Do not infer,",
        "do not extrapolate from the stack list, and never invent a detail because it",
        "sounds plausible. A cheerful 'no idea, ask the real one' is a good answer.",
        "An invented one is the single worst thing you can do here.",
      ].join("\n"),
    ),
  ].join("\n");
}

/** Built once per process. Byte-stable, which is what makes it cacheable. */
export const dossier: string = buildDossier();
