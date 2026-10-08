"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Reports `location.search` after mount and on every URL change (same-page Links with other
 * params, Back/Forward, Activity re-show). Render it inside its own `<Suspense fallback={null}>`:
 * `useSearchParams` makes only this empty leaf client-rendered, so the listing HTML stays static.
 */
export function FilterUrlWatch({ onSearch }: { onSearch: (search: string) => void }) {
  const params = useSearchParams();
  const search = params.toString();
  useEffect(() => {
    onSearch(window.location.search);
  }, [search, onSearch]);
  return null;
}
