import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { Container } from "@/components/ui/Container";
import { TagList } from "@/components/ui/Tag";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { ArrowLeftLink, ProjectLinks } from "@/components/work/ProjectMeta";
import { Morph } from "@/components/motion/Morph";
import { getProject, getProjectSlugs, getAllProjects } from "@/lib/content";
import { accentStyle } from "@/lib/accent";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      type: "article",
      title: `${project.title} — ${site.shortTitle}`,
      description: project.summary,
      url: `/projects/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — ${site.shortTitle}`,
      description: project.summary,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const all = getAllProjects();
  const position = all.findIndex((p) => p.slug === slug);
  const next = all[(position + 1) % all.length];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    abstract: project.summary,
    author: { "@type": "Person", name: site.name },
    keywords: project.stack.join(", "),
    ...(project.links?.repo ? { codeRepository: project.links.repo } : {}),
    ...(project.links?.live ? { url: project.links.live } : {}),
  };

  return (
    <article style={accentStyle(project.accent)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ------------------------------------------------------------- Header */}
      <Container className="pt-12 pb-16 sm:pt-16">
        <ArrowLeftLink href="/projects">All work</ArrowLeftLink>

        <p className="mt-12 font-mono text-xs tracking-[0.2em] text-accent uppercase">
          {project.role}
        </p>

        <Morph name={`project-title-${project.slug}`}>
          <h1 className="mt-4 max-w-4xl font-display text-display text-ink kinetic">
            {project.title}
          </h1>
        </Morph>

        <p className="mt-6 max-w-2xl text-lg text-ink-muted">
          {project.tagline}
        </p>

        <div className="mt-10 grid gap-8 border-t border-rule pt-8 sm:grid-cols-[1fr_auto] sm:gap-16">
          <div className="space-y-6">
            <div>
              <h2 className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-faint uppercase">
                Stack
              </h2>
              <TagList
                items={project.stack}
                className="mt-3"
                label="Technologies used"
              />
            </div>
            <ProjectLinks links={project.links} period={project.period} />
          </div>

          {project.metrics && project.metrics.length > 0 && (
            <dl className="grid grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-1">
              {project.metrics.map((metric) => (
                <div key={metric.label}>
                  <dd className="font-display text-2xl text-accent kinetic">
                    {metric.value}
                  </dd>
                  <dt className="mt-1 font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
                    {metric.label}
                  </dt>
                </div>
              ))}
            </dl>
          )}
        </div>
      </Container>

      {/* --------------------------------------------------------------- Body */}
      <Container className="prose pb-24">
        <div className="max-w-3xl">
          <MDXRemote source={project.body} components={mdxComponents} />
        </div>
      </Container>

      {/* ----------------------------------------------------------- Next up */}
      {next && next.slug !== slug && (
        <Container className="pb-24">
          <div style={accentStyle(next.accent)} className="group">
            <Link
              href={`/projects/${next.slug}`}
              className="block border-t border-rule pt-8 transition-colors group-hover:border-accent-hairline"
            >
              <p className="font-mono text-[0.6875rem] tracking-[0.2em] text-ink-faint uppercase">
                Next project
              </p>
              <p className="mt-3 font-display text-title text-ink transition-colors kinetic group-hover:text-accent">
                {next.title}
              </p>
            </Link>
          </div>
        </Container>
      )}
    </article>
  );
}
