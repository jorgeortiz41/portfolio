import { Container } from "@/components/ui/Container";

export default function Loading() {
  return (
    <Container className="py-20 sm:py-28">
      <div className="animate-pulse space-y-6" aria-hidden="true">
        <div className="h-3 w-24 rounded bg-bg-elevated" />
        <div className="h-16 w-full max-w-3xl rounded bg-bg-elevated" />
        <div className="h-4 w-full max-w-xl rounded bg-bg-elevated" />
      </div>
      <p className="sr-only" role="status">
        Loading
      </p>
    </Container>
  );
}
