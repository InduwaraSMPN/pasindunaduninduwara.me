"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * The hero artwork: a photograph rebuilt as a mosaic of flat square tiles,
 * after the "k" recipe from 21st.dev's ASCII editor, reimplemented on
 * Canvas2D. Each 7px cell becomes one tile in that cell's average colour,
 * divided from its neighbours by a thin dark seam. The photograph keeps its
 * own colours; a light vignette and the recipe's "shimmer" — tiles catching
 * the light at random — finish it.
 *
 * From `dissolveFrom` down to the bottom edge the mosaic comes apart: tiles
 * thin out and fade along a wavering front, so the picture feathers into the
 * page rather than ending on a line.
 *
 * Under the pointer the mosaic gives way to the photograph itself: a
 * feathered circle shows the picture sharp and whole, as if the tiles were a
 * screen you can look through.
 *
 * Everything static is rendered once per size. A frame is then a few
 * `drawImage` calls plus a cols×rows shimmer map, so it stays cheap on
 * phones. It pauses off-screen and in background tabs, and under reduced
 * motion it prints once.
 */

const PRESET = {
	cellSize: 7,
	/** Darkness of the seam between tiles. */
	seam: 0.3,
	vignette: 0.38,
	shimmer: { speed: 1, intensity: 0.6 },
};

/**
 * The window onto the photograph under the pointer. Its radius follows the
 * width of the artwork within limits, in CSS px; `feather` is the share of
 * the radius given to the soft rim.
 */
const REVEAL = { widthShare: 0.11, minRadius: 120, maxRadius: 200, feather: 0.45 };

/**
 * How the mosaic comes apart, over `t` from 0 (dissolve starts) to 1 (bottom
 * edge). Tiles shrink gently toward the centre of their cells, the way dots
 * shrink across a halftone gradient — never below 40 % of a cell, so they
 * stay tiles rather than turning to dust. Only once the picture has opened
 * into a screen do tiles start to drop out, so the gaps never read as bright
 * holes punched into a solid picture, in either theme.
 */
const tileScale = (t: number) => 1 - 0.6 * smoothstep(0.1, 1, t);
const survival = (t: number) => 1 - smoothstep(0.5, 1, t);
const fadeAlpha = (t: number) => 1 - 0.45 * smoothstep(0.4, 1, t);

function clamp01(v: number) {
	return v < 0 ? 0 : v > 1 ? 1 : v;
}

function smoothstep(a: number, b: number, v: number) {
	const t = clamp01((v - a) / (b - a));
	return t * t * (3 - 2 * t);
}

/** Stable per-cell noise in [0, 1). */
function hash(x: number, y: number) {
	const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
	return s - Math.floor(s);
}

