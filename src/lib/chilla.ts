import { employees } from "@/data/employees";
import type { ChatMessage, Settings } from "@/lib/types";
import { recommend } from "@/lib/search/engine";

// Chilla's "brain": turns a user message into bot replies.
// Pure functions only. Timing, typing indicators and storage live in WorkspaceProvider.

export const CHILLA_DM = "chilla";

export const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();

export function chillaText(text: string): ChatMessage {
  return { id: uid(), kind: "text", author: "chilla", ts: now(), text };
}

export function userText(text: string): ChatMessage {
  return { id: uid(), kind: "text", author: "me", ts: now(), text };
}

export const welcomeMessages: ChatMessage[] = [
  {
    id: "welcome-1",
    kind: "text",
    author: "chilla",
    ts: "2026-11-01T16:00:00.000Z",
    text: "Hi Jess 👋 I'm **Chilla**. Ask me who to talk to about a project, a decision or a problem, and I'll find the people who actually know, plus the reason I picked each one.",
  },
  {
    id: "welcome-2",
    kind: "text",
    author: "chilla",
    ts: "2026-11-01T16:00:01.000Z",
    text: "Try something like **\"Who should I talk to about our payments integration?\"** You can also mention `@chilla` in any channel.",
  },
];

/** Does this message in a channel address Chilla? (DMs always do.) */
export const mentionsChilla = (text: string) => /@chilla\b/i.test(text);

export function respond(
  text: string,
  opts: { settings: Settings; excludeIds?: string[] },
): ChatMessage[] {
  const clean = text.replace(/@chilla\b/gi, "").trim();
  const lower = clean.toLowerCase();

  if (!clean || /^(hi|hey|hello|yo|howdy|good (morning|afternoon))\b[!. ]*$/.test(lower)) {
    return [chillaText("Hey! 👋 What are you working on? Tell me the project or problem and I'll find who to ask.")];
  }
  if (/^(thanks|thank you|thx|ty|cheers|perfect|great|awesome)\b/.test(lower)) {
    return [chillaText("Anytime! Ping me whenever you're stuck on **who owns what**. 🫶")];
  }
  if (/^(help|what can you do|\?)/.test(lower)) {
    return [
      chillaText(
        "I search Fernway by what people **actually work on**: their projects, skills and expertise, not just their job titles. Ask me a question in plain English, e.g. **\"Who knows the SSO migration?\"** or **\"I need legal sign-off on data retention\"**. From each result you can open a profile or request a meeting.",
      ),
    ];
  }

  const pool = employees.filter((e) => !opts.excludeIds?.includes(e.id));
  const { topic, results } = recommend(clean, pool, opts.settings.resultCount);

  if (!results.length) {
    return [
      chillaText(
        `Hmm, I couldn't find anyone who clearly works on **${topic}** 🤔 Try naming a project, skill or team (like "checkout", "SSO" or "pricing"), or browse the **Directory** tab.`,
      ),
    ];
  }

  return [
    {
      id: uid(),
      kind: "recommendations",
      author: "chilla",
      ts: now(),
      query: clean,
      topic,
      results,
    },
  ];
}
