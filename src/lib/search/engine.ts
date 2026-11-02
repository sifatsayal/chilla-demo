import type { Employee, Project, Recommendation } from "@/lib/types";
import { concepts, stopwords } from "./concepts";

// A small, deterministic stand-in for Chilla's AI ranking.
// 1. Parse the query into keywords and expand them with concept groups.
// 2. Score every employee on weighted fields (project tags count most).
// 3. Turn the strongest evidence into human-readable reasons.

const FIELD_WEIGHTS = {
  projectTags: 4,
  projectText: 2.5,
  expertise: 3.5,
  skills: 3,
  roleTeam: 2,
  bio: 1,
};
const CURRENT_PROJECT_BOOST = 1.25;
const SYNONYM_WEIGHT = 0.55;

interface Term {
  text: string;
  weight: number;
  concept?: string;
}

export interface ParsedQuery {
  keywords: string[];
  concepts: string[];
  terms: Term[];
}

const normalize = (s: string) =>
  s.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9/&\- ]+/g, " ");

// Whole-word match that tolerates simple suffixes ("test" ~ "tests" / "testing").
function hasWord(haystack: string, needle: string) {
  return new RegExp(`(^|[^a-z0-9])${escape(needle)}(s|es|ed|ing)?([^a-z0-9]|$)`).test(haystack);
}
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
const singular = (t: string) => (t.length > 3 && t.endsWith("s") && !t.endsWith("ss") ? t.slice(0, -1) : t);

/** Words that appear everywhere, so they count for less on their own. */
const GENERIC = new Set(["data", "change", "model", "new", "run", "running", "process", "plan", "decided", "decision", "q4", "project", "issue", "problem", "admins", "admin"]);

function conceptFor(token: string) {
  return concepts.find(([, ...words]) => words.some((w) => w === token || w === singular(token)));
}

export function parseQuery(query: string): ParsedQuery {
  const tokens = normalize(query)
    .split(/\s+/)
    .filter((t) => t.length > 1 && !stopwords.has(t));

  const terms = new Map<string, Term>();
  const matchedConcepts: string[] = [];
  const addTerm = (t: Term) => {
    const prev = terms.get(t.text);
    if (!prev || prev.weight < t.weight) terms.set(t.text, t);
  };
  const expand = ([label, ...words]: string[]) => {
    if (!matchedConcepts.includes(label)) matchedConcepts.push(label);
    for (const w of words) addTerm({ text: w, weight: SYNONYM_WEIGHT, concept: label });
  };

  for (let i = 0; i < tokens.length; i++) {
    // Prefer two-word phrases like "data retention" or "load test" over their parts.
    const bigram = tokens[i + 1] ? `${tokens[i]} ${singular(tokens[i + 1])}` : "";
    const phrase = bigram && conceptFor(bigram);
    if (phrase) {
      expand(phrase);
      addTerm({ text: bigram, weight: 1.5, concept: phrase[0] });
      addTerm({ text: singular(tokens[i]), weight: 0.5 });
      addTerm({ text: singular(tokens[i + 1]), weight: 0.5 });
      i++;
      continue;
    }
    const token = singular(tokens[i]);
    const concept = conceptFor(tokens[i]);
    if (concept && !GENERIC.has(token)) expand(concept);
    addTerm({ text: token, weight: GENERIC.has(token) ? 0.4 : 1, concept: concept?.[0] });
  }

  return { keywords: tokens, concepts: matchedConcepts, terms: [...terms.values()] };
}

interface Evidence {
  project?: Project;
  projectScore: number;
  skills: Set<string>;
  expertise: Set<string>;
  matched: Set<string>;
}

