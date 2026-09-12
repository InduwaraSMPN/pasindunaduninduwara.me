"use client";

import MarkdownPreview from "@uiw/react-markdown-preview";
import { useTheme } from "next-themes";

interface MarkdownPreviewComponentProps {
	content: string;
	className?: string;
}

/**
 * Article body. The library renders raw HTML, so the few elements that need
 * editorial treatment — code, blockquotes — are styled inline against the
 * project's own tokens rather than a hard-coded palette.
 */
export default function MarkdownPreviewComponent({
	content,
	className = "",
}: MarkdownPreviewComponentProps) {
	const { resolvedTheme } = useTheme();
	const colorMode = resolvedTheme === "dark" ? "dark" : "light";

	return (
		<div className={`ed-prose ${className}`}>
			<MarkdownPreview
				source={content.replace(/\\n/g, "\n")}
				style={{
					backgroundColor: "transparent",
					color: "inherit",
					fontFamily: "inherit",
					fontSize: "inherit",
				}}
				wrapperElement={{
					"data-color-mode": colorMode,
				}}
				data-color-mode={colorMode}
				rehypeRewrite={(node, _index, parent) => {
					if (node.type === "element" && node.tagName === "pre") {
						node.properties = {
							...node.properties,
							style:
								"background-color: var(--muted); border: 1px solid var(--rule); padding: 1rem 1.125rem; margin: 1.5rem 0; overflow-x: auto; font-size: 0.8125rem; line-height: 1.7;",
						};
					}
					if (
						node.type === "element" &&
						node.tagName === "code" &&
						parent?.type === "element" &&
						parent.tagName !== "pre"
					) {
						node.properties = {
							...node.properties,
							style:
								"background-color: var(--muted); padding: 0.15rem 0.35rem; font-size: 0.85em; color: var(--foreground);",
						};
					}
					if (node.type === "element" && node.tagName === "blockquote") {
						node.properties = {
							...node.properties,
							style:
								"border-left: 2px solid var(--signal); padding-left: 1.375rem; margin: 1.75rem 0; font-family: var(--font-serif), Georgia, serif; font-style: italic; font-size: 1.125em; line-height: 1.55; color: var(--foreground);",
						};
					}
				}}
			/>
		</div>
	);
}
