"use client";

import { useEffect } from "react";
import { trackAmbient } from "./use-ambient-pause";

const SELECTOR = "[data-reveal]:not(.is-in)";
const AMBIENT = "[data-ambient]";
const RETRY_MS = 120;
const GIVE_UP_MS = 10_000;

/**
 * React marks every DOM node it owns with an own `__reactFiber$<id>` key once hydrated.
 * Touching `class` on a node BEFORE its Suspense segment hydrates makes React log a
 * hydration mismatch, so we only ever mutate nodes React already owns.
 */
function isHydrated(el: Element): boolean {
  for (const key of Object.keys(el)) if (key.startsWith("__reactFiber$")) return true;
  return false;
}

/**
 * One IntersectionObserver for every generic fade-up on the site (`data-reveal`).
 *
 * - Content is visible without JS and while its segment is still hydrating: an element is
 *   only hidden once we have claimed it (`.rv-wait`), and we only claim hydrated nodes.
 * - Anything already on screen when claimed is marked `is-in` straight away (no flicker).
 * - A MutationObserver picks up streamed Suspense content and client navigations.
 * - It also auto-tracks every `[data-ambient]` motif (Oyen, wau, spinning seal, mesh, marquee)
 *   so its CSS loops pause offscreen / in a hidden tab (`data-paused`), again only once hydrated.
 * Mounted once, in the root layout.
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    if (!("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.15 },
    );

    const pending = new Map<Element, (el: Element) => void>();
    const started = performance.now();
    let timer: number | undefined;

    const claim = (el: Element) => {
      const rect = el.getBoundingClientRect();
      // Already visible (or above us): reveal immediately, never hide it.
      if (rect.top < window.innerHeight * 0.92) {
        el.classList.add("is-in");
      } else {
        el.classList.add("rv-wait");
        io.observe(el);
      }
    };

    const flush = () => {
      timer = undefined;
      const force = performance.now() - started > GIVE_UP_MS;
      for (const [el, run] of pending) {
        if (!el.isConnected) pending.delete(el);
        else if (force || isHydrated(el)) {
          pending.delete(el);
          run(el);
        }
      }
      if (pending.size) timer = window.setTimeout(flush, RETRY_MS);
    };

    const ambientCleanups: Array<() => void> = [];
    const ambient = (el: Element) => ambientCleanups.push(trackAmbient(el));

    const whenHydrated = (el: Element, run: (el: Element) => void) => {
      if (isHydrated(el)) run(el);
      else {
        pending.set(el, run);
        if (timer === undefined) timer = window.setTimeout(flush, RETRY_MS);
      }
    };

    const track = (el: Element) => {
      if (!el.classList.contains("rv-wait")) whenHydrated(el, claim);
    };

    const scan = (scope: ParentNode) => {
      if (scope instanceof Element && scope.matches(SELECTOR)) track(scope);
      scope.querySelectorAll(SELECTOR).forEach(track);
      if (scope instanceof Element && scope.matches(AMBIENT)) whenHydrated(scope, ambient);
      scope.querySelectorAll(AMBIENT).forEach((el) => whenHydrated(el, ambient));
    };

    scan(document);
    root.classList.add("reveal-ready");

    const mo = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node instanceof Element) scan(node);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      if (timer !== undefined) window.clearTimeout(timer);
      ambientCleanups.forEach((stop) => stop());
      root.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
