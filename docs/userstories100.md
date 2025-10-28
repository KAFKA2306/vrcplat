# User stories backlog

## Identity and account linking
1. As a new VRChat creator, I want to link Discord via `POST /auth/link` so that my profile seeds
   the consent template before I ever reach the dashboard.
2. As a multilingual user, I want to submit my `ja-JP` locale in the link request so that the
   `IdentityStore` returns a session with localized copy.
3. As an operator, I want duplicate link attempts to resolve to the existing user so that the
   external account index in `IdentityStore` prevents double billing profiles.
4. As a handle curator, I want the sanitize step to strip emoji and enforce `^[a-z0-9_-]+$` so that
   every dashboard URL slug renders cleanly.
5. As a creator, I want to pass an optional display name in the link payload so that my consent
   emails use my stage name instead of the generated handle.
6. As a support agent, I want invalid providers to fail Zod validation so that misconfigured mobile
   sign-up attempts surface actionable errors.
7. As a platform engineer, I want Fastify logging enabled on identity boot so that our Grafana
   dashboard reflects health checks in real time.
8. As a privacy lead, I want default scopes to initialize to `false` so that no feature ever activates
   without explicit user confirmation.
9. As a reliability analyst, I want the `/health` route to respond with `status: ok` so that uptime
   probes can page us before customer impact.
10. As a security reviewer, I want authorization codes to require at least six characters so that we
    reject scraped or truncated callbacks.

## Consent control and transparency
11. As a dashboard visitor, I want the `ConsentPanel` to render my current toggles so that I can see
    which scopes are in effect at a glance.
12. As a consent owner, I want the UI to optimistically show checkbox updates so that I feel the
    toggle applied instantly even before the PATCH response arrives.
13. As a product marketer, I want scope labels to explain `presence:friends` in Japanese so that
    users understand mutual consent before sharing location.
14. As a QA tester, I want unsupported scope keys to emit custom Zod issues so that we detect schema
    drift whenever shared contracts change.
15. As a privacy officer, I want scope updates to write an `updatedAt` timestamp so that audit logs
    anchor the exact consent version.
16. As a backend engineer, I want PATCH `/privacy/consent` to require the `x-user-id` header so that
    we never update the wrong profile.
17. As a friend manager, I want to disable `presence:friends` while keeping `presence:self` on so
    that my personal timeline stays intact without exposing friend locations.
18. As a compliance reviewer, I want the consent API to return full state after updates so that the
    dashboard cache stays consistent with the server truth.
19. As an accessibility advocate, I want consent toggles to expose `aria-checked` via native inputs
    so that screen readers confirm each scope change.
20. As a localization lead, I want scope descriptions centralized in code so that future locales reuse
    the same consent metadata bundle.

## Data portability and deletion
21. As a data subject, I want `POST /data/export` to queue a job with my preferred format so that I
    can download CSVs for bookkeeping.
22. As a compliance lead, I want export jobs to respond 202 with a `job.id` so that we track the SLA
    from request to readiness.
23. As a privacy engineer, I want deletion jobs to accept an optional reason so that we can surface
    trend analysis for churn triggers.
24. As an operations manager, I want export jobs in `IdentityStore` to support multiple outstanding
    requests so that staged pulls for legal and user copies do not clash.
25. As a support rep, I want delete jobs to default to `queued` status so that our ops dashboard knows
    the workflow has not begun processing yet.
26. As a retention analyst, I want export job payloads to include `downloadUrl` only when ready so
    that we avoid broken links in customer notifications.
27. As a user, I want deletion requests to immediately return a job handle so that I can confirm the
    queue without waiting for backend completion.
28. As a data engineer, I want export formats restricted to `json` or `csv` so that downstream import
    tooling stays simple.
29. As a privacy reviewer, I want failed deletion requests to surface 404 when the user is missing so
    that we keep the pipeline honest about stale sessions.
30. As a compliance auditor, I want export jobs to retain `requestedAt` ISO timestamps so that we can
    certify request handling times.

## Session resilience and guardrails
31. As a signed-in user, I want the dashboard `SessionGuard` to show skeleton loaders so that the
    page feels alive while my identity cookie resolves.
