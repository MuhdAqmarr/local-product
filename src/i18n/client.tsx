"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { localeHref, stripLocale, type Locale } from "./config";
import type { Messages } from "./dictionaries/en";
import { fmt, plural } from "./format";

/**
 * Client-side i18n (docs/I18N.md).
 *
 * The root layout wraps the app in `<I18nProvider locale messages={common + search + saved}>`.
 * A page that needs more namespaces in its client islands wraps them in
 * `<MessagesProvider messages={await getMessages("listings")}>` (nested providers merge).
 *
 *   const { m, href, locale } = useI18n();
 *   <Link href={href("/promos")}>{m.common.nav.promos}</Link>
 */

interface I18nValue {
  locale: Locale;
  messages: Partial<Messages>;
}

const I18nContext = createContext<I18nValue | null>(null);

/** The locale alone (null outside the provider), for `Link` and other locale-only consumers. */
export const I18nLocaleContext = createContext<Locale | null>(null);

export function I18nProvider({ locale, messages, children }: { locale: Locale; messages: Partial<Messages>; children: ReactNode }) {
  const value = useMemo(() => ({ locale, messages }), [locale, messages]);
  return (
    <I18nLocaleContext.Provider value={locale}>
      <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
    </I18nLocaleContext.Provider>
  );
}

/** Adds namespaces for the client islands below it (merged over the parent's). */
export function MessagesProvider({ messages, children }: { messages: Partial<Messages>; children: ReactNode }) {
  const parent = useContext(I18nContext);
  if (!parent) throw new Error("MessagesProvider must be rendered inside I18nProvider (the [lang] root layout).");
  const merged = useMemo(() => ({ locale: parent.locale, messages: { ...parent.messages, ...messages } }), [parent, messages]);
  return <I18nContext.Provider value={merged}>{children}</I18nContext.Provider>;
}

/** Throws a clear error in development when a namespace was never provided to this subtree. */
function guard(messages: Partial<Messages>): Messages {
  if (process.env.NODE_ENV === "production") return messages as Messages;
  return new Proxy(messages, {
    get(target, key) {
      if (typeof key === "string" && !(key in target) && !key.startsWith("$$") && key !== "then" && key !== "toJSON") {
        throw new Error(`[i18n] Namespace "${key}" is not provided here. Wrap the client island in <MessagesProvider messages={await getMessages("${key}")}>.`);
      }
      return Reflect.get(target, key);
    },
  }) as Messages;
}

export interface UseI18n {
  locale: Locale;
  /** Messages by namespace: `m.common.nav.promos`. Only provided namespaces exist at runtime. */
  m: Messages;
  /** Locale-aware internal href: `href("/promos")` → "/promos" or "/ms/promos". */
  href: (path: string) => string;
  /** `{name}` placeholders: `fmt(m.common.live.site, { count: 141 })`. */
  fmt: typeof fmt;
  /** `{ one, other }` + `{count}`: `plural(n, m.common.category.brands)`. */
  plural: typeof plural;
}

export function useI18n(): UseI18n {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider (the [lang] root layout).");
  const { locale, messages } = ctx;
  return useMemo(() => ({ locale, m: guard(messages), href: (path: string) => localeHref(locale, path), fmt, plural }), [locale, messages]);
}

/** Just the locale (cheaper than useI18n when you only need it for a formatter). */
export function useLocale(): Locale {
  const locale = useContext(I18nLocaleContext);
  if (!locale) throw new Error("useLocale must be used inside I18nProvider (the [lang] root layout).");
  return locale;
}

/**
 * The current pathname without its locale prefix ("/ms/promos" → "/promos"), for active-link
 * checks. Same value on the server render and in the browser, whichever form the router reports.
 */
export function useLocalePath(): string {
  const pathname = usePathname();
  return stripLocale(pathname ?? "/").path;
}

type AppRouter = ReturnType<typeof useRouter>;

/**
 * `useRouter()` whose `push` / `replace` / `prefetch` take language-neutral paths and keep the
 * visitor in their language: `router.push("/brands/x")` → "/ms/brands/x" on Malay pages.
 */
export function useLocaleRouter(): AppRouter {
  const router = useRouter();
  const locale = useLocale();
  return useMemo(
    () => ({
      ...router,
      push: (href, options) => router.push(localeHref(locale, href), options),
      replace: (href, options) => router.replace(localeHref(locale, href), options),
      prefetch: (href, options) => router.prefetch(localeHref(locale, href), options),
    }),
    [router, locale],
  );
}
