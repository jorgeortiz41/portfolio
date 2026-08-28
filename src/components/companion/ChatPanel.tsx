"use client";

import { useEffect, useRef, useState } from "react";

import { disclosure } from "@/data/persona";
import { cn } from "@/lib/cn";
import { PixelAvatar } from "./PixelAvatar";
import type { Pose } from "./sprite";
import { isSpent, type ChatMessage, type ChatStatus } from "./useChat";

/**
 * The conversation panel.
 *
 * Unlike the quip bubble this *is* addressed to the viewer, so it is a real
 * dialog: labelled, escapable, focus moves in on open and returns to the
 * launcher on close, and the reply streams into a polite live region so a
 * screen-reader user hears the answer rather than silence.
 *
 * `aria-modal` is deliberately absent. Nothing behind the panel is inert — the
 * viewer is meant to keep reading the page while they chat, which is the whole
 * point of a companion rather than a support widget.
 */

/** Openers, so nobody has to guess what it knows. */
const STARTERS = [
  "What's ARGUS?",
  "What are you good at?",
  "Hot take on interviews?",
] as const;

export function ChatPanel({
  messages,
  status,
  pose,
  maxInput,
  onSend,
  onClose,
}: {
  messages: ChatMessage[];
  status: ChatStatus;
  /** Kept in the header so the character stays present while you talk to it. */
  pose: Pose;
  maxInput: number;
  onSend: (text: string) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const spent = isSpent(status);
  const busy = status === "thinking" || status === "streaming";

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Follow the reply as it streams.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages]);

  const submit = (text: string) => {
    if (!text.trim() || busy || spent) return;
    onSend(text);
    setDraft("");
  };

  return (
    <div
      role="dialog"
      aria-label="Chat with a pixel version of Jorge"
      // Width comes from the wrapper insets rather than a calc(): the arbitrary
      // value this used to carry, `calc(100vw-2rem)`, is invalid CSS — calc
      // requires spaces around the operator — so the rule was dropped and the
      // panel sized to its content, overflowing narrow viewports.
      className="flex h-[26rem] max-h-[75dvh] w-full flex-col border border-rule-strong bg-bg-elevated shadow-2xl sm:w-84"
    >
      <div className="flex items-start justify-between gap-3 border-b border-rule px-4 py-3">
        <PixelAvatar pose={pose} className="mt-0.5 size-9 shrink-0" />
        <div className="flex-1">
          <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink uppercase">
            Pixel Jorge
          </p>
          <p className="mt-1 text-[0.6875rem] leading-snug text-ink-faint">
            {disclosure}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="tap-target -mt-1 -mr-1 shrink-0 px-2 py-1 font-mono text-xs text-ink-faint transition-colors hover:text-accent"
        >
          ✕
        </button>
      </div>

      <div
        ref={logRef}
        className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm"
      >
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-ink-muted">
              Ask me about the work, the projects, or anything career-shaped.
              I&apos;m small but opinionated.
            </p>
            <div className="flex flex-wrap gap-2">
              {STARTERS.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => submit(starter)}
                  className="border border-rule px-2.5 py-1.5 font-mono text-[0.6875rem] text-ink-muted transition-colors hover:border-accent-hairline hover:text-accent"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <p
            key={index}
            className={cn(
              "leading-relaxed",
              message.role === "user"
                ? "ml-6 border-l-2 border-accent-hairline pl-3 text-ink-muted"
                : "text-ink",
            )}
            // The streamed reply is announced; the viewer's own words are not
            // read back to them.
            aria-live={
              message.role === "assistant" && index === messages.length - 1
                ? "polite"
                : undefined
            }
          >
            {message.content}
          </p>
        ))}

        {status === "thinking" && (
          <p className="font-mono text-xs text-ink-faint">thinking…</p>
        )}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit(draft);
        }}
        className="flex items-center gap-2 border-t border-rule px-3 py-3"
      >
        <input
          ref={inputRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={maxInput}
          disabled={spent}
          placeholder={spent ? "out of words for today" : "Ask me something…"}
          aria-label="Message"
          className="min-w-0 flex-1 bg-transparent px-1 text-sm text-ink placeholder:text-ink-faint focus:outline-none disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={busy || spent || !draft.trim()}
          className="tap-target shrink-0 border border-rule px-3 py-1.5 font-mono text-[0.6875rem] tracking-[0.14em] text-ink-muted uppercase transition-colors enabled:hover:border-accent-hairline enabled:hover:text-accent disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}
