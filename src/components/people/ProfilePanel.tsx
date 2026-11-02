"use client";

import { CalendarPlus, Clock, Mail, MapPin, MessageCircle, X } from "lucide-react";
import { getEmployee } from "@/data/employees";
import { Avatar, statusLabel } from "@/components/ui/Avatar";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { ProjectList } from "./ProjectList";

// Slack-style profile side panel with a person's full Chilla profile.
export function ProfilePanel() {
  const { profilePanelId, closeProfile, openMeeting, showToast, settings } = useWorkspace();
  const e = profilePanelId ? getEmployee(profilePanelId) : undefined;
  if (!e) return null;

  const current = e.projects.filter((p) => p.status === "current");
  const past = e.projects.filter((p) => p.status === "past");
  const localTime = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", timeZone: e.timezone });
  const first = e.name.split(" ")[0];

  return (
    <aside
      className="fixed inset-0 z-40 flex animate-slide-in flex-col bg-white lg:static lg:z-auto lg:w-[380px] lg:shrink-0 lg:border-l-2 lg:border-ink"
      aria-label={`${e.name}'s profile`}
    >
      <div className="flex items-center justify-between border-b-2 border-ink px-4 py-3">
        <p className="font-extrabold">Profile</p>
        <button onClick={closeProfile} className="rounded-lg p-1.5 hover:bg-belly" aria-label="Close profile">
          <X size={18} />
        </button>
      </div>

      <div className="scroll-thin flex-1 overflow-y-auto">
        <div className="border-b-2 border-dashed border-ear bg-paper px-5 pt-6 pb-5">
          <Avatar name={e.name} size="xl" />
          <h2 className="mt-3 text-2xl font-black tracking-tight">{e.name}</h2>
          <p className="font-medium">{e.role}</p>
          <p className="text-sm text-muted">
            {e.department} · {e.team}
          </p>
          {settings.showAvailability && (
            <p className="mt-2 flex items-center gap-2 text-sm">
              <span
                className={`h-2.5 w-2.5 rounded-full border border-ink ${
                  e.availability === "available" ? "bg-green" : e.availability === "busy" ? "bg-nose" : "bg-ear"
                }`}
              />
              {statusLabel(e.availability)}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn btn-sm" onClick={() => openMeeting(e.id)}>
              <CalendarPlus size={14} /> Schedule meeting
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => showToast(`DMs are simulated. Say hi to ${first} in real Slack! 👋`)}>
              <MessageCircle size={14} /> Message
            </button>
          </div>
        </div>

        <div className="space-y-6 px-5 py-5">
          <Section title="About">
            <p className="text-[0.95rem]">{e.bio}</p>
            <p className="mt-3 rounded-lg bg-blue-soft px-3 py-2 text-sm">
              <b>Ask {first} about:</b> {e.bestFor}
            </p>
          </Section>

          <Section title="Expertise">
            <div className="flex flex-wrap gap-1.5">
              {e.expertise.map((x) => (
                <span key={x} className="chip bg-yellow">{x}</span>
              ))}
            </div>
          </Section>

          <Section title="Skills">
            <div className="flex flex-wrap gap-1.5">
              {e.skills.map((s) => (
                <span key={s} className="chip">{s}</span>
              ))}
            </div>
          </Section>

          {current.length > 0 && (
            <Section title="Current projects">
              <ProjectList projects={current} />
            </Section>
          )}
          {past.length > 0 && (
            <Section title="Previous projects">
              <ProjectList projects={past} />
            </Section>
          )}

          <Section title="Experience">
            <ul className="space-y-1.5 text-sm">
              <li>
                <b>{e.role}</b>, Fernway <span className="text-muted">· {e.tenure}</span>
              </li>
              {e.experience.map((x) => (
                <li key={x.company + x.title}>
                  <b>{x.title}</b>, {x.company} <span className="text-muted">· {x.period}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Contact">
            <ul className="space-y-1.5 text-sm">
              <li className="flex items-center gap-2"><Mail size={14} /> {e.email}</li>
              <li className="flex items-center gap-2"><MessageCircle size={14} /> {e.slack}</li>
              <li className="flex items-center gap-2"><MapPin size={14} /> {e.location}</li>
              <li className="flex items-center gap-2" suppressHydrationWarning><Clock size={14} /> {localTime} local time</li>
            </ul>
          </Section>
        </div>
      </div>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-bold tracking-wider text-muted uppercase">{title}</h3>
      {children}
    </section>
  );
}
