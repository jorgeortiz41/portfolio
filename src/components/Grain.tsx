/**
 * Film grain. One fixed SVG turbulence overlay — no animation, no JS, and it
 * does more for the site's texture than any moving effect. Hidden entirely
 * under prefers-reduced-motion (see globals.css).
 */
export function Grain() {
  return (
    <div className="grain-overlay" aria-hidden="true">
      <svg className="size-full">
        <filter id="grain-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves={4}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-noise)" />
      </svg>
    </div>
  );
}
