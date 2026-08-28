"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-32 sm:py-48">
      <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
        Error
      </p>
      <h1 className="mt-6 max-w-2xl font-display text-display text-ink kinetic">
        Something broke on this page.
      </h1>
      <p className="mt-6 max-w-md text-ink-muted">
        This is on me, not you. Try again — and if it keeps happening, the rest
        of the site should still work.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-10 border-b border-ink pb-1 font-mono text-xs tracking-[0.16em] uppercase transition-colors hover:border-accent hover:text-accent"
      >
        Try again
      </button>
    </Container>
  );
}
