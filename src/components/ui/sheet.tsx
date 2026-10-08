"use client";

import { DialogShell, type DialogBaseProps } from "./dialog-base";

export type SheetProps = DialogBaseProps;

/**
 * Bottom sheet (DESIGN §6.6/§6.2): native `<dialog class="sheet">` + showModal(), so focus trap,
 * Esc, inert background and focus return are free. Slides up via CSS @starting-style (no JS
 * animation). Body is `data-lenis-prevent`; page scroll is locked by `html:has(dialog[open])`.
 * No drag-to-dismiss. On ≥ 640 px it floats as a centred card.
 */
export function Sheet(props: SheetProps) {
  return <DialogShell kind="sheet" {...props} />;
}
