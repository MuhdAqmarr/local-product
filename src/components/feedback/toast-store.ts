"use client";

import { useSyncExternalStore } from "react";

export type ToastTone = "save" | "success" | "error" | "offline" | "info";

export interface ToastAction {
  label: string;
  /** Run on tap (e.g. Undo). The toast closes afterwards. */
  onClick?: () => void;
  /** Or navigate (e.g. "Tengok" → /saved). */
  href?: string;
}

export interface ToastInput {
  message: string;
  tone?: ToastTone;
  action?: ToastAction;
  /** ms; default 3200, or 5000 with an action. */
  duration?: number;
}

export interface ToastItem extends Required<Pick<ToastInput, "message" | "tone">> {
  id: number;
  action?: ToastAction;
  duration: number;
}

interface State {
  current: ToastItem | null;
  /** Polite sr-only announcement without a visible toast (e.g. "Disimpan"). */
  announcement: { id: number; text: string } | null;
}

let state: State = { current: null, announcement: null };
let seq = 0;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const SERVER: State = { current: null, announcement: null };

/** Show a toast (one at a time; a new one replaces the old). Returns its id. Safe to call from any client code. */
export function toast(input: ToastInput): number {
  const id = ++seq;
  state = {
    ...state,
    current: {
      id,
      message: input.message,
      tone: input.tone ?? "info",
      action: input.action,
      duration: input.duration ?? (input.action ? 5000 : 3200),
    },
  };
  emit();
  return id;
}

/** Close the current toast (or only if it is `id`). */
export function dismissToast(id?: number) {
  if (!state.current || (id != null && state.current.id !== id)) return;
  state = { ...state, current: null };
  emit();
}

/** Screen-reader-only status message (no visible toast). */
export function announce(text: string) {
  state = { ...state, announcement: { id: ++seq, text } };
  emit();
}

export function useToastState(): State {
  return useSyncExternalStore(subscribe, () => state, () => SERVER);
}

/** `const { toast, dismiss, announce } = useToast()` — stable functions, no provider needed. */
export function useToast() {
  return { toast, dismiss: dismissToast, announce };
}
