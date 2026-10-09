"use client";

import { useEffect } from "react";
import { RefreshCw } from "@/components/ui/lucide";
import { ErrorFrame } from "@/components/feedback/error-frame";
import { Button } from "@/components/ui/button";

/** Segment error boundary (DESIGN §8.10): same frame as 404, Oyen terkejut, "Cuba lagi" + "Balik ke kedai". */
export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorFrame mood="terkejut" kite={false} title="Alamak, ada benda tak kena kat pihak kami." body="Bukan salah kau. Cuba lagi kejap? Kalau masih tak jadi, balik ke kedai dulu.">
      <Button variant="primary" icon={<RefreshCw />} onClick={() => retry()}>
        Cuba lagi
      </Button>
      <Button variant="secondary" href="/" trailing="arrow">
        Balik ke kedai
      </Button>
    </ErrorFrame>
  );
}
