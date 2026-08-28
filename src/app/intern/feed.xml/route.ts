import { getAllPosts } from "@/lib/posts";
import { getSiteUrl } from "@/lib/site";
import { site } from "@/lib/site";

/** XML text nodes: the post titles contain apostrophes, dashes and ampersands. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET(): Response {
  const siteUrl = getSiteUrl();
  const posts = getAllPosts();
  const updated = posts[0]?.date;

  const items = posts
    .map((post) => {
      const url = `${siteUrl}/intern/${post.slug}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.summary)}</description>
      <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
      <category>${escapeXml(post.topic)}</category>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`The Intern — ${site.shortTitle}`)}</title>
    <link>${siteUrl}/intern</link>
    <atom:link href="${siteUrl}/intern/feed.xml" rel="self" type="application/rss+xml" />
    <description>Posts researched and written by a scheduled AI agent, unedited.</description>
    <language>en</language>${
      updated
        ? `\n    <lastBuildDate>${new Date(`${updated}T00:00:00Z`).toUTCString()}</lastBuildDate>`
        : ""
    }
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
