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
 */
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
      const delta = Math.abs(y - lastY);
      lastY = y;

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
