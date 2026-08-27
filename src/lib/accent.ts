import type { CSSProperties } from "react";

/**
 * A project supplies a single hue (0-360), never a hex colour.
 *
 * Lightness and chroma are held per theme in globals.css, so the composed
 * `oklch(var(--accent-l) var(--accent-c) var(--accent-h))` is legible against
 * both the light and the dark background by construction. A raw hex could not
 * make that guarantee — it would be fixed while the background flips.
 */
export const DEFAULT_ACCENT_HUE = 38;

/** Inline style that re-colours an entire subtree. Server-rendered: no flash. */
export function accentStyle(hue: number | undefined): CSSProperties {
  return { "--accent-h": String(hue ?? DEFAULT_ACCENT_HUE) } as CSSProperties;
}
