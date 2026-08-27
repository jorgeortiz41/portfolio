"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { useCursorEffectsEnabled } from "@/lib/capabilities";

export type PointerState = {
  /** Viewport coordinates. */
  x: number;
  y: number;
  /** False before the pointer has ever moved, and after it leaves the window. */
  active: boolean;
};

type FrameCallback = (state: PointerState) => void;

type PointerContextValue = {
  pointer: RefObject<PointerState>;
  /** Join the shared rAF loop. Returns an unsubscribe. */
  subscribe: (fn: FrameCallback) => () => void;
  enabled: boolean;
};

const PointerContext = createContext<PointerContextValue | null>(null);

/**
 * One pointermove listener and one rAF loop for the entire site.
 *
 * The magnetic cursor, the cursor-following work previews and the node-graph
 * canvas all need pointer position. Three components each opening their own
 * listener and their own loop would cost three times as much and would visibly
 * desync from each other. They subscribe here instead.
 *
 * The loop only runs while something is subscribed, so pages with no
 * cursor-driven effects pay nothing.
 */
export function PointerProvider({ children }: { children: ReactNode }) {
  const enabled = useCursorEffectsEnabled();
  const pointer = useRef<PointerState>({ x: 0, y: 0, active: false });
  const subscribers = useRef(new Set<FrameCallback>());
  const frame = useRef<number | null>(null);

  const runLoop = useCallback(() => {
    const tick = () => {
      const state = pointer.current;
      for (const fn of subscribers.current) fn(state);

      if (subscribers.current.size > 0) {
        frame.current = requestAnimationFrame(tick);
      } else {
        frame.current = null;
      }
    };

    if (frame.current === null) {
      frame.current = requestAnimationFrame(tick);
    }
  }, []);

  const subscribe = useCallback(
    (fn: FrameCallback) => {
      subscribers.current.add(fn);
      runLoop();
      return () => {
        subscribers.current.delete(fn);
      };
    },
    [runLoop],
  );

  useEffect(() => {
    if (!enabled) return;

    const onMove = (event: PointerEvent) => {
      pointer.current.x = event.clientX;
      pointer.current.y = event.clientY;
      pointer.current.active = true;
    };
    const onLeave = () => {
      pointer.current.active = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  useEffect(() => {
    const current = frame;
    return () => {
      if (current.current !== null) cancelAnimationFrame(current.current);
    };
  }, []);

  const value = useMemo<PointerContextValue>(
    () => ({ pointer, subscribe, enabled }),
    [subscribe, enabled],
  );

  return (
    <PointerContext.Provider value={value}>{children}</PointerContext.Provider>
  );
}

export function usePointer(): PointerContextValue {
  const context = useContext(PointerContext);
  if (!context) {
    throw new Error("usePointer must be used inside <PointerProvider>");
  }
  return context;
}
