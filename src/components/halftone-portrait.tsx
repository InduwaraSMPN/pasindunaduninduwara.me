"use client";

import { type ReactNode, useCallback, useState } from "react";
import { HalftoneImage } from "@/components/halftone-image";
import { cn } from "@/lib/utils";

interface HalftonePortraitProps {
	src: string;
	alt: string;
	caption: ReactNode;
	sizes: string;
	priority?: boolean;
	className?: string;
}

/**
 * The portrait, printed. The caption sits above the plate, level with the
 * "Contents" label beside it, so on desktop the plate's top and bottom edges
 * line up with the first and last rules of the contents list.
 *
 * Hovering the plate shows the photograph; the caption control pins it, which
 * is also the only way to see it on a touch screen.
 */
export function HalftonePortrait({
	src,
	alt,
	caption,
	sizes,
	priority,
	className,
}: HalftonePortraitProps) {
	const [ready, setReady] = useState(false);
	const [showPhoto, setShowPhoto] = useState(false);
	const onReady = useCallback(() => setReady(true), []);

	return (
		<figure className={cn("group", className)}>
			<figcaption className="mb-3 flex items-baseline justify-between gap-3">
				<span className="ed-label">{caption}</span>
				{ready ? (
					<button
						type="button"
						aria-pressed={showPhoto}
						onClick={() => setShowPhoto((v) => !v)}
						className="ed-label ed-link shrink-0 whitespace-nowrap transition-colors duration-200 hover:text-foreground"
					>
						{showPhoto ? "Show print" : "Show photo"}
					</button>
				) : null}
			</figcaption>
			<div className="ed-figure">
				<HalftoneImage
					src={src}
					alt={alt}
					sizes={sizes}
					priority={priority}
					showPhoto={showPhoto}
					onReady={onReady}
					className="aspect-[4/5]"
				/>
			</div>
		</figure>
	);
}
