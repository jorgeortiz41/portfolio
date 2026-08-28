import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A single stack chip. Always rendered inside <TagList> so screen readers
 * announce "list, N items" — the old markup used bare divs.
 */
export function Tag({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <li
      className={cn(
        "rounded-full border border-rule px-2.5 py-1 font-mono text-[0.6875rem] tracking-wide text-ink-muted",
        className,
      )}
    >
      {children}
    </li>
  );
}

export function TagList({
  items,
  className,
  label = "Technologies",
}: {
  items: readonly string[];
  className?: string;
  label?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label={label}>
      {items.map((item) => (
        <Tag key={item}>{item}</Tag>
      ))}
    </ul>
  );
}
