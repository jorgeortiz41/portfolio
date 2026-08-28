/**
 * The companion, as thirty-two strings of thirty-two characters per frame.
 *
 * Authoring the sprite as ASCII art rather than shipping a PNG buys three
 * things that matter on this site specifically:
 *
 *   1. Editing the character is editing legible text. Jorge can redraw this in
 *      a text editor without opening a pixel editor or re-exporting anything.
 *   2. It stays sharp at any size, and costs no network request.
 *   3. His kit takes the live accent, so he is dressed in whatever hue the page
 *      he is standing on is using (see `src/lib/accent.ts`).
 *
 * DRAWN AS AN OVERWORLD SPRITE, WHICH MEANS TWO THINGS.
 *
 * First, PROPORTIONS ARE CHIBI ON PURPOSE. An earlier pass "corrected" the head
 * down to a third of the height on the theory that a realistic figure reads
 * better. It doesn't — it just reads as a small adult, and it stopped looking
 * like the reference at all. Overworld sprites give the head roughly half the
 * body height and make it wider than the shoulders, because at 32 pixels the
 * face is the only part carrying any character. The head is back to 16 wide
 * over a 12-wide body. What separates this from the "marshmallow with a face"
 * that feedback rightly killed is not the proportion, it is the detail: a hard
 * outline, three-pixel eyes with a catchlight, a spiked hair silhouette and a
 * headband.
 *
 * Second, THERE IS AN OUTLINE. Every overworld sprite in the games has one, and
 * its absence is most of why earlier versions looked flat and web-native rather
 * than drawn. It is a lifted near-black rather than true black so it still
 * separates from the dark theme's background.
 *
 * TWO VIEWS. Overworld sprites do not walk face-on — they turn to a profile and
 * stride. A front-only version can only splay its legs apart and back, which
 * reads as jumping jacks. There is a `front` view (standing, talking, every
 * expression) and a `side` view (profile, arm swinging, a real two-frame
 * stride). The side view is drawn facing RIGHT only; facing left is the same
 * frames mirrored, exactly as the games do it.
 */

export const GRID = 32;

/**
 * Character -> CSS colour.  `.` is transparent and never emitted.
 *
 * THE PALETTE IS MOSTLY FIXED, NOT THEMED, AND THAT IS A REVERSAL.
 *
 * An earlier version resolved every pixel to a site token — `--ink` for skin,
 * `--bg` for eyes — so the sprite inverted with the theme and cost no second
 * asset. It looked right in dark mode and fell apart in light, because those
 * tokens flip *against each other*: `--ink` goes 0.97 -> 0.16 while `--bg` goes
 * 0.125 -> 0.985, so the face turned darker than its own eyes and he rendered
 * as a black silhouette with two glowing slits.
 *
 * A face cannot invert. Skin has to stay lighter than hair and eyes darker than
 * skin, in both themes, so those relationships are fixed. Real sprites don't
 * re-theme either; a Pokémon is the same colour on every map.
 *
 * The trainer this is modelled on wears black with red flashes. True black
 * would disappear against the dark theme, so the blacks are lifted to charcoal
 * — still unmistakably black beside the skin tone, but clear of the 0.125
 * background. The red IS the site accent, the one thing that should still
 * theme: its lightness is already tuned per theme for contrast (see the sweep
 * note in `globals.css`).
 */
export const PALETTE: Record<string, string> = {
  O: "oklch(0.19 0.010 275)", // outline, eye pupil, shoe sole
  K: "oklch(0.30 0.014 275)", // hair
  k: "oklch(0.43 0.018 275)", // hair highlight
  F: "oklch(0.84 0.055 62)", // skin
  f: "oklch(0.71 0.062 55)", // skin in shadow — chin, neck
  w: "oklch(0.98 0.008 80)", // catchlight, which stops the eyes looking dead
  J: "oklch(0.29 0.013 275)", // jacket
  R: "oklch(var(--accent-l) var(--accent-c) var(--accent-h))", // headband, flash, shoes
  P: "oklch(0.38 0.020 265)", // trousers
};

/** What he is doing. Orthogonal to which way he is looking. */
export type Pose =
  "idle" | "walkA" | "walkB" | "talk" | "think" | "drowsy" | "sleep" | "grumpy";

/** Which way he is looking. `side` is drawn facing right and mirrored for left. */
export type Facing = "front" | "side";

