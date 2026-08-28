"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { subscribeScroll } from "@/components/motion/ScrollDriver";
import { usePointer } from "@/components/motion/PointerProvider";
import { stepWalk, type WalkState } from "./walk";

/**
 * Drives the sprite along the bottom of the page.
 *
 * All of the movement logic lives in `./walk.ts` as a pure function; this hook
 * is only the wiring — measure the range, feed frames in, write a transform
 * out, and tell React the two things the sprite needs (is he moving, which way
 * is he facing). Everything interesting is testable without a browser, which
 * matters because animation is the hardest kind of behaviour to eyeball and
 * `requestAnimationFrame` does not run at all in a hidden or headless page.
 *
 * Three things move him, in priority order:
 *
 *   • The CURSOR. He walks toward where your mouse is, at his own pace.
 *   • Your SCROLL, which nudges his destination when there is no cursor.
 *   • His own STROLL — a new spot every few seconds when nothing else is
 *     asking. Its absence is why an early version appeared not to walk at all.
 *
 * HIS POSITION SURVIVES REMOUNTING, which is the whole reason `stateRef` exists
 * rather than a local in the effect. Opening the chat swaps the walker out of
 * the tree entirely, so closing it remounts a fresh node and re-runs this
 * effect; with the position initialised inside the effect he snapped back to
 * the left edge every single time. The state is now owned by the component and
 * merely re-attached to whatever node is current, so he stands where you left
 * him.
 *
 * PAUSING IS AN INPUT, NOT A TEARDOWN, for the same reason. Passing `paused`
 * through to `stepWalk` keeps the subscription alive and the position intact;
 * flipping `enabled` to stop him would re-run this effect and reset him again.
 *
 * WHY IT RIDES `ScrollDriver` RATHER THAN ITS OWN LISTENER. An early version
 * used a passive `scroll` listener and did nothing whatsoever: in the preview
 * browser the document scrolls without ever dispatching `scroll` to `window`.
 * `ScrollDriver` polls `scrollY` inside a loop it runs anyway, so subscribing
 * to it is both the thing that works and one rAF loop instead of two. It is
 * also this hook's clock — the pointer is read from `PointerProvider`'s ref on
 * each of those frames rather than by joining its loop as well.
 *
 * Only `transform` is written, only when the value actually changed, and never
 * through React state — a re-render per frame would cost far more than the
 * animation. The two booleans React does see change a handful of times per
 * stroll, not per frame.
 */

/** Keeps him clear of the viewport edges. */
const EDGE_MARGIN = 16;
/**
 * rAF can hand back a huge delta after a background tab wakes up. Clamping it
 * stops him teleporting the length of the viewport on the first frame back.
 */
const MAX_FRAME_MS = 50;
/**
 * A cursor parked this long stops being something to follow and he goes back to
 * strolling. Without it he stands under an abandoned mouse pointer indefinitely,
 * which looks broken rather than attentive.
 */
const POINTER_IDLE_MS = 5_000;

export type Gait = { moving: boolean; facing: 1 | -1 };

export function useCompanionWalk(enabled: boolean, paused = false) {
  /**
   * A callback ref, because the node does not exist on the first render — the
   * companion renders nothing until it has mounted, and it is swapped out
   * entirely while the chat is open. `attached` makes "a node arrived" a
   * dependency like any other, while the node itself stays in a ref: it is a
   * DOM object to be mutated, not React state.
   */
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [attached, setAttached] = useState(false);
  const [gait, setGait] = useState<Gait>({ moving: false, facing: 1 });

  /** Survives remounting. See the note above. */
  const stateRef = useRef<WalkState | null>(null);

  const { pointer, enabled: pointerEnabled } = usePointer();

  // Read inside the frame callback so pausing never re-runs the effect.
  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const ref = useCallback((element: HTMLDivElement | null) => {
    nodeRef.current = element;
    setAttached(element !== null);
  }, []);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const span = () =>
      Math.max(0, window.innerWidth - node.offsetWidth - EDGE_MARGIN * 2);

    /**
     * Where the container sits when its transform is zero, and where the sprite
     * sits inside it. Measured on setup and on resize rather than per frame —
     * both are layout reads, and this loop is otherwise entirely write-only.
     */
    let baseLeft = 0;
    let spriteCentre = 0;
    const measure = () => {
      const state = stateRef.current;
      baseLeft = node.getBoundingClientRect().left - (state ? state.x : 0);
      const sprite = node.querySelector("button");
      spriteCentre = sprite
        ? sprite.offsetLeft + sprite.offsetWidth / 2
        : node.offsetWidth / 2;
    };

    if (stateRef.current === null) {
      // Start a little in from the left, out of the way of content. Only ever
      // on the very first mount — afterwards he keeps the position he had.
      const start = Math.min(span(), 24);
      stateRef.current = {
        x: start,
        target: start,
        facing: 1,
        moving: false,
        restUntil: performance.now(),
      };
    } else {
      // Re-attaching to a new node: the viewport may have changed while the
      // chat was covering him.
      const limit = span();
      stateRef.current = {
        ...stateRef.current,
        x: Math.min(stateRef.current.x, limit),
        target: Math.min(stateRef.current.target, limit),
      };
    }

    let painted = Number.NaN;
    const paint = () => {
      const state = stateRef.current;
      if (!state) return;
      // Same discipline as the loop this rides on: at rest, no style writes.
      const rounded = Math.round(state.x * 10) / 10;
      if (rounded === painted) return;
      painted = rounded;
      node.style.transform = `translate3d(${rounded}px, 0, 0)`;
    };
    paint();
    measure();

    if (!enabled) return;

    let last = performance.now();
    let seenX = Number.NaN;
    let seenY = Number.NaN;
    let pointerMovedAt = Number.NEGATIVE_INFINITY;

    const unsubscribe = subscribeScroll(({ delta }) => {
      const state = stateRef.current;
      if (!state) return;

      const now = performance.now();
      const elapsed = Math.min(now - last, MAX_FRAME_MS);
      last = now;

      // Freshness, not just presence: a cursor that has not moved is not a
      // cursor that is asking for company.
      const p = pointer.current;
      if (pointerEnabled && p.active && (p.x !== seenX || p.y !== seenY)) {
        seenX = p.x;
        seenY = p.y;
        pointerMovedAt = now;
      }
      const following =
        pointerEnabled && p.active && now - pointerMovedAt < POINTER_IDLE_MS;

      const next = stepWalk(state, {
        now,
        elapsed,
        scrollDelta: delta,
        limit: span(),
        pointerTarget: following ? p.x - baseLeft - spriteCentre : null,
        paused: pausedRef.current,
      });
      stateRef.current = next;

      paint();

      if (next.moving !== state.moving || next.facing !== state.facing) {
        setGait({ moving: next.moving, facing: next.facing });
      }
    });

    const onResize = () => {
      const state = stateRef.current;
      if (!state) return;
      const limit = span();
      stateRef.current = {
        ...state,
        x: Math.min(state.x, limit),
        target: Math.min(state.target, limit),
      };
      paint();
      measure();
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      unsubscribe();
      window.removeEventListener("resize", onResize);
    };
  }, [attached, enabled, pointer, pointerEnabled]);

  return { ref, gait };
}
