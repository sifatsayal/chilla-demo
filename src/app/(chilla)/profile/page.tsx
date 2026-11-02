"use client";

import { useMemo, useState } from "react";
import { Mail, MapPin, Pencil } from "lucide-react";
import { employees, getEmployee } from "@/data/employees";
import { recommend } from "@/lib/search/engine";
import { Avatar } from "@/components/ui/Avatar";
import { ProfileEditor } from "@/components/people/ProfileEditor";
import { ProjectList } from "@/components/people/ProjectList";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";

export default function MyProfilePage() {
  const { profile, setProfile, showToast, openProfile, settings } = useWorkspace();
  const [editing, setEditing] = useState(false);

  // Chilla suggests colleagues whose work overlaps with yours.
  const suggested = useMemo(() => {
    const text = [...profile.skills, ...profile.projects.flatMap((p) => [p.name, p.summary, ...p.tags])].join(" ");
    return recommend(text, employees, 3).results;
  }, [profile]);

  const filled = [profile.bio, profile.skills.length, profile.projects.length, profile.experience.length, profile.team].filter(Boolean).length;
  const strength = Math.round((filled / 5) * 100);

  return (
    <div className="scroll-thin min-h-0 flex-1 overflow-y-auto bg-paper/50 px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {editing ? (
          <>
            <h1 className="mb-4 text-2xl font-black tracking-tight">Edit your profile</h1>
            <ProfileEditor
              initial={profile}
              onCancel={() => setEditing(false)}
              onSave={(p) => {
                setProfile(p);
                setEditing(false);
                showToast("Profile saved ✓ Chilla will use it for recommendations");
              }}
            />
          </>
        ) : (
          <div className="space-y-5">
            <section className="card relative overflow-hidden p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <Avatar name={profile.name} size="xl" />
                <div className="flex-1">
                  <h1 className="text-2xl font-black tracking-tight">{profile.name}</h1>
                  <p className="font-medium">{profile.role}</p>
                  <p className="text-sm text-muted">{profile.department} · {profile.team}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {profile.location}</span>
                    <span className="flex items-center gap-1"><Mail size={14} /> {profile.email}</span>
                  </div>
                </div>
                <button className="btn btn-sm self-start" onClick={() => setEditing(true)}>
                  <Pencil size={14} /> Edit profile
                </button>
              </div>
              <div className="mt-5">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Profile strength</span><span>{strength}%</span>
                </div>
                <div className="mt-1 h-3 overflow-hidden rounded-full border-[1.5px] border-ink bg-belly">
                  <div className="h-full bg-nose" style={{ width: `${strength}%` }} />
                </div>
                <p className="mt-1 text-xs text-muted">
                  {settings.discoverable ? "Colleagues can find you through Chilla." : "Hidden from Chilla recommendations (see Settings)."} Richer profiles get better matches.
                </p>
              </div>
            </section>

            <Block title="About">
              <p>{profile.bio || <span className="text-muted">Add a short bio so people know what to ask you.</span>}</p>
            </Block>
            <Block title="Skills">
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.length ? profile.skills.map((s) => <span key={s} className="chip bg-yellow">{s}</span>) : <span className="text-sm text-muted">No skills yet.</span>}
              </div>
            </Block>
            <Block title="Projects">
              <ProjectList projects={profile.projects.filter((p) => p.name)} />
            </Block>
            <Block title="Experience">
              <ul className="space-y-1.5 text-sm">
                {profile.experience.filter((x) => x.title || x.company).map((x, i) => (
                  <li key={i}><b>{x.title}</b>{x.company && `, ${x.company}`} <span className="text-muted">· {x.period}</span></li>
                ))}
              </ul>
            </Block>

            {suggested.length > 0 && (
              <Block title="People Chilla thinks you should know">
                <ul className="grid gap-2 sm:grid-cols-3">
                  {suggested.map((r) => {
                    const e = getEmployee(r.employeeId)!;
                    return (
                      <li key={e.id}>
                        <button onClick={() => openProfile(e.id)} className="flex w-full items-center gap-2 rounded-xl border-[1.5px] border-ink bg-white p-2 text-left hover:bg-blue-soft">
                          <Avatar name={e.name} size="sm" />
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-bold">{e.name}</span>
                            <span className="block truncate text-xs text-muted">{e.team}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </Block>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card-flat p-4 sm:p-5">
      <h2 className="mb-2 text-xs font-bold tracking-wider text-muted uppercase">{title}</h2>
      {children}
    </section>
  );
}
