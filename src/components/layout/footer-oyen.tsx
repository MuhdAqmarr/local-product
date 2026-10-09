"use client";

import { useEffect, useRef, useState } from "react";
import { Oyen } from "@/components/art/oyen";
import { useAfterLoad } from "@/lib/after-load";
import { cn } from "@/lib/utils";

/**
 * Footer easter egg (DESIGN §6.15): Oyen sleeps on the rebung strip; a tap wakes him (happy)
 * with a 1.2 s "meow!" bubble, then he dozes off again. Decorative: aria-hidden, not focusable.
 * The (invisible) bubble mounts after the page has loaded: it is the only Gochi Hand text on most
 * pages, and rendering it at once made every page fetch that font next to its first paint.
 */
export function FooterOyen() {
  const [awake, setAwake] = useState(false);
  const afterLoad = useAfterLoad();
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const wake = () => {
    setAwake(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAwake(false), 1200);
  };

  return (
    <div aria-hidden className="footer-oyen absolute bottom-[2px] right-[10%] z-10 w-24 cursor-pointer select-none" onClick={wake}>
      {(afterLoad || awake) && (
        <span
          className={cn(
            "hand absolute -top-6 left-1/2 whitespace-nowrap rounded-full border-2 border-ink bg-putih px-2.5 py-0.5 !rotate-[-4deg] text-[18px] text-ink transition-[opacity,translate] duration-200 ease-pop",
            awake ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
          )}
        >
          meow!
        </span>
      )}
      <Oyen mood={awake ? "happy" : "tidur"} pose="loaf" size={96} className={cn("block transition-transform duration-200", awake && "-translate-y-1")} />
    </div>
  );
}
