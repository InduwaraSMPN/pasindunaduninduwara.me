# Outline, Building an incremental entity provider for Backstage catalog ingestion

**Recommended title:** Building an incremental entity provider for Backstage catalog ingestion

**Alternative titles:**
1. Incremental ingestion and cursor pagination for an OpenChoreo Backstage plugin
2. From full-dataset polling to mark-and-sweep, rewriting Backstage catalog ingestion for OpenChoreo

**Voice and style notes for writer:**
- First person ("I"), honest intern voice. Audience is platform/backend engineers comfortable with Kubernetes, Backstage, Go, TypeScript.
- Sentence-case headings only. Straight quotes only. No emojis. No em-dashes (use commas, hyphens, colons, or split sentences).
- Banned vocabulary: transformative, pivotal, landscape (figurative), testament, vibrant, journey, dive into, unlock, tapestry, intricate, crucial, leverage (verb), seamless, robust, unprecedented.
- Hard cap: 3 code excerpts total (1 TypeScript ≤25 lines, 1 Go ≤25 lines, 1 config/CLI ≤15 lines), exactly 1 Mermaid diagram (in section 5).
- Both PRs are shipped and under review, not merged. State this explicitly once in §5 or §7.
- Brand mentions: at most 1 (author bio context).
- Every H2 opens with a 40-60 word answer-first paragraph containing a stat with named source.
- 60-70% of H2s phrased as questions.

**Word budget total:** 2,400 words (within 2,000–3,000 band)

---

## Section 1 — Hook (~150 w)

