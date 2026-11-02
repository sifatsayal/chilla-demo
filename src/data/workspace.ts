import type { ChatMessage, Settings, UserProfile } from "@/lib/types";

// Workspace-level mock content: company, channels, seeded messages, prompts
// and the defaults used before anything is saved to localStorage.

export const company = {
  name: "Fernway",
  domain: "fernway.com",
  landingUrl: "https://chilla-azure.vercel.app/",
};

export const suggestedPrompts = [
  "Who should I talk to about our payments integration?",
  "Who knows the SSO migration?",
  "Who decided the EU pricing change?",
  "I need legal sign-off on data retention for exports",
  "Who can help me run user interviews with finance admins?",
  "Who's running load tests before the Q4 launch?",
];

export interface Channel {
  slug: string;
  name: string;
  topic: string;
  members: number;
}

export const channels: Channel[] = [
  { slug: "launch-q4", name: "launch-q4", topic: "Q4 Checkout & Payouts launch · Nov 12", members: 24 },
  { slug: "payments-squad", name: "payments-squad", topic: "Payments Platform day-to-day", members: 11 },
  { slug: "general", name: "general", topic: "Company-wide announcements", members: 312 },
];

/** Messages shown the first time a channel is opened. Authors are employee ids. */
export const seededChannelMessages: Record<string, ChatMessage[]> = {
  "launch-q4": [
    {
      id: "seed-l1",
      kind: "text",
      author: "chloe-dubois",
      ts: "2026-11-01T17:12:00.000Z",
      text: "Launch tiering doc is final 🎉 We're Tier 1 for **Nov 12**. Please flag any blockers here.",
    },
    {
      id: "seed-l2",
      kind: "text",
      author: "dev-patel",
      ts: "2026-11-01T17:40:00.000Z",
      text: "Load test for checkout at 5× peak is running Thursday. Will post results here.",
    },
    {
      id: "seed-l3",
      kind: "text",
      author: "maya-chen",
      ts: "2026-11-01T18:05:00.000Z",
      text: "Reminder: anything touching data exports needs a consent banner. Not sure who signs off on the wording though 🤔",
    },
  ],
  "payments-squad": [
    {
      id: "seed-p1",
      kind: "text",
      author: "priya-raman",
      ts: "2026-11-01T16:30:00.000Z",
      text: "Adyen failover is live in staging. `retry-worker` changes ship tomorrow.",
    },
    {
      id: "seed-p2",
      kind: "text",
      author: "kenji-watanabe",
      ts: "2026-11-01T16:52:00.000Z",
      text: "Fraud scoring latency is p99 42ms after the feature store change 🚀",
    },
  ],
  general: [
    {
      id: "seed-g1",
      kind: "text",
      author: "tom-becker",
      ts: "2026-10-31T23:00:00.000Z",
      text: "October Voice of Customer report is out. Top driver this month is failed payment notifications.",
    },
    {
      id: "seed-g2",
      kind: "text",
      author: "omar-haddad",
      ts: "2026-11-01T15:45:00.000Z",
      text: "Happy Monday all ☕ New onboarding emails go live this week.",
    },
  ],
};

/** People pinned under "Direct messages" in the sidebar. */
export const sidebarDMs = ["priya-raman", "maya-chen", "isabel-torres", "grace-liu"];

export const defaultProfile: UserProfile = {
  name: "Jess Lin",
  role: "Product Manager",
  department: "Product",
  team: "Spend Management",
  location: "San Francisco, CA",
  email: "jess.lin@fernway.com",
  bio: "PM for corporate cards and spend controls. Before Fernway I was a consultant, so I really like a good spreadsheet.",
  skills: ["Product discovery", "Roadmapping", "SQL", "User interviews"],
  projects: [
    {
      name: "Card spend controls",
      status: "current",
      period: "2026",
      role: "PM",
      summary: "Merchant-category limits and real-time approvals for corporate cards.",
      tags: ["cards", "spend", "approvals"],
    },
    {
      name: "Expense policy engine",
      status: "past",
      period: "2025",
      role: "Associate PM",
      summary: "Rules engine for automatic expense policy checks.",
      tags: ["expenses", "policy", "automation"],
    },
  ],
  experience: [
    { title: "Associate PM", company: "Fernway", period: "2024–2025" },
    { title: "Consultant", company: "Bain & Company", period: "2021–2024" },
  ],
};

export const defaultSettings: Settings = {
  discoverable: true,
  showAvailability: true,
  defaultDuration: 30,
  defaultFormat: "video",
  workingHoursStart: "09:00",
  workingHoursEnd: "17:00",
  resultCount: 3,
  dmNotifications: true,
  weeklyDigest: false,
};
