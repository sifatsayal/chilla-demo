"use client";

import { useEffect, useRef } from "react";
import { useConversation, useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { Composer } from "./Composer";
import { Message, TypingIndicator } from "./Message";

// A scrollable conversation plus composer. Used for the Chilla DM and channels.
export function ChatView({
  convId,
  placeholder,
  prefix,
  intro,
}: {
  convId: string;
  placeholder: string;
  prefix?: string;
  intro?: React.ReactNode;
}) {
  const messages = useConversation(convId);
  const { typing } = useWorkspace();
  const endRef = useRef<HTMLDivElement>(null);
  const isTyping = !!typing[convId];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isTyping]);

  const askedSomething = messages.some((m) => m.author === "me");

  return (
    <>
      <div className="scroll-thin min-h-0 flex-1 overflow-y-auto py-4">
        {intro}
        <div className="my-2 flex items-center gap-3 px-5 text-xs font-semibold text-muted">
          <span className="h-px flex-1 bg-ear" /> Today <span className="h-px flex-1 bg-ear" />
        </div>
        {messages.map((m) => (
          <Message key={m.id} msg={m} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={endRef} />
      </div>
      <Composer convId={convId} placeholder={placeholder} prefix={prefix} showSuggestions={!askedSomething} />
    </>
  );
}
