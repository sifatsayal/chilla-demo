# Chilla: interactive demo

An interactive prototype of **Chilla**, the PM's sidekick that tells you who to ask. It runs inside a **simulated Slack workspace** and matches the branding of our landing page ([chilla-azure.vercel.app](https://chilla-azure.vercel.app/)).

Nothing is real. Slack, calendars and the AI are all simulated with mock data for a fictional company, **Fernway**. User edits are saved to `localStorage`.

## The demo flow

1. **Ask Chilla** in the Chilla DM (or `@chilla` in any channel): *"Who should I talk to about our payments integration?"*
2. **Get 2–3 ranked people**, each with reasons drawn from their projects and expertise.
3. **View a profile** in the Slack-style side panel.
4. **Request a meeting**: pick a day, a free slot, the length and a purpose. You'll see a confirmation, and the colleague "accepts" about 6 seconds later.
5. **Browse the Directory**, check **Meetings**, edit **My profile**, change **Settings** or read **Help**.

## Run it

```bash
npm install
npm run dev
# open http://localhost:3000/demo   (/ redirects to /demo)
```

`npm run build && npm start` runs a production build. `npm run lint` runs the linter.

Stack: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 and lucide-react icons. There is no backend.

## Project structure

```
src/
  app/                    Routes only (thin pages)
    layout.tsx            Fonts + WorkspaceProvider + Slack window shell
    (chilla)/             Chilla app tabs, sharing one header
      page.tsx            Messages (the Chilla DM)
      directory/ meetings/ profile/ settings/ help/
    c/[slug]/             Slack channels (#launch-q4, …)
  components/
    ui/                   Brand primitives: Avatar, Mascot, Modal, Toggle, RichText
    workspace/            Slack chrome: TopBar, Sidebar, ChillaHeader, WorkspaceProvider (global state)
    chat/                 ChatView, Message, RecommendationCard, Composer, MeetingNotice
    people/               ProfilePanel, EmployeeCard, ProfileEditor, ProjectList
    meeting/              MeetingModal (form + confirmation)
  data/                   ALL mock data. Edit here, not in components
    employees.ts          The 15 Fernway employees
    workspace.ts          Company, channels, seeded messages, prompts, default user/settings
  lib/
    search/engine.ts      Recommendation ranking + "why" explanations
    search/concepts.ts    Synonym groups (teach search new vocabulary here)
    chilla.ts             Bot replies (greetings, recommendations, no-match)
    storage.ts            usePersistentState: localStorage-backed state
    dates.ts              Date helpers + the fake calendar
    types.ts              Shared types
```

## Common changes

| I want to… | Edit |
| --- | --- |
| Add or change a person | `src/data/employees.ts` (search, the directory and profiles update automatically) |
| Make search understand a new term | Add it to a group in `src/lib/search/concepts.ts` |
| Tune ranking | `FIELD_WEIGHTS` and related constants in `src/lib/search/engine.ts` |
| Change what Chilla says | `src/lib/chilla.ts` |
| Change brand colors or fonts | The `@theme` block in `src/app/globals.css` (classes like `bg-ink` and `shadow-brutal` follow) |
| Restyle buttons, cards, pills | `@layer components` in `src/app/globals.css` (`.btn`, `.card`, `.pill`, `.chip`, `.input`) |
| Add a Chilla tab | Add it to `CHILLA_TABS` in `components/workspace/ChillaHeader.tsx`, then create `src/app/(chilla)/<tab>/page.tsx` |
| Add a channel | `channels` + `seededChannelMessages` in `src/data/workspace.ts` |
| Open a profile or meeting from anywhere | `const { openProfile, openMeeting } = useWorkspace()` |

**Clearing demo state:** use Settings → Reset demo data. Bump `PREFIX` in `src/lib/storage.ts` if you change a stored data shape.

## Putting it on the landing site at `/demo`

The landing page is a separate static site (its source isn't in this repo), so it stays untouched. This app is configured with `basePath: "/demo"` in `next.config.ts`, so every page and asset already lives under `/demo`.

**Option A (recommended): proxy from the landing site.** Deploy this repo as its own Vercel project (e.g. `chilla-demo.vercel.app`). Then add a rewrite to the **landing page's** `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/demo", "destination": "https://chilla-demo.vercel.app/demo" },
    { "source": "/demo/:path*", "destination": "https://chilla-demo.vercel.app/demo/:path*" }
  ]
}
```

`chilla-azure.vercel.app/demo` then serves the prototype, and the two sites deploy independently.

**Option B: move the landing page into this repo.** Put the landing page's `index.html`, `styles.css`, `script.js` and `favicon.svg` into `public/`, remove `basePath` and the redirect, and move the routes under `src/app/demo/`. This is more work and couples the two sites, so only do it if the team wants one repo.

## Working together on GitHub

- `main` is protected by convention. **Never push to it directly.**
- Create a branch per change: `git checkout -b feature/<short-name>` (or `fix/…`, `style/…`).
- Open a pull request. The template asks for a short description and screenshots.
- Get at least one teammate's review, make sure `npm run lint` and `npm run build` pass, then merge.
- On GitHub, turn on *Settings → Branches → Branch protection* for `main` (require a PR + 1 approval) to enforce this.
- Connect the repo to Vercel to get a preview URL on every PR.
