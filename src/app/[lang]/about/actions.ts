"use server";

import { hasLocale, type Locale } from "@/i18n/config";
import enAbout from "@/i18n/dictionaries/en/about";
import msAbout from "@/i18n/dictionaries/ms/about";
import { fmt } from "@/i18n/format";
import { categoryName, isCategorySlug } from "@/lib/taxonomy";
import { LIMITS, normaliseLink, text, validateSuggestion, type SuggestField, type SuggestResult } from "./suggest-validate";

export type { SuggestField, SuggestResult };

/**
 * A prefilled email to `SUGGEST_EMAIL`, labelled in the visitor's language (the form posts a hidden
 * `lang`). Sent from the visitor's own email app, so nothing is stored on our side.
 */
function mailtoUrl(to: string, v: Record<SuggestField, string>, link: string, locale: Locale): string {
  const t = (locale === "ms" ? msAbout : enAbout).issue;
  const category = isCategorySlug(v.kategori) ? `${categoryName(v.kategori, locale)} (${v.kategori})` : "-";
  const lines = [
    `${t.name}: ${v.nama}`,
    `${t.link}: ${link}`,
    `${t.category}: ${category}`,
    `${t.state}: ${v.negeri || "-"}`,
    "",
    `${t.why}`,
    v.kenapa || "-",
    "",
    t.footer,
  ];
  // mailto wants %20, not "+", for spaces (RFC 6068), so encode each part by hand.
  const subject = encodeURIComponent(fmt(t.title, { name: v.nama }));
  const body = encodeURIComponent(lines.join("\r\n"));
  return `mailto:${encodeURIComponent(to).replace(/%40/g, "@")}?subject=${subject}&body=${body}`;
}

/**
 * "Cadang jenama" (DESIGN §8.8 #6). Validates, then POSTs JSON to `SUGGEST_WEBHOOK_URL` when it
 * is set. Without a webhook but with `SUGGEST_EMAIL`, nothing is stored on our side, so we say so
 * honestly and hand back a prefilled email for the visitor to send from their own app. With
 * neither, the page shows a "suggestions open soon" note instead of the form (see `suggestMode`).
 * Never link to the source repo (owner's rule).
 */
export async function suggestBrand(form: FormData): Promise<SuggestResult> {
  // Honeypot: real people never see this field. Bots get a quiet success and nothing is sent.
  if (text(form, "laman", 200)) return { status: "sent" };

  const values: Record<SuggestField, string> = {
    nama: text(form, "nama", LIMITS.nama),
    link: text(form, "link", LIMITS.link),
    kategori: text(form, "kategori", 40),
    negeri: text(form, "negeri", 40),
    kenapa: text(form, "kenapa", LIMITS.kenapa),
    email: text(form, "email", LIMITS.email),
  };
  const errors = validateSuggestion(values);
  if (Object.keys(errors).length) return { status: "invalid", errors };

  const link = normaliseLink(values.link) ?? values.link;
  const lang = text(form, "lang", 4);
  const email = process.env.SUGGEST_EMAIL?.trim();
  const fallback = email ? mailtoUrl(email, values, link, hasLocale(lang) ? lang : "en") : undefined;
  const webhook = process.env.SUGGEST_WEBHOOK_URL;
  if (!webhook) return fallback ? { status: "email", url: fallback } : { status: "error" };

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: "suggest-brand",
        name: values.nama,
        link,
        category: values.kategori || null,
        state: values.negeri || null,
        why: values.kenapa || null,
        email: values.email || null,
        submittedAt: new Date().toISOString(),
        source: "lokallah/about",
      }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`webhook ${res.status}`);
    return { status: "sent" };
  } catch {
    return { status: "error", url: fallback };
  }
}
