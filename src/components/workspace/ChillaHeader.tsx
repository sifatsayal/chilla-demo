"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChillaAvatar } from "@/components/ui/Mascot";

// Header for the Chilla app, with Slack-style app tabs.
// Add a tab here, then create the matching route in src/app/(chilla)/.
export const CHILLA_TABS = [
  { href: "/", label: "Messages" },
  { href: "/directory", label: "Directory" },
  { href: "/meetings", label: "Meetings" },
  { href: "/profile", label: "My profile" },
  { href: "/settings", label: "Settings" },
  { href: "/help", label: "Help" },
];

export function ChillaHeader() {
  const pathname = usePathname();
  return (
    <div className="shrink-0 border-b-2 border-ink bg-white">
      <div className="flex items-center gap-3 px-4 pt-3 pb-2 sm:px-5">
        <ChillaAvatar size={34} />
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-lg leading-tight font-extrabold tracking-tight">
            Chilla <span className="rounded bg-ear px-1.5 text-[0.6rem] font-bold">APP</span>
          </p>
          <p className="truncate text-xs text-muted">Find the person who knows.</p>
        </div>
      </div>
      <div className="scroll-thin flex gap-1 overflow-x-auto px-3 sm:px-4" role="tablist">
        {CHILLA_TABS.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              role="tab"
              aria-selected={active}
              className={`-mb-[2px] shrink-0 border-b-[3px] px-3 py-2 text-sm font-semibold ${
                active ? "border-nose text-ink" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
