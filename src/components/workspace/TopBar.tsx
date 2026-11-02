"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowRight, HelpCircle, Menu, Search } from "lucide-react";
import Link from "next/link";
import { company } from "@/data/workspace";
import { CHILLA_DM } from "@/lib/chilla";
import { Avatar } from "@/components/ui/Avatar";
import { useWorkspace } from "./WorkspaceProvider";

// Top bar of the fake Slack window. The search box sends the query to Chilla.
export function TopBar() {
  const router = useRouter();
  const { sendMessage, setSidebarOpen, profile } = useWorkspace();
  const [q, setQ] = useState("");

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b-2 border-ink bg-ink-2 px-3 text-ear">
      <button className="rounded-lg p-1.5 hover:bg-white/10 md:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
        <Menu size={18} />
      </button>
      <div className="hidden items-center gap-1 md:flex">
        <button className="rounded-lg p-1.5 hover:bg-white/10" onClick={() => router.back()} aria-label="Back">
          <ArrowLeft size={16} />
        </button>
        <button className="rounded-lg p-1.5 hover:bg-white/10" onClick={() => router.forward()} aria-label="Forward">
          <ArrowRight size={16} />
        </button>
      </div>
      <form
        className="mx-auto flex w-full max-w-xl items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-sm focus-within:bg-white focus-within:text-ink"
        onSubmit={(e) => {
          e.preventDefault();
          if (!q.trim()) return;
          sendMessage(CHILLA_DM, q);
          setQ("");
          router.push("/");
        }}
      >
        <Search size={15} className="shrink-0 opacity-70" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Ask Chilla who knows… (searches ${company.name})`}
          className="w-full bg-transparent placeholder:text-ear/70 focus:outline-none"
          aria-label="Ask Chilla"
        />
      </form>
      <Link href="/help" className="rounded-lg p-1.5 hover:bg-white/10" aria-label="Help">
        <HelpCircle size={18} />
      </Link>
      <Link href="/profile" aria-label="My profile">
        <Avatar name={profile.name} size="sm" />
      </Link>
    </header>
  );
}
