"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Hash, MessageSquareText, PenSquare, Plus } from "lucide-react";
import { getEmployee } from "@/data/employees";
import { channels, company, sidebarDMs } from "@/data/workspace";
import { Avatar } from "@/components/ui/Avatar";
import { ChillaAvatar } from "@/components/ui/Mascot";
import { useWorkspace } from "./WorkspaceProvider";

// Slack-style left sidebar. Channels and the Chilla app are routes;
// direct messages open that person's profile panel.

const CHILLA_ROUTES = ["/", "/directory", "/meetings", "/profile", "/settings", "/help"];

export function Sidebar() {
  const pathname = usePathname();
  const { openProfile, setSidebarOpen, showToast, profile } = useWorkspace();
  const close = () => setSidebarOpen(false);
  const chillaActive = CHILLA_ROUTES.includes(pathname);

  return (
    <nav className="scroll-thin flex h-full w-64 flex-col overflow-y-auto bg-ink text-ear" aria-label="Workspace">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <button
          className="flex items-center gap-1 text-lg font-extrabold tracking-tight text-white"
          onClick={() => showToast(`You're in the ${company.name} workspace`)}
        >
          {company.name} <ChevronDown size={16} />
        </button>
        <button
          className="grid h-8 w-8 place-items-center rounded-lg bg-white text-ink"
          aria-label="New message to Chilla"
          onClick={() => showToast("Tip: ask Chilla anything from the box at the bottom")}
        >
          <PenSquare size={15} />
        </button>
      </div>

      <div className="space-y-5 px-2 py-4 text-[0.95rem]">
        <Section title="Apps">
          <Link
            href="/"
            onClick={close}
            className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${
              chillaActive ? "bg-blue font-semibold text-white" : "hover:bg-white/10"
            }`}
          >
            <ChillaAvatar size={22} />
            Chilla
            <span className="ml-auto rounded bg-nose px-1.5 text-[0.6rem] font-bold text-ink">APP</span>
          </Link>
        </Section>

        <Section title="Channels">
          {channels.map((c) => {
            const active = pathname === `/c/${c.slug}`;
            return (
              <Link
                key={c.slug}
                href={`/c/${c.slug}`}
                onClick={close}
                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${
                  active ? "bg-blue font-semibold text-white" : "hover:bg-white/10"
                }`}
              >
                <Hash size={15} className="opacity-70" />
                {c.name}
              </Link>
            );
          })}
          <button
            onClick={() => showToast("Channels are read-only in this demo")}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left opacity-70 hover:bg-white/10"
          >
            <Plus size={15} /> Add channels
          </button>
        </Section>

        <Section title="Direct messages">
          {sidebarDMs.map((id) => {
            const e = getEmployee(id);
            if (!e) return null;
            return (
              <button
                key={id}
                onClick={() => {
                  openProfile(id);
                  close();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-white/10"
              >
                <Avatar name={e.name} size="sm" status={e.availability} />
                <span className="truncate">{e.name}</span>
              </button>
            );
          })}
          <Link
            href="/profile"
            onClick={close}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/10"
          >
            <Avatar name={profile.name} size="sm" status="available" />
            <span className="truncate">
              {profile.name} <span className="opacity-60">(you)</span>
            </span>
          </Link>
        </Section>
      </div>

      <div className="mt-auto border-t border-white/10 p-3">
        <div className="flex items-start gap-2 rounded-xl bg-white/5 p-3 text-xs">
          <MessageSquareText size={16} className="mt-0.5 shrink-0 text-nose" />
          <p>
            <span className="font-semibold text-white">Simulated Slack workspace.</span> Mention{" "}
            <code className="text-nose">@chilla</code> in any channel to try it there.
          </p>
        </div>
      </div>
    </nav>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 px-2 text-xs font-bold tracking-wide uppercase opacity-60">{title}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}
