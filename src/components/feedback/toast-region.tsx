"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { CircleAlert, CircleCheck, Heart, Info, WifiOff, X } from "lucide-react";
import { toast as toastVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { dismissToast, toast, useToastState, type ToastItem, type ToastTone } from "./toast-store";

export { toast, dismissToast, announce, useToast } from "./toast-store";
export type { ToastInput, ToastTone, ToastAction } from "./toast-store";

const ICON: Record<ToastTone, { icon: React.ReactNode; well: string }> = {
  save: { icon: <Heart size={16} fill="currentColor" strokeWidth={2.25} />, well: "bg-bandung" },
  success: { icon: <CircleCheck size={16} strokeWidth={2.5} />, well: "bg-pandan" },
  error: { icon: <CircleAlert size={16} strokeWidth={2.5} />, well: "bg-mangga" },
  offline: { icon: <WifiOff size={16} strokeWidth={2.5} />, well: "bg-mangga" },
  info: { icon: <Info size={16} strokeWidth={2.5} />, well: "bg-keladi" },
};

/**
 * The single toast region (DESIGN §6.14), mounted once in the root layout.
 * Polite status region for everything, assertive alert for errors. Auto-dismiss 3.2 s
 * (5 s with an action), paused while hovered or focused. Also watches online/offline.
 */
export function ToastRegion() {
  const { current, announcement } = useToastState();
  const isError = current?.tone === "error" || current?.tone === "offline";

  useEffect(() => {
    const offline = () => toast({ message: "Internet tengah merajuk. Data mungkin bukan yang terkini.", tone: "offline" });
    const online = () => toast({ message: "Dah online balik!", tone: "success" });
    window.addEventListener("offline", offline);
    window.addEventListener("online", online);
    return () => {
      window.removeEventListener("offline", offline);
      window.removeEventListener("online", online);
    };
  }, []);

  // Activity hygiene: never leave a toast behind on a hidden route.
  useLayoutEffect(() => () => dismissToast(), []);

  return (
    <>
      <div role="status" aria-live="polite" className="sr-only">
        {current && !isError ? current.message : ""}
        {announcement ? <span key={announcement.id}>{announcement.text}</span> : null}
      </div>
      <div role="alert" aria-live="assertive" className="sr-only">
        {current && isError ? current.message : ""}
      </div>
      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 z-(--z-toast) flex justify-center px-4",
          "bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom)+28px)] lg:bottom-6 lg:justify-end lg:px-6",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {current && <ToastView key={current.id} item={current} />}
        </AnimatePresence>
      </div>
    </>
  );
}

function ToastView({ item }: { item: ToastItem }) {
  const [paused, setPaused] = useState(false);
  const remaining = useRef(item.duration);
  const startedAt = useRef(0);

  useEffect(() => {
    if (paused) return;
    startedAt.current = Date.now();
    const id = window.setTimeout(() => dismissToast(item.id), remaining.current);
    return () => {
      window.clearTimeout(id);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [paused, item.id]);

  const look = ICON[item.tone];
  const actionClass =
    "relative inline-flex min-h-11 items-center px-1 text-label text-mangga underline decoration-2 underline-offset-4 hover:decoration-mangga";

  return (
    <m.div
      variants={toastVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="on-ink pointer-events-auto flex min-h-12 max-w-[min(92vw,420px)] items-center gap-3 rounded-full bg-ink py-1.5 pl-2 pr-1.5 text-[14px] font-semibold leading-snug text-santan shadow-float"
    >
      <span aria-hidden className={cn("grid size-7 shrink-0 place-items-center rounded-full text-ink ring-2 ring-white", look.well)}>
        {look.icon}
      </span>
      <span className="min-w-0 flex-1 py-1">{item.message}</span>
      {item.action &&
        (item.action.href ? (
          <Link href={item.action.href} className={actionClass} onClick={() => dismissToast(item.id)}>
            {item.action.label}
          </Link>
        ) : (
          <button
            type="button"
            className={actionClass}
            onClick={() => {
              item.action?.onClick?.();
              dismissToast(item.id);
            }}
          >
            {item.action.label}
          </button>
        ))}
      <button
        type="button"
        aria-label="Tutup"
        onClick={() => dismissToast(item.id)}
        className="grid size-8 shrink-0 place-items-center rounded-full text-ink-dim transition-colors hover:bg-white/10 hover:text-santan"
      >
        <X aria-hidden size={18} strokeWidth={2.25} />
      </button>
    </m.div>
  );
}
