"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, X } from "lucide-react";
import { departments, employees } from "@/data/employees";
import { CHILLA_DM } from "@/lib/chilla";
import { EmployeeCard } from "@/components/people/EmployeeCard";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";

const uniq = (xs: string[]) => [...new Set(xs)].sort((a, b) => a.localeCompare(b));
const TEAMS = uniq(employees.map((e) => e.team));
const SKILLS = uniq(employees.flatMap((e) => [...e.skills, ...e.expertise]));
const PROJECTS = uniq(employees.flatMap((e) => e.projects.map((p) => p.name)));

export default function DirectoryPage() {
  const router = useRouter();
  const { sendMessage } = useWorkspace();
  const [q, setQ] = useState("");
  const [dept, setDept] = useState<string>("All");
  const [team, setTeam] = useState("");
  const [skill, setSkill] = useState("");
  const [project, setProject] = useState("");

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return employees.filter((e) => {
      if (dept !== "All" && e.department !== dept) return false;
      if (team && e.team !== team) return false;
      if (skill && ![...e.skills, ...e.expertise].includes(skill)) return false;
      if (project && !e.projects.some((p) => p.name === project)) return false;
      if (!needle) return true;
      const hay = [e.name, e.role, e.team, e.department, ...e.skills, ...e.expertise, ...e.projects.map((p) => p.name)]
        .join(" ")
        .toLowerCase();
      return needle.split(/\s+/).every((w) => hay.includes(w));
    });
  }, [q, dept, team, skill, project]);

  const filtersOn = dept !== "All" || team || skill || project || q;
  const clear = () => { setQ(""); setDept("All"); setTeam(""); setSkill(""); setProject(""); };
  const askChilla = () => { sendMessage(CHILLA_DM, q); router.push("/"); };

  return (
    <div className="scroll-thin min-h-0 flex-1 overflow-y-auto bg-paper/50 px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Directory</h1>
            <p className="text-sm text-muted">{employees.length} people at Fernway. Filter by team, skill or project.</p>
          </div>
          <p className="hand -rotate-2 text-lg">not sure who? ask Chilla ↗</p>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
            <input className="input pl-9" placeholder="Search names, roles, skills, projects…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search directory" />
          </div>
          {q.trim().split(/\s+/).length > 2 && (
            <button className="btn btn-blue" onClick={askChilla}>
              <Sparkles size={15} /> Ask Chilla instead
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Department">
          {["All", ...departments].map((d) => (
            <button
              key={d}
              onClick={() => setDept(d)}
              className={`chip ${dept === d ? "bg-ink text-white" : "bg-white hover:bg-belly"}`}
              aria-pressed={dept === d}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <Select label="Team" value={team} onChange={setTeam} options={TEAMS} />
          <Select label="Skill or expertise" value={skill} onChange={setSkill} options={SKILLS} />
          <Select label="Project" value={project} onChange={setProject} options={PROJECTS} />
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="font-semibold">{results.length} {results.length === 1 ? "person" : "people"}</p>
          {filtersOn && (
            <button className="flex items-center gap-1 font-semibold text-blue hover:underline" onClick={clear}>
              <X size={14} /> Clear filters
            </button>
          )}
        </div>

        {results.length ? (
          <div className="mt-3 grid gap-4 pb-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((e) => (
              <EmployeeCard key={e.id} employee={e} />
            ))}
          </div>
        ) : (
          <div className="card-flat mt-3 border-dashed p-8 text-center">
            <p className="font-bold">Nobody matches those filters.</p>
            <p className="text-sm text-muted">Try clearing a filter, or describe what you need to Chilla.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select className="input py-2 text-sm" value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
      <option value="">{`Any ${label.toLowerCase()}`}</option>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}
