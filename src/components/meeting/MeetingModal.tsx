"use client";

import { useMemo, useState } from "react";
import { CalendarCheck, Loader2, Video, Users } from "lucide-react";
import { getEmployee } from "@/data/employees";
import { formatMeetingWhen, formatTimeLabel, nextWeekdays, slotsFor, toISODate } from "@/lib/dates";
import type { Employee, MeetingRequest } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { Mascot } from "@/components/ui/Mascot";
import { Modal } from "@/components/ui/Modal";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";

const DURATIONS = [15, 30, 45, 60];

// Slack-style modal to request time with someone. Calendar data is simulated.
export function MeetingModal() {
  const { meetingTarget, closeMeeting } = useWorkspace();
  const employee = meetingTarget ? getEmployee(meetingTarget.employeeId) : undefined;
  return (
    <Modal
      open={!!employee}
      onClose={closeMeeting}
      title={employee ? `Meet with ${employee.name.split(" ")[0]}` : ""}
      icon={employee && <Avatar name={employee.name} size="sm" />}
    >
      {employee && <MeetingForm key={employee.id} employee={employee} context={meetingTarget?.context} />}
    </Modal>
  );
}

function MeetingForm({ employee, context }: { employee: Employee; context?: string }) {
  const { settings, submitMeeting, closeMeeting, openProfile } = useWorkspace();
  const days = useMemo(() => nextWeekdays(7), []);
  const [date, setDate] = useState(toISODate(days[0]));
  const slots = slotsFor(employee.id, date, settings.workingHoursStart, settings.workingHoursEnd);
  const [time, setTime] = useState<string | null>(null);
  const [duration, setDuration] = useState(settings.defaultDuration);
  const [format, setFormat] = useState(settings.defaultFormat);
  const [purpose, setPurpose] = useState(context ? `Chilla suggested I talk to you about ${context}. Could I get your input?` : "");
  const [shareContext, setShareContext] = useState(true);
  const [state, setState] = useState<"form" | "sending" | "done">("form");
  const [sent, setSent] = useState<MeetingRequest | null>(null);
  const first = employee.name.split(" ")[0];

  if (state === "done" && sent) {
    return (
      <div className="text-center">
        <div className="relative mx-auto w-fit">
          <Mascot className="h-28 w-28" />
          <span className="absolute -right-2 bottom-1 grid h-9 w-9 place-items-center rounded-full border-2 border-ink bg-mint">
            <CalendarCheck size={18} />
          </span>
        </div>
        <h3 className="mt-3 text-2xl font-black tracking-tight">
          Request <span className="hl">sent!</span>
        </h3>
        <p className="mt-1 text-muted">
          Chilla sent {first} a DM with your request. I&apos;ll ping you the moment they reply.
        </p>
        <div className="card-flat mt-5 bg-belly p-4 text-left text-sm">
          <p className="flex items-center gap-2 font-bold">
            <Avatar name={employee.name} size="sm" /> {employee.name}
          </p>
          <dl className="mt-3 grid grid-cols-[90px_1fr] gap-y-1.5">
            <dt className="text-muted">When</dt>
            <dd className="font-semibold">{formatMeetingWhen(sent.date, sent.time)}</dd>
            <dt className="text-muted">Length</dt>
            <dd>{sent.duration} minutes</dd>
            <dt className="text-muted">Where</dt>
            <dd>{sent.format === "video" ? "Video call (link added on accept)" : "In person"}</dd>
            <dt className="text-muted">Purpose</dt>
            <dd>{sent.purpose}</dd>
          </dl>
        </div>
        <div className="mt-5 flex justify-center gap-2">
          <button className="btn btn-ghost" onClick={() => { closeMeeting(); openProfile(employee.id); }}>
            Back to profile
          </button>
          <button className="btn" onClick={closeMeeting}>Done</button>
        </div>
      </div>
    );
  }

  const canSubmit = !!time && purpose.trim().length > 2 && state === "form";

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit || !time) return;
        setState("sending");
        window.setTimeout(() => {
          setSent(submitMeeting({ employeeId: employee.id, date, time, duration, format, purpose: purpose.trim(), shareContext }));
          setState("done");
        }, 800);
      }}
    >
      <div>
        <p className="label">Day</p>
        <div className="scroll-thin flex gap-2 overflow-x-auto pb-1">
          {days.map((d) => {
            const iso = toISODate(d);
            const active = iso === date;
            return (
              <button
                type="button"
                key={iso}
                onClick={() => { setDate(iso); setTime(null); }}
                className={`flex min-w-14 shrink-0 flex-col items-center rounded-[10px] border-2 border-ink px-2 py-1.5 ${
                  active ? "bg-ink text-white shadow-fur" : "bg-white hover:bg-belly"
                }`}
              >
                <span className="text-[0.7rem] font-semibold uppercase opacity-80">
                  {d.toLocaleDateString([], { weekday: "short" })}
                </span>
                <span className="text-lg leading-tight font-extrabold">{d.getDate()}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="label">
          Time <span className="font-normal text-muted">· {first}&apos;s free slots (your time)</span>
        </p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {slots.map((s) => (
            <button
              type="button"
              key={s.time}
              disabled={!s.free}
              onClick={() => setTime(s.time)}
              className={`rounded-lg border-[1.5px] px-2 py-1.5 text-sm font-semibold ${
                !s.free
                  ? "cursor-not-allowed border-ear text-ear line-through"
                  : time === s.time
                    ? "border-ink bg-blue text-white"
                    : "border-ink bg-white hover:bg-blue-soft"
              }`}
            >
              {formatTimeLabel(s.time)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="label">Length</p>
          <div className="flex gap-1.5">
            {DURATIONS.map((d) => (
              <button
                type="button"
                key={d}
                onClick={() => setDuration(d)}
                className={`flex-1 rounded-lg border-[1.5px] border-ink py-1.5 text-sm font-semibold ${
                  duration === d ? "bg-ink text-white" : "bg-white hover:bg-belly"
                }`}
              >
                {d}m
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="label">Format</p>
          <div className="flex gap-1.5">
            {(["video", "in-person"] as const).map((f) => (
              <button
                type="button"
                key={f}
                onClick={() => setFormat(f)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border-[1.5px] border-ink py-1.5 text-sm font-semibold ${
                  format === f ? "bg-ink text-white" : "bg-white hover:bg-belly"
                }`}
              >
                {f === "video" ? <Video size={14} /> : <Users size={14} />}
                {f === "video" ? "Video" : "In person"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="purpose">What do you want to discuss?</label>
        <textarea
          id="purpose"
          className="input min-h-20"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder={`e.g. Get ${first}'s take on the integration timeline`}
          required
        />
      </div>

      {context && (
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" className="mt-1 accent-blue" checked={shareContext} onChange={(e) => setShareContext(e.target.checked)} />
          <span>Share why Chilla recommended {first} so they come prepared</span>
        </label>
      )}

      <div className="flex items-center justify-end gap-2 border-t-2 border-dashed border-ear pt-4">
        <button type="button" className="btn btn-ghost" onClick={closeMeeting}>Cancel</button>
        <button className="btn btn-blue" disabled={!canSubmit}>
          {state === "sending" ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : "Send request"}
        </button>
      </div>
    </form>
  );
}
