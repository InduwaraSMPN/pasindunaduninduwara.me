# SEO checklist: incremental-entity-provider-and-cursor-pagination

Audited file: `blog/draft-v1.md`
Target canonical: `https://www.pasindunaduninduwara.me/blog/incremental-entity-provider-and-cursor-pagination`
Primary keyword: `incremental entity provider for backstage`
Audit date: 2026-05-02

## Summary

- Score: 7 PASS / 1 NEEDS FIX / 1 TODO / 2 RECOMMENDED ADDITIONS
- Status: NEEDS FIXES — ship-blocking issues are minor; one H1/title mismatch and one missing OG/Twitter block.

---

## 1. Title tag — PASS

- Frontmatter `title`: `Building an incremental entity provider for Backstage`
- Length: 53 chars (target ≤ 60). PASS.
- Primary keyword `incremental entity provider for backstage` appears in chars 13–53 (within the first 60). PASS.
- No sibling collisions: only `outline.md`, `draft-v1.md`, `review.md` exist, none publish a competing title. PASS.

Sub-issue (non-blocking): the H1 on line 12 is `Building an incremental entity provider for Backstage catalog ingestion` (71 chars). H1 is the on-page heading, not the `<title>`. It is acceptable for H1 to differ from the title tag, but if the Next.js wrapper sets `<title>` from the H1 instead of from frontmatter, the title tag will exceed 60 chars and truncate in SERPs.

Fix (only if the page wrapper derives `<title>` from H1):
- Make sure the Next.js page reads `frontmatter.title` for `<title>`, not the rendered H1.

## 2. Meta description — PASS

- Frontmatter `description`: `How I rewrote OpenChoreo's Backstage catalog ingestion with an incremental entity provider, mark-and-sweep, and Kubernetes-style cursor pagination.`
- Length: 148 chars (target 140–155). PASS.
- Primary keyword phrase `incremental entity provider` appears at char 67 (within the first 100). PASS.
- Verb hook present: "rewrote". PASS.
- No mid-word truncation. PASS.

## 3. Heading hierarchy — PASS

```
H1  Building an incremental entity provider for Backstage catalog ingestion
H2  Why does full-dataset polling break the catalog?
H2  Why did the default Backstage pattern break at our scale?
H2  How does the incremental entity provider work?
H2  How does the implementation hang together?
H2  What pagination problem did we find next?
H2  How does cursor pagination work for OpenChoreo?
H2  How do choreoctl and the Backstage clients consume it?
H2  What did I get wrong on the first try?
H2  FAQ
H3    Why not just use Backstage's built-in incremental-ingestion module?
H3    How is the continue token validated server-side?
H3    What happens if a token expires mid-sweep?
H3    Does the sweep handle re-parented entities?
H3    How does this interact with Backstage's `refresh_state`?
H2  References
```

- Exactly one H1. PASS.
- No skipped levels (no H2 → H4). PASS.
- Sentence case throughout. PASS.
- Primary keyword in H2: `How does the incremental entity provider work?` carries the exact phrase. PASS.
- H2-as-question ratio: 8 of 10 H2s are questions = 80% (target 60–70%). Slightly above target but not a fail; question-style H2s are AI-citation friendly.

## 4. Internal-link audit — TODO (not a fail)

Internal-link placeholders detected (3 total):
- Line 19: `<!-- TODO: internal link to /about page once published -->`
- Line 130: `<!-- TODO: internal link to a future deep-dive on Backstage refresh_state mechanics -->`
- Line 256: `<!-- TODO: internal link to a future deep-dive on Backstage refresh_state mechanics -->`

The site has zero existing siblings, so this is correctly flagged as a publish-time TODO list rather than a fail.

Publish-time TODO list:
- [ ] Resolve `/about` link (line 19) — point to whichever about/bio page ships first.
- [ ] Decide whether the two `refresh_state` placeholders (lines 130 and 256) link to the same future post or to different anchors. Consider de-duplicating to one link to avoid stuffed anchor text.
- [ ] When the second blog post is published, add a contextual "see also" link in the relevant FAQ entry.

## 5. External-link audit — PASS (with one URL anchor follow-up)

All external URLs use `https://`. PASS.
All anchor texts are descriptive (no "click here" or bare URLs in body prose; references list is intentionally a numbered bibliography). PASS.

| URL | Status | Notes |
|---|---|---|
| https://github.com/openchoreo/backstage-plugins/pull/140 | 200 OK | Title matches "Add Incremental Entity Provider and Global API Pagination Support". |
| https://github.com/openchoreo/openchoreo/pull/1257 | 200 OK | Title matches "Implement cursor-based pagination for API and CLI". |
| https://github.com/openchoreo/openchoreo/discussions/837 | 200 OK | Discussion title "[Proposal] Add Cursor Pagination Support to OpenChoreo Endpoints". |
| https://backstage.io/docs/features/software-catalog/external-integrations/#provider-cycle | 200 OK | Page resolves; verify in-page anchor `#provider-cycle` at publish time; if renamed, drop fragment. |
| https://kubernetes.io/docs/reference/using-api/api-concepts/#retrieving-large-results-sets-in-chunks | 200 OK | Anchor matches. |
| https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report | 200 OK | 90% IDP figure supported. |
| https://www.cncf.io/announcements/2026/01/20/...82-in-2025-cncf-annual-cloud-native-survey/ | 200 OK | 82% K8s in production confirmed. |
| https://www.cncf.io/projects/backstage/ | 200 OK | Confirms "Incubating since March 15, 2022". |
| https://www.cncf.io/announcements/2026/03/24/...platform-engineering-tools-maturing.../ | 200 OK | Confirms "28% have a dedicated platform engineering team". |
| https://github.com/backstage/backstage | 200 OK | Live star count 33.3k; post says "more than 30,000 as of January 2026" — factually correct. |

