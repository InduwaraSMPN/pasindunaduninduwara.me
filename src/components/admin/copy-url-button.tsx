"use client";

import { Button } from "@/components/ui/button";

export default function CopyUrlButton({ url }: { url: string }) {
	return (
		<Button
			variant="ghost"
			size="sm"
			className="h-8 px-2"
			onClick={() => {
				navigator.clipboard.writeText(url);
			}}
		>
			Copy URL
		</Button>
	);
}
