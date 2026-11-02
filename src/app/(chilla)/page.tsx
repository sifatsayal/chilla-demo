import { ChatView } from "@/components/chat/ChatView";
import { CHILLA_DM } from "@/lib/chilla";

export default function MessagesPage() {
  return <ChatView convId={CHILLA_DM} placeholder="Ask Chilla who to talk to…" />;
}
