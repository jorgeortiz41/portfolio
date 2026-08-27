"use client";

import { useEffect, useRef } from "react";
import { usePointer } from "@/components/motion/PointerProvider";

/**
 * A cursor dot that trails the pointer and swells over interactive elements.
 *
 * Subscribes to the shared pointer loop rather than adding its own listener.
 * Only ever writes `transform` and `opacity`, both compositor-only properties,
 * so it never triggers layout or paint.
 */
export function MagneticCursor() {
  const { subscribe, enabled } = usePointer();
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const node = dot.current;
    if (!node) return;

    let x = 0;
    let y = 0;
    let scale = 1;
    let visible = false;

    const unsubscribe = subscribe((pointer) => {
      // Spring toward the pointer. Lower factor = more lag = more "trail".
      x += (pointer.x - x) * 0.18;
      y += (pointer.y - y) * 0.18;

      const target = document.elementFromPoint(pointer.x, pointer.y);
      const interactive = Boolean(
        target?.closest("a, button, summary, [role='button']"),
      );
      const targetScale = interactive ? 2.6 : 1;
      scale += (targetScale - scale) * 0.14;

      if (pointer.active !== visible) {
        visible = pointer.active;
        node.style.opacity = visible ? "1" : "0";
      }

      node.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
    });

    return unsubscribe;
  }, [subscribe, enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9998] size-3 rounded-full bg-accent opacity-0 mix-blend-difference will-change-transform"
    />
  );
}
