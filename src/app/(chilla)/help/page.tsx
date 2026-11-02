import Link from "next/link";
import { Mascot } from "@/components/ui/Mascot";

const STEPS = [
  { n: "1", title: "Ask in plain English", body: "DM Chilla or mention @chilla in a channel: “Who should I talk to about our payments integration?”" },
  { n: "2", title: "Get ranked people + reasons", body: "Chilla returns the 2–3 best matches and explains each pick using their actual projects and skills." },
  { n: "3", title: "Reach out in one click", body: "Open a full profile, copy a ready-made intro DM, or request a meeting at a time that works for both of you." },
];

const SIGNALS = [
  ["Project work", "Tags and descriptions of current and past projects. This is the strongest signal, and current projects count extra."],
  ["Expertise", "Topics teammates go to that person for (e.g. “SSO”, “Pricing”)."],
  ["Skills", "Tools and techniques like Stripe API, Figma, dbt or GDPR."],
  ["Role & team", "Job title, team and department, useful for “who's the designer on…” questions."],
  ["Bio", "A light signal for anything else people mention about themselves."],
];

const FAQ = [
  ["Why did Chilla pick this person?", "Every recommendation lists the specific projects or expertise that matched your question, plus the words it matched on. The match % shows how strong that is compared with the other people listed."],
  ["Chilla understood my question wrong. What now?", "Use the words your team uses: name the project, system or decision (e.g. “retry-worker”, “EU pricing”). Chilla also understands related terms, so “billing” finds people who work on Stripe and checkout."],
  ["Does Chilla read my private messages?", "No. In the real product Chilla only uses profiles and the channels it's added to, following your workspace permissions. In this demo everything is mock data stored in your browser."],
  ["How do I show up in results?", "Keep My profile up to date with your skills and projects. You can opt out under Settings → “Show me in Chilla recommendations”."],
  ["Is anything real here?", "No. This is an interactive prototype. Slack, calendars and AI are all simulated, and your edits are saved to localStorage only."],
];

export default function HelpPage() {
  return (
    <div className="scroll-thin min-h-0 flex-1 overflow-y-auto bg-paper/50 px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6 pb-6">
        <section className="card relative flex flex-col gap-4 overflow-hidden bg-belly p-6 sm:flex-row sm:items-center">
          <Mascot className="h-24 w-24 shrink-0" />
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              How Chilla <span className="hl">finds</span> people
            </h1>
            <p className="mt-1 text-muted">Chilla searches by what people actually work on, not what their title says.</p>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.n} className={`card-flat p-4 shadow-brutal-sm ${i === 1 ? "sm:rotate-1" : i === 2 ? "sm:-rotate-1" : ""}`}>
              <span className="font-hand text-3xl font-bold text-nose">{s.n}</span>
              <h2 className="font-extrabold">{s.title}</h2>
              <p className="mt-1 text-sm text-muted">{s.body}</p>
            </div>
          ))}
        </div>

        <section className="card-flat p-5">
          <h2 className="text-lg font-extrabold">How recommendations are ranked</h2>
          <p className="mt-1 text-sm text-muted">
            Chilla pulls out the key topics in your question and expands them with related terms (“payments” also covers billing, Stripe, checkout…).
            It then scores everyone on these signals, strongest first:
          </p>
          <ol className="mt-3 space-y-2">
            {SIGNALS.map(([t, d], i) => (
              <li key={t} className="flex gap-3 text-sm">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border-[1.5px] border-ink bg-blue-soft text-xs font-bold">{i + 1}</span>
                <span><b>{t}:</b> {d}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-sm text-muted">
            People who match <b>more</b> of your question rank above people who match one word many times.
          </p>
        </section>

        <section className="card-flat p-5">
          <h2 className="text-lg font-extrabold">Tips for great results</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            <li>Name the project or system: “Who owns the billing retry logic?”</li>
            <li>Say what you need: “I need legal sign-off on data retention for exports.”</li>
            <li>Ask about decisions: “Who decided the EU pricing change?”</li>
            <li>Use the Directory to browse by team, skill or project.</li>
          </ul>
          <Link href="/" className="btn btn-sm mt-4">Try it in Messages →</Link>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-extrabold">FAQ</h2>
          <div className="space-y-2">
            {FAQ.map(([q, a]) => (
              <details key={q} className="card-flat group p-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between font-bold">
                  {q} <span className="text-xl transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-sm text-muted">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="hand text-center text-xl">questions about the prototype? ping the team 🫶</p>
      </div>
    </div>
  );
}
