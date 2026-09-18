/**
 * Halftone screening for the site's photographs.
 *
 * Every photograph is printed the way a periodical prints one: round dots on a
 * 45° grid, dot area proportional to tone, in the theme's ink. The portrait
 * uses a coarse screen; project and post images use a fine one so type and
 * interface detail inside a screenshot survive the screening.
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

export type HalftoneScreen = "coarse" | "fine";

interface ScreenSpec {
	/** Dots across the plate; the finer, the more detail survives. */
	cellsAcross: number;
	/** Smallest cell, in CSS px, that still prints as visible dots. */
	minCell: number;
	/**
	 * Levels applied before screening, the way a photo is prepared for press:
	 * tones past the white point drop out to bare paper, tones below the black
	 * point close up to solid ink, and the gamma opens or holds the mid-tones.
	 */
	blackPoint: number;
	whitePoint: number;
	gamma: number;
	/**
	 * Light ink on dark paper must represent lightness, not darkness, or the
	 * print becomes a negative; the ceiling holds highlights back from a glare.
	 */
	lightInkCeiling: number;
}

const SCREENS: Record<HalftoneScreen, ScreenSpec> = {
	/** The portrait: coarse and contrasty, the wall dropped out to paper. */
	coarse: {
		cellsAcross: 76,
		minCell: 2.6,
		blackPoint: 0.06,
		whitePoint: 0.8,
		gamma: 0.72,
		lightInkCeiling: 0.4,
	},
	/**
	 * Screenshots: a fine ruling and gentle levels, so logos, headlines and
	 * light interface greys survive the screen instead of dropping out.
	 */
	fine: {
		cellsAcross: 230,
		minCell: 2.2,
		blackPoint: 0.03,
		whitePoint: 0.94,
		gamma: 0.9,
		lightInkCeiling: 0.72,
	},
};

export function screenImage(
	canvas: HTMLCanvasElement,
	img: HTMLImageElement,
	screen: HalftoneScreen = "coarse",
) {
	const { cellsAcross, minCell, blackPoint, whitePoint, gamma, lightInkCeiling } = SCREENS[screen];
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
	// The ruling scales with the plate, down to a floor that still reads as dots.
	const cell = Math.max(minCell, box.width / cellsAcross) * dpr;

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
		const leveled = clamp01((l - blackPoint) / (whitePoint - blackPoint));
		return lightInk ? leveled * lightInkCeiling : 1 - leveled ** gamma;
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