export type Frame = readonly string[];

/** A front-view row: 8 dots, 16 of character, 8 dots. */
const fr = (middle: string) => `........${middle}........`;
/** A side-view torso row: 10 dots, 12 of body, 10 dots. */
const st = (middle: string) => `..........${middle}..........`;

/* ============================================================== FRONT VIEW

   Rows 0-2 blank, 3-16 head, 17-24 body, 25-30 legs, 31 blank. */

const FRONT_CROWN = [
  "................................",
  "................................",
  "...........OOOOOOOOOO...........",
  ".........OOKKKKKKKKKKOO.........",
  "........OOKKKKKKKKKKKKOO........",
  "........OKKKKkkkkkkKKKKO........",
  "........OKKKkkkkkkkkKKKO........",
  "........OKKRRRRRRRRRRKKO........",
  "........OKRRRRRRRRRRRRKO........",
] as const;

/* Rows 15-16: the jaw narrowing, then a chin. */
const FRONT_JAW = [
  ".........OKFFFFFFFFFFKO.........",
  "..........OOffffffffOO..........",
] as const;

/* Rows 17-24. Jacket with the red flash down the chest, hands at the hem. */
const FRONT_TORSO = [
  "..........OJJJRRRRJJJO..........",
  "........OOJJJJRRRRJJJJOO........",
  "........OJJJJJRRRRJJJJJO........",
  "........OJJJJJRRRRJJJJJO........",
  "........OJJJJJJRRJJJJJJO........",
  "........OFFOJJJJJJJJOFFO........",
  "........OFFOJJJJJJJJOFFO........",
  "..........OJJJJJJJJJJO..........",
] as const;

/* Rows 25-30. He never walks face-on, so the front view only ever stands. */
const FRONT_LEGS = [
  "...........OPPPPPPPPO...........",
  "...........OPPO..OPPO...........",
  "...........OPPO..OPPO...........",
  "...........OPPO..OPPO...........",
  "...........ORRO..ORRO...........",
  "...........OOOO..OOOO...........",
] as const;

const BLANK = "................................";

/* Row 9 — brow line. */
const BROW_PLAIN = "OKFFFFFFFFFFFFKO";
const BROW_CROSS = "OKFKKFFFFFFKKFKO";

/* Rows 10-12 — the eyes, three pixels tall. Big eyes are most of what makes a
   sprite this size read as a character rather than a shape. */
const EYES_TOP = "OKFOOOFFFFOOOFKO";
const EYES_MID = "OKFOwOFFFFOwOFKO";
const EYES_BOT = "OKFOOOFFFFOOOFKO";
const EYES_BLANK = "OKFFFFFFFFFFFFKO";
/* One eye still open: running low, not out. */
const EYES_ONE_TOP = "OKFFFFFFFFOOOFKO";
const EYES_ONE_MID = "OKFFFFFFFFOwOFKO";

/* Row 13 cheeks, row 14 the mouth. */
const CHEEKS = "OKFFFFFFFFFFFFKO";
const MOUTH_SMALL = "OKFFFFFOOFFFFFKO";
const MOUTH_WIDE = "OKFFFFOOOOFFFFKO";

function frontFrame(
  brow: string,
  eyeTop: string,
  eyeMid: string,
  eyeBot: string,
  mouth: string,
): Frame {
  return [
    ...FRONT_CROWN,
    fr(brow),
    fr(eyeTop),
    fr(eyeMid),
    fr(eyeBot),
    fr(CHEEKS),
    fr(mouth),
    ...FRONT_JAW,
    ...FRONT_TORSO,
    ...FRONT_LEGS,
    BLANK,
  ];
}

/* =============================================================== SIDE VIEW

   Facing right. Three things make a profile read as a profile at this size,
   and an earlier attempt had none of them: hair mass spiking BACK behind the
   skull (the strongest cue by far), a NOSE breaking the face line, and ONE eye
   set forward and well clear of the mouth — stacking a small eye directly over
   a small mouth made the pair merge into what looked like a moustache. */

