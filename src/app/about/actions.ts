"use server";

import { REPO_URL } from "@/lib/site";
import { CATEGORIES } from "@/lib/taxonomy";
import { LIMITS, normaliseLink, text, validateSuggestion, type SuggestField, type SuggestResult } from "./suggest-validate";

export type { SuggestField, SuggestResult };

function githubUrl(v: Record<SuggestField, string>, link: string): string {
  const category = CATEGORIES.find((c) => c.slug === v.kategori);
  const lines = [
    `**Nama jenama:** ${v.nama}`,
    `**Link kedai / Instagram:** ${link}`,
    `**Kategori:** ${category ? `${category.nameMs} (${category.slug})` : "-"}`,
    `**Negeri:** ${v.negeri || "-"}`,
    "",
    "**Kenapa best?**",
    v.kenapa || "-",
    "",
    "_Dihantar dari borang Cadang jenama LokalLah! (email tak dimasukkan sebab isu GitHub boleh dibaca umum)._",
  ];
  const params = new URLSearchParams({ title: `Cadangan jenama: ${v.nama}`, body: lines.join("\n") });
  return `${REPO_URL}/issues/new?${params.toString()}`;
}

/**
 * "Cadang jenama" (DESIGN §8.8 #6). Validates, then POSTs JSON to `SUGGEST_WEBHOOK_URL` when it
 * is set. Without a webhook nothing is stored on our side, so we say so honestly and hand back a
 * prefilled GitHub issue for the visitor to submit themselves.
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
  const fallback = githubUrl(values, link);
  const webhook = process.env.SUGGEST_WEBHOOK_URL;
  if (!webhook) return { status: "github", url: fallback };

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
    return { status: "error", message: "Alamak, tak jadi hantar. Cuba lagi, atau hantar terus kat GitHub.", url: fallback };
  }
}
