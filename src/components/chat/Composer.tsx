"use client";

import { SendHorizontal } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { suggestedPrompts } from "@/data/workspace";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";

// Message box. Enter sends, Shift+Enter adds a new line.
export function Composer({
  convId,
  placeholder,
  showSuggestions,
  prefix = "",
}: {
  convId: string;
  placeholder: string;
  showSuggestions?: boolean;
  /** Text auto-prepended to suggestion chips (e.g. "@chilla " in channels). */
  prefix?: string;
}) {
  const { sendMessage, typing } = useWorkspace();
  const [text, setText] = useState("");
  const busy = !!typing[convId];

  const send = (value = text) => {
    if (!value.trim() || busy) return;
    sendMessage(convId, value);
    setText("");
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="shrink-0 px-4 pt-2 pb-4 sm:px-5">
      {showSuggestions && (
        <div className="scroll-thin mb-2 flex gap-2 overflow-x-auto pb-1">
          {suggestedPrompts.map((p) => (
            <button key={p} className="chip shrink-0 bg-white hover:bg-blue-soft" onClick={() => send(prefix + p)} disabled={busy}>
              {p}
            </button>
          ))}
        </div>
      )}
      <div className="card-flat flex items-end gap-2 p-2 shadow-brutal-sm focus-within:outline-3 focus-within:outline-blue">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKey}
          rows={1}
          placeholder={placeholder}
          aria-label={placeholder}
          className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 focus:outline-none"
        />
        <button className="btn btn-blue h-10 w-10 p-0" onClick={() => send()} disabled={!text.trim() || busy} aria-label="Send">
          <SendHorizontal size={17} />
        </button>
      </div>
      <p className="mt-1.5 hidden text-xs text-muted sm:block">
        <b>Enter</b> to send · <b>Shift + Enter</b> for a new line
      </p>
    </div>
  );
}
