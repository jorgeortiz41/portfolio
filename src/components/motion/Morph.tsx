"use client";

import { ViewTransition } from "react";
import type { ReactNode } from "react";

/**
 * Shared-element morph across navigation.
 *
 * Two elements on different routes with the same `name` are matched by the
 * browser, which animates between their positions instead of cutting. This is
 * pure progressive enhancement: without View Transitions support the app
 * navigates normally and simply does not animate.
 */
export function Morph({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) {
  return <ViewTransition name={name}>{children}</ViewTransition>;
}
