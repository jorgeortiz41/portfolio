"use client";

import { useEffect, useRef, useState } from "react";
import { usePointer } from "@/components/motion/PointerProvider";
import { useCanvasEnabled } from "@/lib/capabilities";

type Node = { x: number; y: number; vx: number; vy: number; r: number };

/**
 * Drifting entity graph behind the hero — a visual echo of the relationship
 * graphs ARGUS builds. Decorative, so aria-hidden.
 *
 * This is the only genuinely expensive effect on the site, so it is budgeted
 * hard: capped node count, DPR clamped to 2, no per-frame allocation, and it
 * stops completely whenever it is off-screen or the tab is hidden. It also
 * mounts on idle, so it never competes with first paint or the decode.
 */
const MAX_NODES_DESKTOP = 54;
const MAX_NODES_MOBILE = 22;
const LINK_DISTANCE = 150;
const POINTER_RADIUS = 190;

export function NodeGraph() {
  const enabled = useCanvasEnabled();
  const { subscribe, pointer } = usePointer();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  // Defer past first paint and past the decode animation.
  useEffect(() => {
    if (!enabled) return;
    const idle =
      window.requestIdleCallback ??
      ((cb: IdleRequestCallback) =>
        window.setTimeout(
          () => cb({ didTimeout: false, timeRemaining: () => 0 }),
          600,
        ));
    const handle = idle(() => setReady(true), { timeout: 1400 });
    return () => {
      if (window.cancelIdleCallback)
        window.cancelIdleCallback(handle as number);
      else clearTimeout(handle as number);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const nodes: Node[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let running = false;
    let accent = "oklch(0.8 0.145 38)";

    const readAccent = () => {
      accent =
        getComputedStyle(canvas).getPropertyValue("color").trim() || accent;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // DPR above 2 buys nothing visible here and costs 2x+ the fill rate.
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = width < 768 ? MAX_NODES_MOBILE : MAX_NODES_DESKTOP;
      nodes.length = 0;
      for (let i = 0; i < target; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: 1 + Math.random() * 1.6,
        });
      }
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const px = pointer.current.active ? pointer.current.x - rect.left : -9999;
      const py = pointer.current.active ? pointer.current.y - rect.top : -9999;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i] as Node;
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }

      // Edges. O(n^2) over <=54 nodes is ~1.4k cheap comparisons per frame.
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i] as Node;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j] as Node;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > LINK_DISTANCE) continue;
          ctx.globalAlpha = (1 - dist / LINK_DISTANCE) * 0.16;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = accent;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i] as Node;
        const near =
          1 - Math.min(Math.hypot(n.x - px, n.y - py) / POINTER_RADIUS, 1);
        ctx.globalAlpha = 0.22 + near * 0.65;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + near * 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    };

    const start = () => {
      if (running) return;
      running = true;
      // Paint one frame synchronously so the canvas is never briefly blank
      // between becoming visible and the first animation tick.
      draw();
      unsubscribe = subscribe(draw);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      unsubscribe?.();
      unsubscribe = undefined;
      ctx.clearRect(0, 0, width, height);
    };

    let unsubscribe: (() => void) | undefined;

    readAccent();
    resize();

    // Stop the moment the hero scrolls away — this is what keeps the canvas
    // from costing anything on the rest of the page.
    const observer = new IntersectionObserver(
      ([entry]) => (entry?.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    observer.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (canvas.getBoundingClientRect().bottom > 0) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      readAccent();
    });
    resizeObserver.observe(canvas);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
    };
  }, [enabled, ready, subscribe, pointer]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      // `color` carries the accent into the canvas so JS can read one resolved
      // value instead of recomposing the oklch() itself.
      className="pointer-events-none absolute inset-0 -z-10 size-full text-accent transition-opacity duration-1000"
      style={{ opacity: ready ? 1 : 0 }}
      data-ready={ready}
    />
  );
}
