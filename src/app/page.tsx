import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ProjectRow } from "@/components/work/ProjectRow";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { getFeaturedProjects } from "@/lib/content";
import { currentExperience } from "@/data/experience";
import { skills } from "@/data/skills";
import { site } from "@/lib/site";

export default function Home() {
  const featured = getFeaturedProjects();

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative isolate">
        <Container className="py-24 sm:py-32 lg:py-40">
          <p className="font-mono text-xs tracking-[0.22em] text-ink-faint uppercase">
            {site.role} · {site.location}
          </p>

          <h1 className="kinetic-hero mt-8 max-w-5xl font-display text-hero text-ink kinetic">
            I build AI systems that security teams can actually trust.
          </h1>

          <p className="mt-8 max-w-xl text-lg text-ink-muted">
            Currently building auditable threat intelligence tooling at Evertec.
            Previously full-stack work at LeadWire and Red Ventures, and
            research engineering at the Arecibo Observatory.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 border-b border-ink pb-1 font-mono text-xs tracking-[0.16em] uppercase transition-colors hover:border-accent hover:text-accent"
            >
              View work
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />
            </Link>
            <a
              href={site.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 border-b border-transparent pb-1 font-mono text-xs tracking-[0.16em] text-ink-muted uppercase transition-colors hover:border-accent hover:text-accent"
            >
              Résumé
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" />
            </a>
          </div>
        </Container>
      </section>

      {/* -------------------------------------------------------- Selected work */}
      <section aria-labelledby="work-heading">
        <Container className="py-16 sm:py-24">
          <Eyebrow index={featured.length} total={featured.length}>
            <span id="work-heading">Selected work</span>
          </Eyebrow>

          <ul className="mt-10">
            {featured.map((project, i) => (
              <ProjectRow key={project.slug} project={project} index={i + 1} />
            ))}
          </ul>

          <div className="border-t border-rule pt-8">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 font-mono text-xs tracking-[0.16em] text-ink-muted uppercase transition-colors hover:text-accent"
            >
              All projects
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />
            </Link>
          </div>
        </Container>
      </section>

      {/* ----------------------------------------------------------- Experience */}
      <section aria-labelledby="experience-heading">
        <Container className="py-16 sm:py-24">
          <Eyebrow>
            <span id="experience-heading">Experience</span>
          </Eyebrow>

          <ol className="mt-10">
            {currentExperience.map((role) => (
              <li
                key={`${role.company}-${role.period}`}
                className="grid gap-2 border-t border-rule py-8 sm:grid-cols-[10rem_1fr] sm:gap-8"
              >
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
                    <p className="mt-1 text-sm text-ink-muted">
                      {role.company}
                    </p>
                  )}
                  <p className="mt-3 max-w-2xl text-sm text-ink-muted">
                    {role.summary}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* --------------------------------------------------------------- Skills */}
      <section aria-labelledby="skills-heading">
        <Container className="py-16 sm:py-24">
          <Eyebrow>
            <span id="skills-heading">Toolkit</span>
          </Eyebrow>

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
      </section>

      {/* -------------------------------------------------------------- Contact */}
      <section aria-labelledby="contact-heading">
        <Container className="py-16 sm:py-24">
          <Eyebrow>
            <span id="contact-heading">Contact</span>
          </Eyebrow>
          <p className="kinetic-enter mt-8 max-w-3xl font-display text-display text-ink kinetic">
            Looking for a software engineering role where AI meets security.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="group mt-8 inline-flex items-center gap-2 border-b border-ink pb-1 font-mono text-sm tracking-[0.1em] transition-colors hover:border-accent hover:text-accent"
          >
            {site.email}
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" />
          </a>
        </Container>
      </section>
    </>
  );
}
