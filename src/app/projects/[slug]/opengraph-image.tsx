import { ImageResponse } from "next/og";
import { getProject, getProjectSlugs } from "@/lib/content";
import { site } from "@/lib/site";
import { accentHex } from "@/lib/accent";

export const alt = "Case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export default async function ProjectOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  // Same accent engine as the site: the project's hue, converted to sRGB
  // because Satori cannot parse oklch(). Derived from the one hue in
  // frontmatter, so the card provably matches the page.
  const accent = accentHex(project?.accent);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#08080a",
        padding: "72px",
        fontFamily: "sans-serif",
        borderTop: `16px solid ${accent}`,
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 24,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: accent,
        }}
      >
        Case study
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            display: "flex",
            fontSize: 92,
            color: "#fafafa",
            letterSpacing: "-0.02em",
          }}
        >
          {project?.title ?? site.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 34,
            lineHeight: 1.3,
            color: "#a0a0a8",
            maxWidth: "85%",
          }}
        >
          {project?.tagline ?? site.description}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 26,
          color: "#8a8a90",
        }}
      >
        <span>{site.name}</span>
        <span style={{ color: accent }}>
          {project?.stack.slice(0, 3).join(" · ") ?? site.focus}
        </span>
      </div>
    </div>,
    size,
  );
}
