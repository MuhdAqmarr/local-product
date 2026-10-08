"use client";

import { useSyncExternalStore } from "react";

/** "user" = follow the OS setting (Motion's default); "always" = reduce everything. */
export type MotionPref = "user" | "always";

const STORAGE_KEY = "lokallah:motion";
const QUERY = "(prefers-reduced-motion: reduce)";
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", listener);
  return () => {
    listeners.delete(listener);
    mq.removeEventListener("change", listener);
  };
}

function getSnapshot(): MotionPref {
  if (document.documentElement.dataset.motion === "reduce") return "always";
  return window.matchMedia(QUERY).matches ? "always" : "user";
}

const getServerSnapshot = (): MotionPref => "user";

/** Reduced motion from the OS, the in-site switch or Save-Data. Server snapshot: "user". */
export function useMotionPref(): MotionPref {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** True when the visitor turned on "Animasi: Kurang" in the site (not the OS setting). */
export function useSiteMotionReduced(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.motion === "reduce",
    () => false,
  );
}

/** Imperative check for event handlers (particles, flights, nudges). */
export function prefersLessMotion(): boolean {
  if (typeof window === "undefined") return false;
  return getSnapshot() === "always";
}

/** The "Animasi: Penuh / Kurang" switch. Persists per browser and updates every subscriber. */
export function setMotionPref(reduce: boolean) {
  const root = document.documentElement;
  if (reduce) root.dataset.motion = "reduce";
  else delete root.dataset.motion;
  try {
    if (reduce) window.localStorage.setItem(STORAGE_KEY, "reduce");
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage blocked: the choice still applies for this visit.
  }
  emit();
}
