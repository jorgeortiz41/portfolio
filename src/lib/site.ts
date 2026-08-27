export const site = {
  name: "Jorge Ortiz",
  title: "Jorge Ortiz — Software Engineer",
  shortTitle: "Jorge Ortiz",
  role: "Software Engineer",
  focus: "Software Architecture · AI Systems",
  location: "Puerto Rico",
  description:
    "Software engineer working on systems where correctness matters — threat intelligence, radio science instrumentation, analytics platforms, and the AI components inside them.",
  email: "jortizsoftware@gmail.com",
  resume: "/resume.pdf",
  socials: {
    github: "https://github.com/jorgeortiz41",
    linkedin: "https://www.linkedin.com/in/jorgeaortizramirez/",
  },
} as const;

/**
 * Absolute origin for metadataBase, sitemap and OG images. Vercel injects
 * VERCEL_PROJECT_PRODUCTION_URL on deployments; NEXT_PUBLIC_SITE_URL overrides
 * it locally or on a custom domain.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}
