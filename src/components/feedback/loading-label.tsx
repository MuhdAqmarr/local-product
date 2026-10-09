"use client";

import { useI18n } from "@/i18n/client";

/** "Loading…" / "Sedang dimuatkan…" in the page language (text only; place it in an sr-only status). */
export function LoadingLabel() {
  return <>{useI18n().m.common.feedback.loading}</>;
}
