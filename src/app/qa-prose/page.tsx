import MarkdownPreviewComponent from "@/components/blog/markdown-preview";

/**
 * TEMPORARY QA ROUTE — delete after review.
 *
 * Exists to verify the `.ed-prose` list styling visually, because a green
 * `tsc` + lint + build has coexisted with visibly broken pages twice on this
 * project. Specifically it checks that ordered lists render their numbers
 * (Tailwind Preflight sets `list-style: none`, which silently stripped them)
 * and that loose lists do not gain a paragraph margin inside every bullet.
 */
const CONTENT = `
## Ordered list — must show 1. 2. 3.

1. Install the dependency
2. Run the migration
3. Verify the cursor pagination

## Unordered list — square markers, signal-coloured

- First bullet
- Second bullet
- Third bullet

## Nested unordered — circle, then square

- Outer item
  - Nested one level
    - Nested two levels

## Loose list — items wrapped in <p>, must not double-space

1. A loose item that has its own paragraph wrapper

2. Another loose item, same list

## Mixed, as a real post would have

1. Prepare the schema
2. Seed the data
   - Users
   - Projects
3. Publish

A closing paragraph so the spacing after a list is visible.
`;

export default function QaProsePage() {
	return (
		<main className="mx-auto max-w-2xl px-6 py-16">
			<p className="ed-eyebrow mb-8">QA — prose list rendering</p>
			<MarkdownPreviewComponent content={CONTENT} />
		</main>
	);
}
