import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Buttons are set in mono, uppercase, tightly tracked — they read as labels on
 * a printed page rather than as pills. The hover state is an ink fill that
 * rises from the bottom edge, which keeps the interaction on `transform` only.
 */
const buttonVariants = cva(
	[
		"relative isolate inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap",
		"font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em]",
		"transition-colors duration-300 ease-out-quart",
		"outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--signal)]",
		"disabled:pointer-events-none disabled:opacity-45",
		"[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		"before:absolute before:inset-0 before:-z-10 before:translate-y-full before:transition-transform before:duration-[380ms] before:ease-out-expo",
		"hover:before:translate-y-0",
	].join(" "),
	{
		variants: {
			variant: {
				default:
					"border border-[var(--signal)] bg-[var(--signal)] text-[var(--accent-warm-foreground)] before:bg-foreground hover:border-foreground hover:text-background",
				outline:
					"border border-[var(--rule-strong)] bg-transparent text-foreground before:bg-foreground hover:border-foreground hover:text-background",
				secondary:
					"border border-[var(--rule)] bg-secondary text-secondary-foreground before:bg-foreground hover:border-foreground hover:text-background",
				ghost:
					"border border-transparent bg-transparent text-muted-foreground before:bg-foreground hover:text-background",
				destructive:
					"border border-destructive bg-destructive text-white before:bg-foreground hover:border-foreground hover:text-background",
				link: "border-0 bg-transparent p-0 text-[var(--signal)] underline-offset-4 before:hidden hover:underline",
			},
			size: {
				default: "h-10 px-5",
				sm: "h-8 px-3 text-[0.625rem] tracking-[0.12em]",
				lg: "h-12 px-7",
				icon: "size-10 px-0",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
