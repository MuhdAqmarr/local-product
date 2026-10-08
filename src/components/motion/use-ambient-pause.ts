"use client";

import { useEffect, type RefObject } from "react";

/**
 * Pauses CSS ambient loops (mesh blobs, wau sway, Oyen blink, stamp ring, marquee)
 * when their container is offscreen or the tab is hidden, by toggling `data-paused`.
 * One IntersectionObserver is shared by every ambient container on the page.
 */
let io: IntersectionObserver | null = null;
const visible = new WeakMap<Element, boolean>();
const tracked = new Set<Element>();
let visibilityBound = false;

function apply(el: Element) {
  const paused = document.hidden || !visible.get(el);
  if (paused) el.setAttribute("data-paused", "");
  else el.removeAttribute("data-paused");
}

function onVisibility() {
  tracked.forEach(apply);
}

function observer() {
  io ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.target.isConnected) {
          // Removed by a navigation: forget it so the shared sets do not grow all session.
          io?.unobserve(entry.target);
          tracked.delete(entry.target);
          continue;
        }
        visible.set(entry.target, entry.intersectionRatio > 0.01 || entry.isIntersecting);
        apply(entry.target);
      }
    },
    { threshold: [0, 0.01] },
  );
  if (!visibilityBound) {
    document.addEventListener("visibilitychange", onVisibility);
    visibilityBound = true;
  }
  return io;
}

/** Start pausing `el` offscreen / when hidden. Returns the cleanup. */
export function trackAmbient(el: Element): () => void {
  if (!("IntersectionObserver" in window) || tracked.has(el)) return () => {};
  const obs = observer();
  tracked.add(el);
  obs.observe(el);
  return () => {
    obs.unobserve(el);
    tracked.delete(el);
    el.removeAttribute("data-paused");
  };
}

/** Pause one ambient container (`ref`) when < 1 % visible or when the tab is hidden. */
export function useAmbientPause(ref: RefObject<Element | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return trackAmbient(el);
  }, [ref]);
}
