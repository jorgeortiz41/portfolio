"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePointer } from "@/components/motion/PointerProvider";
import { useCursorEffectsEnabled } from "@/lib/capabilities";
import type { ProjectSummary } from "@/lib/schema";
import { accentStyle } from "@/lib/accent";

/**
 * Summons a project's cover art to trail the cursor while its row is hovered.
 *
 * Hover is caught by delegation on the container, keyed off the
 * `data-project-slug` the row already carries — so the rows stay server
 * components and this adds no per-row JS.
 *
 * Fine pointers only. Touch gets the list with no preview layer, which is the
 * better experience there anyway.
 */
export function CursorPreview({
  projects,
  children,
}: {
  projects: ProjectSummary[];
  children: ReactNode;
}) {
  const enabled = useCursorEffectsEnabled();
  const { subscribe, pointer } = usePointer();
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  // Hover detection by delegation.
  useEffect(() => {
    if (!enabled) return;
    const container = containerRef.current;
    if (!container) return;

    const onOver = (event: PointerEvent) => {
      const row = (event.target as HTMLElement)?.closest?.(
        "[data-project-slug]",
      );
      setActiveSlug(row?.getAttribute("data-project-slug") ?? null);
    };
    const onLeave = () => setActiveSlug(null);

    container.addEventListener("pointerover", onOver);
    container.addEventListener("pointerleave", onLeave);
    return () => {
      container.removeEventListener("pointerover", onOver);
      container.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  // Position, driven off the shared pointer loop.
  useEffect(() => {
    if (!enabled || !activeSlug) return;
    const layer = layerRef.current;
    if (!layer) return;

    let x = pointer.current.x;
    let y = pointer.current.y;

    return subscribe((p) => {
      x += (p.x - x) * 0.13;
      y += (p.y - y) * 0.13;
      layer.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    });
  }, [enabled, activeSlug, subscribe, pointer]);

  return (
    <div ref={containerRef} className="relative">
      {children}

      {enabled && (
        <div
          ref={layerRef}
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-40 hidden will-change-transform lg:block"
        >
          {projects.map((project) => (
            <div
              key={project.slug}
              style={accentStyle(project.accent)}
              className={`absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 transition-[opacity,scale] duration-300 ease-out ${
                project.slug === activeSlug
                  ? "scale-100 opacity-100"
                  : "scale-90 opacity-0"
              }`}
            >
              {project.cover && (
                <Image
                  src={project.cover.src}
                  alt=""
                  width={project.cover.width}
                  height={project.cover.height}
                  className="w-[22rem] rounded-lg border border-accent-hairline object-cover shadow-2xl"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
