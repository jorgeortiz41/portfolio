import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ThemeToggle } from "@/components/ThemeToggle";
import { site } from "@/lib/site";

const nav = [
  { href: "/projects", label: "Work" },
  { href: "/about", label: "About" },
];

/**
 * Two links and a toggle. Small enough to stay inline at every width, which is
 * why there is no hamburger and no JS breakpoint — the old site simply hid its
 * entire nav below 1024px with no replacement.
 */
export function SiteHeader() {
  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className="sticky top-0 z-50 border-b border-rule bg-bg/80 backdrop-blur-md"
    >
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="font-mono text-sm tracking-[0.16em] uppercase transition-colors hover:text-accent"
        >
          {site.name}
        </Link>

        <nav aria-label="Main" className="flex items-center gap-6">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-xs tracking-[0.16em] text-ink-muted uppercase transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </Container>
    </header>
  );
}
