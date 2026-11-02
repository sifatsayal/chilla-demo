"use client";

import { RotateCcw } from "lucide-react";
import type { Settings } from "@/lib/types";
import { resetDemoData } from "@/lib/storage";
import { Toggle } from "@/components/ui/Toggle";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";

export default function SettingsPage() {
  const { settings, setSettings, showToast } = useWorkspace();
  const update = <K extends keyof Settings>(k: K, v: Settings[K]) => {
    setSettings({ ...settings, [k]: v });
    showToast("Settings saved");
  };

  return (
    <div className="scroll-thin min-h-0 flex-1 overflow-y-auto bg-paper/50 px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-2xl space-y-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Settings</h1>
          <p className="text-sm text-muted">Changes save automatically to this browser.</p>
        </div>

        <Section title="Profile & privacy">
          <Toggle label="Show me in Chilla recommendations" description="Let colleagues find you when they ask about your skills or projects." checked={settings.discoverable} onChange={(v) => update("discoverable", v)} />
          <Toggle label="Show availability status" description="Display green / busy / away dots on profiles and cards." checked={settings.showAvailability} onChange={(v) => update("showAvailability", v)} />
        </Section>

        <Section title="Recommendations">
          <div className="py-3">
            <p className="font-semibold">People per answer</p>
            <p className="text-sm text-muted">How many recommendations Chilla returns for each question.</p>
            <Segmented value={settings.resultCount} options={[{ v: 2, l: "Top 2" }, { v: 3, l: "Top 3" }]} onChange={(v) => update("resultCount", v as 2 | 3)} />
          </div>
        </Section>

        <Section title="Meetings">
          <div className="py-3">
            <p className="font-semibold">Default length</p>
            <Segmented value={settings.defaultDuration} options={[15, 30, 45, 60].map((v) => ({ v, l: `${v} min` }))} onChange={(v) => update("defaultDuration", v as number)} />
          </div>
          <div className="py-3">
            <p className="font-semibold">Default format</p>
            <Segmented value={settings.defaultFormat} options={[{ v: "video", l: "Video call" }, { v: "in-person", l: "In person" }]} onChange={(v) => update("defaultFormat", v as Settings["defaultFormat"])} />
          </div>
          <div className="grid gap-3 py-3 sm:grid-cols-2">
            <label>
              <span className="label">Working hours start</span>
              <input type="time" className="input" value={settings.workingHoursStart} onChange={(e) => update("workingHoursStart", e.target.value)} />
            </label>
            <label>
              <span className="label">Working hours end</span>
              <input type="time" className="input" value={settings.workingHoursEnd} onChange={(e) => update("workingHoursEnd", e.target.value)} />
            </label>
          </div>
        </Section>

        <Section title="Notifications">
          <Toggle label="DM me when someone responds" description="Chilla pings you in Slack when a meeting request is accepted." checked={settings.dmNotifications} onChange={(v) => update("dmNotifications", v)} />
          <Toggle label="Weekly digest" description="A Monday summary of who's working on what near your projects." checked={settings.weeklyDigest} onChange={(v) => update("weeklyDigest", v)} />
        </Section>

        <Section title="Demo">
          <div className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div>
              <p className="font-semibold">Reset demo data</p>
              <p className="text-sm text-muted">Clears chats, meetings, your profile edits and settings.</p>
            </div>
            <button className="btn btn-ghost" onClick={() => confirm("Reset all demo data?") && resetDemoData()}>
              <RotateCcw size={15} /> Reset
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card-flat px-4 py-2 sm:px-5">
      <h2 className="border-b-[1.5px] border-dashed border-ear pt-2 pb-2 font-extrabold">{title}</h2>
      <div className="divide-y divide-belly">{children}</div>
    </section>
  );
}

function Segmented<T extends string | number>({ value, options, onChange }: { value: T; options: { v: T; l: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="mt-2 inline-flex overflow-hidden rounded-[10px] border-2 border-ink">
      {options.map((o, i) => (
        <button
          key={String(o.v)}
          onClick={() => onChange(o.v)}
          aria-pressed={value === o.v}
          className={`px-3.5 py-1.5 text-sm font-semibold ${i ? "border-l-2 border-ink" : ""} ${value === o.v ? "bg-ink text-white" : "bg-white hover:bg-belly"}`}
        >
          {o.l}
        </button>
      ))}
    </div>
  );
}
