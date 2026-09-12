"use client";

import { X } from "lucide-react";
import { useState } from "react";

/**
 * A development notice, printed rather than animated. The only motion is a
 * blinking block — the same signal used elsewhere for "live" state.
 */
export function DevelopmentBanner() {
	const [isVisible, setIsVisible] = useState(true);

	if (!isVisible) return null;

	return (
		<div className="bg-[var(--signal)] text-[var(--accent-warm-foreground)]">
			<div className="ed-shell relative flex items-center justify-center gap-3 py-2.5">
				<span
					aria-hidden="true"
					className="size-1.5 shrink-0 animate-ed-blink bg-[var(--accent-warm-foreground)]"
				/>
				<p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.16em]">
					This site is under development
				</p>
				<span className="hidden font-mono text-[0.625rem] uppercase tracking-[0.16em] opacity-70 md:inline">
					— Some features may be incomplete
				</span>

				<button
					type="button"
					onClick={() => setIsVisible(false)}
					aria-label="Dismiss development notice"
					className="absolute right-0 top-1/2 grid size-6 -translate-y-1/2 place-items-center opacity-70 transition-opacity duration-200 hover:opacity-100"
				>
					<X className="size-3.5" />
				</button>
			</div>
		</div>
	);
}
