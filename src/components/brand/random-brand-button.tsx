"use client";

import { startTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { Dices } from "@/components/ui/lucide";
import { prefersLessMotion } from "@/components/providers/motion-pref";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/button";

export interface RandomBrandButtonProps {
  /** Brand slugs to pick from (picked at tap time, never during render). */
  slugs: string[];
  /** Skip this slug (e.g. the brand page you are on). */
  exclude?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/**
 * "Jenama rawak" (DESIGN §7.5 #26): the dice rotates 360° (400 ms, ease-out) to say "random",
 * then we navigate. Under reduced motion it navigates straight away.
 */
export function RandomBrandButton({ slugs, exclude, variant = "secondary", size = "md", className }: RandomBrandButtonProps) {
  const router = useRouter();
  const iconRef = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);

  const go = () => {
    const pool = exclude ? slugs.filter((s) => s !== exclude) : slugs;
    if (!pool.length || busy.current) return;
    const slug = pool[Math.floor(Math.random() * pool.length)];
    const href = `/brands/${slug}`;
    router.prefetch(href);
    const navigate = () => {
      busy.current = false;
      startTransition(() => router.push(href, { transitionTypes: ["nav-forward"] }));
    };
    const icon = iconRef.current;
    if (!icon || prefersLessMotion() || typeof icon.animate !== "function") return navigate();
    busy.current = true;
    const spin = icon.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }], {
      duration: 400,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    });
    spin.finished.then(navigate, navigate);
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={go}
      icon={
        <span ref={iconRef} className="inline-flex">
          <Dices aria-hidden size={20} />
        </span>
      }
    >
      Jenama rawak
    </Button>
  );
}
