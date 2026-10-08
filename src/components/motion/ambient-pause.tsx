"use client";

import { useEffect, useRef } from "react";
import { trackAmbient } from "./use-ambient-pause";

/**
 * Drop-in island for Server Components: place it inside any `[data-ambient]`
 * container and it pauses that container's CSS loops when offscreen or when
 * the tab is hidden. `<div data-ambient>…<AmbientPause /></div>`
 */
export function AmbientPause() {
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = marker.current?.closest("[data-ambient]");
    if (!el) return;
    return trackAmbient(el);
  }, []);

  return <span ref={marker} hidden />;
}