const SIDE_HEAD = [
  "................................",
  "................................",
  "...........OOOOOOOOO............",
  ".........OOKKKKKKKKKOO..........",
  "........OOKKKKKKKKKKKO..........",
  ".......OOKKKKkkkkKKKKO..........",
  ".......OKKKkkkkkkKKKKO..........",
  ".......OKKKRRRRRRRRRRO..........",
  "........OKKRRRRRRRRRRO..........",
  ".........OKKFFFFFFFFFO..........",
  ".........OKKFFFFOOOFFO..........",
  ".........OKKFFFFOwOFFO..........",
  ".........OKKFFFFOOOFFFO.........",
  ".........OKKFFFFFFFFFFO.........",
  ".........OKKFFFFFFOOFO..........",
  "..........OKFFFFFFFFO...........",
  "...........OOfffffOO............",
] as const;

/* Rows 17-21: collar and chest. */
const SIDE_CHEST = [
  st("OJJRRRRRRJJO"),
  st("OJJJRRRRJJJO"),
  st("OJJJJRRJJJJO"),
  st("OJJJJJJJJJJO"),
  st("OJJJJJJJJJJO"),
] as const;

/* Rows 22-23 — the near arm, which is what sells the stride. Swinging it
   forward on one frame and back on the other is the difference between walking
   and being slid along the ground. Written full-width rather than through `st`
   because the hand has to reach outside the torso to be visible at all. */
const ARM_REST = [
  "..........OJJJJJJJJJJO..........",
  "..........OJJJJJJJJJJO..........",
] as const;

const ARM_FORWARD = [
  "..........OJJJJJJJJJJJO.........",
  "..........OJJJJJJJJJJOFO........",
] as const;

const ARM_BACK = [
  ".........OJJJJJJJJJJJO..........",
  "........OFOJJJJJJJJJJO..........",
] as const;

/** Row 24 — jacket hem. */
const SIDE_HEM = "..........OJJJJJJJJJJO..........";

const SIDE_LEGS_STAND = [
  "...........OPPPPPPPPO...........",
  "...........OPPO..OPPO...........",
  "...........OPPO..OPPO...........",
  "...........OPPO..OPPO...........",
  "...........ORRO..ORRO...........",
  "...........OOOO..OOOO...........",
] as const;

/* Contact pose: full stride, front foot landing, back foot pushing off. The
   two legs travel in OPPOSITE directions across the frame — that is what makes
   it a stride. Splaying both outward from the hip is a jumping jack, which is
   precisely what the front-only version was doing. */
const SIDE_LEGS_STRIDE = [
  "...........OPPPPPPPPO...........",
  "..........OPPO....OPPO..........",
  ".........OPPO......OPPO.........",
  "........OPPO........OPPO........",
  ".......ORRO..........ORRO.......",
  ".......OOOO..........OOOO.......",
] as const;

/* Passing pose: the legs overlap into a single column as one goes by the other.
   Drawing two separate legs here is the mistake that turns a walk cycle into a
   shuffle — at this size the near leg simply hides the far one. */
const SIDE_LEGS_PASS = [
  "...........OPPPPPPPPO...........",
  "...........OPPPPPPPPO...........",
  "............OPPPPPPO............",
  "............OPPPPPPO............",
  "............ORRRRRRO............",
  "............OOOOOOOO............",
] as const;

function sideFrame(arm: readonly string[], legs: readonly string[]): Frame {
  return [...SIDE_HEAD, ...SIDE_CHEST, ...arm, SIDE_HEM, ...legs, BLANK];
}

/* ================================================================== Frames */

const FRONT_FRAMES: Record<Pose, Frame> = {
  idle: frontFrame(BROW_PLAIN, EYES_TOP, EYES_MID, EYES_BOT, MOUTH_SMALL),
  // Front-facing "walking" only happens if the side view is unavailable.
  walkA: frontFrame(BROW_PLAIN, EYES_TOP, EYES_MID, EYES_BOT, MOUTH_SMALL),
  walkB: frontFrame(BROW_PLAIN, EYES_TOP, EYES_MID, EYES_BOT, MOUTH_SMALL),
  talk: frontFrame(BROW_PLAIN, EYES_TOP, EYES_MID, EYES_BOT, MOUTH_WIDE),
  // Eyes rolled up: filled at the top of the socket, empty at the bottom.
  think: frontFrame(BROW_PLAIN, EYES_TOP, EYES_TOP, EYES_BLANK, MOUTH_SMALL),
  drowsy: frontFrame(
    BROW_PLAIN,
    EYES_ONE_TOP,
    EYES_ONE_MID,
    EYES_ONE_TOP,
    MOUTH_SMALL,
  ),
  // Lids shut: a single line where the middle of the eye was.
  sleep: frontFrame(BROW_PLAIN, EYES_BLANK, EYES_BOT, EYES_BLANK, MOUTH_SMALL),
  grumpy: frontFrame(BROW_CROSS, EYES_TOP, EYES_MID, EYES_BOT, MOUTH_SMALL),
};

