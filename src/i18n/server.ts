import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { hasLocale, type Locale } from "./config";
import en, { type Messages, type Namespace } from "./dictionaries/en";
import ms from "./dictionaries/ms";

/**
 * Server-side i18n (docs/I18N.md). Server Components, generateMetadata, opengraph-image and other
 * server utilities only (`next/root-params` fails the build in a Client Component, a Server Action
 * or a Route Handler).
 */

const DICTIONARIES: Record<Locale, Messages> = { en, ms };

/** The page's locale from the `[lang]` root param. An unknown value 404s (the proxy normally prevents it). */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!hasLocale(value)) notFound();
  return value;
}

/** Every namespace for the current page: `const t = await getDictionary(); t.home.heroTitle`. */
export async function getDictionary(): Promise<Messages> {
  return DICTIONARIES[await getLocale()];
}

/** The dictionary for a known locale (sync), e.g. when the locale is already in hand. */
export function dictionaryFor(locale: Locale): Messages {
  return DICTIONARIES[locale];
}

/**
 * A subset of namespaces for a client provider (plain strings, serialisable):
 * `<MessagesProvider messages={await getMessages("listings")}>`.
 */
export async function getMessages<N extends Namespace>(...namespaces: N[]): Promise<Pick<Messages, N>> {
  return messagesFor(await getLocale(), ...namespaces);
}

/** `getMessages` for a known locale. */
export function messagesFor<N extends Namespace>(locale: Locale, ...namespaces: N[]): Pick<Messages, N> {
  const all = DICTIONARIES[locale];
  const out = {} as Pick<Messages, N>;
  for (const ns of namespaces) out[ns] = all[ns];
  return out;
}

export type { Locale, Messages, Namespace };
