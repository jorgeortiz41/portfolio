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

export function Companion() {
  const mounted = useMounted();
  const motion = useMotionEnabled();
  const wide = useWideViewport();

  const [open, setOpen] = useState(false);
  const launcher = useRef<HTMLButtonElement>(null);

  const { messages, status, budget, send, maxInput } = useChat();

  const quip = useIdleQuips(!open);

  /**
   * `enabled` is deliberately stable — it must NOT include `open` or `quip`.
   * Flipping it tears the walk effect down and rebuilds it, and the position
   * used to be initialised in there, so every chat open/close snapped him back
   * to the left edge. Stopping him is a `paused` input instead, which leaves
   * the subscription and his position alone.
   *
   * He stands still to speak. That is characterful, and it also removes the
   * only way the pose and the motion could disagree: `talk` outranks the walk
   * frames, so a quip while moving used to render a standing sprite sliding
   * across the page.
   */
  const { ref, gait } = useCompanionWalk(motion && wide, quip !== null);

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

  /* Conversation and mood outrank locomotion: if he is answering you, he has
     stopped to do it — and `paused` above guarantees he really has, so this
     ordering can no longer produce a standing pose on a moving sprite. */
  const walking = gait.moving && motion;

  const pose: Pose =
    status === "asleep" || status === "offline"
      ? "sleep"
      : status === "grumpy"
        ? "grumpy"
        : status === "thinking"
          ? "think"
          : status === "streaming" || (quip !== null && !open)
            ? "talk"
            : walking
              ? step
                ? "walkA"
                : "walkB"
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
