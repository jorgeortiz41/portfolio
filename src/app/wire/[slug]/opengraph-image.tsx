import { ImageResponse } from "next/og";
import { getPost, getPostSlugs } from "@/lib/posts";
import { TOPIC_ACCENT, TOPIC_LABEL } from "@/lib/schema";
import { site } from "@/lib/site";
import { accentHex } from "@/lib/accent";

export const alt = "Post from The Wire";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export default async function PostOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  // Same accent engine as the page: the topic's hue, converted to sRGB because
  // Satori cannot parse oklch().
  const accent = accentHex(post ? TOPIC_ACCENT[post.topic] : undefined);

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
        Filed by an AI agent
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            lineHeight: 1.1,
            color: "#fafafa",
            letterSpacing: "-0.02em",
          }}
        >
          {post?.title ?? "The Wire"}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            lineHeight: 1.3,
            color: "#a0a0a8",
            maxWidth: "88%",
          }}
        >
          {post?.summary ?? site.description}
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
          {post ? TOPIC_LABEL[post.topic] : site.focus}
        </span>
      </div>
    </div>,
    size,
  );
}
