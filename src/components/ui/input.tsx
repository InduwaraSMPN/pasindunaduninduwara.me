import * as React from "react";

import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Inputs are rules, not boxes — the editorial convention of writing on a line.
 * Focus thickens the rule to the signal colour rather than adding a glow.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return <input type={type} className={cn("ed-field", className)} ref={ref} {...props} />;
	},
);
Input.displayName = "Input";

export { Input };
