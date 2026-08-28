import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ArrowRight } from "@/components/icons";

export default function NotFound() {
  return (
    <Container className="py-32 sm:py-48">
      <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
        404
      </p>
      <h1 className="mt-6 max-w-2xl font-display text-display text-ink kinetic">
        That page doesn&apos;t exist.
      </h1>
      <p className="mt-6 max-w-md text-ink-muted">
        The link may be out of date, or the project may have been renamed.
      </p>
      <Link
        href="/projects"
        className="group mt-10 inline-flex items-center gap-2 border-b border-ink pb-1 font-mono text-xs tracking-[0.16em] uppercase transition-colors hover:border-accent hover:text-accent"
      >
        Browse all work
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />
      </Link>
    </Container>
  );
}