/** Smooth value noise in [0, 1): neighbouring cells get similar values. */
function valueNoise(x: number, y: number) {
	const xi = Math.floor(x);
	const yi = Math.floor(y);
	const xf = x - xi;
	const yf = y - yi;
	const u = xf * xf * (3 - 2 * xf);
	const v = yf * yf * (3 - 2 * yf);
	const a = hash(xi, yi);
	const b = hash(xi + 1, yi);
	const c = hash(xi, yi + 1);
	const d = hash(xi + 1, yi + 1);
	return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

interface Frame {
	dpr: number;
	/** How the photo was cover-fitted, in CSS px: offset and scale. */
	cover: { x: number; y: number; scale: number };
	/** Scratch canvas the reveal is composed in, and its radius in CSS px. */
	lens: HTMLCanvasElement;
	lensRadius: number;
	cols: number;
	rows: number;
	/** Device-pixel width of a cell; fractional on 125 % and 150 % displays. */
	cellPx: number;
	/** Where the dissolve starts and ends, in CSS px from the top. */
	fadeStart: number;
	fadeEnd: number;
	mosaic: HTMLCanvasElement;
	vignette: HTMLCanvasElement;
	shimmer: HTMLCanvasElement;
	shimmerData: ImageData;
	/** Per cell: drawn or not, twinkle phase and rate, how much it can light. */
	kept: Uint8Array;
	phase: Float32Array;
	rate: Float32Array;
	gain: Float32Array;
}

function build(
	canvas: HTMLCanvasElement,
	img: HTMLImageElement,
	focusY: number,
	dissolveFrom: number,
): Frame | null {
	const box = canvas.getBoundingClientRect();
	const width = Math.max(1, Math.round(box.width));
	const height = Math.max(1, Math.round(box.height));
	const dpr = Math.min(window.devicePixelRatio || 1, 2);
	canvas.width = Math.round(width * dpr);
	canvas.height = Math.round(height * dpr);
	const W = canvas.width;
	const H = canvas.height;

	const make = (w: number, h: number) => {
		const c = document.createElement("canvas");
		c.width = w;
		c.height = h;
		return c;
	};

	// The grid is whole cells; its last column overhangs the canvas slightly
	// and is clipped, so every tile lines up with the photo.
	const cell = PRESET.cellSize;
	const cols = Math.ceil(width / cell);
	const rows = Math.ceil(height / cell);
	const gridW = cols * cell;
	const gridH = rows * cell;
	const cellPx = cell * dpr;

	// 1. The photo, cover-fitted to the grid. It is only ever sampled, so CSS
	//    resolution is plenty.
	const photo = make(gridW, gridH);
	const p = photo.getContext("2d");
	if (!p) return null;
	const scale = Math.max(gridW / img.naturalWidth, gridH / img.naturalHeight);
	const dw = img.naturalWidth * scale;
	const dh = img.naturalHeight * scale;
	const cover = { x: (gridW - dw) / 2, y: (gridH - dh) * focusY, scale };
	p.imageSmoothingQuality = "high";
	p.drawImage(img, cover.x, cover.y, dw, dh);

	// 2. Average colour per cell — the drawImage downscale does the averaging.
	const sample = make(cols, rows);
	const s = sample.getContext("2d", { willReadFrequently: true });
	if (!s) return null;
	s.imageSmoothingQuality = "high";
	s.drawImage(photo, 0, 0, cols, rows);
	const cells = s.getImageData(0, 0, cols, rows).data;

	// 3. The tiles. Above the dissolve every cell is drawn; below it the
	//    tiles thin out and fade, and the last one ends a cell short of the
	//    edge so nothing is ever cut in half by the bottom of the canvas.
	const fadeEnd = height - cell;
	const fadeStart = Math.min(Math.max(0, dissolveFrom), fadeEnd - cell * 4);
	const band = fadeEnd - fadeStart;

	const mosaic = make(W, H);
	const m = mosaic.getContext("2d");
	if (!m) return null;
	const kept = new Uint8Array(cols * rows);
	const phase = new Float32Array(cols * rows);
	const rate = new Float32Array(cols * rows);
	const gain = new Float32Array(cols * rows);
	// Tile edges snap to whole device pixels, so fractional cell widths on
	// 125 % and 150 % displays never leave hairline gaps between tiles.
	const edge = (n: number) => Math.round(n * cellPx);

	for (let y = 0; y < rows; y++) {
		const top = y * cell;
		if (top + cell > height) break;
		for (let x = 0; x < cols; x++) {
			// A wavering front: each tile's depth is nudged by smooth noise, so the
			// dissolve advances in tongues and clearings rather than along a line.
			const wobble = (valueNoise(x / 7, y / 5) - 0.5) * band * 0.45;
			const t = clamp01((top + cell / 2 + wobble - fadeStart) / band);
			if (hash(x, y) >= survival(t)) continue;

			const i = y * cols + x;
			const r = cells[i * 4];
			const g = cells[i * 4 + 1];
			const b = cells[i * 4 + 2];
			const alpha = fadeAlpha(t);
			kept[i] = 1;
			phase[i] = hash(x + 91, y + 17) * Math.PI * 2;
			rate[i] = 0.5 + hash(x + 7, y + 53) * 1.1;
			// Lit tiles glint more than shadowed ones, and fading ones barely.
			gain[i] = (0.3 + 0.7 * ((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255) ** 0.5) * alpha;
			m.globalAlpha = alpha;
			m.fillStyle = `rgb(${r},${g},${b})`;
			if (t === 0) {
				m.fillRect(edge(x), edge(y), edge(x + 1) - edge(x), edge(y + 1) - edge(y));
				continue;
			}
			// A shrinking tile keeps fractional coordinates on purpose: the canvas
			// anti-aliases its edges, so the gap around it opens from a faint
			// hairline instead of snapping to a hard 1px line. Per-tile jitter
			// grows with depth, keeping the gradient from looking machined.
			const jitter = (hash(x + 31, y + 5) - 0.5) * 0.24 * smoothstep(0, 0.5, t);
			const size = cellPx * Math.min(1, tileScale(t) * (1 + jitter));
			const inset = (cellPx - size) / 2;
			m.fillRect(x * cellPx + inset, y * cellPx + inset, size, size);
		}
	}

	// The seams: one dark line along every column and row boundary, laid only
	// over tiles that were drawn.
	m.globalAlpha = 1;
	m.globalCompositeOperation = "source-atop";
	m.fillStyle = `rgba(0,0,0,${PRESET.seam})`;
	const seamPx = Math.max(1, Math.round(dpr));
	for (let x = 1; x <= cols; x++) m.fillRect(edge(x) - seamPx, 0, seamPx, H);
	for (let y = 1; y <= rows; y++) m.fillRect(0, edge(y) - seamPx, W, seamPx);
	m.globalCompositeOperation = "source-over";

	// 4. A light vignette, applied only where something was drawn.
	const vignette = make(W, H);
	const v = vignette.getContext("2d");
	if (!v) return null;
	const radius = Math.hypot(W, H) / 2;
	const vg = v.createRadialGradient(W / 2, H / 2, radius * 0.45, W / 2, H / 2, radius);
	vg.addColorStop(0, "rgba(0,0,0,0)");
	vg.addColorStop(1, `rgba(0,0,0,${PRESET.vignette})`);
	v.fillStyle = vg;
	v.fillRect(0, 0, W, H);

	const shimmer = make(cols, rows);
	const shimmerCtx = shimmer.getContext("2d");
	if (!shimmerCtx) return null;

	const lensRadius = Math.min(
		REVEAL.maxRadius,
		Math.max(REVEAL.minRadius, width * REVEAL.widthShare),
	);
	const lensSize = Math.ceil(lensRadius * 2 * dpr);

	return {
		dpr,
		cover,
		lens: make(lensSize, lensSize),
		lensRadius,
		cols,
		rows,
		cellPx,
		fadeStart,
		fadeEnd,
		mosaic,
		vignette,
		shimmer,
		shimmerData: shimmerCtx.createImageData(cols, rows),
		kept,
		phase,
		rate,
		gain,
	};
}

interface MosaicFieldProps {
	src: string;
	/** Vertical focus of the cover crop, 0 (top) to 1 (bottom). */
	focusY?: number;
	/**
	 * Where the mosaic starts to come apart, as any CSS length measured from
	 * the top — e.g. `calc(var(--hero-art) * 0.8)`. It dissolves from there to
	 * the bottom edge.
	 */
	dissolveFrom?: string;
	className?: string;
}

export function MosaicField({
	src,
	focusY = 0.5,
	dissolveFrom = "60%",
	className,
}: MosaicFieldProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const probeRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const probe = probeRef.current;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !probe || !ctx) return;

		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const img = new Image();
		img.decoding = "async";
		let frame: Frame | null = null;
		let raf = 0;
		let running = false;
		let visible = true;
		let time = 0;
		let last = performance.now();
		let lastShimmer = -1;
		const pointer = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4, light: 0, target: 0 };

		const updateShimmer = (f: Frame) => {
			const data = f.shimmerData.data;
			const { intensity, speed } = PRESET.shimmer;
			for (let i = 0; i < f.kept.length; i++) {
				if (!f.kept[i]) {
					data[i * 4 + 3] = 0;
					continue;
				}
				// Sharp, occasional peaks: most tiles rest, a few catch the light.
				const wave = 0.5 + 0.5 * Math.sin(time * f.rate[i] * speed * 2.2 + f.phase[i]);
				const glint = wave ** 10 * intensity * f.gain[i];
				data[i * 4] = 255;
				data[i * 4 + 1] = 255;
				data[i * 4 + 2] = 255;
				data[i * 4 + 3] = glint * 130;
			}
			f.shimmer.getContext("2d")?.putImageData(f.shimmerData, 0, 0);
		};

		/**
		 * The photograph itself, seen through a feathered circle under the
		 * pointer. The circle is composed in the lens canvas — mask, then the
		 * photo inside it in the same cover crop the tiles were sampled from —
		 * and fades out through the top of the dissolve, so a sharp patch of
		 * photo never floats among the scattered tiles.
		 */
		const drawReveal = (f: Frame) => {
			const l = f.lens.getContext("2d");
			if (!l) return;
			const size = f.lens.width;
			const centre = size / 2;
			const left = pointer.x - f.lensRadius;
			const top = pointer.y - f.lensRadius;
			// The circle opens a little as it appears.
			const radius = f.lensRadius * f.dpr * (0.75 + 0.25 * pointer.light);

			l.globalCompositeOperation = "source-over";
			l.clearRect(0, 0, size, size);
			const mask = l.createRadialGradient(centre, centre, 0, centre, centre, radius);
			mask.addColorStop(0, "#000");
			mask.addColorStop(1 - REVEAL.feather, "#000");
			mask.addColorStop(1, "rgba(0,0,0,0)");
			l.fillStyle = mask;
			l.fillRect(0, 0, size, size);

			l.globalCompositeOperation = "source-in";
			l.imageSmoothingQuality = "high";
			const { x, y, scale } = f.cover;
			const span = (f.lensRadius * 2) / scale;
			l.drawImage(img, (left - x) / scale, (top - y) / scale, span, span, 0, 0, size, size);

			l.globalCompositeOperation = "destination-in";
			const fadeTo = f.fadeStart + (f.fadeEnd - f.fadeStart) * 0.55;
			const fade = l.createLinearGradient(
				0,
				(f.fadeStart - top) * f.dpr,
				0,
				(fadeTo - top) * f.dpr,
			);
			fade.addColorStop(0, "#000");
			fade.addColorStop(1, "rgba(0,0,0,0)");
			l.fillStyle = fade;
			l.fillRect(0, 0, size, size);
			l.globalCompositeOperation = "source-over";

			ctx.globalCompositeOperation = "source-over";
			ctx.globalAlpha = pointer.light;
			ctx.drawImage(f.lens, left * f.dpr, top * f.dpr);
			ctx.globalAlpha = 1;
		};

		const draw = () => {
			const f = frame;
			if (!f) return;
			const W = canvas.width;
			const H = canvas.height;
			ctx.globalCompositeOperation = "source-over";
			ctx.clearRect(0, 0, W, H);
			ctx.drawImage(f.mosaic, 0, 0);

			if (!reduce) {
				// Glints are laid over the tiles only, never over bare paper.
				ctx.globalCompositeOperation = "source-atop";
				ctx.imageSmoothingEnabled = false;
				ctx.drawImage(f.shimmer, 0, 0, f.cols * f.cellPx, f.rows * f.cellPx);
				ctx.imageSmoothingEnabled = true;
			}

			if (pointer.light > 0.01) drawReveal(f);

			ctx.globalCompositeOperation = "source-atop";
			ctx.drawImage(f.vignette, 0, 0);
			ctx.globalCompositeOperation = "source-over";
		};

		const tick = (now: number) => {
			const dt = Math.min(0.05, (now - last) / 1000);
			last = now;
			time += dt;
			pointer.light += (pointer.target - pointer.light) * Math.min(1, dt * 5);
			pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 9);
			pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 9);
			// The shimmer map only needs ~30 updates a second.
			if (frame && time - lastShimmer > 1 / 30) {
				updateShimmer(frame);
				lastShimmer = time;
			}
			draw();
			raf = requestAnimationFrame(tick);
		};

		const start = () => {
			if (running || reduce || !frame || !visible || document.hidden) return;
			running = true;
			last = performance.now();
			raf = requestAnimationFrame(tick);
		};
		const stop = () => {
			running = false;
			cancelAnimationFrame(raf);
		};

		const rebuild = () => {
			if (!img.complete || img.naturalWidth === 0) return;
			frame = build(canvas, img, focusY, probe.getBoundingClientRect().height);
			if (frame) {
				updateShimmer(frame);
				draw();
				canvas.dataset.ready = "";
				start();
			}
		};

		img.onload = rebuild;
		img.src = src;

		let pending = 0;
		const resize = new ResizeObserver(() => {
			cancelAnimationFrame(pending);
			pending = requestAnimationFrame(() => {
				stop();
				rebuild();
			});
		});
		resize.observe(canvas);

		const onScreen = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			if (visible) start();
			else stop();
		});
		onScreen.observe(canvas);

		const onVisibility = () => (document.hidden ? stop() : start());
		document.addEventListener("visibilitychange", onVisibility);

		// Last known pointer position in the viewport, so a scroll under a still
		// mouse moves the reveal with the page.
		let clientX = -1e4;
		let clientY = -1e4;

		const track = () => {
			const box = canvas.getBoundingClientRect();
			const x = clientX - box.left;
			const y = clientY - box.top;
			const inside = x >= 0 && y >= 0 && x <= box.width && y <= box.height;
			pointer.target = inside ? 1 : 0;
			if (inside) {
				pointer.tx = x;
				pointer.ty = y;
				if (pointer.x < -1e3) {
					pointer.x = x;
					pointer.y = y;
				}
			}
			// Without the animation loop the reveal simply follows the pointer.
			if (reduce) {
				pointer.x = pointer.tx;
				pointer.y = pointer.ty;
				pointer.light = pointer.target;
				draw();
			}
		};
		const onPointer = (e: PointerEvent) => {
			if (e.pointerType === "touch") return;
			clientX = e.clientX;
			clientY = e.clientY;
			track();
		};
		const onScroll = () => {
			if (clientX > -1e3) track();
		};
		const onLeave = () => {
			clientX = -1e4;
			clientY = -1e4;
			track();
		};
		window.addEventListener("pointermove", onPointer, { passive: true });
		window.addEventListener("scroll", onScroll, { passive: true });
		document.documentElement.addEventListener("mouseleave", onLeave);

		return () => {
			stop();
			cancelAnimationFrame(pending);
			resize.disconnect();
			onScreen.disconnect();
			document.removeEventListener("visibilitychange", onVisibility);
			window.removeEventListener("pointermove", onPointer);
			window.removeEventListener("scroll", onScroll);
			document.documentElement.removeEventListener("mouseleave", onLeave);
			img.onload = null;
		};
	}, [src, focusY]);

	return (
		<div aria-hidden="true" className={cn("pointer-events-none", className)}>
			<canvas ref={canvasRef} className="ed-mosaic-field block size-full" />
			{/* Measures `dissolveFrom` in px, whatever CSS length it was given. */}
			<div
				ref={probeRef}
				className="invisible absolute top-0 left-0 w-px"
				style={{ height: dissolveFrom }}
			/>
		</div>
	);
}
