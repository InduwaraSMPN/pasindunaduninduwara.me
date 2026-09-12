"use client";

import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

/**
 * Copy-to-clipboard with a confirmation state. The button reports what
 * happened rather than silently succeeding — feedback belongs in the control.
 */
export default function CopyUrlButton({ url }: { url: string }) {
	const [copied, setCopied] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (timer.current) clearTimeout(timer.current);
		};
	}, []);

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			if (timer.current) clearTimeout(timer.current);
			timer.current = setTimeout(() => setCopied(false), 1600);
		} catch {
			// Clipboard access can be blocked; leave the button unchanged.
			setCopied(false);
		}
	};

	return (
		<Button
			type="button"
			variant="ghost"
			size="sm"
			onClick={copy}
			aria-live="polite"
			className="px-2"
		>
			{copied ? (
				<>
					<Check className="size-3 text-[var(--signal)]" aria-hidden="true" />
					Copied
				</>
			) : (
				"Copy URL"
			)}
		</Button>
	);
}
