"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";

/**
 * The quip bubble.
 *
 * Stepped corners rather than a border-radius: a rounded rectangle next to a
 * hard-edged 16x16 sprite reads as two different drawings. The steps are four
 * inset pseudo-free spans on the container, done with `clip-path` so there is no
 * extra markup.
 *
 * `aria-hidden` because these are ambient decoration. They are not addressed to
 * the viewer, they appear unprompted every half minute, and narrating them would
 * interrupt a screen-reader user mid-sentence for a pun. The chat panel, which
 * *is* addressed to the viewer, is announced properly.
 */

/** ms per character of the typewriter reveal. */
const TYPE_MS = 18;

export function SpeechBubble({
  text,
  animate,
  className,
}: {
  text: string;
  /** False under reduced motion — the line appears whole. */
  animate: boolean;
  className?: string;
}) {
  // Mounted fresh for every quip — the caller keys this component on `text` —
  // so the initial value is always right and the effect never has to reset it.
  const [shown, setShown] = useState(animate ? 0 : text.length);

  useEffect(() => {
    if (!animate) return;

    let index = 0;
    const id = setInterval(() => {
      index += 1;
      setShown(index);
      if (index >= text.length) clearInterval(id);
    }, TYPE_MS);

    return () => clearInterval(id);
  }, [text, animate]);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none max-w-[15rem] border border-rule-strong bg-bg-elevated px-3 py-2 font-mono text-[0.6875rem] leading-relaxed text-ink",
        // Corners clipped one pixel in on each side, so the box is faceted the
        // same way the sprite is.
        "[clip-path:polygon(3px_0,calc(100%-3px)_0,100%_3px,100%_calc(100%-3px),calc(100%-3px)_100%,3px_100%,0_calc(100%-3px),0_3px)]",
        className,
      )}
    >
      {text.slice(0, shown)}
      {shown < text.length && (
        <span className="text-accent" aria-hidden="true">
          _
        </span>
      )}
    </div>
  );
}
