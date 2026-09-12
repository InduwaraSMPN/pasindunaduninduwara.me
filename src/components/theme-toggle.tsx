"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

const cycle = ["light", "dark", "system"] as const;

/**
 * The theme control is a labelled switch, not an icon button — it names the
 * current state, which is more useful and more in keeping with the type system.
 */
export function ThemeToggle() {
	const { theme, setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => setMounted(true), []);

	const next = () => {
		const i = cycle.indexOf((theme ?? "system") as (typeof cycle)[number]);
		setTheme(cycle[(i + 1) % cycle.length]);
	};

	const base =
		"inline-flex h-8 items-center gap-1.5 border border-[var(--rule)] px-2.5 font-mono text-[0.625rem] font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors duration-200 ease-out-quart hover:border-foreground hover:bg-foreground hover:text-background";

	if (!mounted) {
		return (
			<span aria-hidden="true" className={base}>
				<span className="size-3" />
				<span className="w-8" />
			</span>
		);
	}

	const current = theme ?? "system";

	return (
		<button
			type="button"
			onClick={next}
			className={base}
			aria-label={`Theme: ${current} (currently ${resolvedTheme}). Click to change.`}
		>
			{current === "light" ? <Sun className="size-3" /> : null}
			{current === "dark" ? <Moon className="size-3" /> : null}
			{current === "system" ? <Monitor className="size-3" /> : null}
			{current}
		</button>
	);
}
