import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { accentStyle } from "@/lib/accent";
import { formatPostDate } from "@/lib/post-format";
import { TOPIC_ACCENT, TOPIC_LABEL, type PostSummary } from "@/lib/schema";
import { cn } from "@/lib/cn";

/**
 * One post as a full-width editorial row, matching the work index: the whole
 * row is a single <Link>, so it is one tab stop, one hover target and one focus
 * target, and every hover state is mirrored onto keyboard focus.
 */
export function PostRow({
  post,
  className,
}: {
  post: PostSummary;
  className?: string;
}) {
  return (
    <li
      style={accentStyle(TOPIC_ACCENT[post.topic])}
      className={cn("group", className)}
    >
      <Link
        href={`/wire/${post.slug}`}
        className="relative block border-t border-rule py-8 transition-colors duration-500 outline-none group-focus-within:border-accent-hairline group-hover:border-accent-hairline"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[-1.5rem] inset-y-0 -z-10 rounded-lg bg-accent-soft opacity-0 transition-opacity duration-500 group-focus-within:opacity-100 group-hover:opacity-100"
        />

        <div className="flex items-start justify-between gap-4 sm:gap-8">
          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[0.6875rem] tracking-[0.16em] text-ink-faint uppercase">
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              <span aria-hidden="true">·</span>
              <span className="transition-colors duration-500 group-focus-within:text-accent group-hover:text-accent">
                {TOPIC_LABEL[post.topic]}
              </span>
              {post.draft && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-ink">Draft</span>
                </>
              )}
            </p>

            <h3 className="mt-3 font-display text-title text-ink kinetic group-focus-within:[--kin-wdth:92] group-focus-within:[--kin-wght:700] group-hover:[--kin-wdth:92] group-hover:[--kin-wght:700]">
              {post.title}
            </h3>

            <p className="mt-3 max-w-2xl text-ink-muted">{post.summary}</p>
          </div>

          <ArrowUpRight className="mt-1 size-5 shrink-0 text-ink-faint transition-all duration-500 group-focus-within:translate-x-0.5 group-focus-within:-translate-y-0.5 group-focus-within:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent motion-reduce:transform-none" />
        </div>
      </Link>
    </li>
  );
}
