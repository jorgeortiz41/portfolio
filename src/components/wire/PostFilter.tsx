"use client";

import { useMemo, useState } from "react";
import { PostRow } from "@/components/wire/PostRow";
import { groupPostsByMonth } from "@/lib/post-format";
import { TOPIC_LABEL, type PostSummary, type PostTopic } from "@/lib/schema";
import { cn } from "@/lib/cn";

const ALL = "All";

/**
 * The only interactive part of the index. Filtering happens client-side over a
 * list the server already rendered, so the full set is in the HTML for crawlers
 * and the filter is pure enhancement — same contract as the work index.
 */
export function PostFilter({
  posts,
  topics,
}: {
  posts: PostSummary[];
  topics: PostTopic[];
}) {
  const [active, setActive] = useState<PostTopic | typeof ALL>(ALL);

  const groups = useMemo(() => {
    const visible =
      active === ALL ? posts : posts.filter((p) => p.topic === active);
    return groupPostsByMonth(visible);
  }, [posts, active]);

  const count = groups.reduce((n, g) => n + g.posts.length, 0);

  return (
    <>
      <div
        className="mt-8 flex flex-wrap gap-2.5 sm:gap-2"
        role="group"
        aria-label="Filter by topic"
      >
        {[ALL, ...topics].map((topic) => {
          const selected = topic === active;
          return (
            <button
              key={topic}
              type="button"
              onClick={() => setActive(topic as PostTopic | typeof ALL)}
              aria-pressed={selected}
              className={cn(
                "inline-flex min-h-11 items-center rounded-full border px-4 py-2 font-mono text-[0.6875rem] tracking-wide transition-colors sm:min-h-0 sm:px-3 sm:py-1.5",
                selected
                  ? "border-accent-hairline bg-accent-soft text-accent"
                  : "border-rule text-ink-faint hover:border-rule-strong hover:text-ink-muted",
              )}
            >
              {topic === ALL ? ALL : TOPIC_LABEL[topic as PostTopic]}
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {count} {count === 1 ? "post" : "posts"} shown
      </p>

      {groups.map((group) => (
        <section key={group.month} className="mt-14 first:mt-10">
          <h2 className="font-mono text-[0.6875rem] tracking-[0.22em] text-ink-faint uppercase">
            {group.month}
          </h2>
          <ul className="mt-6">
            {group.posts.map((post) => (
              <PostRow key={post.slug} post={post} />
            ))}
          </ul>
        </section>
      ))}

      {count === 0 && (
        <p className="mt-10 border-t border-rule py-16 text-center text-ink-faint">
          Nothing filed under{" "}
          {active === ALL ? "that topic" : TOPIC_LABEL[active]} yet.
        </p>
      )}
    </>
  );
}
