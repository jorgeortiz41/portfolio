"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { quips, type Quip } from "@/data/persona";

/**
 * The ambient chatter.
 *
 * Entirely local — `src/data/persona.ts` holds the lines and nothing here
 * touches the network. An idle bubble has to be free and instant; one API call
 * per quip would be a recurring bill for something nobody asked a question to
 * receive, and a visible pause before a joke is not a joke.
 *
 * Fires shortly after a route change (the sprite reacting to where you went)
 * and then on a timer. Recently-used lines are held back so the same quip does
 * not land twice in one visit.
 *
 * THIS KNOWS NOTHING ABOUT WALKING, ON PURPOSE. The causation runs the other
 * way: a quip appearing is what makes the companion stop, not the reverse (see
 * the delivery beat in `Companion`). So he speaks just as often whether he is
 * chasing the cursor, strolling, or standing still — which is the whole point
 * of keeping the schedule here rather than in the walk loop.
 */

/** Delay after a route change before the sprite comments on it. */
const ROUTE_DELAY_MS = 2_600;
/**
 * Gap between unprompted quips.
 *
 * This used to be 26-48s, which averages 37 seconds of silence. That read as
 * sparse once he was in motion most of the time — a long gap is much more
 * noticeable beside a character who is visibly doing something than beside one
 * standing still. Roughly halved.
 */
const IDLE_MIN_MS = 13_000;
const IDLE_MAX_MS = 24_000;
/** How long a bubble stays up. */
const VISIBLE_MS = 5_600;
/** Lines held back before they may repeat. */
const MEMORY = 8;

function matching(pathname: string): Quip[] {
  const scoped = quips.filter(
    (q) =>
      q.route !== "*" &&
      (q.route === "/" ? pathname === "/" : pathname.startsWith(q.route)),
  );
  const global = quips.filter((q) => q.route === "*");
  return [...scoped, ...global];
}

export function useIdleQuips(enabled: boolean): string | null {
  const pathname = usePathname();
  const [quip, setQuip] = useState<string | null>(null);
  const recent = useRef<string[]>([]);

  useEffect(() => {
    if (!enabled) return;

    // Two handles rather than an ever-growing array: at any moment there is one
    // pending hide and one pending next-quip, and the old version pushed a new
    // entry per quip and never released any of them.
    let hide: ReturnType<typeof setTimeout> | undefined;
    let next: ReturnType<typeof setTimeout> | undefined;

    const scheduleNext = () => {
      next = setTimeout(
        speak,
        IDLE_MIN_MS + Math.random() * (IDLE_MAX_MS - IDLE_MIN_MS),
      );
    };

    function speak() {
      const pool = matching(pathname);
      const fresh = pool.filter((q) => !recent.current.includes(q.text));
      const candidates = fresh.length > 0 ? fresh : pool;
      const chosen = candidates[Math.floor(Math.random() * candidates.length)];

      // Reschedule even when there is nothing to say. Returning early here
      // broke the chain permanently — one empty pool and the companion went
      // silent for the rest of the visit, with no way to tell from the outside.
      if (!chosen) {
        scheduleNext();
        return;
      }

      recent.current = [chosen.text, ...recent.current].slice(0, MEMORY);
      setQuip(chosen.text);
      hide = setTimeout(() => setQuip(null), VISIBLE_MS);
      scheduleNext();
    }

    next = setTimeout(speak, ROUTE_DELAY_MS);

    return () => {
      clearTimeout(hide);
      clearTimeout(next);
      setQuip(null);
    };
  }, [enabled, pathname]);

  // Derived rather than cleared in the effect: when the hook is switched off the
  // answer is "nothing", and writing that into state would just be a second
  // source of truth for the same fact.
  return enabled ? quip : null;
}
