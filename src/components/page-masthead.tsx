"use client";

import type { ReactNode } from "react";
import { MaskedLines } from "@/components/ui/scroll-reveal";
import { cn } from "@/lib/utils";

interface PageMastheadProps {
	/** Small mono line above the rule — the page's category. */
	eyebrow: string;
	/** Headline split into lines. Each line gets its own mask and rises in turn. */
	lines: ReactNode[];
	/** Optional standfirst below the rule. */
	lede?: ReactNode;
	/** Optional mono note, set at the far right of the eyebrow row. */
	note?: ReactNode;
	className?: string;
}

/**
 * Every inner page opens the same way: a category line, a drawn rule, the
 * headline revealed line by line, then an optional standfirst. Consistency
 * here is what makes the site feel like one publication.
 */
export function PageMasthead({ eyebrow, lines, lede, note, className }: PageMastheadProps) {
	return (
		<header className={cn("ed-shell pt-10 md:pt-14", className)}>
			<div className="flex flex-wrap items-center gap-x-4 gap-y-2">
				<span className="ed-eyebrow">{eyebrow}</span>
				<span aria-hidden="true" className="h-px min-w-8 flex-1 bg-[var(--rule-strong)]" />
				{note ? <span className="ed-eyebrow max-sm:w-full">{note}</span> : null}
			</div>

			<div className="ed-crop mt-10 md:mt-12">
				<h1 className="ed-display">
					<MaskedLines lines={lines} />
				</h1>
			</div>

			{lede ? (
				<p className="mt-12 max-w-[52ch] border-t border-[var(--rule-strong)] pt-8 text-base leading-relaxed text-muted-foreground md:text-lg">
					{lede}
				</p>
			) : null}
		</header>
	);
}
