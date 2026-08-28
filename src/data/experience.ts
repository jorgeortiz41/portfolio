export type Experience = {
  title: string;
  company: string;
  /** Free-form display string. */
  period: string;
  summary: string;
  stack: readonly string[];
  /**
   * Presence of a link is what makes a card linked — the old code kept a
   * separate hardcoded `linkCompanies` array that silently desynced from the
   * data whenever a company was renamed or a link added.
   */
  link?: string;
  /** Older roles, collapsed behind a disclosure. */
  archived?: boolean;
};

export const experience: readonly Experience[] = [
  {
    title: "Cyber Threat Intelligence & AI Engineering Intern",
    company: "Evertec",
    period: "Jun — Aug 2026",
    summary:
      "Built ARGUS, an AI-assisted OSINT platform that enriches indicators with risk scores, relationship graphs and MITRE ATT&CK-mapped intelligence across 14 sources. Designed a deterministic source-verification layer that cites API-derived facts independently of the LLM, so every claim in a generated briefing is auditable.",
    stack: [
      "Python",
      "Pydantic AI",
      "FastAPI",
      "OSINT",
      "STIX 2.1",
      "MITRE ATT&CK",
    ],
  },
  {
    title: "Full-Stack Software Engineer Intern",
    company: "LeadWire LLC",
    period: "May 2024 — Aug 2025",
    summary:
      "Led a UI redesign of a large-scale SMS marketing platform — dashboard, navigation, modals and global styles — and shipped real-time dashboard updates over WebSockets. Drove a full-stack upgrade to Node 20, React 18, Apollo v3 and MUI v5, and migrated the build to Vite.",
    stack: ["React", "JavaScript", "Apollo", "GraphQL", "PostgreSQL", "Prisma"],
    link: "https://www.leadwireapp.com/",
  },
  {
    title: "Associate Software Engineer Intern",
    company: "Red Ventures",
    period: "May — Aug 2023",
    summary:
      "Delivered front-end and back-end features across several sites with the Platea team. Built a 'Save' feature for blog content and an API for user-generated lists, and coded two content gates to drive A/B testing on conversion pathways.",
    stack: ["React", "TypeScript", "WordPress", "PHP", "Prisma", "NestJS"],
    link: "https://www.redventures.com/",
  },
  {
    title: "Software Engineering REU",
    company: "Arecibo Observatory",
    period: "May — Aug 2022",
    summary:
      "Independently built a proof-of-concept MERN application surfacing real-time data from the 12m radio telescope, with a logging tool for operational data collection.",
    stack: ["React", "Node.js", "Express", "MongoDB"],
  },
  {
    title: "Software Developer",
    company: "SEA UPRM",
    period: "Sep 2021 — May 2022",
    summary:
      "Developed web modules in PHP/Laravel/MySQL for the organization's services, gathering requirements with multidisciplinary teams and supporting end users.",
    stack: ["PHP", "Laravel", "MySQL"],
    archived: true,
  },
  {
    title: "Data Analyst Intern",
    company: "VIPPR",
    period: "Sep 2020 — Feb 2021",
    summary:
      "Processed thousands of home-reconstruction requests for an organization aiding those affected by the 2020 Puerto Rico earthquakes, extracting insights from demographic and financial datasets to inform resource allocation.",
    stack: ["Python", "Pandas", "NumPy", "Matplotlib"],
    archived: true,
  },
];

export const currentExperience = experience.filter((e) => !e.archived);
export const archivedExperience = experience.filter((e) => e.archived);
