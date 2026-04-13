"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const fadeUp: Variants = {
	hidden: { opacity: 0, y: 32 },
	visible: { opacity: 1, y: 0 },
};

const fadeIn: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
};

const scaleIn: Variants = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: { opacity: 1, scale: 1 },
};

const slideLeft: Variants = {
	hidden: { opacity: 0, x: -40 },
	visible: { opacity: 1, x: 0 },
};

const slideRight: Variants = {
	hidden: { opacity: 0, x: 40 },
	visible: { opacity: 1, x: 0 },
};

const blurIn: Variants = {
	hidden: { opacity: 0, filter: "blur(8px)", y: 16 },
	visible: { opacity: 1, filter: "blur(0px)", y: 0 },
};

const variantMap = {
	"fade-up": fadeUp,
	"fade-in": fadeIn,
	"scale-in": scaleIn,
	"slide-left": slideLeft,
	"slide-right": slideRight,
	"blur-in": blurIn,
};

interface ScrollRevealProps {
	children: ReactNode;
	variant?: keyof typeof variantMap;
	delay?: number;
	duration?: number;
	className?: string;
	once?: boolean;
}

export function ScrollReveal({
	children,
	variant = "fade-up",
	delay = 0,
	duration = 0.6,
	className,
	once = true,
}: ScrollRevealProps) {
	return (
		<motion.div
			variants={variantMap[variant]}
			initial="hidden"
			whileInView="visible"
			viewport={{ once, margin: "-60px" }}
			transition={{
				duration,
				delay,
				ease: [0.25, 0.1, 0.25, 1],
			}}
			className={className}
		>
			{children}
		</motion.div>
	);
}

interface StaggerContainerProps {
	children: ReactNode;
	className?: string;
	staggerDelay?: number;
	once?: boolean;
}

export function StaggerContainer({
	children,
	className,
	staggerDelay = 0.1,
	once = true,
}: StaggerContainerProps) {
	return (
		<motion.div
			initial="hidden"
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
			transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
			className={className}
		>
			{children}
		</motion.div>
	);
}
