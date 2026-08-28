import { GRID, runsFor, type Facing, type Pose } from "./sprite";

/**
 * The sprite itself. Pure, presentational, no state of its own.
 *
 * `shapeRendering="crispEdges"` is the whole trick: it turns off antialiasing
 * on the rect edges, so a 32-unit viewBox scaled to 80px stays hard-edged pixel
 * art instead of a blurry vector drawing. Without it the browser interpolates
 * every rect boundary and the shading ramp turns to mush.
 *
 * NO CSS FILTER ON THIS ELEMENT. It used to carry `drop-shadow-lg`, which is a
 * `filter`, which forces the browser to re-run a blur over the element's box on
 * every frame it moves. Chrome absorbed that; Safari did not, and the walk was
 * visibly heavier there. A moving element wants transform and nothing else. If
 * the sprite ever needs grounding, the cheap version is a couple of dark pixels
 * drawn into the frame itself, not a filter.
 *
 * The rect list comes from `runsFor`, which memoises per pose+view — the eleven
 * frames never change, so building them on each render was per-render work
 * inside an animation.
 */
export function PixelAvatar({
  pose,
  facing = "front",
  flip = 1,
  className,
}: {
  pose: Pose;
  facing?: Facing;
  /** 1 draws as authored (facing right); -1 mirrors it to face left. */
  flip?: 1 | -1;
  className?: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${GRID} ${GRID}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={flip === -1 ? { transform: "scaleX(-1)" } : undefined}
    >
      {runsFor(pose, facing).map((run) => (
        <rect
          key={`${run.y}-${run.x}`}
          x={run.x}
          y={run.y}
          width={run.width}
          height={1}
          fill={run.fill}
        />
      ))}
    </svg>
  );
}
