import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import type { ProjectFrontmatter } from "@/lib/schema";

export function ArrowLeftLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 font-mono text-xs tracking-[0.16em] text-ink-faint uppercase transition-colors hover:text-accent"
    >
      <ArrowRight className="size-4 rotate-180 transition-transform group-hover:-translate-x-1 motion-reduce:transform-none" />
      {children}
    </Link>
  );
}

const LINK_LABELS: Record<string, string> = {
  live: "Live site",
  repo: "Source",
  demo: "Demo",
};

export function ProjectLinks({
  links,
  period,
}: {
  links: ProjectFrontmatter["links"];
  period: string;
}) {
  const entries = Object.entries(links ?? {}).filter(([, href]) =>
    Boolean(href),
  );

  return (
    <div>
      <h2 className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-faint uppercase">
        Details
      </h2>
      <ul className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <li className="font-mono text-xs text-ink-muted">{period}</li>
        {entries.map(([key, href]) => (
          <li key={key}>
            <a
              href={href as string}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 text-ink-muted transition-colors hover:text-accent"
            >
              {LINK_LABELS[key] ?? key}
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
