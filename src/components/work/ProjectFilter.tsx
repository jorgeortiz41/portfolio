"use client";

import { useMemo, useState } from "react";
import { ProjectRow } from "@/components/work/ProjectRow";
import type { ProjectSummary } from "@/lib/schema";
import { cn } from "@/lib/cn";

const ALL = "All";

/**
 * The only interactive part of the index. Filtering happens client-side over a
 * list the server already rendered, so the full set is in the HTML for crawlers
 * and the filter is pure enhancement.
 */
export function ProjectFilter({
  projects,
  tags,
}: {
  projects: ProjectSummary[];
  tags: string[];
}) {
  const [active, setActive] = useState<string>(ALL);

  const visible = useMemo(
    () =>
      active === ALL
        ? projects
        : projects.filter((p) => p.stack.includes(active)),
    [projects, active],
  );

  return (
    <>
      <div
        className="mt-8 flex flex-wrap gap-2"
        role="group"
        aria-label="Filter by technology"
      >
        {[ALL, ...tags].map((tag) => {
          const selected = tag === active;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => setActive(tag)}
              aria-pressed={selected}
              className={cn(
                "rounded-full border px-3 py-1.5 font-mono text-[0.6875rem] tracking-wide transition-colors",
                selected
                  ? "border-accent-hairline bg-accent-soft text-accent"
                  : "border-rule text-ink-faint hover:border-rule-strong hover:text-ink-muted",
              )}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length} {visible.length === 1 ? "project" : "projects"} shown
      </p>

      <ul className="mt-10">
        {visible.map((project, i) => (
          <ProjectRow key={project.slug} project={project} index={i + 1} />
        ))}
      </ul>

      {visible.length === 0 && (
        <p className="border-t border-rule py-16 text-center text-ink-faint">
          No projects use {active} yet.
        </p>
      )}
    </>
  );
}
