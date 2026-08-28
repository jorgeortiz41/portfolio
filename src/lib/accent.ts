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

/**
 * OKLCH -> sRGB hex.
 *
 * Satori (which renders the OG images) cannot parse `oklch()`, but the site's
 * whole accent system is OKLCH. Converting here rather than hardcoding hex per
 * project keeps the social card provably the same colour as the page: both are
 * derived from the one hue in frontmatter.
 *
 * Uses the dark theme's lightness/chroma, since the OG cards are always dark.
 */
const OG_L = 0.8;
const OG_C = 0.145;

function gammaEncode(channel: number): number {
  const v =
    channel <= 0.0031308
      ? 12.92 * channel
      : 1.055 * Math.pow(channel, 1 / 2.4) - 0.055;
  return Math.round(Math.min(Math.max(v, 0), 1) * 255);
}

export function oklchToHex(l: number, c: number, hDeg: number): string {
  const h = (hDeg * Math.PI) / 180;
  const a = c * Math.cos(h);
  const b = c * Math.sin(h);

  // OKLab -> LMS
  const lms = [
    l + 0.3963377774 * a + 0.2158037573 * b,
    l - 0.1055613458 * a - 0.0638541728 * b,
    l - 0.0894841775 * a - 1.291485548 * b,
  ].map((v) => v ** 3) as [number, number, number];

  // LMS -> linear sRGB
  const [L, M, S] = lms;
  const r = 4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S;
  const g = -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S;
  const bl = -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S;

  return (
    "#" +
    [r, g, bl]
      .map((ch) => gammaEncode(ch).toString(16).padStart(2, "0"))
      .join("")
  );
}

/** The accent for a given project hue, as hex, for contexts that need sRGB. */
export function accentHex(hue: number = DEFAULT_ACCENT_HUE): string {
  return oklchToHex(OG_L, OG_C, hue);
}
