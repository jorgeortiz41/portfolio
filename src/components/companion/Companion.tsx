"use client";

import { useEffect, useRef, useState } from "react";

import {
  useMotionEnabled,
  useMounted,
  useWideViewport,
} from "@/lib/capabilities";
import { ChatPanel } from "./ChatPanel";
import { PixelAvatar } from "./PixelAvatar";
import { SpeechBubble } from "./SpeechBubble";
import type { Facing, Pose } from "./sprite";
import { useChat } from "./useChat";
import { useCompanionWalk } from "./useCompanionWalk";
import { useIdleQuips } from "./useIdleQuips";

/**
 * The companion: a sprite that paces the bottom of the page, says things, and
 * opens into a conversation when you click it.
 *
 * Mounted once in the root layout. Renders nothing until `useMounted()` is
 * true — the same rule `MagneticCursor` follows — so it is absent from the
 * server HTML and cannot mismatch on hydration, and a crawler or a
 * JavaScript-less viewer simply gets the site without it.
 *
 * The reserved column is a fixed 15rem wide even though the sprite is 80px.
 * That is what keeps the speech bubble on screen: the walk range is derived
 * from the container's width, so bounding the container bounds the bubble too,
 * and no per-frame edge-collision maths is needed.
 *
 * He turns to a PROFILE the moment he starts moving and faces the viewer again
 * when he stops, which is how overworld sprites in the Pokémon games behave.
 * Front-on walking was the previous version's tell: with only one view, a walk
 * cycle can only splay the legs, which looks like calisthenics.
 */

/**
 * ms per frame of the two-frame walk cycle. Paired with the 74px/s in
 * `useCompanionWalk` this is roughly one step every 13px, which is about right
 * for a figure this size — fast enough to read as walking, slow enough that the
 * legs don't buzz. Change one of the two and the feet start to skate.
 */
const STEP_MS = 180;

/** Allowance below which the sprite starts looking like it needs a nap. */
const DROWSY_AT = 0.2;

/**
 * How long he stands still to deliver a line, in ms.
 *
 * Deliberately much shorter than the bubble stays up. He used to be frozen for
 * the bubble's entire life, which at the new quip cadence would have him
 * standing around roughly a third of the time. A beat is enough to read as
 * "stopped to say something"; after that he walks on and the bubble travels
 * with him, exactly like an NPC that comments and carries on.
 */
const DELIVERY_MS = 2_400;

export function Companion() {
  const mounted = useMounted();
  const motion = useMotionEnabled();
  const wide = useWideViewport();

  const [open, setOpen] = useState(false);
  const launcher = useRef<HTMLButtonElement>(null);

  const { messages, status, budget, send, maxInput } = useChat();

  const quip = useIdleQuips(!open);

  /**
   * The delivery beat: he plants his feet for a moment when a line lands, then
   * carries on. Quips are scheduled entirely independently of walking (see
   * `useIdleQuips`), so he says the same things just as often whether he is
   * chasing the cursor, strolling, or standing still — this only decides how
   * long he holds still to say them.
   */
  const [settled, setSettled] = useState<string | null>(null);
  useEffect(() => {
    if (quip === null) return;
    const id = setTimeout(() => setSettled(quip), DELIVERY_MS);
    return () => clearTimeout(id);
  }, [quip]);

  /* Derived, not stored. Writing this into state meant setting it synchronously
     in an effect body on every quip, which is a cascading render — and the
     "no quip, so not delivering" case falls out of the expression for free. */
  const delivering = quip !== null && settled !== quip;

  /**
   * `enabled` is deliberately stable — it must NOT include `open` or `quip`.
   * Flipping it tears the walk effect down and rebuilds it, and the position
   * used to be initialised in there, so every chat open/close snapped him back
   * to the left edge. Stopping him is a `paused` input instead, which leaves
   * the subscription and his position alone.
   */
  const { ref, gait } = useCompanionWalk(motion && wide, delivering);

  const [step, setStep] = useState(false);
  useEffect(() => {
    if (!gait.moving || !motion) return;
    const id = setInterval(() => setStep((s) => !s), STEP_MS);
    return () => clearInterval(id);
  }, [gait.moving, motion]);

  // Returning focus to the launcher is the part people skip. Without it, closing
  // the panel with Escape drops focus to the top of the document.
  const close = () => {
    setOpen(false);
    launcher.current?.focus();
  };

  if (!mounted) return null;

  const walking = gait.moving && motion;

  /**
   * MOVING ALWAYS WINS. Every other pose is a standing frame, so letting mood
   * or conversation outrank locomotion is the one way this can render a
   * stationary sprite sliding across the page — which is exactly what a quip
   * while walking used to do, and what being out of budget would do the moment
   * `sleep` outranked a stroll. Testing `walking` first makes
   * "in motion implies a walk frame" structural rather than something the
   * ordering below has to keep getting right.
   */
  const pose: Pose = walking
    ? step
      ? "walkA"
      : "walkB"
    : status === "asleep" || status === "offline"
      ? "sleep"
      : status === "grumpy"
        ? "grumpy"
        : status === "thinking"
          ? "think"
          : status === "streaming" || (quip !== null && !open)
            ? "talk"
            : budget !== null && budget < DROWSY_AT
              ? "drowsy"
              : "idle";

  // Profile only while actually travelling — he faces you to talk, doze or sulk.
  const facing: Facing =
    pose === "walkA" || pose === "walkB" ? "side" : "front";

  if (open) {
    return (
      <div className="fixed inset-x-4 bottom-4 z-50 sm:inset-x-auto sm:bottom-6 sm:left-6">
        <ChatPanel
          messages={messages}
          status={status}
          pose={pose}
          maxInput={maxInput}
          onSend={send}
          onClose={close}
        />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      // `will-change` promotes the walker to its own compositor layer up front.
      // He is in motion most of the time, so paying the layer cost permanently
      // is cheaper than Safari re-promoting and demoting him on every stroll.
      className="pointer-events-none fixed bottom-4 left-4 z-40 flex w-60 flex-col items-start gap-2 [will-change:transform] sm:bottom-6 sm:left-6"
    >
      {quip && <SpeechBubble text={quip} animate={motion} className="ml-1" />}

      <button
        ref={launcher}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Chat with a pixel version of Jorge"
        className="pointer-events-auto tap-target grid place-items-center transition-transform hover:scale-110 motion-reduce:transform-none"
      >
        <PixelAvatar
          pose={pose}
          facing={facing}
          flip={gait.facing}
          className="size-16 sm:size-20"
        />
      </button>
    </div>
  );
}
