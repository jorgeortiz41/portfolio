import { ChevronDown } from "@/components/icons";

/**
 * The section's premise, stated plainly.
 *
 * This is the actual portfolio artifact — the point is not the posts, it is
 * that a scheduled agent researches, drafts and files them unattended. So the
 * panel is specific about the mechanism rather than hedging with a disclaimer,
 * and it shows the real prompt: the prompt is the more convincing evidence.
 */

const PROMPT = `Research the past week's news (roughly the last 7 days) in these
areas: Software Engineering, Full Stack Web Development, AI/ML, and Puerto Rico
(tech/business/economy news relevant to Puerto Rico). Use web search to find
notable, recent, relevant stories, launches, trends, or discussions in each area.

Then write three full blog post drafts, each based on a different notable news
item you found (prioritize a mix across the topic areas rather than three posts
on the same story). Each article should be a complete, well-structured,
medium-length blog post of roughly 800-1200 words, written in Markdown.

Write each article to content/posts/<YYYY-MM-DD>-<kebab-slug>.mdx, with YAML
frontmatter matching postFrontmatterSchema in src/lib/schema.ts. Then push
branch posts/<YYYY-MM-DD> and open a PR. Do not push to main.`;

const facts = [
  { label: "Author", value: "A scheduled Claude agent" },
  { label: "Beat", value: "Software engineering, AI/ML, Puerto Rico" },
  { label: "Cadence", value: "Three posts, three times a week" },
  { label: "Human input", value: "Merging the pull request" },
];

export function WirePreamble() {
  return (
    <section
      aria-labelledby="how-this-works"
      className="mt-12 border-t border-rule pt-8"
    >
      <h2
        id="how-this-works"
        className="font-mono text-[0.6875rem] tracking-[0.22em] text-ink-faint uppercase"
      >
        How this works
      </h2>

      <p className="mt-5 max-w-2xl text-ink-muted">
        A scheduled task runs three times a week. It searches the past
        week&apos;s news across its beat, picks three stories, writes each one
        up at 800&ndash;1200 words, commits the files to this repository and
        opens a pull request. Everything you read here is the agent&apos;s first
        draft — I merge, I don&apos;t rewrite.
      </p>

      <dl className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {facts.map((fact) => (
          <div key={fact.label} className="border-t border-rule pt-4">
            <dt className="font-mono text-[0.625rem] tracking-[0.18em] text-ink-faint uppercase">
              {fact.label}
            </dt>
            <dd className="mt-2 text-sm text-ink-muted">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <details className="group mt-8 border-t border-rule pt-4">
        <summary className="tap-target flex cursor-pointer list-none items-center gap-2 font-mono text-[0.6875rem] tracking-[0.16em] text-ink-faint uppercase transition-colors hover:text-ink focus-visible:text-ink">
          <ChevronDown className="size-3.5 transition-transform duration-300 group-open:rotate-180 motion-reduce:transform-none" />
          The prompt it runs on
        </summary>
        <pre className="mt-4 overflow-x-auto rounded-lg border border-rule bg-bg-elevated p-5 font-mono text-xs leading-relaxed whitespace-pre-wrap text-ink-muted">
          {PROMPT}
        </pre>
      </details>
    </section>
  );
}
