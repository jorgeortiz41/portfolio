import type { ComponentPropsWithoutRef } from "react";
import { ArrowUpRight } from "@/components/icons";

/**
 * Explicit element mapping rather than a typography plugin.
 *
 * Case-study bodies use a small, fixed set of elements, and mapping them by
 * hand keeps the prose on the same tokens as the rest of the site — including
 * the per-project accent, which a generic prose theme would not know about.
 */

function H2({ children, ...props }: ComponentPropsWithoutRef<"h2">) {
  return (
    <h2
      className="mt-16 scroll-mt-24 border-t border-rule pt-8 font-display text-title text-ink kinetic first:mt-0"
      {...props}
    >
      {children}
    </h2>
  );
}

function H3({ children, ...props }: ComponentPropsWithoutRef<"h3">) {
  return (
    <h3
      className="mt-10 font-display text-lg font-semibold text-ink"
      {...props}
    >
      {children}
    </h3>
  );
}

function P({ children, ...props }: ComponentPropsWithoutRef<"p">) {
  return (
    <p className="mt-5 leading-[1.75] text-ink-muted" {...props}>
      {children}
    </p>
  );
}

function A({ href, children, ...props }: ComponentPropsWithoutRef<"a">) {
  const external = href?.startsWith("http");
  return (
    <a
      href={href}
      className="inline-flex items-baseline gap-0.5 text-accent underline decoration-accent-hairline underline-offset-4 transition-colors hover:decoration-current"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {children}
      {external && <ArrowUpRight className="size-3 self-center" />}
    </a>
  );
}

function Ul({ children, ...props }: ComponentPropsWithoutRef<"ul">) {
  return (
    <ul className="mt-5 space-y-2.5 text-ink-muted" {...props}>
      {children}
    </ul>
  );
}

function Ol({ children, ...props }: ComponentPropsWithoutRef<"ol">) {
  return (
    <ol
      className="mt-5 list-decimal space-y-2.5 pl-5 text-ink-muted"
      {...props}
    >
      {children}
    </ol>
  );
}

function Li({ children, ...props }: ComponentPropsWithoutRef<"li">) {
  return (
    <li
      className="relative pl-5 leading-[1.7] before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-2.5 before:bg-accent-hairline"
      {...props}
    >
      {children}
    </li>
  );
}

function Strong({ children, ...props }: ComponentPropsWithoutRef<"strong">) {
  return (
    <strong className="font-semibold text-ink" {...props}>
      {children}
    </strong>
  );
}

function Code({ children, ...props }: ComponentPropsWithoutRef<"code">) {
  return (
    <code
      className="rounded border border-rule bg-bg-elevated px-1.5 py-0.5 font-mono text-[0.85em] text-ink"
      {...props}
    >
      {children}
    </code>
  );
}

function Pre({ children, ...props }: ComponentPropsWithoutRef<"pre">) {
  return (
    <pre
      className="mt-6 overflow-x-auto rounded-lg border border-rule bg-bg-elevated p-4 font-mono text-sm"
      {...props}
    >
      {children}
    </pre>
  );
}

function Blockquote({
  children,
  ...props
}: ComponentPropsWithoutRef<"blockquote">) {
  return (
    <blockquote
      className="mt-6 border-l-2 border-accent-hairline pl-5 text-ink-muted italic"
      {...props}
    >
      {children}
    </blockquote>
  );
}

function Hr() {
  return <hr className="mt-12 border-0 border-t border-rule" />;
}

export const mdxComponents = {
  h2: H2,
  h3: H3,
  p: P,
  a: A,
  ul: Ul,
  ol: Ol,
  li: Li,
  strong: Strong,
  code: Code,
  pre: Pre,
  blockquote: Blockquote,
  hr: Hr,
};
