*Photo by S A on Unsplash.*

The bug that pushed me to rewrite OpenChoreo's Backstage plugin showed up on a Tuesday in September. Someone had deleted a component upstream. Hours later the catalog UI was still showing it as if nothing had happened. The next refresh tick should have caught the delete. It didn't. That was the moment I gave up trying to patch the existing entity provider and opened a new one.

I spent six months on the OpenChoreo and Backstage developer-experience team at WSO2 between July and December 2025. Two PRs came out of the work: a new incremental entity provider for Backstage ([PR #140](https://github.com/openchoreo/backstage-plugins/pull/140)) and cursor-paginated list endpoints on the OpenChoreo backend ([PR #1257](https://github.com/openchoreo/openchoreo/pull/1257)). Both are still open and in review. When I link a class or file below, the link goes to the PR. Line numbers drift mid-review, the "Files changed" tab does not.

The catalog matters more than people give it credit for. [DORA's 2025 report](https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report) puts internal-developer-platform adoption at 90% of organizations, and the catalog is usually the first surface developers touch. When that surface lies about what's actually upstream, trust drains out of it quickly.

## What the old provider was doing

The original `OpenChoreoEntityProvider` ran the simplest possible loop. Every refresh tick, it called the OpenChoreo API, accumulated the entire entity set in memory, and emitted a `full` mutation against the catalog. At small scale, fine. We weren't at small scale.

Memory was the first thing I noticed. Each refresh held the full dataset in a single in-process slice before handing it to Backstage, and the catalog backend's resident set jumped on every tick. Cold starts were the next thing. A fresh deployment had to wait one full refresh interval before any entities appeared, then another tick before stale rows reconciled, which meant anyone watching the UI right after a deploy saw an empty catalog for thirty-plus seconds.

The orphan bug was the one that mattered. The `full` mutation has partial-failure recovery semantics: if any single fetch in the batch hiccupped, the previous "complete" set was kept around and deletes weren't propagated. Memory and latency are visible. Orphans are silent, and they erode trust in the catalog faster than the other two combined.

## Why the default broke for us

Backstage's default `EntityProvider.applyMutation({ type: 'full', entities })` is a sensible primitive for small, slow-moving sources. It cost-scales linearly with entity count, and every tick re-pays that cost in full. There is no checkpointing, so a producer fetch failing halfway means the next tick starts over from zero. Worst of all, deletion is implicit: it depends on the producer returning an authoritative complete list, which any upstream pagination, retry, or transient error breaks.

The OpenChoreo list API at the time also had no pagination, which meant any client that wanted a complete list paid the full cost on every refresh, no matter how the consumer was written. The fix had to be two-sided. Make the consumer incremental, then make the producer navigable so incremental actually pays off.

![A narrow library aisle with bookshelves so full that volumes spill into stacks on the floor.](https://sgp.cloud.appwrite.io/v1/storage/buckets/images/files/69f62884001db5c60a24/view?project=pasindunaduninduwara-me)
*Photo by Ryan Delfin from Pexels.*

## Mark, sweep, repeat

Credit first: the mark-and-sweep design is not mine. It comes straight from Backstage's incremental-ingestion module, [documented in the provider-cycle section of the external-integrations docs](https://backstage.io/docs/features/software-catalog/external-integrations/#provider-cycle). I vendored that pattern as a deliberate local fork, into a new plugin package called `catalog-backend-module-openchoreo-incremental`, because I needed hooks for OpenChoreo-shaped errors and burst sizing that the upstream module didn't expose at the time.

The model is simple once you have the right mental picture. Each ingestion run gets its own generation id, recorded as a row in an `ingestions` table. As the engine drives bursts, every entity it sees gets logged as a "mark" against that generation, in `ingestion_marks` (one row per burst) and `ingestion_mark_entities` (one row per entity ref seen). When the provider eventually reports `done: true`, the engine sweeps. Anything in the previous generation that has no mark in the current generation gets deleted.

The split between "what we saw this run" and "what's currently in the catalog" is what makes this work. The old `full` path conflated the two and produced orphans whenever any fetch hiccupped. The mark/sweep path doesn't, because the sweep is conditional on the ingestion completing, not on every individual fetch succeeding.

One mental-model warning. People reach for the Kubernetes garbage-collector analogy here, and it is the wrong one. There are no `ownerReferences`, no finalizers, no foreground or background propagation. The lifecycle is per-ingestion-generation, not per-owner-graph. Carrying the GC mental model into the next section will leave you looking for pieces that don't exist and missing the ones that do.

## Walking through one ingestion cycle

The provider-side surface is small. Inside an `around` envelope that the engine controls, the provider gets called repeatedly via `next(context, cursor)`. Each call returns a page of entities plus a continuation cursor. When the provider returns `done: true`, the engine knows to sweep.

![TypeScript class OpenChoreoIncrementalEntityProvider implementing IncrementalEntityProvider with getProviderName, around, and next methods.](https://sgp.cloud.appwrite.io/v1/storage/buckets/images/files/69f62d4b003735bc0bbb/view?project=pasindunaduninduwara-me)

The full implementation lives in `OpenChoreoIncrementalEntityProvider` inside [PR #140](https://github.com/openchoreo/backstage-plugins/pull/140/files). What the snippet doesn't show: the `next` body builds an authenticated client, calls one of the OpenChoreo list endpoints (orgs, projects, components), and unpacks the response into Backstage entity refs.

I learned this engine the way I learn most engines, which is by adding a log line at every lifeline and watching one full ingestion play out. The sequence isn't complicated, it's just spread across six actors:

![Sequence diagram of one ingestion burst: Scheduler ticks the Engine, which loops next(cursor) against the Provider, which fetches paginated pages from the OpenChoreo API and writes ingestion marks. On done, the Engine calls computeRemoved, the DB Manager deletes orphan entities from the Backstage Catalog, and the Engine rests.](https://sgp.cloud.appwrite.io/v1/storage/buckets/images/files/69f62d4b00373ca658fa/view?project=pasindunaduninduwara-me)

The `OpenChoreoIncrementalIngestionEngine` class owns the burst loop and the sweep handoff. Orphan computation lives in `OpenChoreoIncrementalIngestionDatabaseManager.computeRemoved`, which compares the prior generation's marks to the current generation's marks and emits deletes. `componentBatchProcessor` is where each burst's batch boundary is enforced, and I'll come back to it in a moment.

## Why we needed pagination next

The first run of the new provider on a real-sized catalog showed me something obvious in retrospect. Incremental ingestion only pays off if the producer can be navigated page by page. With no upstream pagination, every burst was still pulling the full list and chunking it client-side, which kept the memory burst we were trying to remove. The first burst was as expensive as the old `full` poll. Later bursts were cheap, because there was nothing left to fetch. We had moved the cost, not removed it.

So the proposal moved server-side. The proposal lives in [GitHub Discussion #837](https://github.com/openchoreo/openchoreo/discussions/837), which is the design of record. The constraints I had to honor were that I couldn't break existing `choreoctl` users, the protocol had to be safe to expire mid-pagination so a long-running list couldn't pin server state forever, and the cursor had to compose cleanly with the Backstage incremental provider's existing `cursor` field.

The right reference model here is the Kubernetes list-pagination protocol, not anything new. This is also the place where the Kubernetes analogy is correct, after I spent the previous section saying it was wrong for the ingestion lifecycle. List protocols and lifecycle protocols are different problems.

![A hand pulls a single index card from a wooden library card catalog drawer.](https://sgp.cloud.appwrite.io/v1/storage/buckets/images/files/69f62884001dbf682da1/view?project=pasindunaduninduwara-me)
*Photo by Daniel Forsman on Unsplash.*

## The cursor token

I followed the [Kubernetes API conventions for retrieving large result sets in chunks](https://kubernetes.io/docs/reference/using-api/api-concepts/#retrieving-large-results-sets-in-chunks): an opaque `continue` token, a `ResourceVersion`-style snapshot marker so the server can detect drift, and `410 Gone` when the token has expired past its retention window. OpenChoreo's `continue` token mirrors that protocol almost directly.

The token itself is base64-url-encoded JSON with two fields. The encode/decode pair lives in `pagination.go`:

![Go paginationCursor struct with Continue and Skip fields, plus encodeCursor and decodeCursor functions using base64 RawURLEncoding.](https://sgp.cloud.appwrite.io/v1/storage/buckets/images/files/69f62d4b00373343e435/view?project=pasindunaduninduwara-me)

Two fields, both load-bearing. The `c` value is the upstream Kubernetes `continue` token, which the OpenChoreo API forwards to controller-runtime via `client.Continue(...)`. The `s` value is a within-page skip pointer. We need it because authorization checks and project filters can reject some items inside a page, which means a single Kubernetes page does not always map cleanly to a single response page. The skip pointer lets the server resume mid-page after filtering.

Server expiry is where the protocol earns its keep. When the upstream Kubernetes `continue` token has aged out, apimachinery returns a typed error. `HandleListError` checks `apierrors.IsResourceExpired(err)` and produces an `ErrContinueTokenExpired` sentinel. The HTTP layer maps that sentinel to `410 Gone` in `handlePaginationError`. Malformed tokens go to `400 Bad Request` through the same handler. This is the same shape Kubernetes itself uses, which means most Kubernetes clients already know how to retry against it.

Defaults come from a small constants package: `DefaultPageLimit=100`, `MaxPageLimit=512`. The Backstage provider asks for 50 per page in normal operation, well under the cap.

## What choreoctl users see

Almost nothing. `choreoctl` doesn't expose a `--continue` flag. Two flags surface to end users: `--limit` caps a single page, and `--all` pulls every page through internal auto-pagination. I made that choice on purpose. Cursor lifetime, expiry, and retry are protocol details that no end user should ever have to think about.

Flag definitions live in the CLI's shared `flags` package, and individual `get <resource>` commands compose them through a small command builder. Under `--all`, the client invokes `fetchAllPages`, which loops on the `continue` token until it comes back empty and surfaces a single combined slice to the caller.

The Backstage client side is similar in spirit. It uses `openapi-fetch` against the OpenChoreo API, with no rate-limited HTTP client. Throttling is application-level in two layers. The component batch processor caps per-burst concurrency at `MAX_CONCURRENT=5` with a `BATCH_DELAY=100ms` between batches, which keeps a single ingestion sane against the upstream API. The engine layer adds a backoff schedule of `[1m, 5m, 30m, 3h]` declared in the provider module's burst configuration, which stretches the rest interval after repeated failures and stops us from hammering an outage.

The README ships a working YAML config block end users can copy:

![app-config.yaml block for the openchoreo incremental provider with burstLength, burstInterval, restLength, chunkSize, maxConcurrentRequests, batchDelayMs, and rejectRemovalsAbovePercentage settings.](https://sgp.cloud.appwrite.io/v1/storage/buckets/images/files/69f62d4b003730c2b094/view?project=pasindunaduninduwara-me)

`rejectRemovalsAbovePercentage` is worth calling out. It's a safety valve. If a single sweep would delete more than 80% of the catalog (because, say, the upstream API silently returned an empty list), the engine refuses the sweep and surfaces a warning instead of nuking the catalog. I tuned this default down twice during testing before settling on 80%, which felt about right.

## What I got wrong

Mostly, I missed the orphan bug for too long. It was sitting in a fixture-shaped hole in my test suite. I had tests for the happy path, tests for empty responses, tests for malformed payloads, and no test for "fetch succeeds for some pages and fails for others." The spec said "deletes propagate." I read that as "the next refresh picks them up." It didn't, because the old provider's `full` mutation had partial-failure recovery that kept the previous "complete" set around when any fetch had hiccupped. The lesson I keep coming back to is small and unglamorous. Write the failing test before you trust the spec.

A few other things came out of code review:

- My first sweep implementation only ran one pass, which left orphan rows in `refresh_state` whenever the catalog processor had partially observed them between marks. Reviewer caught it. Second pass added.
- I was mutating the cursor object directly across burst boundaries. That is fine right up to the point where the engine retries a burst, and then it isn't. Switched to immutable cursor returns.
- Error detection started as `if err.Error() == "http 429"` string matching. I winced when the reviewer flagged it. Replaced with a typed sentinel error.
- An unused `fetchAllComponents` method survived the cursor migration. Dead code, gone.

If I were starting again with what I know now, I'd write the orphan test first, before any production code. I'd also design the cursor token before the consumer, because the consumer's retry logic is downstream of the token's expiry semantics, and getting that order wrong means rewriting the consumer twice. Vendoring the upstream incremental-ingestion module is fine, but it carries a maintenance tax I underestimated; the upstream RFC path was probably faster than I thought.

## FAQ

### Why not just use Backstage's built-in incremental-ingestion module?
I did. Vendored it. The upstream module didn't expose the hooks I needed for OpenChoreo's specific error shapes and burst sizing, and a local fork let me iterate without an upstream RFC. The pattern itself comes straight from the [Backstage docs](https://backstage.io/docs/features/software-catalog/external-integrations/#provider-cycle).

### How is the continue token validated server-side?
Base64-url decode produces `{c, s}` JSON. The `c` value is forwarded to controller-runtime, which compares it against the current `ResourceVersion` window. On mismatch, apimachinery returns `IsResourceExpired`, which `HandleListError` maps to `ErrContinueTokenExpired`, which the HTTP handler returns as `410 Gone`.

### What happens if a token expires mid-sweep?
The engine receives `410 Gone`, treats the ingestion generation as terminated, and restarts from cursor zero with a fresh generation id. Marks already written under the old generation get discarded by the next sweep, because the new generation id wins. This is the same retry shape [Kubernetes uses for its own expired continue tokens](https://kubernetes.io/docs/reference/using-api/api-concepts/#retrieving-large-results-sets-in-chunks).

### Does the sweep handle re-parented entities?
Yes. Identity is by entity ref, not by parent path. If the same ref appears in the new generation under a different parent, the sweep counts that as a mark hit, not a delete. `computeRemoved` operates on entity refs only.

### How does this interact with Backstage's `refresh_state`?
The sweep deletes rows from `refresh_state` in the same transaction as the mark cleanup, so there is no window where the catalog UI shows an entity the provider has already disowned. The transaction boundary is enforced inside `computeRemoved`.

## References

- [PR #140, openchoreo/backstage-plugins](https://github.com/openchoreo/backstage-plugins/pull/140), the incremental entity provider.
- [PR #1257, openchoreo/openchoreo](https://github.com/openchoreo/openchoreo/pull/1257), cursor pagination on the list API.
- [Discussion #837](https://github.com/openchoreo/openchoreo/discussions/837), the cursor pagination proposal.
- [Backstage incremental-ingestion provider cycle](https://backstage.io/docs/features/software-catalog/external-integrations/#provider-cycle).
- [Kubernetes API conventions, retrieving large result sets in chunks](https://kubernetes.io/docs/reference/using-api/api-concepts/#retrieving-large-results-sets-in-chunks).
