"use client";

import { useEffect } from "react";

const KEY = "lokallah:intro";

/**
 * The Home hero intro is pure CSS (`.intro-*`) and plays before hydration.
 * ~1.5 s after mount this marks it as played for the session, so neither a
 * later visit nor Activity re-showing Home (display:none -> block) replays it.
 */
export function HeroIntroGuard() {
  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(KEY, "1");
      } catch {
        // Storage blocked: the intro may replay next visit, which is harmless.
      }
      document.documentElement.dataset.intro = "done";
    }, 1500);
    return () => window.clearTimeout(id);
  }, []);
  return null;
}
