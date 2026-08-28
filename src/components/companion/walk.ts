/**
 * The companion's movement, as a pure function of one frame.
 *
 * This is deliberately separated from the React hook that drives it. The first
 * version of the walk lived entirely inside a `useEffect` closure, and it had a
 * bug that was invisible from the outside: he only ever moved in response to a
 * scroll delta, so on a page you weren't actively scrolling — which is most of
 * the time — his target equalled his position and he stood still forever. That
 * shipped because there was no way to check the behaviour except by watching
 * him, and animation is exactly the kind of thing that is hard to watch
 * carefully (and, in a headless or backgrounded browser, impossible: requestAnimationFrame
 * does not run at all when the page is hidden).
 *
 * With the state transition as a pure function, thirty seconds of walking can be
 * simulated in a millisecond and asserted on. No DOM, no React, no clock.
 */

export type WalkState = {
  /** Current offset from the left edge of the walk range, in px. */
  x: number;
  /** Where he is heading. */
  target: number;
  facing: 1 | -1;
  moving: boolean;
  /** Timestamp before which he will not choose a new destination. */
  restUntil: number;
};

export type WalkTuning = {
  /** Walking pace in px per second. A stroll, not a commute. */
  speed: number;
  /** Px of travel per px scrolled, on top of the stroll. */
  gain: number;
  /** Closer than this to the destination and he has arrived. */
  settle: number;
  /** Bounds on how long he stands around before picking somewhere new, in ms. */
  restMin: number;
  restMax: number;
  /** A stroll shorter than this isn't worth taking; he'd just twitch. */
  minStroll: number;
};

export const TUNING: WalkTuning = {
  speed: 74,
  gain: 0.35,
  settle: 0.5,
  restMin: 1800,
  restMax: 6000,
  minStroll: 80,
};

export type WalkInput = {
  /** Monotonic ms. */
  now: number;
  /** ms since the previous frame, already clamped by the caller. */
  elapsed: number;
  /** Signed px scrolled since the previous frame. */
  scrollDelta: number;
  /** Width of the walkable range. */
  limit: number;
  /**
   * Where the cursor wants him, already converted from viewport coordinates to
   * this range by the caller. `null` when there is no usable pointer — a touch
   * device, the cursor outside the window, or a cursor that has sat still long
   * enough that following it is no longer interesting.
   */
  pointerTarget: number | null;
  /**
   * Standing still on purpose: he has something to say. Distinct from having
   * arrived, because his destination is preserved and he resumes toward it.
   *
   * This is a per-frame input rather than a reason to tear the walk down. When
   * pausing was done by flipping the hook's `enabled` flag, the effect re-ran
   * and re-initialised his position, so he teleported back to the left edge
   * every time the chat closed.
   */
  paused: boolean;
};

/**
 * Somewhere else along the range, far enough away to be worth walking to.
 *
 * Rejection-sampled rather than computed so the destinations stay unpredictable
 * — a formula ends up with him metronoming between two spots. After six misses
 * he is near the middle of a short range, so he just goes to an end.
 */
export function pickDestination(
  x: number,
  limit: number,
  tuning: WalkTuning,
  random: () => number,
): number {
  if (limit < tuning.minStroll) return x;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const candidate = random() * limit;
    if (Math.abs(candidate - x) >= tuning.minStroll) return candidate;
  }
  return x < limit / 2 ? limit : 0;
}

/** How long he stands around before choosing somewhere new to be. */
function restFor(tuning: WalkTuning, random: () => number): number {
  return tuning.restMin + random() * (tuning.restMax - tuning.restMin);
}

/**
 * Advance one frame. Returns a new state; never mutates the one passed in.
 *
 * He moves at a CONSTANT pace rather than easing toward the target. Easing
 * spends most of its time in the last few pixels, decelerating forever, which
 * reads as a sliding decal — and it desynchronises the two-frame leg cycle,
 * since the legs alternate at a fixed rate while the body crawls. A fixed px/s
 * with a hard stop is how sprites in games move, and it is why the walk cycle
 * looks attached to the ground.
 */
export function stepWalk(
  state: WalkState,
  input: WalkInput,
  tuning: WalkTuning = TUNING,
  random: () => number = Math.random,
): WalkState {
  const { now, elapsed, scrollDelta, limit, pointerTarget, paused } = input;
  const { x, facing, moving } = state;
  let { target, restUntil } = state;

  // Nothing to walk along — a viewport narrower than the sprite. Park him.
  if (limit <= 0) {
    return { x: 0, target: 0, facing, moving: false, restUntil };
  }

  if (paused) {
    // Hold position and hold the destination. `moving: false` matters: it is
    // what the sprite reads to pick a standing frame, and letting him keep the
    // walk pose while stationary is the mismatch that made the animation look
    // like it was skipping.
    return {
      x,
      target,
      facing,
      moving: false,
      restUntil: now + restFor(tuning, random),
    };
  }

  if (pointerTarget !== null) {
    // The cursor outranks everything. He walks toward it at the same pace he
    // strolls at — following is a destination change, never a speed change,
    // and lerping him to the cursor instead would read as dragging a sticker.
    target = Math.min(Math.max(pointerTarget, 0), limit);
    restUntil = now + restFor(tuning, random);
  } else if (scrollDelta !== 0) {
    // Scrolling redirects him mid-stroll, and counts as something to do — he
    // shouldn't wander off the instant you stop scrolling.
    let next = target + scrollDelta * tuning.gain;

    // Reflect off the ends rather than clamping, so a long scroll paces him
    // back and forth instead of pinning him to one side.
    if (next < 0) next = Math.min(-next, limit);
    else if (next > limit) next = Math.max(limit - (next - limit), 0);

    target = next;
    restUntil = now + restFor(tuning, random);
  }

  target = Math.min(Math.max(target, 0), limit);
  const distance = target - x;

  if (Math.abs(distance) < tuning.settle) {
    if (moving) {
      // Arriving starts the clock on standing around.
      //
      // He stops WHERE HE IS — `target` is pulled to `x`, not the other way
      // round. Snapping x onto target here moved him, by up to `settle`, on the
      // same frame that reported `moving: false`; the sprite was then drawing a
      // standing frame while its transform changed. Sub-pixel and invisible in
      // isolation, but it is exactly the "moves without the walk animation"
      // defect, and the residual is well under the 0.1px the paint rounds to.
      return {
        x,
        target: x,
        facing,
        moving: false,
        restUntil: now + restFor(tuning, random),
      };
    }
    if (now >= restUntil) {
      return {
        x,
        target: pickDestination(x, limit, tuning, random),
        facing,
        moving: false,
        restUntil: now + restFor(tuning, random),
      };
    }
    return { x, target, facing, moving, restUntil };
  }

  const stride = (tuning.speed * elapsed) / 1000;
  return {
    x: x + Math.sign(distance) * Math.min(stride, Math.abs(distance)),
    target,
    facing: distance > 0 ? 1 : -1,
    moving: true,
    restUntil,
  };
}
