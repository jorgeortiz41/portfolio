import { cn } from "@/lib/cn";

/** Hairline divider. V2 uses these instead of card borders. */
export function Rule({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-rule", className)} />;
}
