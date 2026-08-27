export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-32">
      <p className="font-mono text-xs tracking-[0.2em] text-ink-faint uppercase">
        Toolchain smoke test
      </p>
      <h1 className="mt-6 font-display text-hero kinetic">Jorge Ortiz</h1>
      <p className="mt-6 max-w-prose text-ink-muted">
        Tailwind v4 tokens, three variable fonts, and the OKLCH accent engine.
      </p>
      <a href="/" className="mt-8 inline-block text-accent underline">
        Accent link
      </a>
    </main>
  );
}
