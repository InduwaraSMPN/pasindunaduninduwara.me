"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface HalftonePortraitProps {
	src: string;
	alt: string;
	caption: string;
	sizes: string;
	priority?: boolean;
	className?: string;
}

/** Screen angle for a single-colour halftone: 45° hides the grid best. */
const SCREEN_ANGLE = Math.PI / 4;

/**
 * Levels applied before screening. The wall behind the sitter should drop out
 * to bare paper and the shirt should close up to solid ink, so the face is
 * carried by the mid-tones — the way a newspaper photo is prepared for press.
 */
const BLACK_POINT = 0.06;
const WHITE_POINT = 0.8;
/** Opens the mid-tones so a face screened in dark ink doesn't close up. */
const MIDTONE_GAMMA = 0.72;

/**
 * Light ink on dark paper has to represent lightness, not darkness, or the
 * print becomes a negative. Highlights are held back so the wall reads as a
 * mid-tone field instead of a lit panel on a dark page.
 */
const LIGHT_INK_CEILING = 0.4;

function clamp01(v: number) {
	return v < 0 ? 0 : v > 1 ? 1 : v;
}

/** Resolves any CSS colour — including oklch — to sRGB bytes. */
function toRgb(color: string): [number, number, number] {
	const probe = document.createElement("canvas");
	probe.width = 1;
	probe.height = 1;
	const ctx = probe.getContext("2d");
	if (!ctx) return [0, 0, 0];
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, 1, 1);
	const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
	return [r, g, b];
}

function luma([r, g, b]: [number, number, number]) {
	return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/**
 * Screens `img` onto `canvas` as round dots on a rotated grid, cropped the
 * same way `object-fit: cover` crops the photograph underneath it.
 */
function screen(canvas: HTMLCanvasElement, img: HTMLImageElement) {
	const box = canvas.getBoundingClientRect();
	if (box.width === 0 || box.height === 0 || img.naturalWidth === 0) return false;

	const dpr = Math.min(window.devicePixelRatio || 1, 2);
	const W = Math.round(box.width * dpr);
	const H = Math.round(box.height * dpr);
	canvas.width = W;
	canvas.height = H;

	const ctx = canvas.getContext("2d");
	if (!ctx) return false;

	const styles = getComputedStyle(canvas);
	const ink = styles.color;
	const lightInk = luma(toRgb(ink)) > luma(toRgb(styles.backgroundColor));
	// A slightly coarser screen on small plates keeps the dots legible.
	const cell = Math.max(4.25, box.width / 76) * dpr;

	// Sample at half-cell resolution: enough to average the tone under a dot.
	const sw = Math.max(1, Math.ceil((W / cell) * 2));
	const sh = Math.max(1, Math.ceil((H / cell) * 2));
	const sample = document.createElement("canvas");
	sample.width = sw;
	sample.height = sh;
	const sctx = sample.getContext("2d", { willReadFrequently: true });
	if (!sctx) return false;

	// Cover-fit by destination rect only. A source rect would be read in the
	// bitmap's own pixels, which differ from `naturalWidth` whenever srcset
	// picked a candidate at a density other than 1 — the crop would drift.
	const scale = Math.max(sw / img.naturalWidth, sh / img.naturalHeight);
	const dw = img.naturalWidth * scale;
	const dh = img.naturalHeight * scale;
	sctx.imageSmoothingQuality = "high";
	sctx.drawImage(img, (sw - dw) / 2, (sh - dh) / 2, dw, dh);
	const pixels = sctx.getImageData(0, 0, sw, sh).data;

	const tone = (x: number, y: number) => {
		const sx = Math.min(sw - 1, Math.max(0, Math.floor((x / W) * sw)));
		const sy = Math.min(sh - 1, Math.max(0, Math.floor((y / H) * sh)));
		const i = (sy * sw + sx) * 4;
		const l = (0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2]) / 255;
		const leveled = clamp01((l - BLACK_POINT) / (WHITE_POINT - BLACK_POINT));
		return lightInk ? leveled * LIGHT_INK_CEILING : 1 - leveled ** MIDTONE_GAMMA;
	};

	ctx.clearRect(0, 0, W, H);
	ctx.fillStyle = ink;
	ctx.beginPath();

	const cos = Math.cos(SCREEN_ANGLE);
	const sin = Math.sin(SCREEN_ANGLE);
	const cx = W / 2;
	const cy = H / 2;
	const reach = Math.ceil(Math.hypot(W, H) / 2 / cell) + 1;
	// Full coverage needs r ≥ cell·√2⁄2; 0.74 lets the shadows close up.
	const maxRadius = cell * 0.74;

	for (let i = -reach; i <= reach; i++) {
		for (let j = -reach; j <= reach; j++) {
			const x = cx + (i * cos - j * sin) * cell;
			const y = cy + (i * sin + j * cos) * cell;
			if (x < -cell || y < -cell || x > W + cell || y > H + cell) continue;
			// Dot area, not radius, is proportional to ink coverage.
			const r = maxRadius * Math.sqrt(tone(x, y));
			if (r < 0.35 * dpr) continue;
			ctx.moveTo(x + r, y);
			ctx.arc(x, y, r, 0, Math.PI * 2);
		}
	}

	ctx.fill();
	return true;
}

/**
 * The portrait, printed. The photograph is screened into a halftone on a
 * canvas — the site's one piece of imagery treated the way a periodical treats
 * a photo. Hovering the plate, or pressing the caption control, shows the
 * photograph itself; the swap is a crossfade, so nothing moves.
 *
 * Without JavaScript, or before the screen is drawn, the grayscale photo shows.
 */
export function HalftonePortrait({
	src,
	alt,
	caption,
	sizes,
	priority,
	className,
}: HalftonePortraitProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const imgRef = useRef<HTMLImageElement>(null);
	const [ready, setReady] = useState(false);
	const [showPhoto, setShowPhoto] = useState(false);

	const draw = useCallback(() => {
		const canvas = canvasRef.current;
		const img = imgRef.current;
		if (!canvas || !img?.complete) return;
		if (screen(canvas, img)) setReady(true);
	}, []);

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

	return (
		<figure
			className={cn("ed-figure group", className)}
			data-view={ready && !showPhoto ? "halftone" : "photo"}
		>
			<div className="relative aspect-[4/5] overflow-hidden bg-[var(--card)]">
				<Image
					ref={imgRef}
					src={src}
					alt={alt}
					fill
					sizes={sizes}
					priority={priority}
					onLoad={draw}
					className={cn(
						"object-cover transition-[opacity,filter] duration-700 ease-out-expo",
						ready ? "grayscale-0" : "grayscale",
						"group-data-[view=halftone]:opacity-0 group-data-[view=halftone]:group-hover:opacity-100",
					)}
				/>
				{/* The screen is a rendering of the photo above, which carries the alt text. */}
				<div
					aria-hidden="true"
					className={cn(
						"absolute inset-0 transition-opacity duration-700 ease-out-expo",
						"opacity-0 group-data-[view=halftone]:opacity-100 group-data-[view=halftone]:group-hover:opacity-0",
					)}
				>
					<canvas ref={canvasRef} className="block size-full bg-[var(--card)] text-foreground" />
				</div>
			</div>
			<figcaption className="mt-3.5 flex items-baseline justify-between gap-3">
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
		</figure>
	);
}
