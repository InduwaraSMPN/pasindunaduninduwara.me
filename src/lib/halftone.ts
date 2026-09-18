/**
 * Halftone screening for the portrait.
 *
 * The photograph is printed the way a periodical prints one: round dots on a
 * 45° grid, dot area proportional to tone, in the theme's ink.
 *
 * Runs once per image (and again on resize or theme change) — never per frame.
 */

export type Rgb = [number, number, number];

/** Resolves any CSS colour string — oklch, lab, hex — to sRGB bytes. */
export function toRgb(color: string): Rgb {
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

export function luma([r, g, b]: Rgb) {
	return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function clamp01(v: number) {
	return v < 0 ? 0 : v > 1 ? 1 : v;
}

/** Screen angle for a single-colour halftone: 45° hides the grid best. */
const SCREEN_ANGLE = Math.PI / 4;

/**
 * Levels applied before screening. Light backgrounds drop out to bare paper,
 * deep shadows close up to solid ink, and a gamma opens the mid-tones so a
 * face does not fill in — the way a photo is prepared for press.
 */
const BLACK_POINT = 0.06;
const WHITE_POINT = 0.8;
const MIDTONE_GAMMA = 0.72;

/**
 * Light ink on dark paper must represent lightness, not darkness, or the
 * print becomes a negative. Highlights are held back so a pale wall reads as
 * a mid-tone field rather than a lit panel on a dark page.
 */
const LIGHT_INK_CEILING = 0.4;

export function screenImage(canvas: HTMLCanvasElement, img: HTMLImageElement) {
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
	// Small plates get a finer screen, down to a floor that still reads as dots.
	const cell = Math.max(2.6, box.width / 76) * dpr;

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

	/**
	 * Ink wanted at (x, y), 0–1. With dark ink that is the image's darkness;
	 * with light ink on dark paper it is the image's (held-back) lightness.
	 */
	const coverage = (x: number, y: number) => {
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
			// Dot area, not radius, is proportional to coverage.
			const r = maxRadius * Math.sqrt(coverage(x, y));
			if (r < 0.35 * dpr) continue;
			ctx.moveTo(x + r, y);
			ctx.arc(x, y, r, 0, Math.PI * 2);
		}
	}

	ctx.fill();
	return true;
}
