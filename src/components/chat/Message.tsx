"use client";

import { getEmployee } from "@/data/employees";
import type { ChatMessage } from "@/lib/types";
import { formatTime } from "@/lib/dates";
import { Avatar } from "@/components/ui/Avatar";
import { ChillaAvatar } from "@/components/ui/Mascot";
import { RichText } from "@/components/ui/RichText";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { MeetingNotice } from "./MeetingNotice";
import { RecommendationCard } from "./RecommendationCard";

export function Message({ msg }: { msg: ChatMessage }) {
  const { profile, openProfile } = useWorkspace();
  const employee = msg.author !== "me" && msg.author !== "chilla" ? getEmployee(msg.author) : undefined;
  const name = msg.author === "me" ? profile.name : msg.author === "chilla" ? "Chilla" : (employee?.name ?? "Someone");

  return (
    <div className="group flex animate-pop gap-3 rounded-lg px-4 py-2 hover:bg-paper/60 sm:px-5">
      {msg.author === "chilla" ? (
        <ChillaAvatar />
      ) : employee ? (
        <button onClick={() => openProfile(employee.id)} aria-label={`Open ${employee.name}'s profile`}>
          <Avatar name={employee.name} />
        </button>
      ) : (
        <Avatar name={name} />
      )}
      <div className="min-w-0 flex-1">
        <p className="flex items-baseline gap-2">
          {employee ? (
            <button className="font-bold hover:underline" onClick={() => openProfile(employee.id)}>
              {name}
            </button>
          ) : (
            <b>{name}</b>
          )}
          {msg.author === "chilla" && <span className="rounded bg-ear px-1.5 text-[0.6rem] font-bold">APP</span>}
          <time className="text-xs text-muted" suppressHydrationWarning>{formatTime(msg.ts)}</time>
        </p>

        {msg.kind === "text" && (
          <p className="text-[0.97rem] leading-relaxed whitespace-pre-wrap">
            <RichText text={msg.text} />
          </p>
        )}

        {msg.kind === "meeting" && <MeetingNotice meetingId={msg.meetingId} />}

        {msg.kind === "recommendations" && (
          <div className="mt-0.5">
            <p className="text-[0.97rem] leading-relaxed">
              {msg.results.length > 1 ? (
                <>
                  Here are the <b>{msg.results.length} people</b> who know the most about{" "}
                  <span className="hl font-semibold">{msg.topic}</span>, ranked by how closely their work matches:
                </>
              ) : (
                <>
                  I found one person who clearly works on <span className="hl font-semibold">{msg.topic}</span>:
                </>
              )}
            </p>
            <div className="mt-4 grid max-w-2xl grid-cols-[minmax(0,1fr)] gap-4">
              {msg.results.map((r, i) => (
                <RecommendationCard key={r.employeeId} rec={r} rank={i + 1} query={msg.query} topic={msg.topic} />
              ))}
            </div>
            <p className="mt-3 text-xs text-muted">
              Based on projects, skills and expertise in Fernway profiles. Ask a follow-up to narrow it down.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 px-4 py-2 sm:px-5" aria-live="polite">
      <ChillaAvatar />
      <div className="flex items-center gap-2 text-sm text-muted">
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-1.5 w-1.5 animate-bounce-dot rounded-full bg-fur" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </span>
        Chilla is checking who&apos;s worked on this…
      </div>
    </div>
  );
}