32. As a security admin, I want unauthenticated sessions to see the login redirect button so that we
    never leak dashboard content to anonymous visitors.
33. As a QA engineer, I want `SessionGuard` errors to expose retry buttons so that intermittent API
    hiccups are recoverable without a hard refresh.
34. As a mobile user, I want the fallback mock session to include Japanese localization so that I can
    review UI copy offline during design sprints.
35. As a monitoring lead, I want session fetches to set `cache: no-store` so that stale credentials
    never linger in intermediary caches.
36. As a privacy tester, I want `useSession` to surface null when the API returns 204 so that we do
    not misinterpret signed-out states as server errors.
37. As a developer advocate, I want session config to expose the login URL so that third-party demos
    can reuse the same `SessionGuard` component.
38. As an accessibility reviewer, I want the sign-in card to include semantic headings so that screen
    readers announce the auth requirement clearly.
39. As a product designer, I want the session query to refetch on window focus so that returning users
    see fresh consent data after toggling scopes in another tab.
40. As a localization tester, I want the fallback avatar URL to render retro identicons so that empty
    profiles still feel personalized.

## Presence ingestion foundations
41. As a presence contributor, I want `presenceSessionSchema` to reject left timestamps before entry
    so that import jobs do not generate negative durations.
42. As a Companion developer, I want sessions to accept `source: beacon` so that hardware beacons
    and manual imports coexist in the same feed.
43. As a privacy lead, I want visibility defaults set to `private` so that no session leaks before the
    user shares it.
44. As a dashboard viewer, I want `PresencePanel` to split active and recent sessions so that I can
    triage instant meetups separately from past visits.
45. As a VRChat organizer, I want active rows to show world and instance IDs so that I can craft join
    URLs without guessing channels.
46. As a regional user, I want times formatted using `Intl.DateTimeFormat('ja-JP')` so that the
    dashboard respects my locale clock.
47. As a capacity planner, I want the active list capped at six entries so that the layout never
    overflows on mobile.
48. As a retention analyst, I want recent sessions limited to the last ten so that the card remains
    scannable during event days.
49. As an import tester, I want presence queries to fetch with credentials so that protected sessions
    remain scoped to my account.
50. As a monitoring engineer, I want presence polling to refresh every fifteen seconds so that beacon
    updates feel real time without spamming the API.

## Presence-driven collaboration
51. As a meetup host, I want mutual consent enforcement for friend visibility so that only opt-in
    pairs surface in the active list.
52. As a traveler, I want Companion pings to backfill `world_id` strings from the contract so that the
    dashboard renders human-readable breadcrumbs.
53. As a squad leader, I want the dashboard to show `PresenceLamp` badges when friends load into the
    same world so that we converge faster.
54. As an onboarding coach, I want empty states that suggest linking Companion so that newcomers know
    why their presence panel is blank.
55. As a privacy advocate, I want toggle tooltips reminding users that real-world coordinates are not
    stored so that trust stays high.
56. As a power user, I want presence histories to pipe into recommendation signals so that Loadout AI
    can prioritize familiar venues.
57. As a scheduler, I want to download anonymized presence logs from `docs/assets/` so that I can run
    retention workshops without breaching consent.
58. As a moderator, I want to correlate presence with report timestamps so that we triage incidents
    faster.
59. As a product researcher, I want to tag VRCX imports with consent scopes so that imported history
    respects privacy toggles on arrival.
60. As an accessibility coach, I want presence item hover states to amplify contrast so that low-vision
    users distinguish active sessions.

## Purchases, loadouts, and value signals
61. As a merch collector, I want `PurchaseRecord` to store store icons so that the dashboard shows the
    source of each item at a glance.
62. As a finance admin, I want amounts validated against ISO 4217 currency codes so that reports stay
    compliant.
63. As a creator, I want to link purchases to avatar versions so that Loadout recommendations surface
    outfits I already own.
64. As a QA engineer, I want webhook ingestion to dedupe on `receiptRef` so that cross-channel orders
    do not double count revenue.
65. As a stylist, I want purchase metadata to accept four media URLs so that lookbooks embed preview
    shots inside the dashboard.
