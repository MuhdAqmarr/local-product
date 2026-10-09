import "server-only";

import { googleFormSwitch } from "@/app/[lang]/about/suggest-validate";

/**
 * "Cadang jenama" submissions go to the owner's Google Form (responses land in the form's
 * Responses tab and its linked Sheet). The form is published and does not require sign-in, so a
 * plain server-side POST to its formResponse endpoint records a response.
 *
 * Entry ids come from the public form page (FB_PUBLIC_LOAD_DATA_). If the owner edits the
 * questions, re-read them: open the viewform page source and look for "entry.<id>"-style numbers,
 * or ask Claude to re-run the extraction. On/off rules: googleFormSwitch() in suggest-validate.ts.
 */
const FORM_ID = "1FAIpQLSd0hsBxq93ryfqtjY-w3y3FGLAauCqNjNWPuaGu8ird7yqZrg";

export const GOOGLE_FORM = {
  viewUrl: `https://docs.google.com/forms/d/e/${FORM_ID}/viewform`,
  action: `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`,
  entries: {
    name: "entry.1929025263",
    link: "entry.327104909",
    category: "entry.1676148108",
    state: "entry.21727655",
    why: "entry.282023881",
    email: "entry.1254095753",
  },
} as const;

export function googleFormEnabled(): boolean {
  return googleFormSwitch();
}

/**
 * "rejected": Google definitely did not record it (sign-in wall, closed form, 4xx/5xx) — safe to try
 * another channel. "timeout": we gave up waiting; Google may still have recorded it.
 */
export class GoogleFormError extends Error {
  constructor(readonly kind: "rejected" | "timeout") {
    super(`google form ${kind}`);
  }
}

export interface GoogleFormAnswers {
  name: string;
  link: string;
  category: string;
  state: string;
  why: string;
  email: string;
}

/**
 * Records one response. Success is a plain 200 from formResponse itself: redirects are not followed,
 * because a form that later requires sign-in (or stops accepting responses) answers with a redirect
 * to a login or "closed" page that would otherwise look like a 200.
 */
export async function submitToGoogleForm(answers: GoogleFormAnswers): Promise<void> {
  const body = new URLSearchParams();
  for (const [key, entry] of Object.entries(GOOGLE_FORM.entries) as Array<[keyof GoogleFormAnswers, string]>) {
    body.set(entry, answers[key]);
  }
  let res: Response;
  try {
    res = await fetch(GOOGLE_FORM.action, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
      redirect: "manual",
    });
  } catch (err) {
    const name = err instanceof Error ? err.name : "";
    throw new GoogleFormError(name === "TimeoutError" || name === "AbortError" ? "timeout" : "rejected");
  }
  if (res.status !== 200) throw new GoogleFormError("rejected");
}
