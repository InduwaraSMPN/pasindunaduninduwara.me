# How to publish this post on pasindunaduninduwara.me

The site stores blog posts as Appwrite documents in the `BLOG_POSTS` collection. The admin UI at `/admin/blog/new` is a form that maps to columns; the post body markdown goes into the `content` column. There is no frontmatter parser, so the `.md` file's YAML header is for the local archive only — you type the title, slug, etc. into the admin form.

## Two source files in this folder

| File | Purpose |
| --- | --- |
| `incremental-entity-provider-and-cursor-pagination.md` | Canonical archive copy. Has YAML frontmatter, the H1, and the local hero image reference. Keep this for source-of-truth. |
| `incremental-entity-provider-and-cursor-pagination.publish.md` | Body-only version ready to paste into the admin form's `Content` field. No frontmatter, no H1, no hero (the page wrapper renders those from Appwrite columns). Inline images use placeholders `MEMORY_PRESSURE_IMAGE_URL` and `PAGINATION_CURSOR_IMAGE_URL` you replace after upload. |

## Step 1 — Sign in to admin

1. Open `https://www.pasindunaduninduwara.me/login` and sign in with your admin Appwrite account.
2. Go to `/admin/blog`.
3. Click "Add New Blog Post" → opens `/admin/blog/new`.

## Step 2 — Upload the hero image

The admin form has a "Featured Image" widget that uploads via `/api/upload` to Appwrite Storage and returns a public URL. Use:

- File: `blog/assets/hero-platform-engineering-fiber-mesh.jpg`
- After upload completes, the form stores the public URL in `formData.thumbnail`.
- This becomes `post.thumbnail`, which the slug page renders as a 16:9 hero above the article body.

Caption note: the slug page does NOT render the photo credit. If you want the "Photo by S A on Unsplash" credit visible, paste it as the first paragraph of the content body, immediately above "Internal developer platforms went…".

## Step 3 — Upload the inline images and code-block SVGs

The admin form's image-upload widget only handles the featured image, so the body's inline assets get uploaded separately. There are six files: two photos plus four SVGs (three code-block renders and one sequence diagram).

Use `/admin/storage` (Appwrite Storage UI) — upload each file, copy the public URL.

| Local path | Placeholder in publish.md | Notes |
| --- | --- | --- |
| `blog/assets/memory-pressure-overflowing-bookshelves.jpg` | `MEMORY_PRESSURE_IMAGE_URL` | Photo by Ryan Delfin from Pexels |
| `blog/assets/pagination-cursor-card-catalog.jpg` | `PAGINATION_CURSOR_IMAGE_URL` | Photo by Daniel Forsman on Unsplash |
| `blog/assets/code-incremental-entity-provider.svg` | `CODE_INCREMENTAL_ENTITY_PROVIDER_SVG_URL` | TypeScript class, §"How does the implementation hang together?" |
| `blog/assets/code-pagination-cursor.svg` | `CODE_PAGINATION_CURSOR_SVG_URL` | Go cursor encode/decode, §"How does cursor pagination work for OpenChoreo?" |
| `blog/assets/code-app-config.svg` | `CODE_APP_CONFIG_SVG_URL` | YAML config block, §"How do choreoctl and the Backstage clients consume it?" |
| `blog/assets/diagram-ingestion-cycle.svg` | `DIAGRAM_INGESTION_CYCLE_SVG_URL` | Sequence diagram, §"How does the implementation hang together?" |

After upload, find-and-replace each placeholder string in your pasted content with the Appwrite public URL.

> **Why the code blocks are SVGs.** The site's Markdown renderer (`@uiw/react-markdown-preview` v5) doesn't render Mermaid and the syntax-highlighting palette varies with the page theme. Pre-rendered SVGs give consistent, dark-themed output that always looks right. The SVGs were generated locally with Pygments + a custom wrapper for the code blocks, and hand-coded for the sequence diagram.

## Step 4 — Fill in the admin form

Paste these values into `/admin/blog/new`.

### Title
```
Building an incremental entity provider for Backstage
```
(53 chars; keep this short — it becomes the page H1 and the SERP title.)

### Slug
```
incremental-entity-provider-and-cursor-pagination
```
(The "Generate from title" button will produce something different. Override it manually with the line above so the canonical URL matches the SEO + schema files.)

### Excerpt
```
How I rewrote OpenChoreo's Backstage catalog ingestion with an incremental entity provider, mark-and-sweep, and Kubernetes-style cursor pagination.
```
(148 chars. The site stores this as `post.excerpt` and shows it on the blog index card.)

### Content
Paste the entire contents of `incremental-entity-provider-and-cursor-pagination.publish.md` (everything, beginning with `Internal developer platforms went…`). Do NOT include the YAML frontmatter from the canonical file.

After pasting, find-and-replace each of the six placeholders with the public URLs you got back from Appwrite Storage in Step 3:

- `MEMORY_PRESSURE_IMAGE_URL`
- `PAGINATION_CURSOR_IMAGE_URL`
- `CODE_INCREMENTAL_ENTITY_PROVIDER_SVG_URL`
- `CODE_PAGINATION_CURSOR_SVG_URL`
- `CODE_APP_CONFIG_SVG_URL`
- `DIAGRAM_INGESTION_CYCLE_SVG_URL`

