import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Badges are set as mono uppercase tags — square, hairline bordered, no fill.
 * They read as printed labels rather than as chips.
 */
const badgeVariants = cva(
	"inline-flex items-center border px-2 py-0.5 font-mono text-[0.625rem] font-medium uppercase leading-normal tracking-[0.12em] transition-colors duration-200 ease-out-quart focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--signal)]",
	{
		variants: {
			variant: {
				default:
					"border-[var(--signal)] text-[var(--signal)] hover:bg-[var(--signal)] hover:text-[var(--accent-warm-foreground)]",
				secondary:
					"border-[var(--rule-strong)] text-muted-foreground hover:border-foreground hover:text-foreground",
				destructive: "border-destructive bg-destructive text-white hover:opacity-85",
				outline: "border-[var(--rule-strong)] text-foreground",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLSpanElement>,
		VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
	return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
