"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode, type RefObject } from "react";
import { X } from "@/components/ui/lucide";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/utils";

export interface DialogBaseProps {
  open: boolean;
  /** Called on Esc, backdrop tap, the close button and the browser closing the dialog. Set your state to false here. */
  onClose: () => void;
  /** Dialog title (h2). Also the accessible name. */
  title: ReactNode;
  /** Visually hide the title (keeps the accessible name). */
  hideTitle?: boolean;
  /** Line under the title. */
  description?: ReactNode;
  children: ReactNode;
  /** Sticky footer (actions). */
  footer?: ReactNode;
  className?: string;
  bodyClassName?: string;
  /** Focus this element on open instead of the first focusable. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  id?: string;
}

/** Keeps a native <dialog> in sync with `open`, closes on backdrop tap and on unmount/Activity hide. */
export function useNativeDialog(open: boolean, onClose: () => void, initialFocusRef?: RefObject<HTMLElement | null>) {
  const ref = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);
  // Closes done by our own cleanup (unmount, Activity hide, StrictMode re-run) must not
  // report back as a user close, or a dialog mounted open would immediately shut itself.
  const silent = useRef(false);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      initialFocusRef?.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, initialFocusRef]);

  // Activity hygiene: a hidden route must not leave a modal (and the scroll lock) behind.
  useLayoutEffect(() => {
    const dialog = ref.current;
    return () => {
      if (dialog?.open) {
        silent.current = true;
        dialog.close();
      }
    };
  }, []);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => {
      if (silent.current) {
        silent.current = false;
        return;
      }
      onCloseRef.current();
    };
    const handleClick = (event: MouseEvent) => {
      if (event.target === dialog) dialog.close();
    };
    dialog.addEventListener("close", handleClose);
    dialog.addEventListener("click", handleClick);
    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("click", handleClick);
    };
  }, []);

  return ref;
}

export function DialogShell({
  kind,
  open,
  onClose,
  title,
  hideTitle,
  description,
  children,
  footer,
  className,
  bodyClassName,
  initialFocusRef,
  id,
}: DialogBaseProps & { kind: "sheet" | "modal" }) {
  const ref = useNativeDialog(open, onClose, initialFocusRef);
  const titleId = `${id ?? kind}-title`;
  const closeLabel = useI18n().m.common.feedback.close;
  return (
    <dialog
      ref={ref}
      id={id}
      aria-labelledby={titleId}
      className={cn(
        kind,
        "overflow-hidden bg-putih p-0 text-ink open:flex open:flex-col",
        kind === "sheet"
          ? "inset-x-0 bottom-0 top-auto m-0 mx-auto max-h-[88dvh] w-full max-w-[560px] rounded-t-sheet border-2 border-b-0 border-ink shadow-sheet sm:mb-4 sm:rounded-sheet sm:border-b-2"
          : "m-auto max-h-[86dvh] w-[min(560px,92vw)] rounded-card-lg border-2 border-ink shadow-float",
        className,
      )}
    >
      {kind === "sheet" && <span aria-hidden className="mx-auto mt-2.5 block h-1 w-9 shrink-0 rounded-full bg-garis sm:hidden" />}
      <div className={cn("flex shrink-0 items-start gap-3 px-5 pt-4", hideTitle ? "justify-end pb-1" : "pb-3")}>
        <div className={cn("min-w-0 flex-1", hideTitle && "sr-only")}>
          <h2 id={titleId} className="text-title-3 text-ink">
            {title}
          </h2>
          {description && <p className="mt-0.5 text-body-sm text-ink-soft">{description}</p>}
        </div>
        <button
          type="button"
          aria-label={closeLabel}
          onClick={() => ref.current?.close()}
          className="relative -mr-1.5 -mt-0.5 grid size-11 shrink-0 place-items-center rounded-full text-ink transition-colors hover:bg-kapas"
        >
          <X aria-hidden size={22} strokeWidth={2.25} />
        </button>
      </div>
      <div data-lenis-prevent="" className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5", bodyClassName)}>
        {children}
      </div>
      {footer && (
        <div className="shrink-0 border-t-2 border-garis bg-putih px-5 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3">{footer}</div>
      )}
    </dialog>
  );
}
