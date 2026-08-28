"use client";

import { Fragment, useEffect, useRef } from "react";
import { useMotionEnabled } from "@/lib/capabilities";

/**
 * A decrypt sweep, not a full-line scramble.
 *
 * The first version scrambled every unresolved character at once, using a wide
 * uppercase charset. At display size that is genuinely disorienting: caps carry
 * a lot of visual mass, and because each random glyph has a different advance
 * width, the whole headline jittered and rewrapped on every frame.
 *
 * This version fixes both:
 *
 * 1. Layout is locked. Every character is rendered in its final form and the
 *    flicker glyph is painted in an overlay on top, so the line never reflows —
 *    characters change in place.
 * 2. Only a short window of characters at the reveal head flickers. Everything
 *    ahead of it sits dim; everything behind is resolved. The eye tracks one
 *    moving edge instead of the whole line boiling.
 * 3. The charset is narrow and lowercase-biased, so the noise reads as machine
 *    output rather than shouting.
 *
 * Server-rendering rule is unchanged and load-bearing: `text` renders as real
 * text and the effect works from it, so crawlers never see gibberish.
 */

// Narrow, low-mass glyphs. No capitals — they dominate at display sizes.
const GLYPHS = "01<>[]{}/\\|_-=+*:;.^~aceinorstuvxz";

const randomGlyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0] as string;

export function ScrambleText({
  text,
  className,
  /** ms before the sweep starts. */
  delay = 0,
  /** total ms for the head to cross the whole string. */
  duration = 850,
  /** how many characters flicker at the head at once. */
  window: windowSize = 9,
}: {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  window?: number;
}) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const motionEnabled = useMotionEnabled();

  useEffect(() => {
    if (!motionEnabled) return;
    const root = rootRef.current;
    if (!root) return;

    const cells = Array.from(
      root.querySelectorAll<HTMLElement>("[data-cell]"),
    ).map((cell) => ({
      real: cell.querySelector<HTMLElement>("[data-real]"),
      fx: cell.querySelector<HTMLElement>("[data-fx]"),
    }));
    if (cells.length === 0) return;

    const total = cells.length;
    let frame = 0;
    let start: number | null = null;

    const settle = () => {
      for (const { real, fx } of cells) {
        if (real) real.style.opacity = "1";
        if (fx) {
          fx.style.opacity = "0";
          fx.textContent = "";
        }
      }
    };

    const tick = (now: number) => {
      start ??= now;
      const progress = Math.min((now - start) / duration, 1);
      const head = progress * (total + windowSize);

      for (let i = 0; i < total; i++) {
        const cell = cells[i];
        if (!cell) continue;
        const { real, fx } = cell;

        if (i < head - windowSize) {
          // resolved
          if (real) real.style.opacity = "1";
          if (fx && fx.style.opacity !== "0") {
            fx.style.opacity = "0";
            fx.textContent = "";
          }
        } else if (i <= head) {
          // in the flicker window
          if (real) real.style.opacity = "0";
          if (fx) {
            fx.style.opacity = "1";
            fx.textContent = randomGlyph();
          }
        } else {
          // not yet reached
          if (real) real.style.opacity = "0.1";
          if (fx && fx.style.opacity !== "0") {
            fx.style.opacity = "0";
            fx.textContent = "";
          }
        }
      }

      if (progress < 1) frame = requestAnimationFrame(tick);
      else settle();
    };

    const startTimer = setTimeout(() => {
      frame = requestAnimationFrame(tick);
    }, delay);

    /**
     * requestAnimationFrame is paused in background tabs, which would otherwise
     * leave the most important sentence on the site frozen mid-decrypt. This
     * wall-clock deadline force-completes it whether or not a frame ever ran.
     */
    const deadline = setTimeout(settle, delay + duration + 400);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(deadline);
      cancelAnimationFrame(frame);
      settle();
    };
  }, [text, delay, duration, windowSize, motionEnabled]);

  // Split by word so the headline still wraps at word boundaries; each word is
  // an inline-block of per-character cells.
  const words = text.split(" ");

  return (
    <span ref={rootRef} className={className} aria-label={text}>
      {words.map((word, w) => (
        <Fragment key={`${word}-${w}`}>
          <span className="inline-block whitespace-nowrap">
            {[...word].map((char, i) => (
              <span
                key={`${char}-${i}`}
                data-cell=""
                className="relative inline-block"
                aria-hidden="true"
              >
                <span data-real="">{char}</span>
                <span
                  data-fx=""
                  className="pointer-events-none absolute top-0 left-0 text-accent opacity-0"
                />
              </span>
            ))}
          </span>
          {w < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
