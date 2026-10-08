"use client";

import { DialogShell, type DialogBaseProps } from "./dialog-base";

export type ModalProps = DialogBaseProps;

/** Centred native `<dialog class="modal">` (confirmations such as "Kosongkan semua"). */
export function Modal(props: ModalProps) {
  return <DialogShell kind="modal" {...props} />;
}
