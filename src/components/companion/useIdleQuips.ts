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
 * and then on a slow timer. Recently-used lines are held back so the same quip
 * does not land twice in one visit.
 */

/** Delay after a route change before the sprite comments on it. */
const ROUTE_DELAY_MS = 2_600;
/** Gap between unprompted quips. */
const IDLE_MIN_MS = 26_000;
const IDLE_MAX_MS = 48_000;
/** How long a bubble stays up. */
const VISIBLE_MS = 6_500;
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

    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (fn: () => void, ms: number) => {
      timers.push(setTimeout(fn, ms));
    };

    const speak = () => {
      const pool = matching(pathname);
      const fresh = pool.filter((q) => !recent.current.includes(q.text));
      const candidates = fresh.length > 0 ? fresh : pool;
      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      if (!chosen) return;

      recent.current = [chosen.text, ...recent.current].slice(0, MEMORY);
      setQuip(chosen.text);
      later(() => setQuip(null), VISIBLE_MS);
      later(speak, IDLE_MIN_MS + Math.random() * (IDLE_MAX_MS - IDLE_MIN_MS));
    };

    later(speak, ROUTE_DELAY_MS);

    return () => {
      for (const timer of timers) clearTimeout(timer);
      setQuip(null);
    };
  }, [enabled, pathname]);

  // Derived rather than cleared in the effect: when the hook is switched off the
  // answer is "nothing", and writing that into state would just be a second
  // source of truth for the same fact.
  return enabled ? quip : null;
}
