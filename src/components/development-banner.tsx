"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function DevelopmentBanner() {
	const [isVisible, setIsVisible] = useState(true);

	if (!isVisible) return null;

	return (
		<div className="bg-accent-warm text-accent-warm-foreground px-4 py-2 relative overflow-hidden">
			{/* Subtle shimmer overlay */}
			<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent animate-shimmer bg-[length:200%_100%]" />
			<div className="container mx-auto flex items-center justify-center text-center relative">
				<div className="flex items-center gap-2.5">
					<span className="relative flex h-2 w-2">
						<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-warm-foreground opacity-50" />
						<span className="relative inline-flex rounded-full h-2 w-2 bg-accent-warm-foreground" />
					</span>
					<span className="font-heading font-medium text-xs tracking-wide">
						This website is under development
					</span>
					<span className="hidden md:inline text-xs opacity-60 font-light">
						— Some features may not work as expected
					</span>
				</div>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => setIsVisible(false)}
					className="absolute right-1 top-1/2 -translate-y-1/2 text-accent-warm-foreground/80 hover:text-accent-warm-foreground hover:bg-accent-warm-foreground/15 h-6 w-6 p-0 rounded-full"
					aria-label="Dismiss banner"
				>
					<X className="h-3.5 w-3.5" />
				</Button>
			</div>
		</div>
	);
}
