import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { accentStyle } from "@/lib/accent";
import type { ProjectSummary } from "@/lib/schema";
import { cn } from "@/lib/cn";

/**
 * One project as a full-width editorial row rather than a card.
 *
 * The whole row is a single <Link>, so it is one tab stop, one hover target and
 * one focus target — and `group-focus-visible` mirrors every hover state onto
 * keyboard focus, which the old site never did.
 */
export function ProjectRow({
  project,
  index,
  className,
}: {
  project: ProjectSummary;
  index: number;
  className?: string;
}) {
  return (
    <li style={accentStyle(project.accent)} className={cn("group", className)}>
      <Link
        href={`/projects/${project.slug}`}
        data-project-slug={project.slug}
        className="relative block border-t border-rule py-8 transition-colors duration-500 outline-none group-focus-within:border-accent-hairline group-hover:border-accent-hairline sm:py-10"
      >
        {/* Accent wash on hover/focus. Opacity only — cheap to composite. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[-1.5rem] inset-y-0 -z-10 rounded-lg bg-accent-soft opacity-0 transition-opacity duration-500 group-focus-within:opacity-100 group-hover:opacity-100"
        />

        <div className="flex items-baseline gap-4 sm:gap-8">
          <span
            aria-hidden="true"
            className="font-mono text-xs text-ink-faint transition-colors duration-500 group-focus-within:text-accent group-hover:text-accent"
          >
            {String(index).padStart(2, "0")}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-title text-ink transition-[--kin-wght,--kin-wdth] kinetic group-focus-within:[--kin-wdth:92] group-focus-within:[--kin-wght:700] group-hover:[--kin-wdth:92] group-hover:[--kin-wght:700]">
                {project.title}
              </h3>
              <ArrowUpRight className="mt-1 size-5 shrink-0 text-ink-faint transition-all duration-500 group-focus-within:translate-x-0.5 group-focus-within:-translate-y-0.5 group-focus-within:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent motion-reduce:transform-none" />
            </div>

            <p className="mt-2 max-w-2xl text-ink-muted">{project.tagline}</p>

            <p className="mt-4 font-mono text-[0.6875rem] tracking-[0.14em] text-ink-faint uppercase">
              {project.stack.slice(0, 5).join(" · ")}
            </p>
          </div>
        </div>
      </Link>
    </li>
  );
}