- Open with the DORA 2025 stat: 90% of organizations report using at least one IDP in 2025 (Google Cloud / DORA 2025). Optional second stat: 28% have a dedicated platform engineering team (CNCF + SlashData Q1 2026).
- Pivot in two sentences from "everyone has an IDP now" to "but the default Backstage ingestion pattern doesn't survive a large catalog".
- Name the specific problem I hit during my WSO2 internship on the OpenChoreo / Backstage developer-experience team: full-dataset poll on every refresh, memory bursts, orphaned entities sitting around after deletes upstream.
- Tease the two PRs that came out of it: a vendored incremental entity provider (PR #140) and a cursor-paginated list API on the OpenChoreo backend (PR #1257). Both shipped to PR, under review, not merged.
- One-sentence reading promise: what the post covers (architecture, code, the pagination follow-on, what I'd redo).

**Cite:**
- https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report (DORA 2025, 90% IDP adoption)
- https://www.cncf.io/announcements/2026/03/24/cncf-and-slashdata-report-finds-platform-engineering-tools-maturing-as-organizations-prepare-for-ai-driven-infrastructure/ (28% platform engineering teams)

[INTERNAL-LINK: WSO2 internship overview, link to author bio / about page]

---

## Section 2 — The problem: full-dataset polling and orphaned entities (~220 w)

- Answer-first opening with the CNCF 2025 stat: Kubernetes production use hit 82% in 2025 (CNCF Annual Survey, published 2026-01-20). Frame: most catalog sources behind Backstage are now Kubernetes-shaped, and they grow.
- Describe the original `OpenChoreoEntityProvider` behavior: every refresh ticks, the provider calls the upstream API, builds the full entity set in memory, and emits a `full` mutation. Reference `OpenChoreoEntityProvider.ts` lines 214–222.
- Symptoms I observed: memory bursts on the catalog backend during refresh, slow cold start on large orgs, and (the actual bug that surfaced in September 2025) entities deleted upstream stayed visible in the catalog because the next `full` mutation just hadn't run yet, or had partial-failure recovery semantics that left stragglers.
- Why the orphan problem is the worst of the three: memory and latency are observable, orphans are silent and erode trust in the catalog.
- One-line setup for §3: the default Backstage entity provider pattern wasn't broken in general, it was broken for our scale and our delete semantics.

**Cite:**
- `backstage-plugins/plugins/catalog-backend-module-openchoreo/src/provider/OpenChoreoEntityProvider.ts` lines 214–222 (full-dataset poll site)
- https://www.cncf.io/announcements/2026/01/20/kubernetes-established-as-the-de-facto-operating-system-for-ai-as-production-use-hits-82-in-2025-cncf-annual-cloud-native-survey/

[ORIGINAL DATA marker: I observed the orphan-entity bug in production deployment, September 2025.]

---

## Section 3 — Why did the default Backstage pattern break at our scale? (~200 w)

- Answer-first paragraph with stat: backstage/backstage carries 33.3k GitHub stars and Backstage is a CNCF Incubating project since 15 March 2022 (CNCF project page). The default `EntityProvider.applyMutation({ type: 'full', entities })` is fine for small, slow-moving sources.
- Three specific reasons it broke for OpenChoreo:
  - Cost of "full": one mutation diffs the entire previous set against the new set; cost grows linearly with catalog size.
  - No partial progress: if the producer call fails halfway, the next tick starts over, no checkpoint.
  - Delete semantics depend on the producer returning an authoritative complete list. Any upstream pagination or transient error breaks delete detection. That's how we got orphans.
- Link the failure mode back to the upstream API shape: at the time, the OpenChoreo list API had no pagination at all, so any client that wanted a complete list paid full cost every refresh.
- Transition to §4: the fix is two-sided. Make ingestion incremental on the consumer (Backstage). Then make the producer (OpenChoreo) navigable so incremental actually pays off.

**Cite:**
- https://www.cncf.io/projects/backstage/ (CNCF status, 8 Sep 2020 accepted, Incubating 15 Mar 2022)
- https://github.com/backstage/backstage (33.3k stars)

[INTERNAL-LINK: Backstage entity provider concepts, link to a future deep-dive post on Backstage catalog model]

---

## Section 4 — Designing the incremental entity provider (~280 w)

- Answer-first paragraph: the design is not mine. It's the upstream Backstage incremental-ingestion module pattern, which I vendored as a deliberate local fork into a new plugin package, `catalog-backend-module-openchoreo-incremental`. State this up front so credit is clear. Cite Backstage incremental-ingestion docs.
- Mark-and-sweep generation identity, in plain terms:
  - Each ingestion run gets a generation id (the `ingestion`).
  - As bursts complete, every entity seen this generation is recorded as a "mark" against that ingestion id (the `ingestion_marks` and `ingestion_mark_entities` tables).
  - When the producer signals "done" (no more pages), the engine sweeps: any entity in the previous generation that has no mark in the new generation is deleted.
  - This isolates "what we saw this run" from "what's in the catalog right now", which is exactly the property the old full-dataset path lacked.
- Why this is NOT the Kubernetes garbage-collector model: there are no ownerReferences, no finalizers, no foreground/background propagation. The lifecycle is per-ingestion-generation, not per-owner-graph. The K8s GC analogy gets reached for a lot here and it's wrong; flag this explicitly so readers don't carry the wrong mental model into §5.
- The three custom tables introduced by `migrations/20221116073152_init.js`:
  - `ingestions`, the generation record.
  - `ingestion_marks`, the per-burst mark batch.
  - `ingestion_mark_entities`, the actual marked entity refs.
- Why I vendored instead of consumed upstream: at the time, the upstream module didn't expose the hooks I needed for OpenChoreo-shaped errors and burst sizing, and a local fork let me iterate without an upstream RFC.

**Cite:**
- Backstage incremental-ingestion docs (https://backstage.io/docs/features/software-catalog/external-integrations/#provider-cycle)
- `backstage-plugins/plugins/catalog-backend-module-openchoreo-incremental/migrations/20221116073152_init.js`

[UNIQUE INSIGHT marker: explicit "do not use the K8s GC analogy here, it's the wrong mental model" callout.]

---

## Section 5 — Implementation walkthrough (~380 w, includes code + diagram)

- Answer-first paragraph with a deployment fact: PR #140 is shipped and under review, not merged. State the work status here as required.
- Walk through `OpenChoreoIncrementalEntityProvider` (class lines 66–166): the `next` method shape, how it returns `{ done, entities, cursor }`, how the engine drives it. Explain that `done: false` means "more pages", `done: true` means "sweep now".
- Walk through the engine side at `OpenChoreoIncrementalIngestionEngine.ts` lines 286–477: how it persists marks per burst, and the sweep step that calls `computeRemoved` in `OpenChoreoIncrementalIngestionDatabaseManager.ts` lines 669–789.
- Note `componentBatchProcessor.ts` lines 69–76 in passing as the place where per-burst entity batches are processed (deeper detail belongs in §8).
- Configuration knobs (burst interval, rest interval, backoff) come from `openchoreoIncrementalProviderModule.ts` lines 30–82. Don't paste this config in §5; it's the §8 code excerpt.

**Required code excerpt (TypeScript, ≤25 lines):**
- Source: `backstage-plugins/plugins/catalog-backend-module-openchoreo-incremental/src/providers/OpenChoreoIncrementalEntityProvider.ts` lines 66–166.
- Pick the smallest excerpt that shows the `next(context, lastCursor)` signature, one upstream fetch call, and the `{ done, entities, cursor }` return. Trim aggressively.

**Required Mermaid sequence diagram (exactly one diagram in the post):**
- Lifelines, in this order: Scheduler, Engine, Provider, OpenChoreo API, DB Manager, Backstage Catalog.
- Interactions to depict, one ingestion burst then sweep:
  1. Scheduler -> Engine: tick
  2. Engine -> Provider: next(cursor)
  3. Provider -> OpenChoreo API: GET list?continue=...
  4. OpenChoreo API -> Provider: page + nextContinue
  5. Provider -> Engine: { done:false, entities, cursor }
  6. Engine -> DB Manager: write ingestion_marks + ingestion_mark_entities
  7. (loop the above until done:true)
  8. Engine -> DB Manager: computeRemoved(prevGen, currGen)
  9. DB Manager -> Backstage Catalog: delete orphan entities
  10. Engine -> Scheduler: rest interval

**Cite:**
- `backstage-plugins/plugins/catalog-backend-module-openchoreo-incremental/src/providers/OpenChoreoIncrementalEntityProvider.ts` lines 66–166
- `backstage-plugins/plugins/catalog-backend-module-openchoreo-incremental/src/engine/OpenChoreoIncrementalIngestionEngine.ts` lines 286–477
- `backstage-plugins/plugins/catalog-backend-module-openchoreo-incremental/src/database/OpenChoreoIncrementalIngestionDatabaseManager.ts` lines 669–789
- PR #140 link.

[PERSONAL EXPERIENCE marker: walking through the engine call sequence the way I learned it, by adding logs at each lifeline.]

---

## Section 6 — The pagination problem we found next (~220 w)

- Answer-first paragraph framing the segue: incremental ingestion only pays off if the producer can be navigated page by page. With no upstream pagination, every "burst" was still pulling the full list and then chunking client-side, which preserved the memory burst we were trying to remove.
- Concrete observation: even with the new mark-and-sweep, the first burst was as expensive as the old full-dataset poll because the upstream `GET` returned everything at once. So the consumer-side win was capped by the producer.
- This is where the proposal moved server-side. State the line verbatim: "the proposal lives in [GitHub Discussion #837](https://github.com/openchoreo/openchoreo/discussions/837)". Note that there is no `GITHUB_PROPOSAL.md`; the discussion is the proposal of record.
- Brief design constraints I had to honor:
  - Must not break existing `choreoctl` users.
  - Must be safe to expire mid-pagination (long-running list shouldn't pin server state forever).
  - Must compose with the Backstage incremental provider's `cursor` field cleanly.
- One-line bridge to §7: the right reference model for this is the Kubernetes list-pagination protocol, not "build something new".

**Cite:**
- https://github.com/openchoreo/openchoreo/discussions/837
- https://github.com/openchoreo/openchoreo/pull/1257

---

## Section 7 — Cursor pagination for OpenChoreo (~320 w, includes Go code excerpt)

- Answer-first paragraph: I followed the Kubernetes API conventions for list pagination, the `continue` token plus `ResourceVersion` semantics. This IS the right analogy here, where it was wrong in §4. Cite the K8s API conventions doc.
- The token shape: opaque base64-encoded JSON wrapping `{c, s}`, where `c` is the cursor (offset / resource key) and `s` is a snapshot/resource-version-like marker so the server can detect a stale token.
- Server expiry behavior: if the snapshot marker no longer matches (data drift past the retention window), the server returns `410 Gone` with `ErrContinueTokenExpired`, mirroring the K8s `410 Gone` semantics on expired `continue` tokens.
- The handler error path: `handlePaginationError` in `handlers/helpers.go` lines 75–92 maps service-layer errors to HTTP status (`410` on token expiry, `400` on malformed token).
- Defaults from `pkg/constants/pagination.go`: `DefaultPageLimit=100`, `MaxPageLimit=512`. Note: PR #1257 is shipped to PR, under review, not merged. (Either §5 or §7 must say this once; I'll say it once in §7 if it wasn't placed in §5.)

**Required code excerpt (Go, ≤25 lines):**
- Source: `openchoreo/internal/openchoreo-api/services/pagination.go` lines 62–90 (the `paginationCursor` encode/decode).
- Show the struct, the `Encode` returning base64, and the `Decode` returning `ErrContinueTokenExpired` on snapshot mismatch. Trim hard.

**Cite:**
- https://kubernetes.io/docs/reference/using-api/api-concepts/#retrieving-large-results-sets-in-chunks (K8s `continue` + `ResourceVersion`, `410 Gone`)
- `openchoreo/internal/openchoreo-api/services/pagination.go` lines 32–48, 62–90
- `openchoreo/internal/openchoreo-api/services/errors.go` lines 48–51, 89–91, 106–147
- `openchoreo/internal/openchoreo-api/handlers/helpers.go` lines 75–92
- `openchoreo/internal/openchoreo-api/models/request.go` lines 20–33
- `openchoreo/internal/openchoreo-api/models/response.go` lines 20–43, 261–274
- `openchoreo/pkg/constants/pagination.go`

[UNIQUE INSIGHT marker: §4 deliberately rejects the K8s analogy, §7 deliberately adopts it. The point is that "K8s-shaped" is right for list-pagination protocols and wrong for ingestion lifecycle.]

---

## Section 8 — Updating choreoctl and the Backstage clients (~280 w, includes config/CLI excerpt)

- Answer-first paragraph with a concrete fact: `choreoctl` does NOT expose a `--continue` flag. The user-facing flags are `--limit` and `--all`. Auto-pagination is internal, hidden behind `fetchAllPages` in the client. I made this choice on purpose so end users don't have to think about cursor lifetime.
- CLI side: flag definitions in `pkg/cli/flags/flags.go` lines 324–334; wiring for the `get component` command in `pkg/cli/cmd/get/get.go` lines 84–106. `--all` triggers `fetchAllPages`; `--limit` caps a single page.
- Client side: `internal/occ/resources/client/api_client.go` lines 285–332 implements `fetchAllPages`, which loops on the `continue` token until empty, surfacing a single combined slice to the caller.
- Backstage client side: it uses `openapi-fetch`. There is no rate-limited HTTP client. Throttling is application-level:
  - `componentBatchProcessor.ts` lines 69–76: `MAX_CONCURRENT=5`, `BATCH_DELAY=100ms`.
  - Engine-level backoff schedule: `[1m, 5m, 30m, 3h]` from `openchoreoIncrementalProviderModule.ts` lines 30–82.
- Why both layers exist: per-burst batch concurrency keeps a single ingestion sane; engine backoff handles upstream outages without hammering.

**Required code excerpt (config / CLI, ≤15 lines):**
- Source: `backstage-plugins/plugins/catalog-backend-module-openchoreo-incremental/README.md` lines 29–43 (the YAML config block showing burstInterval, restInterval, backoff schedule).
- This is the most user-facing artifact, which is why it's the third excerpt.

**Cite:**
- `openchoreo/pkg/cli/flags/flags.go` lines 324–334
- `openchoreo/pkg/cli/cmd/get/get.go` lines 84–106
- `openchoreo/internal/occ/resources/client/api_client.go` lines 285–332
- `backstage-plugins/plugins/catalog-backend-module-openchoreo-incremental/src/providers/componentBatchProcessor.ts` lines 69–76
- `backstage-plugins/plugins/catalog-backend-module-openchoreo-incremental/src/module/openchoreoIncrementalProviderModule.ts` lines 30–82
- `backstage-plugins/plugins/catalog-backend-module-openchoreo-incremental/README.md` lines 29–43

---

## Section 9 — Trade-offs and what I'd do differently (~220 w)

- Answer-first paragraph: be honest. List the things I got wrong on the first try and had to redo. No marketing varnish.
- Specific items, at least three, at least one with reviewer attribution:
  - I didn't catch the orphan-entity problem until the September 2025 deployment. The spec said "deletes propagate", I assumed that meant "the next refresh picks them up". It didn't, because the old provider's `full` mutation had partial-failure recovery that masked deletes. Lesson: write the failing test before trusting the spec.
  - First sweep implementation only ran one pass. Reviewer feedback flagged that orphan rows could survive in `refresh_state` if the catalog processor had partially observed them between marks. Second pass added.
  - Reviewer feedback on the cursor handling: I was mutating the cursor object directly across burst boundaries; that's fragile if the engine ever retries a burst. Switched to immutable cursor returns.
  - Reviewer feedback on error detection: I had `if err.Error() == "http 429"` style string-matching. Replaced with a typed sentinel error.
  - Dead-code review feedback: an unused `fetchAllComponents` method survived the cursor migration; deleted.
- Close with one paragraph on what I'd do differently next time: write the orphan test first, design the cursor token before the consumer, and don't vendor the upstream module unless the upstream RFC path is actually blocked.

**Cite:**
- PR #140 review threads
- PR #1257 review threads
- Monthly progress reports (internal, cite as "internal monthly report, Sep–Nov 2025" without linking)

[PERSONAL EXPERIENCE marker: this is the section where the intern voice is loudest.]

---

## Section 10 — FAQ (~200 w, 5 entries, ≤60 words each)

Each answer must be answer-first and ≤60 words. Pick exactly these five questions:

1. **Why not just use Backstage's built-in incremental-ingestion module?**
   - Short answer: I did, by vendoring it. At the time the upstream module didn't expose hooks for OpenChoreo's error shapes and burst sizing. Cite the upstream incremental-ingestion docs.
2. **How is the continue token validated server-side?**
   - Short answer: base64 decode -> `{c, s}` JSON -> compare `s` against the current snapshot/resource-version marker. Mismatch returns `410 Gone` via `ErrContinueTokenExpired`. Cite `services/errors.go`.
3. **What happens if a token expires mid-sweep?**
   - Short answer: the engine receives `410`, restarts the ingestion generation from cursor zero. Marks already written are discarded by the next sweep because the new generation id wins. Cite K8s API conventions for the analogous behavior.
4. **Does the sweep handle re-parented entities?**
   - Short answer: yes, because identity is by entity ref, not by parent path. If the same ref appears with a new parent, it's a mark hit, not a delete. Cite `computeRemoved`.
5. **How does this interact with Backstage's `refresh_state`?**
   - Short answer: the sweep deletes rows from `refresh_state` in the same transaction as the mark cleanup, so there's no window where the catalog UI shows an entity the provider has already disowned. Cite `OpenChoreoIncrementalIngestionDatabaseManager.ts` lines 669–789.

**Cite (across FAQ):** Backstage incremental-ingestion docs, K8s API conventions, `services/errors.go`, `OpenChoreoIncrementalIngestionDatabaseManager.ts`.

[INTERNAL-LINK: deeper post on Backstage `refresh_state` mechanics, target a future article]

---

## Section 11 — References (~130 w, list only)

Required external citations, at least 5. Write as a numbered list with full URLs:

1. PR #140, openchoreo/backstage-plugins, https://github.com/openchoreo/backstage-plugins/pull/140 (incremental entity provider, shipped to PR, under review).
2. PR #1257, openchoreo/openchoreo, https://github.com/openchoreo/openchoreo/pull/1257 (cursor pagination on the list API, shipped to PR, under review).
3. OpenChoreo docs, deep link 1: pagination / list API page (insert exact docs URL at draft time).
4. OpenChoreo docs, deep link 2: Backstage integration / incremental ingestion config (insert exact docs URL at draft time).
5. Backstage incremental-ingestion docs: https://backstage.io/docs/features/software-catalog/external-integrations/#provider-cycle
6. Kubernetes API conventions, list pagination (`continue` + `ResourceVersion`, `410 Gone`): https://kubernetes.io/docs/reference/using-api/api-concepts/#retrieving-large-results-sets-in-chunks
7. GitHub Discussion #837, openchoreo/openchoreo: https://github.com/openchoreo/openchoreo/discussions/837
8. DORA 2025 report: https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report
9. CNCF 2025 Annual Survey: https://www.cncf.io/announcements/2026/01/20/kubernetes-established-as-the-de-facto-operating-system-for-ai-as-production-use-hits-82-in-2025-cncf-annual-cloud-native-survey/
10. CNCF Backstage project page: https://www.cncf.io/projects/backstage/

---

## Section word-budget reconciliation

| Section | Budget |
| --- | --- |
| 1. Hook | 150 |
| 2. The problem | 220 |
| 3. Why default broke | 200 |
| 4. Designing IEP | 280 |
| 5. Implementation | 380 |
| 6. Pagination problem | 220 |
| 7. Cursor pagination | 320 |
| 8. choreoctl + Backstage clients | 280 |
| 9. Trade-offs | 220 |
| 10. FAQ | 200 |
| 11. References | 130 |
| **Total** | **2,600** |

---

## Code excerpt budget (hard cap = 3)

1. TypeScript, §5: `OpenChoreoIncrementalEntityProvider.ts` lines 66–166, trimmed to ≤25 lines around the `next(context, lastCursor)` signature.
2. Go, §7: `services/pagination.go` lines 62–90, ≤25 lines, the `paginationCursor` encode/decode showing `410 Gone` path.
3. Config, §8: `README.md` lines 29–43, ≤15 lines, the YAML config block.

## Diagram budget (hard cap = 1)

1. Mermaid sequence diagram in §5, lifelines: Scheduler, Engine, Provider, OpenChoreo API, DB Manager, Backstage Catalog. Burst -> mark -> sweep cycle as enumerated in §5 above.

---

## Pre-flight checklist for the writer
- [ ] Both PRs cited as "shipped to PR / under review, not merged"
- [ ] No K8s GC analogy in §4
- [ ] K8s continue token + ResourceVersion analogy in §7
- [ ] Discussion #837 cited (no GITHUB_PROPOSAL.md)
- [ ] 3 code excerpts max, 1 Mermaid diagram, 5+ external citations
- [ ] At least one paragraph admitting something I got wrong on the first try
- [ ] FAQ has 5 entries
