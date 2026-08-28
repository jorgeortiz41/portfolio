/**
 * The long-form bio, in one place.
 *
 * These paragraphs render on the About page and are also fed verbatim into the
 * companion's knowledge dossier (`src/lib/chat/knowledge.ts`). They lived as
 * hardcoded JSX in the About page until the chatbot needed them too — and a
 * second copy of the bio is exactly the kind of silent desync the
 * `linkCompanies` note in `experience.ts` warns about.
 *
 * Plain strings, not JSX: the dossier needs text, and the About page only ever
 * wrapped each one in a `<p>`.
 */
export const bio: readonly string[] = [
  "I'm a software engineer from Puerto Rico, in my final semester. The domains have varied a lot — radio telescope instrumentation, an SMS marketing platform, esports analytics, threat intelligence — and what I specialize in now is the part that carries across all of them: the architecture around a system's clever bit, rather than the clever bit itself. Increasingly that clever bit is a model.",
  "Integrating AI well is mostly ordinary engineering done carefully. On ARGUS the language model orchestrates and phrases, but never sources a fact — every claim in a briefing traces back to a cited API response, by construction. On the academic platform a data-residency constraint pushed the design toward local inference and a single database holding both the vectors and the relational data. In both cases the model is one component with a failure mode, designed for like any other dependency that can be wrong.",
  "Before that: full-stack product work at LeadWire and Red Ventures, and research engineering at the Arecibo Observatory, where I built instrumentation software for radio science. Right now I'm finishing my degree and learning Rust by writing a shell.",
] as const;
