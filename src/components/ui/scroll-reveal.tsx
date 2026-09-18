"use client";

import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Editorial Brutalism motion vocabulary.
 *
 * Two rules govern everything in this file:
 *   1. Animate transform and opacity only. Nothing here touches layout.
 *   2. Motion states a relationship — entrance order, cause and effect, or
 *      feedback. It never decorates.
 *
 * Timing follows the 100/300/500 bands: micro-interactions live in CSS,
 * entrances live here at 600-1000ms with exponential deceleration.
 */

const EASE = [0.16, 1, 0.3, 1] as const; // ease-out-expo
const EASE_QUART = [0.25, 1, 0.5, 1] as const;

/* ---------------------------------------------------------------------------
   ScrollReveal — the generic entrance. Restrained travel (18px) because the
   editorial language gets its drama from type and rules, not from movement.
   -------------------------------------------------------------------------- */

const fadeUp: Variants = {
	hidden: { opacity: 0, y: 18 },
	visible: { opacity: 1, y: 0 },
};

const fadeIn: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
};

const slideLeft: Variants = {
	hidden: { opacity: 0, x: -24 },
	visible: { opacity: 1, x: 0 },
};

const slideRight: Variants = {
	hidden: { opacity: 0, x: 24 },
	visible: { opacity: 1, x: 0 },
};

const scaleIn: Variants = {
	hidden: { opacity: 0, scale: 0.97 },
	visible: { opacity: 1, scale: 1 },
};

const blurIn: Variants = {
	hidden: { opacity: 0, filter: "blur(6px)", y: 12 },
	visible: { opacity: 1, filter: "blur(0px)", y: 0 },
};

const variantMap = {
	"fade-up": fadeUp,
	"fade-in": fadeIn,
	"scale-in": scaleIn,
	"slide-left": slideLeft,
	"slide-right": slideRight,
	"blur-in": blurIn,
} as const;

interface ScrollRevealProps {
	children: ReactNode;
	variant?: keyof typeof variantMap;
	delay?: number;
	duration?: number;
	className?: string;
	once?: boolean;
	as?: "div" | "section" | "article" | "li" | "header" | "footer";
}

export function ScrollReveal({
	children,
	variant = "fade-up",
	delay = 0,
	duration = 0.6,
	className,
	once = true,
	as = "div",
}: ScrollRevealProps) {
	const reduce = useReducedMotion();
	const Comp = motion[as];

	return (
		<Comp
			variants={variantMap[variant]}
			initial={reduce ? false : "hidden"}
			whileInView="visible"
			viewport={{ once, margin: "-60px" }}
			transition={{ duration, delay, ease: EASE }}
			className={className}
		>
			{children}
		</Comp>
	);
}

/* ---------------------------------------------------------------------------
   MaskedLines — the signature entrance. Each line sits in its own overflow
   mask and rises into place, staggered. This is what the hero is built on.

   IMPORTANT — the intersection observer is attached to the *container*, never
   to the individual line. A line is translated 112% down inside an
   `overflow: hidden` mask, and IntersectionObserver clips a target's rect by
   its clipping ancestors. The line's intersection rect is therefore always
   empty, `isIntersecting` is never true, and the reveal deadlocks with the
   headline permanently off-screen. The container's box is the union of the
   masks, so it reports visibility correctly.
   -------------------------------------------------------------------------- */

interface MaskedLinesProps {
	lines: ReactNode[];
	className?: string;
	lineClassName?: string;
	delay?: number;
	stagger?: number;
	duration?: number;
}

export function MaskedLines({
	lines,
	className,
	lineClassName,
	delay = 0,
	stagger = 0.095,
	duration = 1,
}: MaskedLinesProps) {
	const reduce = useReducedMotion();
	const ref = useRef<HTMLSpanElement>(null);
	const inView = useInView(ref, { once: true, margin: "-40px" });
	const shown = reduce || inView;

	return (
		<span ref={ref} className={cn("block", className)}>
			{lines.map((line, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: line order is stable and positional
				<span key={i} className="block overflow-hidden pb-[0.06em]">
					<motion.span
						className={cn("block", lineClassName)}
						// `initial={false}` renders straight at the animate value, so the
						// line is already masked off on first paint — no flash, no jump.
						initial={false}
						animate={{ y: shown ? "0%" : "112%" }}
						transition={{
							duration,
							ease: EASE,
							delay: shown ? delay + i * stagger : 0,
						}}
					>
						{line}
					</motion.span>
				</span>
			))}
		</span>
	);
}

