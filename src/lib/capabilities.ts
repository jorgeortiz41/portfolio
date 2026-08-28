"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * The degradation ladder, in one place.
 *
 * Six effects run on this site and every one of them needs to know when to
 * switch off. Centralising the checks here is what stops each component from
 * inventing its own slightly-different rule.
 *
 * These are all `useSyncExternalStore` rather than `useState` + `useEffect`:
 * matchMedia and `navigator` are external stores, and this is the primitive
 * built for reading them. It also gives an explicit server snapshot, so every
 * effect is off in the server HTML and turns on only after hydration.
 */

const neverChanges = () => () => {};
const serverFalse = () => false;

function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onStoreChange);
      return () => mql.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  return useSyncExternalStore(subscribe, getSnapshot, serverFalse);
}

/** Rung 1: the user asked for less motion. Everything expressive switches off. */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** Rung 2: no precise pointer — no magnetic cursor, no cursor-following preview. */
export function useFinePointer(): boolean {
  return useMediaQuery("(pointer: fine)");
}

/**
 * Rung 3: narrow viewports. The companion docks in the corner instead of
 * wandering — there is no width to wander across, and a sprite crossing a phone
 * screen would spend most of its time on top of the thing you are reading.
 */
export function useWideViewport(): boolean {
  return useMediaQuery("(min-width: 640px)");
}

/**
 * Rung 4: a coarse low-end heuristic. Deliberately conservative — it only
 * disables the canvas, the single genuinely expensive effect.
 */
function getLowPowerSnapshot(): boolean {
  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  return cores <= 4 || (memory !== undefined && memory <= 4);
}

export function useLowPowerDevice(): boolean {
  return useSyncExternalStore(neverChanges, getLowPowerSnapshot, serverFalse);
}

/**
 * True only after hydration. Effects that must not appear in server HTML (the
 * canvas, the cursor layer) gate on this so they cannot mismatch.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(neverChanges, () => true, serverFalse);
}

/** Composite: should expressive motion run at all? */
export function useMotionEnabled(): boolean {
  const reduced = useReducedMotion();
  const mounted = useMounted();
  return mounted && !reduced;
}

/** Composite: should the cursor-driven layer mount? */
export function useCursorEffectsEnabled(): boolean {
  const motion = useMotionEnabled();
  const fine = useFinePointer();
  return motion && fine;
}

/** Composite: should the node-graph canvas mount? */
export function useCanvasEnabled(): boolean {
  const motion = useMotionEnabled();
  const lowPower = useLowPowerDevice();
  return motion && !lowPower;
}
