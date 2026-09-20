"use client";

import { X } from "lucide-react";
import { useState } from "react";

/**
 * A standing note that the site is never finished, printed rather than
 * animated. The only motion is a blinking block — the same signal used
 * elsewhere for "live" state, which is what the note is about.
 */
export function DevelopmentBanner() {
	const [isVisible, setIsVisible] = useState(true);

	if (!isVisible) return null;

	return (
		<div className="bg-[var(--signal)] text-[var(--accent-warm-foreground)]">
			{/* Side padding keeps a wrapped line clear of the dismiss button. */}
			<div className="ed-shell relative flex items-center justify-center gap-3 py-2.5">
				<p className="flex items-center gap-3 px-6 text-center font-mono text-[0.6875rem] font-medium tracking-[0.02em] text-balance">
					<span
						aria-hidden="true"
						className="size-1.5 shrink-0 animate-ed-blink bg-[var(--accent-warm-foreground)]"
					/>
					Under construction by design, a living project that's always improving.
				</p>

				<button
					type="button"
					onClick={() => setIsVisible(false)}
					aria-label="Dismiss notice"
					className="absolute right-0 top-1/2 grid size-6 -translate-y-1/2 place-items-center opacity-70 transition-opacity duration-200 hover:opacity-100"
				>
					<X className="size-3.5" />
				</button>
			</div>
		</div>
	);
}
