"use client";

import { useEffect } from "react";
import { useLocalePath } from "@/i18n/client";

/**
 * Closes a native `popover` once the visitor picks one of its links. Client-side navigation keeps
 * the document alive, so without this the Kategori panel stayed open over the page it opened.
 * Modified clicks (new tab/window) leave it open; a route change (incl. Back/Forward) closes it.
 */
export function PopoverAutoClose({ id }: { id: string }) {
  const path = useLocalePath();

  useEffect(() => {
    const panel = document.getElementById(id);
    if (!panel) return;
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest("a[href]");
      if (link && panel.contains(link)) hide(panel);
    };
    panel.addEventListener("click", onClick);
    return () => panel.removeEventListener("click", onClick);
  }, [id]);

  useEffect(() => {
    const panel = document.getElementById(id);
    if (panel) hide(panel);
  }, [id, path]);

  return null;
}

function hide(panel: HTMLElement) {
  try {
    if (panel.matches(":popover-open")) panel.hidePopover();
  } catch {
    // Browsers without the Popover API never opened it.
  }
}
