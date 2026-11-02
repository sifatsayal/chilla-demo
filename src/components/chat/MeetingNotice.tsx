"use client";

import { CalendarCheck, Clock } from "lucide-react";
import { getEmployee } from "@/data/employees";
import { formatMeetingWhen } from "@/lib/dates";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";

// Chat card Chilla posts after a meeting request is submitted.
export function MeetingNotice({ meetingId }: { meetingId: string }) {
  const { meetings, openProfile } = useWorkspace();
  const m = meetings.find((x) => x.id === meetingId);
  const e = m && getEmployee(m.employeeId);
  if (!m || !e) return <p className="text-sm text-muted">Meeting request (removed)</p>;
  const accepted = m.status === "accepted";

  return (
    <div className={`card-flat mt-1 max-w-md p-3 ${accepted ? "bg-mint" : "bg-belly"}`}>
      <p className="flex items-center gap-2 font-bold">
        {accepted ? <CalendarCheck size={16} /> : <Clock size={16} />}
        {accepted ? "Meeting confirmed" : "Meeting request sent"}
      </p>
      <p className="mt-1 text-sm">
        With{" "}
        <button className="font-semibold underline" onClick={() => openProfile(e.id)}>
          {e.name}
        </button>{" "}
        · {formatMeetingWhen(m.date, m.time)} · {m.duration} min · {m.format === "video" ? "Video call" : "In person"}
      </p>
      <p className="mt-1 text-sm text-muted">“{m.purpose}”</p>
      {!accepted && <p className="mt-1 text-xs text-muted">I&apos;ll let you know when {e.name.split(" ")[0]} responds.</p>}
    </div>
  );
}
