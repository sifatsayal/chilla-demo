# Contributing

1. `git pull origin main`, then `git checkout -b feature/<short-name>`
2. Make your change (see "Common changes" in the README for where things live)
3. `npm run lint && npm run build`
4. Push your branch and open a PR. Ask a teammate to review.
5. Squash-merge once approved. Don't push to `main` directly.

Conventions:
- Pages in `src/app/` stay thin. Put UI in `src/components/<area>/`.
- Mock content goes in `src/data/`. Logic goes in `src/lib/`.
- Use the brand tokens and classes (`bg-ink`, `card`, `btn`, `pill`, `chip`) instead of new hex colors.
- Client state that should survive a reload uses `usePersistentState` from `src/lib/storage.ts`.
