"use client";

import { Hash, Users } from "lucide-react";
import type { Channel } from "@/data/workspace";
import { ChatView } from "./ChatView";

export function ChannelView({ channel }: { channel: Channel }) {
  return (
    <>
      <div className="flex shrink-0 items-center gap-3 border-b-2 border-ink px-4 py-3 sm:px-5">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 text-lg font-extrabold">
            <Hash size={18} /> {channel.name}
          </p>
          <p className="truncate text-xs text-muted">{channel.topic}</p>
        </div>
        <span className="chip"><Users size={13} /> {channel.members}</span>
      </div>
      <ChatView
        key={channel.slug}
        convId={channel.slug}
        prefix="@chilla "
        placeholder={`Message #${channel.name} (mention @chilla to ask)`}
        intro={
          <div className="mx-4 mb-2 rounded-xl border-2 border-dashed border-ear bg-paper px-4 py-3 text-sm sm:mx-5">
            <span className="hand mr-1 text-xl">psst</span> Start a message with <code className="rounded bg-blue-soft px-1">@chilla</code> and it
            will answer right here in the channel. Other messages just post normally.
          </div>
        }
      />
    </>
  );
}
