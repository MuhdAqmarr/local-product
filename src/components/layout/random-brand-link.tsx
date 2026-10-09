"use client";

import { Link } from "@/i18n/link";
import { startTransition } from "react";
import { Dices } from "@/components/ui/lucide";
import { useI18n, useLocaleRouter } from "@/i18n/client";

/** Footer "Random brand": picks a random brand at tap time (no randomness during render). */
export function RandomBrandLink({ slugs, className }: { slugs: string[]; className?: string }) {
  const router = useLocaleRouter();
  const { m } = useI18n();
  return (
    <Link
      href="/brands"
      className={className}
      onClick={(event) => {
        if (!slugs.length || event.metaKey || event.ctrlKey) return;
        event.preventDefault();
        const slug = slugs[Math.floor(Math.random() * slugs.length)];
        startTransition(() => router.push(`/brands/${slug}`, { transitionTypes: ["nav-forward"] }));
      }}
    >
      <Dices aria-hidden size={16} className="mr-1.5 inline-block -translate-y-px" />
      {m.common.footer.randomBrand}
    </Link>
  );
}
