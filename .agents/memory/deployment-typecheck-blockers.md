---
name: Deployment typecheck blockers in this workspace
description: Root-cause patterns for why `pnpm run build`/deploy fails even when the app runs fine in dev, specific to this Fredora/TemperaMap monorepo.
---

- If deploy fails at "Installing packages" with `package.json: open package.json: no such file or directory`, check whether the root `package.json` and/or root `tsconfig.json` were accidentally deleted by a prior merge commit — restore from an earlier commit rather than reconstructing by hand.
- `tsc --build` for the libs (`typecheck:libs`) silently can't run at all if the root `tsconfig.json` is missing — this MASKS real type errors in `lib/*` packages. Once restored, re-run typecheck fully; do not assume libs are clean just because dev workflows work.
- Running `pnpm run build` directly from a bash shell (not via a workflow) can fail with "PORT environment variable is required" for Vite artifacts even when the app is otherwise fine — this is expected, since PORT/BASE_PATH are injected by the workflow, not by deployment's build step context. Trust `pnpm run typecheck` (not `build`) as the pre-deploy signal from bash; the deploy pipeline supplies its own env vars.
**Why:** Confirmed twice in one session — both false signals initially looked like real blockers but were either masked errors (missing tsconfig) or environment differences (missing PORT in ad hoc bash).
