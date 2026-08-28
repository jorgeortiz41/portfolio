"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { states } from "@/data/persona";

/**
 * The conversation, and the stream that fills it.
 *
 * The endpoint returns plain UTF-8 text rather than SSE, so reading it is a
 * reader loop and a `TextDecoder` — no event parsing, no protocol, no library.
 * `{ stream: true }` on `decode` matters: a multi-byte character can be split
 * across two chunks, and decoding each chunk independently would put a replacement
 * character in the middle of a word.
 */

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type ChatStatus =
  | "idle"
  | "thinking"
  | "streaming"
  /** Budget spent — the sprite naps and the input locks. */
  | "asleep"
  /** Too fast. Temporary. */
  | "grumpy"
  /** No API key, or the model is unreachable. */
  | "offline"
  | "error";

/** Locked states: the input is disabled and no further request will be made. */
export const isSpent = (status: ChatStatus) => status === "asleep";

/** Matches the server's own caps, so a rejection is never a surprise. */
const MAX_INPUT = 500;
const MAX_HISTORY = 12;

function pick(lines: readonly string[]): string {
  return lines[Math.floor(Math.random() * lines.length)] as string;
}

export function useChat() {
  const pathname = usePathname();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  /** Allowance left, 0-1, straight from the server. Null until it has answered. */
  const [budget, setBudget] = useState<number | null>(null);
  const abort = useRef<AbortController | null>(null);

  // Leaving the page mid-reply should stop the request, not finish paying for
  // tokens nobody will read.
  useEffect(() => () => abort.current?.abort(), []);

  const send = useCallback(
    async (raw: string) => {
      const content = raw.trim().slice(0, MAX_INPUT);
      if (!content || status === "thinking" || status === "streaming") return;

      const history = [...messages, { role: "user" as const, content }];
      setMessages(history);
      setStatus("thinking");

      abort.current?.abort();
      const controller = new AbortController();
      abort.current = controller;

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            messages: history.slice(-MAX_HISTORY),
            path: pathname,
          }),
        });

        if (!response.ok || !response.body) {
          // Every error path from the route answers in character, so the reply
          // is simply shown as the sprite's own line.
          const payload = (await response.json().catch(() => null)) as {
            state?: ChatStatus;
            text?: string;
          } | null;

          setStatus(payload?.state ?? "error");
          setMessages([
            ...history,
            {
              role: "assistant",
              content: payload?.text ?? pick(states.error),
            },
          ]);
          return;
        }

        // The sprite gets visibly drowsy as this drops, so running out reads as
        // a character falling asleep rather than a feature failing.
        const left = Number(response.headers.get("X-Chat-Budget"));
        if (Number.isFinite(left)) setBudget(left);

        setStatus("streaming");
        setMessages([...history, { role: "assistant", content: "" }]);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let text = "";

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });
          setMessages([...history, { role: "assistant", content: text }]);
        }
        text += decoder.decode();

        setMessages([...history, { role: "assistant", content: text }]);
        setStatus("idle");
      } catch (error) {
        // An abort is the viewer closing the panel, not a failure.
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        setStatus("error");
        setMessages([
          ...history,
          { role: "assistant", content: pick(states.error) },
        ]);
      }
    },
    [messages, pathname, status],
  );

  return { messages, status, budget, send, maxInput: MAX_INPUT };
}