/**
 * Only the poses that happen while moving exist in profile. Everything else —
 * talking, thinking, dozing — happens standing still and facing the viewer,
 * which is both correct for the character and half the art.
 */
const SIDE_FRAMES: Partial<Record<Pose, Frame>> = {
  idle: sideFrame(ARM_REST, SIDE_LEGS_STAND),
  walkA: sideFrame(ARM_FORWARD, SIDE_LEGS_STRIDE),
  walkB: sideFrame(ARM_BACK, SIDE_LEGS_PASS),
};

/** The frame for a pose in a view, falling back to front where the profile has none. */
export function frameFor(pose: Pose, facing: Facing): Frame {
  if (facing === "side") {
    const side = SIDE_FRAMES[pose];
    if (side) return side;
  }
  return FRONT_FRAMES[pose];
}

/* ================================================================ Rendering */

/**
 * A run of identical adjacent pixels, as one rect.
 *
 * A rect per pixel would be ~500 nodes per frame at this size, swapped several
 * times a second while walking. Merging horizontal runs cuts that by roughly
 * four fifths for free, and the output is identical.
 */
export type Run = { x: number; y: number; width: number; fill: string };

function toRuns(frame: Frame): Run[] {
  const out: Run[] = [];

  frame.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const char = row[x] as string;
      if (!(char in PALETTE)) {
        x += 1;
        continue;
      }
      let width = 1;
      while (row[x + width] === char) width += 1;
      out.push({ x, y, width, fill: PALETTE[char] as string });
      x += width;
    }
  });

  return out;
}

/**
 * Every frame's runs, memoised on first use.
 *
 * There are eleven distinct frames and they never change, so re-deriving the
 * rects on each render was pure waste — and it was per-render waste inside an
 * animation, which is where waste actually costs something. Safari in
 * particular was noticeably heavier than Chrome here; this and dropping the CSS
 * `drop-shadow` filter off the moving element (see `PixelAvatar`) are the two
 * things that mattered.
 */
const RUNS = new Map<string, Run[]>();

export function runsFor(pose: Pose, facing: Facing): Run[] {
  const view: Facing =
    facing === "side" && SIDE_FRAMES[pose] ? "side" : "front";
  const key = `${view}:${pose}`;
  let cached = RUNS.get(key);
  if (!cached) {
    cached = toRuns(frameFor(pose, view));
    RUNS.set(key, cached);
  }
  return cached;
}

/**
 * Hand-edited ASCII is easy to get subtly wrong — one character short and the
 * sprite silently loses a pixel column. Same reasoning as the frontmatter
 * schema in `src/lib/content.ts`: fail loudly at author time rather than render
 * something half-formed. Development only; production ships without the check.
 */
if (process.env.NODE_ENV !== "production") {
  const all: [string, Frame][] = [
    ...Object.entries(FRONT_FRAMES).map(
      ([pose, frame]) => [`front:${pose}`, frame] as [string, Frame],
    ),
    ...Object.entries(SIDE_FRAMES).map(
      ([pose, frame]) => [`side:${pose}`, frame as Frame] as [string, Frame],
    ),
  ];

  for (const [name, rows] of all) {
    if (rows.length !== GRID) {
      throw new Error(
        `Sprite "${name}" has ${rows.length} rows, expected ${GRID}.`,
      );
    }
    const short = rows.findIndex((row) => row.length !== GRID);
    if (short !== -1) {
      throw new Error(
        `Sprite "${name}" row ${short} is ${rows[short]?.length} characters, expected ${GRID}.`,
      );
    }
    // An unmapped character is skipped by `toRuns` rather than drawn, so those
    // pixels quietly vanish. That is exactly how the headphones went missing
    // the first time this rendered.
    for (const row of rows) {
      for (const char of row) {
        if (char !== "." && !(char in PALETTE)) {
          throw new Error(
            `Sprite "${name}" uses "${char}", which has no colour in PALETTE.`,
          );
        }
      }
    }
  }
}
