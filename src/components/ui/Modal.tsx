"use client";

import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

// Slack-style modal dialog with the Chilla card look.
export function Modal({
  open,
  onClose,
  title,
  icon,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="card flex max-h-[92vh] w-full max-w-lg animate-pop flex-col rounded-b-none sm:rounded-b-[14px]"
      >
        <div className="flex items-center gap-3 border-b-2 border-ink px-5 py-4">
          {icon}
          <h2 className="flex-1 text-lg font-extrabold tracking-tight">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-belly" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="scroll-thin flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t-2 border-ink px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
}
