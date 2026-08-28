import { ArrowUpRight } from "@/components/icons";
import type { PostSource } from "@/lib/schema";

/**
 * Citations, rendered from frontmatter rather than left as a bold line at the
 * bottom of the body — which is how the generator wrote them, in three
 * different formats across nine files.
 */
export function PostSources({ sources }: { sources: PostSource[] }) {
  return (
    <section aria-labelledby="sources-heading" className="mt-16">
      <h2
        id="sources-heading"
        className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-faint uppercase"
      >
        {sources.length === 1 ? "Source" : "Sources"}
      </h2>

      <ul className="mt-4">
        {sources.map((source) => (
          <li key={source.url} className="group border-t border-rule">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start justify-between gap-4 py-4 transition-colors outline-none group-focus-within:text-accent hover:text-accent"
            >
              <span className="min-w-0">
                <span className="block text-sm text-ink-muted transition-colors group-hover:text-accent">
                  {source.title}
                </span>
                {source.publisher && (
                  <span className="mt-1 block font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
                    {source.publisher}
                  </span>
                )}
              </span>
              <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-ink-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent motion-reduce:transform-none" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
