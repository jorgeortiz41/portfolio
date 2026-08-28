/**
 * The companion's allowance, and what happens when it runs out.
 *
 * Two ceilings, both denominated in tokens because tokens are what the bill is
 * denominated in:
 *
 *   PER VISITOR — a rolling 24h allowance, plus a short burst window so nobody
 *   can machine-gun the endpoint. Spending it puts the sprite to sleep rather
 *   than throwing an error at them, which is the point.
 *
 *   GLOBAL — a per-process daily ceiling. This is the actual backstop on the
 *   bill if something goes wrong or someone gets clever.
 *
 * HONEST LIMITATION, because a comment claiming more than the code delivers is
 * worse than no comment: this lives in memory. Vercel runs several serverless
 * instances and recycles them, so each instance keeps its own counters and both
 * ceilings reset on a cold start. It is a real guard against ordinary traffic
 * and casual abuse. It is NOT a security control, and someone determined can get
 * past it by waiting for a new instance.
 *
 * Making it exact needs a store all the instances share — that is all Redis is,
 * a small fast database several servers read and write so they agree on one
 * number. That is a deliberate not-yet: it means an account, an integration and
 * a dependency, for a portfolio site whose realistic worst case is a bad
 * afternoon. Everything below sits behind `checkBudget` / `chargeBudget`, so
 * swapping the storage is a change to this file and nothing else.
 */

/** Tokens one visitor may spend in a rolling window. ~25-30 exchanges. */
const VISITOR_TOKENS = 40_000;
const VISITOR_WINDOW_MS = 24 * 60 * 60 * 1000;

/** Burst guard: messages one visitor may send in a short window. */
const BURST_MESSAGES = 6;
const BURST_WINDOW_MS = 60 * 1000;

/** Per-process daily ceiling — the real backstop on the bill. */
const GLOBAL_TOKENS = 1_500_000;
const GLOBAL_WINDOW_MS = 24 * 60 * 60 * 1000;

/**
 * What a request that has not been made yet costs, for admission purposes.
 * A visitor is turned away when their remaining allowance could not cover a
 * typical exchange, so they never get a reply truncated halfway.
 */
const ESTIMATED_EXCHANGE_TOKENS = 1_400;

type Window = { tokens: number; messages: number[]; resetAt: number };

/**
 * Bounded so a long-lived instance under IP churn cannot grow without limit.
 * Well above any plausible concurrent-visitor count for this site.
 */
const MAX_TRACKED_VISITORS = 5_000;

const visitors = new Map<string, Window>();
let global: Window = { tokens: 0, messages: [], resetAt: 0 };

function freshWindow(now: number, windowMs: number): Window {
  return { tokens: 0, messages: [], resetAt: now + windowMs };
}

function visitorWindow(key: string, now: number): Window {
  const existing = visitors.get(key);
  if (existing && existing.resetAt > now) return existing;

  if (visitors.size >= MAX_TRACKED_VISITORS) {
    // Cheap eviction: drop every window that has already expired. If none have,
    // drop the oldest. Either way the map stays bounded.
    for (const [k, w] of visitors) if (w.resetAt <= now) visitors.delete(k);
    if (visitors.size >= MAX_TRACKED_VISITORS) {
      const oldest = visitors.keys().next().value;
      if (oldest !== undefined) visitors.delete(oldest);
    }
  }

  const created = freshWindow(now, VISITOR_WINDOW_MS);
  visitors.set(key, created);
  return created;
}

function globalWindow(now: number): Window {
  if (global.resetAt <= now) global = freshWindow(now, GLOBAL_WINDOW_MS);
  return global;
}

/** Why a request was turned away — the UI maps this to a sprite state. */
export type BudgetState = "ok" | "asleep" | "grumpy";

export type BudgetVerdict = {
  state: BudgetState;
  /** Visitor allowance left, 0-1. Drives the sprite getting visibly sleepy. */
  remaining: number;
  /** Seconds until the visitor's window resets. Only meaningful when asleep. */
  retryAfter: number;
};

/**
 * Admission check. Call before touching the API; call `chargeBudget` after, with
 * what the exchange actually cost.
 */
export function checkBudget(key: string, now = Date.now()): BudgetVerdict {
  const visitor = visitorWindow(key, now);
  const all = globalWindow(now);

  const remaining = Math.max(0, 1 - visitor.tokens / VISITOR_TOKENS);
  const retryAfter = Math.max(1, Math.ceil((visitor.resetAt - now) / 1000));

  // Burst first: this one is temporary, and "slow down" is a different mood
  // from "I'm out of words for the day".
  visitor.messages = visitor.messages.filter((t) => now - t < BURST_WINDOW_MS);
  if (visitor.messages.length >= BURST_MESSAGES) {
    return {
      state: "grumpy",
      remaining,
      retryAfter: Math.ceil(BURST_WINDOW_MS / 1000),
    };
  }

  const visitorSpent =
    visitor.tokens + ESTIMATED_EXCHANGE_TOKENS > VISITOR_TOKENS;
  const globalSpent = all.tokens + ESTIMATED_EXCHANGE_TOKENS > GLOBAL_TOKENS;
  if (visitorSpent || globalSpent) {
    return { state: "asleep", remaining: 0, retryAfter };
  }

  visitor.messages.push(now);
  return { state: "ok", remaining, retryAfter };
}

/** Record what an exchange actually cost. Safe to call with zero. */
export function chargeBudget(
  key: string,
  tokens: number,
  now = Date.now(),
): void {
  if (!Number.isFinite(tokens) || tokens <= 0) return;
  visitorWindow(key, now).tokens += tokens;
  globalWindow(now).tokens += tokens;
}

/**
 * Visitor key from request headers.
 *
 * `x-forwarded-for` is set by Vercel's proxy and is the leftmost entry. It is
 * spoofable in principle — see the limitation note above; this is a cost guard,
 * not authentication. Everything without a usable address shares one bucket,
 * which is the conservative direction to fail in.
 */
export function visitorKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || headers.get("x-real-ip") || "anonymous";
}
