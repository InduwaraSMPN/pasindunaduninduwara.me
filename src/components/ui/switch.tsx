"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * A square toggle. The track is a hairline rule that fills with the signal
 * colour; the thumb is a hard block that slides — no pill, no shadow.
 */
function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
	return (
		<SwitchPrimitive.Root
			data-slot="switch"
			className={cn(
				"peer inline-flex h-5 w-9 shrink-0 items-center border border-[var(--rule-strong)] bg-transparent",
				"transition-colors duration-200 ease-out-quart",
				"data-[state=checked]:border-[var(--signal)] data-[state=checked]:bg-[var(--signal)]",
				"hover:border-foreground",
				"outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--signal)]",
				"disabled:cursor-not-allowed disabled:opacity-45",
				className,
			)}
			{...props}
		>
			<SwitchPrimitive.Thumb
				data-slot="switch-thumb"
				className={cn(
					"pointer-events-none block size-3 bg-[var(--rule-strong)]",
					"transition-transform duration-200 ease-out-quart",
					"data-[state=unchecked]:translate-x-[0.125rem]",
					"data-[state=checked]:translate-x-[1.25rem] data-[state=checked]:bg-[var(--accent-warm-foreground)]",
				)}
			/>
		</SwitchPrimitive.Root>
	);
}

export { Switch };
