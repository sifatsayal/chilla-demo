"use client";

import { useWorkspace } from "./WorkspaceProvider";

export function Toast() {
  const { toast } = useWorkspace();
  if (!toast) return null;
  return (
    <div role="status" aria-live="polite" className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 animate-pop">
      <div className="card bg-yellow px-4 py-2.5 text-sm font-semibold">{toast}</div>
    </div>
  );
}
