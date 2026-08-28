import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { Container } from "@/components/ui/Container";
import { TagList } from "@/components/ui/Tag";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { ArrowLeftLink } from "@/components/work/ProjectMeta";
import { PostByline } from "@/components/intern/PostByline";
import { PostSources } from "@/components/intern/PostSources";
import { getPost, getPostSlugs, getAllPosts } from "@/lib/posts";
import { accentStyle } from "@/lib/accent";
import { TOPIC_ACCENT } from "@/lib/schema";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/intern/${slug}` },
    openGraph: {
      type: "article",
      title: `${post.title} — ${site.shortTitle}`,
      description: post.summary,
      url: `/intern/${slug}`,
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} — ${site.shortTitle}`,
      description: post.summary,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const all = getAllPosts();
  const position = all.findIndex((p) => p.slug === slug);
  const next = position >= 0 ? all[position + 1] : undefined;

  // Authored by a software agent, not by Jorge. Structured data is the one
  // place the disclosure could quietly fail — machines read this and humans
  // do not — so it must not claim a human byline.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    abstract: post.summary,
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: "The Intern — an automated writing agent",
    },
    publisher: { "@type": "Person", name: site.name },
    keywords: post.tags.join(", "),
    citation: post.sources.map((s) => s.url),
  };

  return (
    <article style={accentStyle(TOPIC_ACCENT[post.topic])}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ------------------------------------------------------------- Header */}
      <Container className="pt-12 pb-10 sm:pt-16">
        <ArrowLeftLink href="/intern">All posts</ArrowLeftLink>

        <PostByline date={post.date} topic={post.topic} className="mt-12" />

        <h1 className="mt-5 max-w-4xl font-display text-display text-ink kinetic">
          {post.title}
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-ink-muted">{post.summary}</p>

        {post.tags.length > 0 && (
          <TagList items={post.tags} className="mt-8" label="Topics" />
        )}
      </Container>

      {/* --------------------------------------------------------------- Body */}
      <Container className="prose pb-8">
        <div className="max-w-3xl">
          <MDXRemote source={post.body} components={mdxComponents} />
        </div>
      </Container>

      {/* ------------------------------------------------------------ Sources */}
      <Container className="pb-24">
        <div className="max-w-3xl">
          <PostSources sources={post.sources} />
        </div>
      </Container>

      {/* ----------------------------------------------------------- Next up */}
      {next && (
        <Container className="pb-24">
          <div style={accentStyle(TOPIC_ACCENT[next.topic])} className="group">
            <Link
              href={`/intern/${next.slug}`}
              className="block border-t border-rule pt-8 transition-colors group-hover:border-accent-hairline"
            >
              <p className="font-mono text-[0.6875rem] tracking-[0.2em] text-ink-faint uppercase">
                Previously
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
