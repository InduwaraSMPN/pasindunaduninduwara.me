"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { type HalftoneScreen, screenImage } from "@/lib/halftone";
import { cn } from "@/lib/utils";

interface HalftoneImageProps {
	src: string;
	alt: string;
	sizes: string;
	priority?: boolean;
	/** `coarse` for a portrait; `fine` keeps type inside a screenshot legible. */
	screen?: HalftoneScreen;
	/** Show the photograph instead of the print — a pinned toggle. */
	showPhoto?: boolean;
	onReady?: () => void;
	/** Sizing for the plate itself, e.g. an aspect-ratio utility. */
	className?: string;
}

/**
 * A photograph printed as a halftone. The screen is drawn once onto a canvas
 * laid over the real image; hovering or focusing the nearest `.group` ancestor
 * crossfades to the photograph in full colour, so the print reads as a proof
 * of the picture underneath it.
 *
 * Before the screen is drawn — or without JavaScript — the photo shows in
 * grayscale, so nothing is ever blank.
 */
export function HalftoneImage({
	src,
	alt,
	sizes,
	priority,
	screen = "coarse",
	showPhoto = false,
	onReady,
	className,
}: HalftoneImageProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const imgRef = useRef<HTMLImageElement>(null);
	const [ready, setReady] = useState(false);

	const draw = useCallback(() => {
		const canvas = canvasRef.current;
		const img = imgRef.current;
		if (!canvas || !img?.complete) return;
		if (screenImage(canvas, img, screen)) setReady(true);
	}, [screen]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		// The image may already be decoded by the time this runs.
		draw();

		let frame = 0;
		const schedule = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(draw);
		};

		const resize = new ResizeObserver(schedule);
		resize.observe(canvas);

		// Ink and paper change with the theme; the screen is re-inked to match.
		const theme = new MutationObserver(schedule);
		theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

		return () => {
			cancelAnimationFrame(frame);
			resize.disconnect();
			theme.disconnect();
		};
	}, [draw]);

	useEffect(() => {
		if (ready) onReady?.();
	}, [ready, onReady]);

	return (
		<div
			className={cn("ed-halftone relative overflow-hidden bg-[var(--card)]", className)}
			data-view={ready && !showPhoto ? "halftone" : "photo"}
			data-ready={ready ? "" : undefined}
		>
			<Image
				ref={imgRef}
				src={src}
				alt={alt}
				fill
				sizes={sizes}
				priority={priority}
				onLoad={draw}
				className="ed-halftone-photo object-cover"
			/>
			{/* The screen is a rendering of the photo above, which carries the alt text. */}
			<div aria-hidden="true" className="ed-halftone-screen absolute inset-0">
				<canvas ref={canvasRef} className="block size-full bg-[var(--card)] text-foreground" />
			</div>
		</div>
	);
}
