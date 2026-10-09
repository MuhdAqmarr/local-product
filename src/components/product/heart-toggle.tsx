"use client";

import { useRef, useState } from "react";
import { Heart } from "@/components/ui/lucide";
import { prefersLessMotion } from "@/components/providers/motion-pref";
import { FLY_TEACH_LIMIT } from "@/lib/motion";
import { Particles } from "@/components/art/particles";
import { cn } from "@/lib/utils";
import "./save-button.css";

const FLY_KEY = "lokallah:fly";
const HEART = "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z";

/** First 3 saves of a session fly to Simpan; afterwards only bump + count. */
function takeFlightTicket(): boolean {
  try {
    const n = Number(window.sessionStorage.getItem(FLY_KEY) ?? "0");
    if (n >= FLY_TEACH_LIMIT) return false;
    window.sessionStorage.setItem(FLY_KEY, String(n + 1));
    return true;
  } catch {
    return false;
  }
}

/** The visible Simpan target: tab bar heart on phones, header heart on desktop. */
function visibleTarget(): HTMLElement | null {
  const all = Array.from(document.querySelectorAll<HTMLElement>("[data-saved-target]"));
  return (
    all.find((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight;
    }) ?? null
  );
}

function bump(target: HTMLElement) {
  target.animate([{ transform: "scale(1)" }, { transform: "scale(1.22)" }, { transform: "scale(1)" }], {
    duration: 320,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  });
}

export interface HeartToggleProps {
  saved: boolean;
  /** Write the store; return true when the item is now saved. */
  onToggle: () => boolean;
  /** Called after the visual reward, with the new state. */
  onChange?: (saved: boolean) => void;
  label: { save: string; unsave: string };
  size?: "md" | "lg";
  /** `solid` = 2 px ink outline on white (on surfaces), default = floating on a photo. */
  tone?: "float" | "solid";
  className?: string;
}

/**
 * Heart toggle with the "Masuk Simpan" reward (DESIGN §7.6): squash/pop fill, jambu ring,
 * 6 particles, teach-once flight to `[data-saved-target]`, catch bump, haptic tick.
 * Everything is CSS/WAAPI; the Motion flight module is imported lazily only for the first 3 saves.
 */
export function HeartToggle({ saved, onToggle, onChange, label, size = "md", tone = "float", className }: HeartToggleProps) {
  const ref = useRef<HTMLButtonElement>(null);
  /** Bumped on every save: fires one <Particles> burst + one ring (0 = nothing). */
  const [burst, setBurst] = useState(0);
  const [popped, setPopped] = useState(false);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    const btn = ref.current;
    const calm = prefersLessMotion();
    // Measure once, before any write (INP: no forced layout after the store update).
    const from = btn?.getBoundingClientRect();
    const target = !calm ? visibleTarget() : null;
    const to = target?.getBoundingClientRect();

    const nowSaved = onToggle();

    if (nowSaved) {
      setPopped(true);
      if (!calm) {
        setBurst((n) => n + 1);
        try {
          navigator.vibrate?.(8);
        } catch {
          // Some browsers throw without a user-activation context; the tick is optional.
        }
        if (target && from && to) {
          if (takeFlightTicket()) {
            import("./fly-to-saved").then(({ flyToSaved }) => flyToSaved({ from, target, to })).catch(() => bump(target));
          } else {
            bump(target);
          }
        }
      } else if (target) {
        bump(target);
      }
    } else {
      setPopped(false);
      if (!calm) {
        btn?.querySelector("[data-heart]")?.animate([{ transform: "scale(1)" }, { transform: "scale(.8)" }, { transform: "scale(1)" }], {
          duration: 200,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        });
      }
    }
    onChange?.(nowSaved);
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleClick}
      aria-label={saved ? label.unsave : label.save}
      className={cn("heart-btn", size === "lg" && "heart-btn-lg", tone === "solid" && "heart-btn-solid", saved && "heart-on", "relative z-10", className)}
    >
      <span className={"heart-ic"} data-heart="">
        <Heart size={20} strokeWidth={2} className={"heart-outline"} aria-hidden="true" />
        <svg viewBox="0 0 24 24" width={20} height={20} className={cn("heart-filled", popped && "heart-popping")} aria-hidden="true" >
          <path d={HEART} fill="currentColor" stroke="var(--color-ink)" strokeWidth={2} strokeLinejoin="round" />
        </svg>
      </span>
      {burst > 0 && <span key={burst} className="heart-burst-ring" aria-hidden="true" />}
      <Particles burst={burst} preset="save" />
    </button>
  );
}
