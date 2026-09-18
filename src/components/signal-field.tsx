"use client";

import { useEffect, useRef } from "react";
import { luma, toRgb } from "@/lib/halftone";
import { cn } from "@/lib/utils";

/**
 * The hero artwork: a halftone "signal" — a warm mass of dots printed in two
 * plates, signal and ink, drifting slowly like weather. Under the pointer the
 * dots swell, the way ink spreads where a press roller bears down.
 *
 * It is WebGL point sprites, one vertex per dot. The field is evaluated per
 * dot in the vertex shader, so a full-width hero is ~20k vertices a frame —
 * cheap enough for mid-range phones. It pauses off-screen and in background
 * tabs, and under `prefers-reduced-motion` it prints one still frame.
 */

const VERT = `
attribute vec2 aPos;
uniform vec2 uRes;
uniform float uDpr;
uniform float uTime;
uniform float uCell;
uniform vec2 uPointer;
uniform float uLens;
uniform float uPlate;
uniform vec2 uFade;
uniform float uInkGain;
uniform float uScale;
uniform vec3 uSun;
varying float vSize;

float hash(vec2 p) {
	p = fract(p * vec2(123.34, 456.21));
	p += dot(p, p + 45.32);
	return fract(p.x * p.y);
}

float noise(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(
		mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
		mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
		u.y
	);
}

float fbm(vec2 p) {
	float v = 0.0;
	float a = 0.5;
	mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
	for (int i = 0; i < 5; i++) {
		v += a * noise(p);
		p = m * p;
		a *= 0.5;
	}
	return v;
}

void main() {
	float t = uTime;
	// Large, slow forms: a low base frequency keeps the weather calm. The
	// scale follows the viewport so a phone gets several forms, not one.
	vec2 p = aPos / uScale;
	// Domain warping gives the field its weather-like folds.
	vec2 q = vec2(fbm(p + vec2(0.0, 0.06 * t)), fbm(p + vec2(5.2, 1.3) - vec2(0.05 * t, 0.0)));
	vec2 r = vec2(
		fbm(p + 3.0 * q + vec2(1.7, 9.2) + 0.035 * t),
		fbm(p + 3.0 * q + vec2(8.3, 2.8) - 0.03 * t)
	);
	float f = fbm(p + 2.0 * r);

	// The weather is heaviest at the top and dissolves, along a warped edge,
	// into the paper the headline is printed on. Slightly denser to the right.
	float edge = (fbm(p * 0.8 + 4.0 * q - 0.02 * t) - 0.5) * 140.0;
	float mass = 1.0 - smoothstep(uFade.x, uFade.y, aPos.y + edge);
	mass *= 0.65 + 0.35 * smoothstep(0.0, uRes.x, aPos.x);

	// The composition's anchor: a sun, textured by the same weather, setting
	// into the paper along the fade. It keeps the field from ever being empty.
	float rim = (fbm(p * 1.3 + 2.0 * q + 0.03 * t) - 0.5) * 0.3 * uSun.z;
	float sun = 1.0 - smoothstep(0.52 * uSun.z, uSun.z, distance(aPos, uSun.xy) + rim);
	sun *= 1.0 - smoothstep(uFade.x, uFade.y, aPos.y + edge);

	// Thresholded so open paper survives between the masses, like sky.
	float tone = uPlate < 0.5
		? max(smoothstep(0.4, 0.74, f) * mass, sun * (0.5 + 0.5 * smoothstep(0.3, 0.7, f)))
		: max(smoothstep(0.6, 0.86, f) * mass * mass, sun * smoothstep(0.52, 0.8, f)) * uInkGain;

	float d = distance(aPos, uPointer);
	tone += uLens * (uPlate < 0.5 ? 0.6 : 0.15) * exp(-(d * d) / (2.0 * 120.0 * 120.0));
	tone = clamp(tone, 0.0, 1.0);

	// Dot area, not radius, carries the tone. At full tone the dots just
	// touch, so the field never closes up into a flat fill.
	float radius = uCell * 0.52 * sqrt(tone);
	vSize = radius * 2.0 * uDpr + 1.0;
	gl_PointSize = radius < 0.25 ? 0.0 : vSize;
	vec2 clip = aPos / uRes * 2.0 - 1.0;
	gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;
uniform vec3 uColor;
uniform float uScreen;
varying float vSize;

void main() {
	float d = length(gl_PointCoord - 0.5) * 2.0;
	float a = clamp((1.0 - d) * vSize * 0.5, 0.0, 1.0);
	if (a <= 0.0) discard;
	// Multiply on light paper, screen on dark paper — overprinted plates.
	vec3 col = uScreen > 0.5 ? uColor * a : mix(vec3(1.0), uColor, a);
	gl_FragColor = vec4(col, 1.0);
}
`;