function scoreEmployee(e: Employee, q: ParsedQuery) {
  let score = 0;
  const conceptHits = new Set<string>();
  const ev: Evidence = { projectScore: 0, skills: new Set(), expertise: new Set(), matched: new Set() };
  const projectScores = new Map<Project, number>();

  const roleTeam = normalize(`${e.role} ${e.team} ${e.department}`);
  const bio = normalize(e.bio);

  for (const term of q.terms) {
    let best = 0;
    const bump = (v: number) => {
      if (v > best) best = v;
    };

    for (const p of e.projects) {
      const boost = p.status === "current" ? CURRENT_PROJECT_BOOST : 1;
      let pv = 0;
      if (p.tags.some((t) => hasWord(normalize(t), term.text))) pv = FIELD_WEIGHTS.projectTags * boost;
      else if (hasWord(normalize(`${p.name} ${p.summary}`), term.text)) pv = FIELD_WEIGHTS.projectText * boost;
      if (pv) {
        projectScores.set(p, (projectScores.get(p) ?? 0) + pv * term.weight);
        bump(pv);
      }
    }
    for (const x of e.expertise) {
      if (hasWord(normalize(x), term.text)) {
        ev.expertise.add(x);
        bump(FIELD_WEIGHTS.expertise);
      }
    }
    for (const s of e.skills) {
      if (hasWord(normalize(s), term.text)) {
        ev.skills.add(s);
        bump(FIELD_WEIGHTS.skills);
      }
    }
    if (hasWord(roleTeam, term.text)) bump(FIELD_WEIGHTS.roleTeam);
    if (hasWord(bio, term.text)) bump(FIELD_WEIGHTS.bio);

    if (best > 0) {
      score += best * term.weight;
      if (term.weight >= 1) ev.matched.add(term.text);
      if (term.concept) conceptHits.add(term.concept);
    }
  }

  // Reward people who cover more of what was asked, not just one word many times.
  const asked = Math.max(1, q.concepts.length || q.keywords.length);
  const covered = q.concepts.length ? conceptHits.size : ev.matched.size;
  const coverage = Math.min(1, covered / asked);
  score *= 0.6 + 0.4 * coverage;

  const ranked = [...projectScores.entries()].sort((a, b) => b[1] - a[1]);
  return { score, coverage, ev, projects: ranked.map(([p]) => p) };
}

function buildReasons(e: Employee, projects: Project[], ev: Evidence): string[] {
  const reasons: string[] = [];
  for (const p of projects.slice(0, 2)) {
    reasons.push(
      p.status === "current"
        ? `Currently **${roleCase(p.role)}** on **${p.name}**: ${lowerFirst(p.summary)}`
        : `Was **${roleCase(p.role)}** on **${p.name}** (${p.period}): ${lowerFirst(p.summary)}`,
    );
  }
  const skills = [...ev.skills].slice(0, 3);
  const expertise = [...ev.expertise].filter((x) => !skills.includes(x)).slice(0, 2);
  if (expertise.length) reasons.push(`Teammates go to them for ${listify(expertise)}`);
  else if (skills.length) reasons.push(`Hands-on experience with ${listify(skills)}`);
  if (reasons.length < 2) reasons.push(`Best for ${e.bestFor}`);
  return reasons.slice(0, 3);
}

// Lowercase a role for mid-sentence use, keeping acronyms like PM or GTM.
const roleCase = (role: string) =>
  role.split(" ").map((w) => (/^[A-Z]{2,}/.test(w) ? w : w.toLowerCase())).join(" ");
const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const listify = (xs: string[]) =>
  xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`;

export interface SearchResult {
  topic: string;
  parsed: ParsedQuery;
  results: Recommendation[];
}

export function recommend(query: string, people: Employee[], limit = 3): SearchResult {
  const parsed = parseQuery(query);
  const scored = people
    .map((e) => ({ e, ...scoreEmployee(e, parsed) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  const top = scored[0]?.score ?? 0;
  // Keep strong matches; always show at least 2 if a second person matched at all.
  const kept = scored.filter((r, i) => i < 2 || r.score >= top * 0.25).slice(0, limit);

  // The best match scores 80–98% depending on how much of the question it covers;
  // a weak overall match (few signals) is marked down so it doesn't look certain.
  const ceiling = (80 + 18 * (scored[0]?.coverage ?? 0)) * (top < 6 ? 0.8 : 1);
  const results: Recommendation[] = kept.map((r) => ({
    employeeId: r.e.id,
    relevance: Math.round(Math.max(40, (r.score / top) * ceiling)),
    reasons: buildReasons(r.e, r.projects, r.ev),
    matchedTerms: [...r.ev.matched].slice(0, 5),
  }));

  const topic = parsed.keywords.slice(0, 4).join(" ") || query;
  return { topic, parsed, results };
}
