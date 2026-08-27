import type { Metadata } from "next";

import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ProjectFilter } from "@/components/work/ProjectFilter";
import { getAllProjects, getAllStackTags } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies in AI, security and full-stack engineering — problem, approach, architecture and impact.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const projects = getAllProjects();
  const tags = getAllStackTags();

  return (
    <Container className="py-20 sm:py-28">
      <Eyebrow>Work</Eyebrow>

      <h1 className="mt-6 max-w-3xl font-display text-display text-ink kinetic">
        Case studies, not screenshots.
      </h1>

      <p className="mt-6 max-w-2xl text-ink-muted">
        Each project below covers the problem, the approach and the tradeoffs —
        including the ones that did not work out. {projects.length} in total.
      </p>

      <ProjectFilter projects={projects} tags={tags} />
    </Container>
  );
}
