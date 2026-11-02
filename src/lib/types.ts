// Shared domain types. Mock data in src/data/ and all UI components use these.

export type Department =
  | "Product"
  | "Engineering"
  | "Design"
  | "Marketing"
  | "Operations";

export type ProjectStatus = "current" | "past";

export interface Project {
  name: string;
  status: ProjectStatus;
  period: string;
  role: string;
  summary: string;
  tags: string[];
}

export interface Experience {
  title: string;
  company: string;
  period: string;
}

export interface Employee {
  id: string;
  name: string;
  pronouns?: string;
  role: string;
  department: Department;
  team: string;
  location: string;
  timezone: string;
  email: string;
  slack: string;
  tenure: string;
  bio: string;
  skills: string[];
  expertise: string[];
  projects: Project[];
  experience: Experience[];
  /** One line describing what kinds of questions to bring this person. */
  bestFor: string;
  availability: "available" | "busy" | "away";
}

export interface UserProfile {
  name: string;
  role: string;
  department: Department;
  team: string;
  location: string;
  email: string;
  bio: string;
  skills: string[];
  projects: Project[];
  experience: Experience[];
}

export interface MeetingRequest {
  id: string;
  employeeId: string;
  date: string; // yyyy-mm-dd
  time: string; // "10:30"
  duration: number;
  format: "video" | "in-person";
  purpose: string;
  shareContext: boolean;
  createdAt: string;
  status: "pending" | "accepted";
}

export interface Settings {
  discoverable: boolean;
  showAvailability: boolean;
  defaultDuration: number;
  defaultFormat: "video" | "in-person";
  workingHoursStart: string;
  workingHoursEnd: string;
  resultCount: 2 | 3;
  dmNotifications: boolean;
  weeklyDigest: boolean;
}

// ---------- chat ----------

export interface Recommendation {
  employeeId: string;
  relevance: number; // 0–100
  reasons: string[];
  matchedTerms: string[];
}

export type ChatMessage =
  | {
      id: string;
      kind: "text";
      author: string; // "me" | "chilla" | employee id
      ts: string;
      text: string;
    }
  | {
      id: string;
      kind: "recommendations";
      author: "chilla";
      ts: string;
      query: string;
      topic: string;
      results: Recommendation[];
    }
  | {
      id: string;
      kind: "meeting";
      author: "chilla";
      ts: string;
      meetingId: string;
    };
