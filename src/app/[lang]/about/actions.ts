"use server";

import { hasLocale, type Locale } from "@/i18n/config";
import enAbout from "@/i18n/dictionaries/en/about";
import msAbout from "@/i18n/dictionaries/ms/about";
import { fmt } from "@/i18n/format";
import { headers } from "next/headers";
import { GoogleFormError, googleFormEnabled, submitToGoogleForm } from "@/lib/suggest-google-form";
import { categoryName, isCategorySlug } from "@/lib/taxonomy";
import { LIMITS, normaliseLink, text, validateSuggestion, type SuggestField, type SuggestResult } from "./suggest-validate";

export type { SuggestField, SuggestResult };

/**
 * Light anti-spam on top of the honeypot: at most 5 suggestions per IP per 10 minutes on each
 * server instance, and forms submitted within 2.5 s of opening are treated as bots. Both get the
 * same quiet "sent" as the honeypot, so scripts learn nothing.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();

function overLimit(ip: string, now: number): boolean {
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 5000) recent.clear();
  return hits.length > MAX_PER_WINDOW;
}

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
 * "Cadang jenama" (DESIGN §8.8 #6). Validates, then records the suggestion in the owner's Google
 * Form (src/lib/suggest-google-form.ts). If that fails and `SUGGEST_WEBHOOK_URL` is set, the JSON
 * goes there instead; with `SUGGEST_EMAIL` the visitor gets a prefilled email as a last resort.
 * Never link to the source repo (owner's rule).
 */
export async function suggestBrand(form: FormData): Promise<SuggestResult> {
  // Honeypot: real people never see this field. Bots get a quiet success and nothing is sent.
  if (text(form, "laman", 200)) return { status: "sent" };
  const elapsed = Number(text(form, "e", 12));
  if (Number.isFinite(elapsed) && elapsed > 0 && elapsed < 2500) return { status: "sent" };
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (overLimit(ip, Date.now())) return { status: "sent" };

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
  const locale: Locale = hasLocale(lang) ? lang : "en";
  const email = process.env.SUGGEST_EMAIL?.trim();
  const fallback = email ? mailtoUrl(email, values, link, locale) : undefined;
  const webhook = process.env.SUGGEST_WEBHOOK_URL;

  let rejected = false;
  if (googleFormEnabled()) {
    try {
      await submitToGoogleForm({
        name: values.nama,
        link,
        // English category name + slug so the sheet sorts the same whatever language was used.
        category: isCategorySlug(values.kategori) ? `${categoryName(values.kategori, "en")} (${values.kategori})` : "",
        state: values.negeri,
        why: values.kenapa,
        email: values.email,
      });
      return { status: "sent" };
    } catch (err) {
      // A timeout may still have been recorded: don't store it twice through another channel.
      if (err instanceof GoogleFormError && err.kind === "timeout") return { status: "error", url: fallback };
      rejected = true;
    }
  }

  if (!webhook) {
    // After a failed save, say so (with the email link as a way out); "email" mode is only for
    // sites configured to send suggestions by email in the first place.
    if (rejected) return { status: "error", url: fallback };
    return fallback ? { status: "email", url: fallback } : { status: "error" };
  }

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
