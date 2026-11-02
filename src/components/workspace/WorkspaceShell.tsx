"use client";

import type { ReactNode } from "react";
import { Mascot } from "@/components/ui/Mascot";
import { MeetingModal } from "@/components/meeting/MeetingModal";
import { ProfilePanel } from "@/components/people/ProfilePanel";
import { Sidebar } from "./Sidebar";
import { Toast } from "./Toast";
import { TopBar } from "./TopBar";
import { useWorkspace } from "./WorkspaceProvider";

// The fake Slack window: a demo banner, the window frame, sidebar, main pane,
// and the global overlays (profile panel, meeting modal, toast).
export function WorkspaceShell({ children }: { children: ReactNode }) {
  const { sidebarOpen, setSidebarOpen } = useWorkspace();

  return (
    <div className="flex h-dvh flex-col md:p-4 md:pt-3">
      <div className="hidden items-center justify-between px-1 pb-3 md:flex">
        <div className="flex items-center gap-2 text-2xl font-black tracking-tighter">
          <Mascot className="h-9 w-9" /> chilla
          <span className="pill ml-1 bg-blue-soft text-blue">interactive demo</span>
        </div>
        <p className="hand -rotate-1 text-xl">a pretend Slack workspace, so poke around! ✦</p>
      </div>

      <div className="card relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border-0 shadow-none md:rounded-[14px] md:border-2 md:shadow-brutal">
        <TopBar />
        <div className="flex min-h-0 flex-1">
          <div className="hidden md:block">
            <Sidebar />
          </div>
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 flex md:hidden">
              <div className="animate-pop shadow-brutal">
                <Sidebar />
              </div>
              <button className="flex-1 bg-ink/40" aria-label="Close sidebar" onClick={() => setSidebarOpen(false)} />
            </div>
          )}
          <main className="flex min-w-0 flex-1 flex-col bg-white">{children}</main>
          <ProfilePanel />
        </div>
      </div>

      <MeetingModal />
      <Toast />
    </div>
  );
}
