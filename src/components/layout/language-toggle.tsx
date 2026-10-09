"use client";

import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useTransition, type MouseEvent } from "react";
import { useI18n, useLocalePath } from "@/i18n/client";
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, LOCALE_LABEL, LOCALES, localeHref, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

/** Remember the choice for a year (the proxy only reads it for the bare home page). */
function rememberLocale(locale: Locale) {
  try {
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
  } catch {
    // Cookies blocked: the switch still works, it just isn't remembered.
  }
}

export interface LanguageToggleProps {
  /** `header` (sticker pill on santan), `compact` (mobile header), `footer` (on ink). */
  variant?: "header" | "compact" | "footer";
  className?: string;
}

/**
 * EN | BM language switch (docs/I18N.md): two real links to the same page in each language, so it
 * works without JS, opens in a new tab with ⌘/Ctrl-click and is crawlable. A plain click sets the
 * `lokallah-lang` cookie and navigates with `router.push` inside a transition, keeping the query
 * string and hash. The current language is `aria-current="true"`; each option carries `lang` +
 * `hreflang` so screen readers pronounce "English" / "Bahasa Melayu" correctly.
 */
export function LanguageToggle({ variant = "header", className }: LanguageToggleProps) {
  const { locale, m } = useI18n();
  const path = useLocalePath();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const onInk = variant === "footer";

  const choose = (target: Locale) => (event: MouseEvent<HTMLAnchorElement>) => {
    rememberLocale(target);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (target === locale) return;
    const { search, hash } = window.location;
    const destination = localeHref(target, `${path}${search}${hash}`);
    startTransition(() => router.push(destination));
  };

  return (
    <div
      role="group"
      aria-label={m.common.lang.label}
      aria-busy={pending || undefined}
      className={cn(
        "lang-toggle relative inline-flex shrink-0 items-center rounded-full p-0.5",
        onInk ? "border-[1.5px] border-ink-dim" : "border-2 border-ink bg-putih shadow-pop-sm",
        pending && "opacity-70",
        className,
      )}
    >
      {LOCALES.map((l) => {
        const current = l === locale;
        return (
          <NextLink
            key={l}
            href={localeHref(l, path)}
            prefetch={false}
            lang={l}
            hrefLang={l}
            title={m.common.lang.readIn[l]}
            aria-current={current ? "true" : undefined}
            onClick={choose(l)}
            className={cn(
              // ::after widens the tap target to 44 px tall without changing the pill's size.
              "relative grid place-items-center rounded-full font-num leading-none tracking-wide transition-colors duration-150 after:absolute after:inset-x-0 after:-inset-y-2 after:content-['']",
              variant === "compact" ? "h-8 min-w-7 px-1.5 text-[12px] min-[440px]:min-w-9 min-[440px]:px-2 min-[440px]:text-[13px]" : variant === "footer" ? "h-8 min-w-10 px-3 text-[12px]" : "h-9 min-w-10 px-2.5 text-[14px]",
              current
                ? onInk
                  ? "bg-mangga text-ink"
                  : "bg-mangga text-ink shadow-[inset_0_0_0_1.5px_var(--color-ink)]"
                : onInk
                  ? "text-santan hover:bg-white/10"
                  : "text-ink-soft hover:bg-kapas hover:text-ink",
            )}
          >
            <span aria-hidden="true">{LOCALE_LABEL[l].short}</span>
            <span className="sr-only">{LOCALE_LABEL[l].name}</span>
          </NextLink>
        );
      })}
    </div>
  );
}