### Categories (comma separated)
```
Backstage, OpenChoreo, Platform Engineering, Kubernetes, Internship
```
The site stores these as `string[]` and renders them as Badges above the title on the slug page.

### Featured Image
Upload `hero-platform-engineering-fiber-mesh.jpg` via the widget. The widget shows a preview and saves the public URL into `formData.thumbnail`.

### Publish immediately
Toggle ON only when ready. If left OFF, the post saves as a draft (`published: false`); the slug page will return 404 because of the `Query.equal("published", true)` filter on the public route.

## Step 5 — Submit and verify

Click "Create Post". On success, you redirect to `/admin/blog`. Check:

1. Visit `/blog/incremental-entity-provider-and-cursor-pagination` — the post should render.
2. Confirm the hero image renders above the title.
3. Confirm the two inline images render in the body.
4. Confirm the three code-block SVGs render at full width with the dark theme.
5. Confirm the sequence-diagram SVG renders cleanly. If any SVG looks pixellated or stretched, check that `<Image>` or `<img>` in the slug page wrapper is not constraining `max-width` below the SVG's intrinsic width.

## Known site limitations to be aware of

These are gaps between the post's intent and the current site renderer. None block publish; flag for follow-up.

### 1. Code blocks and the sequence diagram are pre-rendered SVGs
Resolved already, noted here for the next post. Because `@uiw/react-markdown-preview@5.2.0` does not render Mermaid and its syntax-highlighting depends on the page theme, the code excerpts and the sequence diagram for this post were pre-rendered as SVGs and uploaded as inline images. Future posts can either follow the same pattern or, if you want to author code in fenced blocks, add `rehype-mermaid` and a Shiki/Prism theme to `src/components/blog/markdown-preview.tsx`.

### 2. Open Graph / Twitter Card are not emitted by the slug page
The current `src/app/blog/[slug]/page.tsx` does not export `generateMetadata`, so Next.js does not produce `og:title`, `og:description`, `og:image`, `twitter:card`, etc. Social-share previews and AI-citation crawlers will miss this. To fix, add a `generateMetadata` async function. A ready-to-paste version is in `seo-checklist.md` (the "Equivalent Next.js App Router `generateMetadata`" block); adapt it to read from the Appwrite document instead of frontmatter.

### 3. JSON-LD schema is not injected
The `schema.json` file in this folder is a `BlogPosting` + `Person` JSON-LD document. The site does not currently inject it. To wire it in, render a `<Script type="application/ld+json">{JSON.stringify(schema)}</Script>` (Next.js App Router `next/script`) inside the slug page's component tree, ideally in the `<head>` via `generateMetadata` or as a child of the page root.

### 4. Canonical URL is not declared
The slug page does not set `<link rel="canonical">`. Add it via `generateMetadata`'s `alternates: { canonical: ... }` field.

### 5. Reading-time and word-count are not displayed
Optional polish. Calculate from `post.content` server-side and render under the date.

## Optional improvements (low priority)

- **Add author capsule under the hero.** A short "About the author" line above the article body strengthens E-E-A-T signaling for search and AI crawlers.
- **Pre-render Mermaid as SVG.** Use the Mermaid CLI: `npx @mermaid-js/mermaid-cli -i diagram.mmd -o diagram.svg`. Upload the SVG to Appwrite Storage. Replace the `mermaid` fenced block with an image link.
- **Wire up an automated content sync from this folder.** Right now the canonical Markdown lives in `blog/`. A small script (`scripts/sync-blog.ts`) could read the canonical file, parse the frontmatter, and POST to `/api/blog/create` so future posts skip the form. Out of scope for this publish.

## Related files in this folder

| File | What it is |
| --- | --- |
| `incremental-entity-provider-and-cursor-pagination.md` | Canonical archive copy with frontmatter |
| `incremental-entity-provider-and-cursor-pagination.publish.md` | Body-only, paste into admin form |
| `assets/hero-platform-engineering-fiber-mesh.jpg` | Hero — upload to Appwrite as Featured Image |
| `assets/memory-pressure-overflowing-bookshelves.jpg` | First inline image — upload, replace `MEMORY_PRESSURE_IMAGE_URL` |
| `assets/pagination-cursor-card-catalog.jpg` | Second inline image — upload, replace `PAGINATION_CURSOR_IMAGE_URL` |
| `assets/code-incremental-entity-provider.svg` | TypeScript code block — upload, replace `CODE_INCREMENTAL_ENTITY_PROVIDER_SVG_URL` |
| `assets/code-pagination-cursor.svg` | Go code block — upload, replace `CODE_PAGINATION_CURSOR_SVG_URL` |
| `assets/code-app-config.svg` | YAML config block — upload, replace `CODE_APP_CONFIG_SVG_URL` |
| `assets/diagram-ingestion-cycle.svg` | Sequence diagram — upload, replace `DIAGRAM_INGESTION_CYCLE_SVG_URL` |
| `outline.md` | Phase-2 outline (working artifact) |
| `review.md` | Phase-4 quality scorecard (91/100 PASS) |
| `seo-checklist.md` | Phase-5 SEO audit + ready `generateMetadata` snippet |
| `schema.json` | JSON-LD `BlogPosting` + `Person` schema |
| `schema-notes.md` | Notes on injecting the schema into the slug page |
