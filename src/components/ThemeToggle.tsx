"use client";

import { useCallback, useSyncExternalStore } from "react";
import { Sun, Moon } from "@/components/icons";

type Theme = "light" | "dark";

/**
 * The active theme is external state: it lives on <html data-theme>, is written
 * by the pre-paint script in the layout, and also depends on the OS preference.
 * So it is read with useSyncExternalStore rather than mirrored into useState —
 * subscribing to both the attribute and the media query keeps this button
 * correct no matter which one changes.
 */
function getTheme(): Theme {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === "light" || explicit === "dark") return explicit;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function subscribe(onStoreChange: () => void) {
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener("change", onStoreChange);

  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  return () => {
    mql.removeEventListener("change", onStoreChange);
    observer.disconnect();
  };
}

// The server cannot know the viewer's theme, so it renders the generic label.
const getServerSnapshot = (): Theme | null => null;

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerSnapshot);

  const toggle = useCallback(() => {
    const next: Theme = getTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private mode or blocked site data: the choice just won't persist.
    }
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        theme
          ? `Switch to ${theme === "dark" ? "light" : "dark"} theme`
          : "Switch theme"
      }
      className="grid size-9 place-items-center rounded-full border border-rule text-ink-muted transition-colors hover:border-rule-strong hover:text-ink"
    >
      {/* Show the theme you will switch TO. */}
      <Sun className="col-start-1 row-start-1 hidden size-4 dark:block" />
      <Moon className="col-start-1 row-start-1 size-4 dark:hidden" />
    </button>
  );
}
