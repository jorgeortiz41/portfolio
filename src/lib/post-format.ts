import type { PostSummary } from "@/lib/schema";

/**
 * Pure formatting helpers, deliberately kept out of `posts.ts`.
 *
 * `posts.ts` imports `node:fs`; the index filter is a client component and
 * needs these same helpers. Importing them from there would drag the filesystem
 * module into the browser bundle.
 */

/**
 * `2026-08-21` -> `21 Aug 2026`.
 *
 * Pinned to UTC: a bare `YYYY-MM-DD` parses as UTC midnight, so formatting in
 * the local zone renders the previous day anywhere west of Greenwich — which is
 * to say, here.
 */
export function formatPostDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** `2026-08-21` -> `August 2026`, for the index's month groupings. */
export function formatPostMonth(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Posts bucketed into month groups, preserving the newest-first order. */
export function groupPostsByMonth(
  posts: PostSummary[],
): { month: string; posts: PostSummary[] }[] {
  const groups: { month: string; posts: PostSummary[] }[] = [];

  for (const post of posts) {
    const month = formatPostMonth(post.date);
    const last = groups.at(-1);
    if (last && last.month === month) last.posts.push(post);
    else groups.push({ month, posts: [post] });
  }

  return groups;
}
