"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "@/components/ui/button";

const cycle = ["light", "dark", "system"] as const;

export function ThemeToggle() {
	const { theme, setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => setMounted(true), []);

	const next = () => {
		const i = cycle.indexOf((theme ?? "system") as (typeof cycle)[number]);
		setTheme(cycle[(i + 1) % cycle.length]);
	};

	if (!mounted) {
		return (
			<Button variant="ghost" size="icon">
				<span className="h-[1.2rem] w-[1.2rem]" />
			</Button>
		);
	}

	return (
		<Button variant="ghost" size="icon" onClick={next}>
			{theme === "light" && <Sun className="h-[1.2rem] w-[1.2rem]" />}
			{theme === "dark" && <Moon className="h-[1.2rem] w-[1.2rem]" />}
			{theme === "system" && <Monitor className="h-[1.2rem] w-[1.2rem]" />}
			<span className="sr-only">
				Theme: {theme} (currently {resolvedTheme})
			</span>
		</Button>
	);
}
