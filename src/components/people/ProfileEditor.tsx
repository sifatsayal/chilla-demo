"use client";

import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { departments } from "@/data/employees";
import type { Department, Project, UserProfile } from "@/lib/types";

// Edit form for "My profile". Works on a draft copy; parent decides on save.
export function ProfileEditor({
  initial,
  onSave,
  onCancel,
}: {
  initial: UserProfile;
  onSave: (p: UserProfile) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<UserProfile>(initial);
  const [skillInput, setSkillInput] = useState("");
  const set = <K extends keyof UserProfile>(k: K, v: UserProfile[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !draft.skills.includes(s)) set("skills", [...draft.skills, s]);
    setSkillInput("");
  };
  const updateProject = (i: number, patch: Partial<Project>) =>
    set("projects", draft.projects.map((p, j) => (j === i ? { ...p, ...patch } : p)));
  const updateExp = (i: number, patch: Partial<UserProfile["experience"][number]>) =>
    set("experience", draft.experience.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ ...draft, name: draft.name.trim() || initial.name });
      }}
    >
      <Card title="Basics">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name"><input className="input" value={draft.name} onChange={(e) => set("name", e.target.value)} required /></Field>
          <Field label="Role"><input className="input" value={draft.role} onChange={(e) => set("role", e.target.value)} /></Field>
          <Field label="Department">
            <select className="input" value={draft.department} onChange={(e) => set("department", e.target.value as Department)}>
              {departments.map((d) => <option key={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="Team"><input className="input" value={draft.team} onChange={(e) => set("team", e.target.value)} /></Field>
          <Field label="Location"><input className="input" value={draft.location} onChange={(e) => set("location", e.target.value)} /></Field>
          <Field label="Email"><input className="input" type="email" value={draft.email} onChange={(e) => set("email", e.target.value)} /></Field>
        </div>
        <Field label="Bio">
          <textarea className="input mt-0 min-h-24" value={draft.bio} onChange={(e) => set("bio", e.target.value)} />
        </Field>
      </Card>

      <Card title="Skills">
        <div className="flex flex-wrap gap-1.5">
          {draft.skills.map((s) => (
            <span key={s} className="chip bg-yellow">
              {s}
              <button type="button" aria-label={`Remove ${s}`} onClick={() => set("skills", draft.skills.filter((x) => x !== s))}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            className="input"
            placeholder="Add a skill and press Enter"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
          />
          <button type="button" className="btn btn-ghost" onClick={addSkill}><Plus size={15} /> Add</button>
        </div>
      </Card>

      <Card title="Projects">
        <div className="space-y-3">
          {draft.projects.map((p, i) => (
            <div key={i} className="rounded-xl border-[1.5px] border-dashed border-fur p-3">
              <div className="grid gap-2 sm:grid-cols-[1fr_140px_120px_auto]">
                <input className="input" placeholder="Project name" value={p.name} onChange={(e) => updateProject(i, { name: e.target.value })} />
                <input className="input" placeholder="Your role" value={p.role} onChange={(e) => updateProject(i, { role: e.target.value })} />
                <select className="input" value={p.status} onChange={(e) => updateProject(i, { status: e.target.value as Project["status"] })}>
                  <option value="current">Current</option>
                  <option value="past">Past</option>
                </select>
                <button type="button" className="btn btn-ghost px-3" aria-label="Remove project" onClick={() => set("projects", draft.projects.filter((_, j) => j !== i))}>
                  <Trash2 size={15} />
                </button>
              </div>
              <input className="input mt-2" placeholder="One-line summary" value={p.summary} onChange={(e) => updateProject(i, { summary: e.target.value })} />
            </div>
          ))}
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-sm mt-3"
          onClick={() => set("projects", [...draft.projects, { name: "", role: "", status: "current", period: String(new Date().getFullYear()), summary: "", tags: [] }])}
        >
          <Plus size={14} /> Add project
        </button>
      </Card>

      <Card title="Experience">
        <div className="space-y-2">
          {draft.experience.map((x, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_140px_auto]">
              <input className="input" placeholder="Title" value={x.title} onChange={(e) => updateExp(i, { title: e.target.value })} />
              <input className="input" placeholder="Company" value={x.company} onChange={(e) => updateExp(i, { company: e.target.value })} />
              <input className="input" placeholder="2021–2024" value={x.period} onChange={(e) => updateExp(i, { period: e.target.value })} />
              <button type="button" className="btn btn-ghost px-3" aria-label="Remove role" onClick={() => set("experience", draft.experience.filter((_, j) => j !== i))}>
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="btn btn-ghost btn-sm mt-3" onClick={() => set("experience", [...draft.experience, { title: "", company: "", period: "" }])}>
          <Plus size={14} /> Add role
        </button>
      </Card>

      <div className="sticky bottom-0 -mx-1 flex justify-end gap-2 border-t-2 border-ink bg-white/95 px-1 py-3 backdrop-blur">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="btn btn-blue">Save profile</button>
      </div>
    </form>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card-flat p-4 sm:p-5">
      <h2 className="mb-3 font-extrabold">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}
