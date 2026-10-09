"use client";

import { useSyncExternalStore } from "react";

/*
 * One session-wide gate that opens once the first page has finished loading (window `load`, or 5 s
 * at most) and the main thread is idle. Work that is not needed for the first paint waits for it,
 * so it doesn't compete with the page's own HTML, CSS, fonts, scripts and images on a phone:
 * shell-link prefetches (ShellLink) and the footer cat's hand-lettered bubble (FooterOyen).
 * Client-side navigations find it already open.
 */
let ready = false;
let armed = false;
const listeners = new Set<() => void>();

function open() {
  if (ready) return;
  ready = true;
  listeners.forEach((fn) => fn());
}

function arm() {
  if (armed) return;
  armed = true;
  let started = false;
  const whenIdle = () => {
    if (started) return;
    started = true;
    if ("requestIdleCallback" in window) window.requestIdleCallback(open, { timeout: 2000 });
    else setTimeout(open, 300);
  };
  if (document.readyState === "complete") whenIdle();
  else {
    window.addEventListener("load", whenIdle, { once: true });
    setTimeout(whenIdle, 5000);
  }
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  arm();
  return () => {
    listeners.delete(onChange);
  };
}

/** False on the server and until the first page has loaded and gone idle; then true for the session. */
export function useAfterLoad() {
  return useSyncExternalStore(
    subscribe,
    () => ready,
    () => false,
  );
}
