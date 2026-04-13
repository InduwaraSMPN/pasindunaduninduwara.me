import * as React from "react";

import { cn } from "@/lib/utils";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, ...props }, ref) => {
		return (
			<textarea
				className={cn(
					"flex min-h-[80px] w-full rounded-xl border border-input/80 bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/50 transition-all duration-300 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent-warm/15 focus-visible:border-accent-warm/40 hover:border-accent-warm/20 disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Textarea.displayName = "Textarea";

export { Textarea };
