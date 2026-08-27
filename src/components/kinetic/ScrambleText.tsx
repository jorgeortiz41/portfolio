"use client";

import { useEffect, useRef } from "react";
import { useMotionEnabled } from "@/lib/capabilities";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&$@/\\<>[]{}*+=~";

/**
 * Resolves text out of scrambling characters.
 *
 * The rule that matters: `text` is rendered as real text in the server HTML and
 * the effect mutates it from there. Never the reverse — scrambled placeholder
 * markup would be what Google indexes and what shows before hydration.
 *
 * The animating copy is aria-hidden with the real string on the wrapper, so
 * assistive tech announces the finished sentence and never the intermediate
 * garbage.
 */
export function ScrambleText({
  text,
  className,
  /** ms before the reveal starts — used to stagger against other hero motion. */
  delay = 0,
  /** ms per character of reveal. */
  speed = 26,
}: {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionEnabled = useMotionEnabled();

  useEffect(() => {
    if (!motionEnabled) return;
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    let start: number | null = null;

    // Whitespace is never scrambled — otherwise word boundaries shift and the
    // headline visibly rewraps while it resolves.
    const chars = [...text];
    const revealAt = chars.map((_, i) => i * speed);
    const total = revealAt[revealAt.length - 1] ?? 0;

    const tick = (now: number) => {
      start ??= now;
      const elapsed = now - start;

      let output = "";
      for (let i = 0; i < chars.length; i++) {
        const char = chars[i] as string;
        if (/\s/.test(char) || elapsed >= (revealAt[i] ?? 0)) {
          output += char;
        } else {
          output += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
      }
      node.textContent = output;

      if (elapsed < total) {
        frame = requestAnimationFrame(tick);
      } else {
        node.textContent = text;
      }
    };

    const timer = setTimeout(() => {
      frame = requestAnimationFrame(tick);
    }, delay);

    /**
     * Guarantee the headline resolves.
     *
     * requestAnimationFrame is paused in background tabs and throttled in some
     * embedded contexts, which leaves the scramble frozen mid-garble on the most
     * important sentence on the site. This wall-clock deadline force-completes
     * it regardless of whether a single frame ever ran.
     */
    const deadline = setTimeout(
      () => {
        cancelAnimationFrame(frame);
        node.textContent = text;
      },
      delay + total + 400,
    );

    return () => {
      clearTimeout(timer);
      clearTimeout(deadline);
      cancelAnimationFrame(frame);
      node.textContent = text;
    };
  }, [text, delay, speed, motionEnabled]);

  return (
    <span className={className} aria-label={text}>
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
