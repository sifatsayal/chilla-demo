"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getEmployee } from "@/data/employees";
import { defaultProfile, defaultSettings, seededChannelMessages } from "@/data/workspace";
import {
  CHILLA_DM,
  chillaText,
  mentionsChilla,
  respond,
  uid,
  userText,
  welcomeMessages,
} from "@/lib/chilla";
import { updateStored, usePersistentState } from "@/lib/storage";
import type { ChatMessage, MeetingRequest, Settings, UserProfile } from "@/lib/types";

// Global workspace state: chat, the profile side panel, the meeting modal,
// toasts and persisted user data. Anything in the app can call useWorkspace().

const EMPTY: ChatMessage[] = [];
const NO_MEETINGS: MeetingRequest[] = [];

export const chatKey = (convId: string) => `chat:${convId}`;
export const chatFallback = (convId: string) =>
  convId === CHILLA_DM ? welcomeMessages : (seededChannelMessages[convId] ?? EMPTY);

interface MeetingTarget {
  employeeId: string;
  /** The topic Chilla recommended this person for, used to prefill the purpose. */
  context?: string;
}

interface WorkspaceCtx {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  settings: Settings;
  setSettings: (s: Settings) => void;
  meetings: MeetingRequest[];

  typing: Record<string, boolean>;
  sendMessage: (convId: string, text: string) => void;

  profilePanelId: string | null;
  openProfile: (id: string) => void;
  closeProfile: () => void;

  meetingTarget: MeetingTarget | null;
  openMeeting: (employeeId: string, context?: string) => void;
  closeMeeting: () => void;
  submitMeeting: (m: Omit<MeetingRequest, "id" | "createdAt" | "status">) => MeetingRequest;

  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;

  toast: string | null;
  showToast: (msg: string) => void;
}

const Ctx = createContext<WorkspaceCtx | null>(null);

export function useWorkspace() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWorkspace must be used inside <WorkspaceProvider>");
  return ctx;
}

const append = (convId: string, ...msgs: ChatMessage[]) =>
  updateStored(chatKey(convId), chatFallback(convId), (prev) => [...prev, ...msgs]);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = usePersistentState("profile", defaultProfile);
  const [settings, setSettings] = usePersistentState("settings", defaultSettings);
  const [meetings] = usePersistentState("meetings", NO_MEETINGS);

  const [typing, setTyping] = useState<Record<string, boolean>>({});
  const [profilePanelId, setProfilePanelId] = useState<string | null>(null);
  const [meetingTarget, setMeetingTarget] = useState<MeetingTarget | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((t) => (t === msg ? null : t)), 2600);
  }, []);

  const sendMessage = useCallback(
    (convId: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      append(convId, userText(trimmed));
      if (convId !== CHILLA_DM && !mentionsChilla(trimmed)) return;

      // Simulate Chilla "thinking" across the org graph before answering.
      setTyping((t) => ({ ...t, [convId]: true }));
      const replies = respond(trimmed, { settings });
      window.setTimeout(
        () => {
          append(convId, ...replies);
          setTyping((t) => ({ ...t, [convId]: false }));
        },
        900 + Math.random() * 600,
      );
    },
    [settings],
  );

  const submitMeeting = useCallback<WorkspaceCtx["submitMeeting"]>((m) => {
    const meeting: MeetingRequest = {
      ...m,
      id: uid(),
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    updateStored("meetings", NO_MEETINGS, (prev) => [meeting, ...prev]);
    append(CHILLA_DM, { id: uid(), kind: "meeting", author: "chilla", ts: meeting.createdAt, meetingId: meeting.id });

    // Simulate the colleague accepting a few seconds later.
    window.setTimeout(() => {
      updateStored("meetings", NO_MEETINGS, (prev) =>
        prev.map((x) => (x.id === meeting.id ? { ...x, status: "accepted" } : x)),
      );
      const person = getEmployee(m.employeeId);
      if (person) {
        const first = person.name.split(" ")[0];
        append(CHILLA_DM, chillaText(`🎉 **${first}** accepted your meeting request. It's on both of your calendars now.`));
      }
    }, 6000);
    return meeting;
  }, []);

  const value = useMemo<WorkspaceCtx>(
    () => ({
      profile,
      setProfile,
      settings,
      setSettings,
      meetings,
      typing,
      sendMessage,
      profilePanelId,
      openProfile: setProfilePanelId,
      closeProfile: () => setProfilePanelId(null),
      meetingTarget,
      openMeeting: (employeeId, context) => setMeetingTarget({ employeeId, context }),
      closeMeeting: () => setMeetingTarget(null),
      submitMeeting,
      sidebarOpen,
      setSidebarOpen,
      toast,
      showToast,
    }),
    [profile, setProfile, settings, setSettings, meetings, typing, sendMessage, profilePanelId, meetingTarget, submitMeeting, sidebarOpen, toast, showToast],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Messages for one conversation, persisted per conversation id. */
export function useConversation(convId: string) {
  const [messages] = usePersistentState(chatKey(convId), chatFallback(convId));
  return messages;
}
