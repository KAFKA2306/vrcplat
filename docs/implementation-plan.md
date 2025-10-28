# Implementation plan

## Purpose and scope

- Capture the cross-functional plan to take the KAFKA platform from prototype to the three
  release slices defined in `docs/requirement_draft.md`.
- Map ownership across services, shared packages, and the dashboard UI so that sequencing,
  dependencies, and verification are explicit.
- Serve as the living backlog for engineering and product synch, updated as epics move.

## Guiding principles

- Ship in vertical slices that exercise consent, data handling, and UI contracts together.
- Keep shared contracts authoritative in `packages/shared`; app and service code import from there.
- Document customer-facing flows alongside thin technical specs under `docs/` to avoid drift.

## Release pacing

| Sprint | Theme | Primary capabilities |
| --- | --- | --- |
| S1 | Consent and presence | Identity + consent scopes, VRCX import, presence beacon, dashboard home shell |
| S2 | Purchases and avatar meta | Purchase ingestion, duplicate resolution, avatar diff metadata, loadout editor |
| S3 | Events and multichannel comms | Event links, multi-post composer, recommendations v1, semantic search |

## Epics and workstreams

### Identity and consent (S1)

- **Services/identity**
  - OAuth broker with Discord, Google, X providers.
  - DID issuance and user table bootstrap; session cookie with rotation.
  - Consent scope CRUD + audit logging APIs.
- **Packages/shared/auth**
  - Publish TypeScript clients for session + consent endpoints.
  - Provide Vitest contract snapshots for scopes.
- **Apps/dashboard**
  - Session guard (done), consent console UI, data export/delete flows.
  - Integrate presence beacon status and consent status in header widgets.
- **Verification**
  - Vitest service tests for scope gating, Playwright journey for sign in → consent toggle → export.
  - Security review for OAuth scope usage and audit trail.

### Presence ingestion (S1)

- **Services/presence**
  - REST endpoints: `POST /presence/ping`, `GET /presence/me`, `GET /presence/friends`.
  - VRCX importer job + dedupe rules; OSC token auth for companion clients.
- **Packages/shared/contracts**
  - Finalize presence session schema (done) and add friend consent types.
  - Generate JSON schema artifacts under `tests/contracts/`.
- **Apps/dashboard**
  - Presence panel showing now/recent/next with consent indicators.
  - Empty states and “connect companion” prompts.
- **Verification**
  - Backfill fixtures from anonymized payloads under `docs/assets/`.
  - Playwright flow for uploading VRCX JSON and viewing history cards.

### Purchases aggregation (S2)

- **Services/purchases**
  - Webhook receivers for BOOTH, Shopify, Gumroad, Patreon, fanbox.
  - Email ingestion worker stub with SES/Gmail connectors (scope TBD).
  - Duplicate reconciliation and currency normalization.
- **Packages/shared/contracts**
  - Enrich `PurchaseRecord` with duplicate markers and CVI/UEI hooks.
- **Apps/dashboard**
  - Purchases table with filters, receipt preview drawer, loadout linking control.
  - CVI/UEI summary widget using shared analytics endpoints.
- **Verification**
  - Contract tests against anonymized receipts; Vitest dedupe scenarios.
  - Playwright smoke for multi-store filtering.

### Avatar diff and loadouts (S2)

- **Services/avatar-diff**
  - API for versions, diffs, and credit automation.
  - Background job to validate license URLs and authorship metadata.
- **Apps/dashboard**
  - Avatar timeline view, diff inspector modal, loadout composer tying purchases + presence.
  - Credit card component shareable to posts.
- **Verification**
  - Snapshot diff metadata tests; VRChat consent fixture tagging per requirement.

### Events, posts, and recommendations (S3)

- **Services/events**
  - CRUD for event cards, invite link issuance, conversion analytics.
- **Services/posts**
  - Multi-post scheduler with provider fallbacks and retry log.
- **Services/search**
  - Hybrid semantic + keyword search indexes with consent-aware filters.
- **Apps/dashboard**
  - Event creation wizard, join-now CTA, multi-post composer with schedule queue.
  - Global search bar hitting recommendation service; highlights per data type.
- **Verification**
  - Contract snapshots for event payloads, Playwright smoke for scheduling.
  - Perf budget checks (LCP ≤ 2.5 s) via Lighthouse CI.

## Cross-cutting tasks

- **Observability**: Ship OpenTelemetry spans from each service, hook to shared logging stack.
- **Privacy**: Ensure data export/delete flows invalidate caches within 60 seconds.
- **Localization**: Introduce i18n scaffolding in dashboard (`ja`, `en`) before S2 UI work.
- **Accessibility**: Axe audits on major flows; keyboard trap checks in modals.
- **Docs**: Update `docs/new-user-guide.md` and add visual assets to `docs/assets/` as features land.

## Dependencies and sequencing

- Dashboard consent UI depends on identity service and consent API readiness.
- Presence panels require beacon tokens, friend consent sync, and history importer.
- Purchases UI waits on dedupe + currency normalization to avoid rework.
- Avatar loadouts depend on purchase linking and presence metadata to recommend destinations.
- Events/post surfaces rely on identity scopes (`event:write`, `post:write`) and search service embeddings.

## Tracking and hygiene

- Maintain sprint board derived from these epics; link PRs to plan sections in descriptions.
- Run `npx markdownlint-cli2 docs/**/*.md` and `npx cspell docs` before merging updates here.
- Review plan weekly with product/engineering leads; capture decisions inline with dated notes.