/** One plate's slice of the shared vertex buffer. */
interface Plate {
	start: number;
	count: number;
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
	const shader = gl.createShader(type);
	if (!shader) return null;
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}

/** Rotated screen grid covering a w×h rectangle, as flat [x, y, …] pairs. */
function grid(w: number, h: number, cell: number, angle: number) {
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	const cx = w / 2;
	const cy = h / 2;
	const reach = Math.ceil(Math.hypot(w, h) / 2 / cell) + 1;
	const out: number[] = [];
	for (let i = -reach; i <= reach; i++) {
		for (let j = -reach; j <= reach; j++) {
			const x = cx + (i * cos - j * sin) * cell;
			const y = cy + (i * sin + j * cos) * cell;
			if (x < -cell || y < -cell || x > w + cell || y > h + cell) continue;
			out.push(x, y);
		}
	}
	return out;
}

export function SignalField({ className }: { className?: string }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const gl = canvas.getContext("webgl", {
			alpha: false,
			antialias: false,
			depth: false,
			stencil: false,
			premultipliedAlpha: false,
			powerPreference: "low-power",
		});
		if (!gl) {
			canvas.dataset.fallback = "";
			return;
		}

		const vs = compile(gl, gl.VERTEX_SHADER, VERT);
		const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
		const program = gl.createProgram();
		if (!vs || !fs || !program) {
			canvas.dataset.fallback = "";
			return;
		}
		gl.attachShader(program, vs);
		gl.attachShader(program, fs);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			canvas.dataset.fallback = "";
			return;
		}
		// biome-ignore lint/correctness/useHookAtTopLevel: WebGL's useProgram, not a React hook
		gl.useProgram(program);

		const u = (name: string) => gl.getUniformLocation(program, name);
		const loc = {
			res: u("uRes"),
			dpr: u("uDpr"),
			time: u("uTime"),
			cell: u("uCell"),
			pointer: u("uPointer"),
			lens: u("uLens"),
			plate: u("uPlate"),
			fade: u("uFade"),
			inkGain: u("uInkGain"),
			scale: u("uScale"),
			sun: u("uSun"),
			color: u("uColor"),
			screen: u("uScreen"),
		};
		const aPos = gl.getAttribLocation(program, "aPos");
		const buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.enableVertexAttribArray(aPos);
		gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
		gl.enable(gl.BLEND);

		// Motion only where it is cheap: never under reduced motion, never on a
		// software rasteriser, and it stops itself if frames run slow (below).
		const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
		const renderer = debugInfo ? String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)) : "";
		const reduce =
			window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
			/swiftshader|llvmpipe|software|basic render/i.test(renderer);
		let plates: Plate[] = [];
		let width = 0;
		let height = 0;
		let dpr = 1;
		let paper: [number, number, number] = [1, 1, 1];
		let ink: [number, number, number] = [0, 0, 0];
		let signal: [number, number, number] = [1, 0.3, 0.2];
		let darkPaper = false;

		const readColors = () => {
			const styles = getComputedStyle(canvas);
			const toUnit = (c: string) => toRgb(c).map((v) => v / 255) as [number, number, number];
			const paperCss = styles.backgroundColor;
			const inkCss = styles.getPropertyValue("--foreground").trim() || "#000";
			paper = toUnit(paperCss);
			ink = toUnit(inkCss);
			signal = toUnit(styles.color);
			darkPaper = luma(toRgb(inkCss)) > luma(toRgb(paperCss));
		};

		const layout = () => {
			const box = canvas.getBoundingClientRect();
			width = Math.max(1, box.width);
			height = Math.max(1, box.height);
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = Math.round(width * dpr);
			canvas.height = Math.round(height * dpr);
			gl.viewport(0, 0, canvas.width, canvas.height);

			// Screen ruling scales with the viewport: coarse enough to read as dots.
			const cell = width < 640 ? 8 : 10;
			const signalGrid = grid(width, height, cell, (15 * Math.PI) / 180);
			const inkGrid = grid(width, height, cell, Math.PI / 4);
			// Signal screened at 15°, ink at 45°: the classic offset between plates
			// that keeps overprinted dots from forming a moiré.
			plates = [
				{ start: 0, count: signalGrid.length / 2 },
				{ start: signalGrid.length / 2, count: inkGrid.length / 2 },
			];
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([...signalGrid, ...inkGrid]), gl.STATIC_DRAW);
			gl.uniform1f(loc.cell, cell);

			// Dense for the top fifth, gone before the dateline that sits at 84%.
			gl.uniform2f(loc.fade, height * 0.16, height * 0.74);
			gl.uniform1f(loc.scale, Math.min(640, Math.max(240, width * 0.42)));
			// The sun sits high and right; on phones it is proportionally larger.
			const narrow = width < 768;
			gl.uniform3f(
				loc.sun,
				width * (narrow ? 0.72 : 0.77),
				height * (narrow ? 0.26 : 0.3),
				narrow ? width * 0.6 : Math.min(width * 0.27, 520),
			);
		};

		const pointer = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4, lens: 0, target: 0 };
		const onPointer = (e: PointerEvent) => {
			if (e.pointerType === "touch") return;
			const box = canvas.getBoundingClientRect();
			const x = e.clientX - box.left;
			const y = e.clientY - box.top;
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
		};

		let time = 8;
		let last = performance.now();
		let frame = 0;
		let running = false;

		const draw = () => {
			gl.clearColor(paper[0], paper[1], paper[2], 1);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.uniform2f(loc.res, width, height);
			gl.uniform1f(loc.dpr, dpr);
			gl.uniform1f(loc.time, time);
			gl.uniform2f(loc.pointer, pointer.x, pointer.y);
			gl.uniform1f(loc.lens, pointer.lens);
			gl.uniform1f(loc.screen, darkPaper ? 1 : 0);
			// Light ink screened over the signal burns toward white; hold it back.
			gl.uniform1f(loc.inkGain, darkPaper ? 0.45 : 0.9);
			if (darkPaper) gl.blendFunc(gl.ONE_MINUS_DST_COLOR, gl.ONE);
			else gl.blendFunc(gl.DST_COLOR, gl.ZERO);
			for (const [index, plate] of plates.entries()) {
				gl.uniform1f(loc.plate, index);
				const color = index === 0 ? signal : ink;
				gl.uniform3f(loc.color, color[0], color[1], color[2]);
				gl.drawArrays(gl.POINTS, plate.start, plate.count);
			}
		};

		// Frame-time governor: if the device can't hold ~30fps over a couple of
		// seconds of visible frames, the field settles into a still print.
		let slowFrames = 0;
		let sampledFrames = 0;
		let settled = false;

		const tick = (now: number) => {
			const raw = (now - last) / 1000;
			const dt = Math.min(0.05, raw);
			last = now;
			sampledFrames += 1;
			if (raw > 1 / 30 && raw < 0.5) slowFrames += 1;
			if (sampledFrames >= 120) {
				if (slowFrames > 60) {
					settled = true;
					draw();
					stop();
					return;
				}
				sampledFrames = 0;
				slowFrames = 0;
			}
			time += dt * 0.32;
			pointer.lens += (pointer.target - pointer.lens) * Math.min(1, dt * 6);
			pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 10);
			pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 10);
			draw();
			frame = requestAnimationFrame(tick);
		};

		const start = () => {
			if (running || reduce || settled) return;
			running = true;
			last = performance.now();
			frame = requestAnimationFrame(tick);
		};
		const stop = () => {
			running = false;
			cancelAnimationFrame(frame);
		};

		readColors();
		layout();
		draw();

		const visibility = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting && !document.hidden) start();
			else stop();
		});
		visibility.observe(canvas);

		const onVisibility = () => {
			if (document.hidden) stop();
			else if (canvas.getBoundingClientRect().bottom > 0) start();
		};
		document.addEventListener("visibilitychange", onVisibility);

		const resize = new ResizeObserver(() => {
			layout();
			draw();
		});
		resize.observe(canvas);

		const theme = new MutationObserver(() => {
			readColors();
			draw();
		});
		theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

		if (!reduce) window.addEventListener("pointermove", onPointer, { passive: true });

		return () => {
			stop();
			visibility.disconnect();
			resize.disconnect();
			theme.disconnect();
			document.removeEventListener("visibilitychange", onVisibility);
			window.removeEventListener("pointermove", onPointer);
			gl.deleteBuffer(buffer);
			gl.deleteProgram(program);
			gl.deleteShader(vs);
			gl.deleteShader(fs);
		};
	}, []);

	return (
		<div aria-hidden="true" className={cn("pointer-events-none", className)}>
			<canvas ref={canvasRef} className="ed-signal-field block size-full" />
		</div>
	);
}
