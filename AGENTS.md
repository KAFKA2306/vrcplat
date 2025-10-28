# Repository Guidelines

## Project Structure & Module Organization
- `docs/` is the authoritative source for strategy, requirements, and discovery notes. Update existing drafts rather than scattering context.
- As code lands, create `services/` for backend APIs (each service keeps `src/`, `tests/`, `README.md`) and `apps/dashboard/` for the operational UI.
- Share domain contracts in `packages/shared/` so Presence, Purchase, and Avatar Diff models stay aligned.
- Store diagrams, mock flows, and anonymized payload samples in `docs/assets/` to ship alongside the narratives they support.

## Build, Test, and Development Commands
- Run `npx markdownlint-cli2 docs/**/*.md` and `npx cspell docs` before every commit to keep current artifacts tidy.
- Initialize the pnpm workspace (`pnpm install`) once a `package.json` appears. Expose scripts such as `pnpm lint` (eslint + prettier --check), `pnpm test -- --runInBand`, and `pnpm dev` for local API/UI loops.
- Surface service-specific bootstrap steps (env vars, seed data) in that service’s README to prevent drift.

## Coding Style & Naming Conventions
- Prefer TypeScript for backend services and React/Next.js for frontend apps. Enforce Prettier + ESLint (2-space indent, single quotes, trailing commas).
- Name files in kebab-case; reserve PascalCase for React components and domain classes. API handlers should mirror resource nouns (`presence-controller.ts`, `purchases-router.ts`).
- Keep Markdown headings in sentence case and wrap prose at 100 characters for review-friendly diffs.

## Testing Guidelines
- Target ≥80% statement coverage using Vitest for services, Testing Library for React, and Playwright for smoke flows.
- Mirror source paths in `tests/` (`src/presence/client.ts` → `tests/presence/client.test.ts`) and tag VRChat log fixtures with the consent scope they represent.
- Capture JSON schema snapshots under `tests/contracts/` and validate them against anonymized webhook payloads before merging integration work.

## Commit & Pull Request Guidelines
- Write imperative English subjects under 65 characters (`Add avatar diff schema`, `Guard consent toggles`). Split doc and code updates when feasible.
- Pull requests must link the relevant issue, outline scope, list verification commands, and include screenshots or API traces for changes affecting UI or external integrations.
- Secure approvals from product and engineering leads when modifying consent, payment, or telemetry surfaces.

## Privacy & Data Handling
- Never store live presence, purchase, or consent payloads in git. Use masked examples under `docs/examples/` with clear usage notes.
- Manage secrets via the central vault; `.env` files live outside the repository. Describe retention windows, opt-out flows, and export endpoints whenever instrumentation or logging expands.