/* ---------------------------------------------------------------------------
   Rule — a hairline that draws itself across the page from the left.
   Used to open sections and to close the masthead.
   -------------------------------------------------------------------------- */

interface RuleProps {
	className?: string;
	delay?: number;
	thin?: boolean;
}

export function Rule({ className, delay = 0, thin = false }: RuleProps) {
	const reduce = useReducedMotion();

	return (
		<motion.div
			aria-hidden="true"
			className={cn(
				"h-px w-full origin-left",
				thin ? "bg-[var(--rule)]" : "bg-[var(--rule-strong)]",
				className,
			)}
			initial={reduce ? false : { scaleX: 0 }}
			whileInView={{ scaleX: 1 }}
			viewport={{ once: true, margin: "-40px" }}
			transition={{ duration: 0.75, ease: EASE, delay }}
		/>
	);
}

/* ---------------------------------------------------------------------------
   CountUp — numbers that resolve. Tabular figures so nothing reflows.
   -------------------------------------------------------------------------- */

interface CountUpProps {
	value: number;
	decimals?: number;
	suffix?: string;
	prefix?: string;
	className?: string;
	duration?: number;
}

export function CountUp({
	value,
	decimals = 0,
	suffix = "",
	prefix = "",
	className,
	duration = 1100,
}: CountUpProps) {
	const reduce = useReducedMotion();
	const ref = useRef<HTMLSpanElement>(null);
	const [display, setDisplay] = useState(reduce ? value : 0);
	const started = useRef(false);

	useEffect(() => {
		if (reduce) {
			setDisplay(value);
			return;
		}

		const el = ref.current;
		if (!el) return;

		let raf = 0;

		const run = () => {
			let start: number | null = null;
			const step = (ts: number) => {
				if (start === null) start = ts;
				const p = Math.min((ts - start) / duration, 1);
				// ease-out-quart — decelerates like a real object settling
				const eased = 1 - (1 - p) ** 4;
				setDisplay(value * eased);
				if (p < 1) raf = requestAnimationFrame(step);
			};
			raf = requestAnimationFrame(step);
		};

		if (!("IntersectionObserver" in window)) {
			run();
			return () => cancelAnimationFrame(raf);
		}

		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting && !started.current) {
						started.current = true;
						run();
						io.unobserve(entry.target);
					}
				}
			},
			{ threshold: 0.5 },
		);

		io.observe(el);

		return () => {
			io.disconnect();
			cancelAnimationFrame(raf);
		};
	}, [value, duration, reduce]);

	return (
		<span ref={ref} className={className} data-numeric>
			{prefix}
			{display.toFixed(decimals)}
			{suffix}
		</span>
	);
}

/* ---------------------------------------------------------------------------
   Stagger primitives — kept API-compatible with the previous implementation
   so list components did not all need rewriting at once.
   -------------------------------------------------------------------------- */

interface StaggerContainerProps {
	children: ReactNode;
	className?: string;
	staggerDelay?: number;
	once?: boolean;
}

export function StaggerContainer({
	children,
	className,
	staggerDelay = 0.08,
	once = true,
}: StaggerContainerProps) {
	const reduce = useReducedMotion();

	return (
		<motion.div
			initial={reduce ? false : "hidden"}
			whileInView="visible"
			viewport={{ once, margin: "-60px" }}
			transition={{ staggerChildren: staggerDelay }}
			className={className}
		>
			{children}
		</motion.div>
	);
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<motion.div
			variants={fadeUp}
			transition={{ duration: 0.55, ease: EASE_QUART }}
			className={className}
		>
			{children}
		</motion.div>
	);
}

/* ---------------------------------------------------------------------------
   SectionHead — number, title, note. The repeating rhythm of the whole site.
   -------------------------------------------------------------------------- */

interface SectionHeadProps {
	num: string;
	title: ReactNode;
	note?: ReactNode;
	className?: string;
}

export function SectionHead({ num, title, note, className }: SectionHeadProps) {
	return (
		<div
			className={cn(
				"mb-10 grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-2 md:grid-cols-[auto_1fr_auto] md:gap-x-6",
				className,
			)}
		>
			<span className="ed-sec-num">{num} —</span>
			<h2 className="ed-display-md">{title}</h2>
			{note ? (
				<span className="ed-label col-span-2 md:col-span-1 md:text-right">{note}</span>
			) : null}
		</div>
	);
}
