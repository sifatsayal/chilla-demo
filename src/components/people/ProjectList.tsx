import type { Project } from "@/lib/types";

export function ProjectList({ projects }: { projects: Project[] }) {
  if (!projects.length) return <p className="text-sm text-muted">No projects listed yet.</p>;
  return (
    <ul className="space-y-3">
      {projects.map((p) => (
        <li key={p.name} className="card-flat border-[1.5px] p-3">
          <div className="flex flex-wrap items-center gap-2">
            <b className="text-[0.95rem]">{p.name}</b>
            <span className={`pill ${p.status === "current" ? "bg-mint" : "bg-belly"}`}>
              {p.status === "current" ? "Current" : p.period}
            </span>
          </div>
          <p className="mt-0.5 text-xs font-semibold text-muted">{p.role}</p>
          <p className="mt-1 text-sm">{p.summary}</p>
        </li>
      ))}
    </ul>
  );
}
