import { TOPIC_LABEL, type PostTopic } from "@/lib/schema";
import { formatPostDate } from "@/lib/post-format";
import { cn } from "@/lib/cn";

/**
 * The disclosure, sitting above the body on every post.
 *
 * The section's premise is that these are machine-written, so the label is not
 * fine print at the bottom — it is the byline, in the position a human author's
 * name would occupy, above the fold.
 */
export function PostByline({
  date,
  topic,
  className,
}: {
  date: string;
  topic: PostTopic;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[0.6875rem] tracking-[0.16em] text-ink-faint uppercase",
        className,
      )}
    >
      <span className="text-accent">Filed by an AI agent</span>
      <span aria-hidden="true">·</span>
      <time dateTime={date}>{formatPostDate(date)}</time>
      <span aria-hidden="true">·</span>
      <span>Unedited</span>
      <span aria-hidden="true">·</span>
      <span>{TOPIC_LABEL[topic]}</span>
    </div>
  );
}
