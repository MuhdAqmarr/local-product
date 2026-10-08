"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, useMotionValueEvent, useScroll } from "motion/react";
import * as m from "motion/react-m";
import { useLenis } from "lenis/react";
import { ArrowUp } from "lucide-react";
import { fab } from "@/lib/motion";
import { prefersLessMotion } from "@/components/providers/motion-pref";

const HIDDEN_ON = ["/about"];

/** Back-to-top FAB (DESIGN §6.20): appears after 1.5 screens, Lenis glide to the top. */
export function BackToTop() {
  const pathname = usePathname();
  const lenis = useLenis();
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > window.innerHeight * 1.5;
    if (next !== show) setShow(next);
  });

  const enabled = !HIDDEN_ON.some((p) => pathname?.startsWith(p));

  const toTop = () => {
    const instant = prefersLessMotion();
    if (lenis) lenis.scrollTo(0, instant ? { immediate: true } : { duration: 0.9 });
    else window.scrollTo({ top: 0, behavior: instant ? "auto" : "smooth" });
    document.getElementById("main")?.focus({ preventScroll: true });
  };

  return (
    <AnimatePresence>
      {enabled && show && (
        <m.button
          key="fab"
          type="button"
          aria-label="Naik ke atas"
          onClick={toTop}
          variants={fab}
          initial="hidden"
          animate="show"
          exit="exit"
          className="pop fixed bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom)+20px)] right-4 z-(--z-fab) lg:bottom-8 lg:right-8"
          style={{ ["--pop-offset" as string]: "3px" }}
        >
          <span className="pop-face size-12 bg-bandung-fizz text-ink">
            <ArrowUp aria-hidden size={22} strokeWidth={2.5} />
          </span>
        </m.button>
      )}
    </AnimatePresence>
  );
}
