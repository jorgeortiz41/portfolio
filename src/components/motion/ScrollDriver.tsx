"use client";

import { useEffect } from "react";
import { useReducedMotion } from "@/lib/capabilities";

/**
 * The site's single scroll loop.
 *
 * Writes one number — `--scroll-v`, smoothed velocity in 0..1 — to the document
 * root once per frame. Every kinetic element derives its font axes from that in
 * pure CSS, so this never touches an individual element's style. The old site
 * ran an unthrottled scroll handler doing five getBoundingClientRect() reads per
 * event; this does zero layout reads.
 *
 * It also hands out the raw signed frame delta to anything that needs scroll in
 * JS rather than CSS — currently the companion, which walks in the direction you
 * scroll and so needs a sign that `--scroll-v` deliberately throws away.
 *
 * Note that this polls `scrollY` rather than listening for `scroll` events. That
 * was already true and it turns out to be load-bearing: in some embedded and
 * automated browsers the document scrolls without dispatching a `scroll` event
 * to `window` at all, and a listener-based version of this silently does
 * nothing. Subscribers get the same guarantee for free.
 */

export type ScrollFrame = {
  /** Current scroll offset. */
  y: number;
  /** Signed pixels moved since the previous frame. Zero when at rest. */
  delta: number;
};

/**
 * A module singleton rather than a context: there is exactly one document and
 * one scroll position, the provider would wrap the entire tree to say so, and
 * `<ScrollDriver />` is already mounted once in the root layout.
 */
const subscribers = new Set<(frame: ScrollFrame) => void>();

/** Join the scroll loop. Returns an unsubscribe. */
export function subscribeScroll(fn: (frame: ScrollFrame) => void): () => void {
  subscribers.add(fn);
  return () => {
    subscribers.delete(fn);
  };
}
export function ScrollDriver() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.style.removeProperty("--scroll-v");
      return;
    }

    const root = document.documentElement;
    let lastY = window.scrollY;
    let velocity = 0;
    let published = -1;
    let frame = 0;

    // Velocity at which the effect is fully expressed, in px/frame.
    const MAX_VELOCITY = 55;
    // Exponential smoothing — low enough that a flick ramps rather than snaps.
    const SMOOTHING = 0.12;

    const tick = () => {
      const y = window.scrollY;
      const signed = y - lastY;
      const delta = Math.abs(signed);
      lastY = y;

      if (subscribers.size > 0) {
        // Named `payload`, not `frame`: `frame` is the rAF handle in the
        // enclosing scope, and shadowing it here reads like a bug every time.
        const payload = { y, delta: signed };
        for (const fn of subscribers) fn(payload);
      }

      const target = Math.min(delta / MAX_VELOCITY, 1);
      velocity += (target - velocity) * SMOOTHING;

      // Only touch the DOM when the value actually moved. At rest this loop
      // does no style writes at all.
      const rounded = Math.round(velocity * 100) / 100;
      if (rounded !== published) {
        published = rounded;
        root.style.setProperty("--scroll-v", String(rounded));
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      root.style.removeProperty("--scroll-v");
    };
  }, [reducedMotion]);

  return null;
}