66. As a supporter, I want `purchases:self` consent to gate the list so that I can hide sensitive
    backing history when needed.
67. As a mobility user, I want purchase filters to respond within 100 ms so that I can slice catalog
    decisions live on stream.
68. As a product strategist, I want CVI and UEI fields to join purchase data so that growth reports
    tie spend to impact.
69. As a loadout curator, I want saved presets to remember matching world candidates so that I can
    launch events with one click.
70. As an avatar designer, I want email importers to normalize manual receipts so that off-platform
    commissions still enrich my dashboard timeline.

## Avatar diff intelligence
71. As an avatar maintainer, I want `avatar:diff` consent opt-ins to enable version timelines so that
    collaborators can follow each upgrade.
72. As a credit manager, I want the diff API to auto-fill license URLs so that attribution remains
    accurate even under refactors.
73. As a QA tester, I want diff payloads to enumerate `mesh_added` and `physbone_edit` so that we can
    run targeted regression tests after updates.
74. As a marketplace vetter, I want private avatars to hide diff metadata so that unreleased designs
    stay confidential.
75. As an asset auditor, I want diff records timestamped on creation so that license disputes resolve
    with precise chronology.
76. As a collaboration lead, I want avatar version cards to expose change notes so that teammates know
    whether to reimport the model.
77. As a localization editor, I want diff labels to reuse shared contract enums so that the dashboard
    toolkit remains consistent across services.
78. As a storyteller, I want avatar diff timelines to crosslink purchase entries so that fans can see
    which accessories inspired each change.
79. As a compliance reviewer, I want diff scopes to default off so that only explicit creators share
    mod details.
80. As a data scientist, I want diff payloads available via export bundles so that long-term trend
    analysis can surface balancing insights.

## Events, posts, and discovery
81. As an event host, I want `event:write` consent toggles to gate link creation so that unauthorized
    dashboards cannot spam invites.
82. As a scheduling assistant, I want `POST /events` to capture `start_at` and tags so that conversion
    tracking can spotlight high-performing slots.
83. As a marketing lead, I want pinned notices to respect `profile:pin` scope so that creators retain
    control over their hero messaging.
84. As a social media manager, I want `post:write` scopes to route to the multi-post scheduler so that
    cross-network launches stay synchronized.
85. As an attendee, I want event cards to launch VRChat with world parameters so that I skip manual
    copy-paste flows.
86. As a discovery fan, I want `GET /search` to blend semantic and keyword results so that I find
    content even when I forget the exact title.
87. As a data analyst, I want `SmartFeed` modules to suppress entries when consent toggles go off so
    that recommendations stay privacy-aligned.
88. As a moderator, I want report submissions to auto-hide offending posts so that harmful content
    disappears within ten seconds.
89. As a localization tester, I want pinned notice editor tooltips translated so that Japanese hosts
    can trust the scheduling UX.
90. As a retention strategist, I want loadout recommendations to consider purchase history so that our
    AI suggests outfits fans already love.

## Operations, trust, and differentiation
91. As an SRE, I want every service to expose OpenTelemetry hooks so that cross-service traces unify
    during incident response.
92. As a compliance officer, I want audit logs hashed per entry so that tampering attempts surface
    instantly in reviews.
93. As a privacy advocate, I want explicit documentation of retention periods so that consent screens
    link to the right policy paragraphs.
94. As a localization manager, I want ja/en bundles loaded by `apps/dashboard` providers so that
    switching languages never reloads the app shell.
95. As an accessibility tester, I want keyboard focus outlines on dashboard pills so that quick
    actions comply with WCAG 2.1 AA.
96. As a support specialist, I want docs to ship anonymized payload samples so that troubleshooting
    never touches live data.
97. As a performance engineer, I want dashboard panels lazy-loaded so that LCP stays under 2.5 seconds
    on mid-tier headsets.
98. As a security architect, I want rate limits applied to `/auth/link` so that botnets cannot brute
    force OAuth code exchanges.
99. As a growth PM, I want KPI dashboards to track `合流率` so that we can quantify meetup success and
    iterate on recommendations.
100. As an ethical lead, I want opt-out flows to invalidate cached data within sixty seconds so that
     users trust their revocations are immediate.
