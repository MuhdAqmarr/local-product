"use client";

import NextLink from "next/link";
import { useContext, type ComponentProps } from "react";
import { localeHref, type Locale } from "./config";
import { I18nLocaleContext } from "./client";

type NextLinkProps = ComponentProps<typeof NextLink>;
type Href = NextLinkProps["href"];

/** Localize a string or `{ pathname, query, hash }` href (idempotent: an already-prefixed href is re-targeted). */
export function localizeHref(locale: Locale, href: Href): Href {
  if (typeof href === "string") return localeHref(locale, href);
  if (href && typeof href === "object" && typeof href.pathname === "string") return { ...href, pathname: localeHref(locale, href.pathname) };
  return href;
}

/**
 * Drop-in `next/link` that keeps the visitor in their language: `href="/promos"` becomes
 * "/ms/promos" on Malay pages. Works from Server and Client Components (next/link is a client
 * component anyway, so this adds no island). External URLs, `#hash` and `/api/*` pass through.
 * The language toggle is the one place that must link across languages: it uses next/link directly.
 */
export function Link({ href, ...rest }: NextLinkProps) {
  const locale = useContext(I18nLocaleContext);
  return <NextLink {...rest} href={locale ? localizeHref(locale, href) : href} />;
}

export default Link;
