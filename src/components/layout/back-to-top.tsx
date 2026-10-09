"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useLenis } from "lenis/react";
import { ArrowUp } from "@/components/ui/lucide";
import { fab } from "@/lib/motion";
import { prefersLessMotion } from "@/components/providers/motion-pref";
import { useI18n, useLocalePath } from "@/i18n/client";

/** DESIGN §6.20: list pages and Home only (QA F22). */
const LIST_PREFIXES = ["/promos", "/new", "/brands", "/categories/"];
const allowed = (path: string) => path === "/" || LIST_PREFIXES.some((p) => path.startsWith(p));

/**
 * Back-to-top FAB (DESIGN §6.20): appears after 1.5 screens, Lenis glide to the top (native smooth
 * scroll when Lenis isn't mounted, e.g. on touch). Routes outside the allow-list render nothing and
 * attach no listeners (QA F05).
 */
export function BackToTop() {
  const pathname = useLocalePath();
  return allowed(pathname) ? <Fab key={pathname} /> : null;
}

function Fab() {
  const lenis = useLenis();
  const label = useI18n().m.common.backToTop;
  const [past, setPast] = useState(false);
  const [footerIn, setFooterIn] = useState(false);

  useEffect(() => {
    // One passive listener; React bails out when the boolean doesn't change. A 404/error frame
    // keeps the original path (the proxy rewrites it), so it is checked here too.
    // Read at most once per frame (rAF), like HeaderScroll.
    let frame = 0;
    const check = () => {
      frame = 0;
      setPast(window.scrollY > window.innerHeight * 1.5 && !document.querySelector("[data-not-found], .error-frame"));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    // Step aside while the footer is on screen (its links sit where the FAB would).
    const footer = document.querySelector("footer.footer-wrap");
    if (!footer) return;
    const io = new IntersectionObserver(([e]) => setFooterIn(e.isIntersecting));
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  const toTop = () => {
    const instant = prefersLessMotion();
    if (lenis) lenis.scrollTo(0, instant ? { immediate: true } : { duration: 0.9 });
    else window.scrollTo({ top: 0, behavior: instant ? "auto" : "smooth" });
    document.getElementById("main")?.focus({ preventScroll: true });
  };

  return (
    <AnimatePresence>
      {past && !footerIn && (
        <m.button
          key="fab"
          type="button"
          aria-label={label}
          onClick={toTop}
          variants={fab}
          initial="hidden"
          animate="show"
          exit="exit"
          className="pop fixed right-3 bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom)+20px)] z-(--z-fab) lg:right-8 lg:bottom-8"
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
