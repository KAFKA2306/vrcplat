# KAFKA metaverse platform

Monorepo scaffold for the presence, purchases, and avatar ecosystems described in `docs/`.

## Workspace layout

- `services/` — backend Fastify services (identity, presence, purchases) plus backlog placeholders.
- `apps/` — operational UI (`dashboard`) built on Next.js App Router.
- `packages/` — shared contracts and auth helpers distributed via pnpm workspace links.
- `docs/` — strategy, requirements, and discovery notes (authoritative source).
- `tools/` — shared scripts, docker compose, infra configs.

## Getting started

```sh
pnpm install
pnpm dev
```

Linting and tests are delegated to workspace packages; see service/app READMEs for more detail.
