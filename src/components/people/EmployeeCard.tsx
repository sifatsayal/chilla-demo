"use client";

import { CalendarPlus } from "lucide-react";
import type { Employee } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";

export const DEPT_COLORS: Record<string, string> = {
  Product: "bg-pink-soft",
  Engineering: "bg-blue-soft",
  Design: "bg-yellow",
  Marketing: "bg-mint",
  Operations: "bg-ear",
};

export function EmployeeCard({ employee: e }: { employee: Employee }) {
  const { openProfile, openMeeting, settings } = useWorkspace();
  const current = e.projects.find((p) => p.status === "current");

  return (
    <article className="card-flat flex flex-col p-4 shadow-brutal-sm transition-transform hover:-translate-y-0.5 hover:shadow-brutal">
      <button className="flex items-start gap-3 text-left" onClick={() => openProfile(e.id)}>
        <Avatar name={e.name} size="lg" status={settings.showAvailability ? e.availability : undefined} />
        <span className="min-w-0">
          <span className="block font-bold hover:underline">{e.name}</span>
          <span className="block text-sm leading-snug">{e.role}</span>
          <span className={`pill mt-1.5 ${DEPT_COLORS[e.department]}`}>{e.department} · {e.team}</span>
        </span>
      </button>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {e.expertise.slice(0, 3).map((x) => (
          <span key={x} className="chip text-[0.72rem]">{x}</span>
        ))}
      </div>
      {current && (
        <p className="mt-3 text-sm text-muted">
          <span className="font-semibold text-ink">Now:</span> {current.name}
        </p>
      )}
      <div className="mt-auto flex gap-2 pt-4">
        <button className="btn btn-ghost btn-sm flex-1" onClick={() => openProfile(e.id)}>View profile</button>
        <button className="btn btn-sm" onClick={() => openMeeting(e.id)} aria-label={`Schedule a meeting with ${e.name}`}>
          <CalendarPlus size={14} />
        </button>
      </div>
    </article>
  );
}
