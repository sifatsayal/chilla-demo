"use client";

import Link from "next/link";
import { CalendarCheck, Clock, Video, Users } from "lucide-react";
import { getEmployee } from "@/data/employees";
import { formatMeetingWhen } from "@/lib/dates";
import { Avatar } from "@/components/ui/Avatar";
import { Mascot } from "@/components/ui/Mascot";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";

export default function MeetingsPage() {
  const { meetings, openProfile } = useWorkspace();
  const sorted = [...meetings].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  return (
    <div className="scroll-thin min-h-0 flex-1 overflow-y-auto bg-paper/50 px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-black tracking-tight">Meetings</h1>
        <p className="text-sm text-muted">Requests you&apos;ve sent through Chilla.</p>

        {sorted.length === 0 ? (
          <div className="card mt-6 flex flex-col items-center p-8 text-center">
            <Mascot className="h-24 w-24" />
            <p className="mt-3 text-lg font-bold">No meetings yet</p>
            <p className="max-w-sm text-sm text-muted">Ask Chilla who to talk to, then hit <b>Request meeting</b> on a recommendation.</p>
            <Link href="/" className="btn mt-4">Ask Chilla</Link>
          </div>
        ) : (
          <ul className="mt-5 space-y-3">
            {sorted.map((m) => {
              const e = getEmployee(m.employeeId);
              if (!e) return null;
              const accepted = m.status === "accepted";
              return (
                <li key={m.id} className="card-flat flex flex-col gap-3 p-4 shadow-brutal-sm sm:flex-row sm:items-center">
                  <button onClick={() => openProfile(e.id)} className="flex items-center gap-3 text-left sm:w-56">
                    <Avatar name={e.name} />
                    <span>
                      <span className="block font-bold hover:underline">{e.name}</span>
                      <span className="block text-xs text-muted">{e.role}</span>
                    </span>
                  </button>
                  <div className="flex-1 text-sm">
                    <p className="font-semibold">{formatMeetingWhen(m.date, m.time)} · {m.duration} min</p>
                    <p className="text-muted">{m.purpose}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="chip bg-white">
                      {m.format === "video" ? <Video size={13} /> : <Users size={13} />}
                      {m.format === "video" ? "Video" : "In person"}
                    </span>
                    <span className={`pill ${accepted ? "bg-mint" : "bg-yellow"}`}>
                      {accepted ? <CalendarCheck size={12} /> : <Clock size={12} />}
                      {accepted ? "Accepted" : "Pending"}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
