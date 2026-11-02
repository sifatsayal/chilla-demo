"use client";

import { CalendarPlus, Copy, UserRound } from "lucide-react";
import { getEmployee } from "@/data/employees";
import type { Recommendation } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { RichText } from "@/components/ui/RichText";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";

// One ranked person in Chilla's answer: who, why, and what to do next.
export function RecommendationCard({
  rec,
  rank,
  query,
  topic,
}: {
  rec: Recommendation;
  rank: number;
  query: string;
  topic: string;
}) {
  const { openProfile, openMeeting, showToast, profile } = useWorkspace();
  const e = getEmployee(rec.employeeId);
  if (!e) return null;
  const first = e.name.split(" ")[0];

  const copyIntro = async () => {
    const intro = `Hi ${first}! Chilla pointed me your way. I'm ${profile.name} (${profile.role}, ${profile.team}). Quick question: ${query.replace(/\?*$/, "?")} Would you have 15 minutes this week?`;
    try {
      await navigator.clipboard.writeText(intro);
      showToast(`Intro message for ${first} copied to clipboard ✨`);
    } catch {
      showToast("Couldn't access the clipboard in this browser");
    }
  };

  return (
    <article
      className={`card-flat relative min-w-0 animate-pop p-4 ${rank === 1 ? "shadow-brutal" : "shadow-brutal-sm"}`}
      style={{ animationDelay: `${rank * 80}ms`, animationFillMode: "backwards" }}
    >
      {rank === 1 && <span className="pill absolute -top-3 right-4 bg-yellow">✦ Best match</span>}
      <div className="flex items-start gap-3">
        <span className="font-hand w-5 pt-1 text-2xl leading-none font-bold text-nose">{rank}</span>
        <button onClick={() => openProfile(e.id)} aria-label={`Open ${e.name}'s profile`}>
          <Avatar name={e.name} status={e.availability} />
        </button>
        <div className="min-w-0 flex-1">
          <button onClick={() => openProfile(e.id)} className="text-left font-bold hover:underline">
            {e.name}
          </button>
          <p className="truncate text-sm text-muted">
            {e.role} · {e.team}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg leading-none font-extrabold text-blue">{rec.relevance}%</p>
          <p className="text-[0.65rem] font-semibold tracking-wide text-muted uppercase">match</p>
        </div>
      </div>

      <ul className="mt-3 space-y-1.5 pl-8 text-[0.92rem]">
        {rec.reasons.map((r, i) => (
          <li key={i} className="relative pl-4 before:absolute before:top-[0.6em] before:left-0 before:h-1.5 before:w-1.5 before:rounded-full before:bg-fur">
            <RichText text={r} />
          </li>
        ))}
      </ul>

      {rec.matchedTerms.length > 0 && (
        <p className="mt-2 pl-8 text-xs text-muted">
          Matched on:{" "}
          {rec.matchedTerms.map((t) => (
            <span key={t} className="mr-1 rounded bg-blue-soft px-1.5 py-px font-semibold text-blue">
              {t}
            </span>
          ))}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2 pl-8">
        <button className="btn btn-sm" onClick={() => openMeeting(e.id, topic)}>
          <CalendarPlus size={14} /> Request meeting
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => openProfile(e.id)}>
          <UserRound size={14} /> View profile
        </button>
        <button className="btn btn-ghost btn-sm" onClick={copyIntro}>
          <Copy size={14} /> Draft intro DM
        </button>
      </div>
    </article>
  );
}
