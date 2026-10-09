"use client";

import { useEffect } from "react";
import { RefreshCw } from "@/components/ui/lucide";
import { ErrorFrame } from "@/components/feedback/error-frame";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/client";
import en from "@/i18n/dictionaries/en/errors";
import ms from "@/i18n/dictionaries/ms/errors";

/** Segment error boundary (DESIGN §8.10): same frame as 404, Oyen terkejut, "Try again" + "Back to the shop". */
export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  // The `errors` namespace is not in the layout's client messages; it is tiny, so import both.
  const t = (useLocale() === "ms" ? ms : en).error;

  return (
    <ErrorFrame mood="terkejut" kite={false} title={t.title} body={t.body}>
      <Button variant="primary" icon={<RefreshCw />} onClick={() => retry()}>
        {t.retry}
      </Button>
      <Button variant="secondary" href="/" trailing="arrow">
        {t.home}
      </Button>
    </ErrorFrame>
  );
}
