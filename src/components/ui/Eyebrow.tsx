import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Small mono label above a section. The `01 / 04` counter is optional. */
export function Eyebrow({
  children,
  index,
  total,
  className,
}: {
  children: ReactNode;
  index?: number;
  total?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4 font-mono text-[0.6875rem] tracking-[0.22em] text-ink-faint uppercase",
        className,
      )}
    >
      <span>{children}</span>
      {index !== undefined && total !== undefined && (
        <span aria-hidden="true">
          {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      )}
    </div>
  );
}