Follow-up to confirm at publish time (not a hard fail):
- Verify the `#provider-cycle` anchor on the Backstage external-integrations docs page. If the anchor has been renamed, link to the parent section URL without the fragment.

## 6. Canonical URL — PASS

- Frontmatter `canonical`: `https://www.pasindunaduninduwara.me/blog/incremental-entity-provider-and-cursor-pagination`
- Matches the target canonical exactly. PASS.
- Absolute URL, no trailing slash, no mid-post inversion.

Confirmation TODO (not a fail):
- [ ] Audit other blog posts (when they exist) to confirm the no-trailing-slash canonical convention is consistent site-wide.

## 7. Open Graph and Twitter Card — RECOMMENDED ADDITION

Current frontmatter exposes: `title`, `description`, `hero`, `canonical`, `date`, `author`, `tags`, `slug`.

The renderer is `@uiw/react-markdown-preview`, which escapes raw HTML, so OG and Twitter meta cannot live inside the markdown body. They must be emitted by the Next.js page wrapper.

Action items for the Next.js page wrapper:
- Confirm `frontmatter.title` is mapped to both `<title>` and `og:title`.
- Confirm `frontmatter.description` is mapped to `meta[name="description"]`, `og:description`, and `twitter:description`.
- Confirm `frontmatter.hero` is mapped to `og:image` and `twitter:image`, and that the path is rewritten to an absolute URL (the markdown carries `/blog/assets/...`, OG requires absolute).
- Confirm `og:type=article`, `og:url=frontmatter.canonical`, `twitter:card=summary_large_image`.

If the wrapper does not derive these automatically, see the "Recommended frontmatter additions" block at the end of this file.

## 8. URL structure — PASS

- Slug: `incremental-entity-provider-and-cursor-pagination`
- Length: 49 chars, kebab-case, lowercase only, no dates, no special characters. PASS.
- Primary keyword phrase `incremental entity provider` is present. PASS.
- Hyphen count: 5. The `and` is a stop word; consider trimming to `incremental-entity-provider-cursor-pagination` (4 hyphens) for a slightly tighter slug. Current is acceptable.

## 9. Image alt text — PASS

| Image | Alt text length | Status |
|---|---|---|
| hero-platform-engineering-fiber-mesh.jpg | 105 chars | PASS |
| memory-pressure-overflowing-bookshelves.jpg | 92 chars | PASS |
| pagination-cursor-card-catalog.jpg | 76 chars | PASS |

All filenames descriptive kebab-case. All photos credited.

## 10. Mermaid diagram alt-text equivalent — PASS

The Mermaid sequence diagram (lines 108–128) is preceded and followed by prose that describes its semantics (lines 106 and 130). Screen readers and LLMs have enough context even if Mermaid rendering fails.

Optional improvement: add a one-line caption immediately under the Mermaid block.

## 11. Frontmatter validity — PASS

- Valid YAML. Straight ASCII quotes throughout.

---

## Priority fixes

1. (Recommendation) Decide and document the OG/Twitter strategy in the Next.js page wrapper. Add the recommended block below to frontmatter if the wrapper does not auto-derive.
2. (Publish-time TODO) Resolve the three internal-link placeholders on lines 19, 130, and 256 before publishing.
3. (Publish-time TODO) Re-check the `#provider-cycle` anchor on backstage.io and drop the fragment if it has been renamed.

---

## Recommended frontmatter additions (if page wrapper does not auto-derive)

```yaml
og:
  title: "Building an incremental entity provider for Backstage"
  description: "How I rewrote OpenChoreo's Backstage catalog ingestion with an incremental entity provider, mark-and-sweep, and Kubernetes-style cursor pagination."
  image: "https://www.pasindunaduninduwara.me/blog/assets/hero-platform-engineering-fiber-mesh.jpg"
  imageAlt: "Blue fiber-optic strands radiating outward against a dark background, evoking a distributed network mesh."
  type: "article"
  url: "https://www.pasindunaduninduwara.me/blog/incremental-entity-provider-and-cursor-pagination"
  siteName: "pasindunaduninduwara.me"
  publishedTime: "2026-01-15T00:00:00Z"
  author: "Pasindu Naduni Induwara"

twitter:
  card: "summary_large_image"
  title: "Building an incremental entity provider for Backstage"
  description: "I rewrote OpenChoreo's Backstage catalog ingestion with an incremental provider, mark-and-sweep, and Kubernetes-style cursor pagination."
  image: "https://www.pasindunaduninduwara.me/blog/assets/hero-platform-engineering-fiber-mesh.jpg"
  imageAlt: "Blue fiber-optic strands radiating outward against a dark background, evoking a distributed network mesh."
```

Equivalent Next.js App Router `generateMetadata`:

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await loadPost(params.slug);
  const absoluteHero = new URL(post.hero, "https://www.pasindunaduninduwara.me").toString();
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: post.canonical },
    openGraph: {
      title: post.title,
      description: post.description,
      url: post.canonical,
      siteName: "pasindunaduninduwara.me",
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: absoluteHero, width: 1200, height: 630, alt: post.heroAlt ?? post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [absoluteHero],
    },
  };
}
```

Notes:
- The `hero` path in markdown is relative (`/blog/assets/...`). OG and Twitter require absolute URLs. The page wrapper must rewrite to absolute, or store `hero` in frontmatter as an absolute URL.
- Because `@uiw/react-markdown-preview` escapes raw HTML, JSON-LD `<script type="application/ld+json">` (see `schema.json`) must be injected by the page wrapper, not the markdown body.
