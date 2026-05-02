# Schema notes for `schema.json`

This file accompanies `schema.json` (the BlogPosting + Person JSON-LD for the
post `incremental-entity-provider-and-cursor-pagination`).

## TODO: populate `sameAs` on the Person

The `Person` object currently has `"sameAs": []` in both the `author` and
`publisher` slots. Replace those empty arrays with the canonical profile URLs
once they are confirmed. Suggested entries:

- GitHub profile, e.g. `https://github.com/<handle>`
- LinkedIn profile, e.g. `https://www.linkedin.com/in/<handle>/`
- X / Twitter profile, e.g. `https://x.com/<handle>`
- Mastodon profile, e.g. `https://<instance>/@<handle>`
- Personal email as a `mailto:` URI, e.g. `mailto:pasindu@marketrix.ai`

Keep the same array in both `author.sameAs` and `publisher.sameAs` so the two
references resolve to a single identity. If you later split publisher into a
distinct entity, give it its own `@id` and `sameAs`.

## How to inject this schema into the Next.js page

`@uiw/react-markdown-preview` escapes raw HTML inside markdown, so a
`<script type="application/ld+json">` tag placed inside the `.md` body will
not render. Inject the schema at the page-component level instead.

### Pattern (App Router)

In the route segment that renders the post, e.g.
`app/blog/[slug]/page.tsx`:

```tsx
import Script from "next/script";
import schema from "@/blog/schema.json"; // adjust path to your import alias

export default function BlogPostPage() {
  return (
    <>
      <Script
        id="ld-json-blogposting"
        type="application/ld+json"
        // JSON.stringify avoids HTML-escaping surprises
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* ...the MarkdownPreview component renders the post body here... */}
    </>
  );
}
```

### Notes

- Use `next/script` with `type="application/ld+json"` rather than a bare
  `<script>` tag. Next.js will keep it out of the hydration path.
- Do not place the JSON-LD inside the markdown file. The markdown renderer
  escapes raw HTML, so the `<script>` would appear as visible text.
- If you generate one schema file per post, import it directly. If you
  centralize, fetch the matching schema by slug at build time and pass it as
  a prop.
- Validate the rendered page with Google's Rich Results Test
  (`https://search.google.com/test/rich-results`) and the Schema.org
  validator (`https://validator.schema.org/`) once deployed.

## Validation summary

The JSON document conforms to schema.org `BlogPosting` requirements that
Google's rich-results parser checks:

- `headline`, `image` (as array of URLs, not a bare string), `datePublished`,
  `dateModified`, `author` (typed `Person`), and `publisher` are all present.
- `mainEntityOfPage` points at the canonical URL via `@id`.
- `inLanguage`, `keywords`, `articleSection`, and `wordCount` are included
  for richer indexing.
- The `Person` is reused in both `author` and `publisher` via a shared
  `@id`, which keeps the identity graph clean for AI extraction.
