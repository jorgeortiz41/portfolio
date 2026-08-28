import type { Metadata } from "next";

import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TagList } from "@/components/ui/Tag";
import { ArrowUpRight } from "@/components/icons";
import { bio } from "@/data/bio";
import { currentExperience, archivedExperience } from "@/data/experience";
import type { Experience } from "@/data/experience";
import { skills } from "@/data/skills";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.description} Background, experience and toolkit.`,
  alternates: { canonical: "/about" },
};

function Role({ role }: { role: Experience }) {
  return (
    <li className="grid gap-2 border-t border-rule py-8 sm:grid-cols-[10rem_1fr] sm:gap-8">
      <p className="font-mono text-xs tracking-[0.14em] text-ink-faint uppercase">
        {role.period}
      </p>
      <div>
        <h3 className="font-display text-lg font-semibold text-ink">
          {role.title}
        </h3>
        {role.link ? (
          <a
            href={role.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-1 inline-flex items-center gap-1 text-sm text-ink-muted transition-colors hover:text-accent"
          >
            {role.company}
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" />
          </a>
        ) : (
          <p className="mt-1 text-sm text-ink-muted">{role.company}</p>
        )}
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
          {role.summary}
        </p>
        <TagList
          items={role.stack}
          className="mt-4"
          label={`${role.company} stack`}
        />
      </div>
    </li>
  );
}

export default function AboutPage() {
  return (
    <>
      <Container className="py-20 sm:py-28">
        <Eyebrow>About</Eyebrow>

        <h1 className="mt-6 max-w-4xl font-display text-display text-ink kinetic">
          The engineering around the model is the actual work.
        </h1>

        <div className="prose mt-10 max-w-2xl space-y-5 text-ink-muted">
          {bio.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="leading-[1.75]">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
          <a
            href={site.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 border-b border-ink pb-1 font-mono text-xs tracking-[0.16em] uppercase transition-colors hover:border-accent hover:text-accent"
          >
            Download résumé
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" />
          </a>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-2 border-b border-transparent pb-1 font-mono text-xs tracking-[0.16em] text-ink-muted uppercase transition-colors hover:border-accent hover:text-accent"
          >
            {site.email}
          </a>
        </div>
      </Container>

      <Container className="py-16">
        <Eyebrow>Experience</Eyebrow>
        <ol className="mt-10">
          {currentExperience.map((role) => (
            <Role key={`${role.company}-${role.period}`} role={role} />
          ))}
        </ol>

        <details className="group mt-6">
          <summary className="cursor-pointer list-none font-mono text-xs tracking-[0.16em] text-ink-faint uppercase transition-colors hover:text-accent">
            <span className="group-open:hidden">Show earlier roles</span>
            <span className="hidden group-open:inline">Hide earlier roles</span>
          </summary>
          <ol className="mt-6">
            {archivedExperience.map((role) => (
              <Role key={`${role.company}-${role.period}`} role={role} />
            ))}
          </ol>
        </details>
      </Container>

      <Container className="py-16 pb-24">
        <Eyebrow>Toolkit</Eyebrow>
        <dl className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group) => (
            <div key={group.category} className="border-t border-rule pt-5">
              <dt className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-faint uppercase">
                {group.category}
              </dt>
              <dd className="mt-3 text-sm leading-relaxed text-ink-muted">
                {group.items.join(", ")}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </>
  );
}
