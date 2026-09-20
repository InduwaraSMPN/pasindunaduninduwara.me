"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
	/**
	 * Controls the brand lockup. The home page shows the full lockup with the
	 * role line; inner pages show a compact one so the nav stays quiet there.
	 */
	showAvatar?: boolean;
	/**
	 * Which nav item to mark. `"none"` is for pages that belong to no section —
	 * the 404 and the login screen — so nothing is falsely highlighted.
	 */
	activePage?: "home" | "projects" | "blog" | "contact" | "cv" | "none";
}

/**
 * Order and numbers follow the home page's sections, so the nav, the hero's
 * contents index and the section heads all agree on what "02" means.
 */
const navLinks = [
	{
		label: "Projects",
		href: "/projects",
		homeHref: "#projects",
		page: "projects" as const,
		sectionId: "projects",
		num: "01",
	},
	{ label: "About", href: "/#about", page: "home" as const, sectionId: "about", num: "02" },
	{
		label: "Blog",
		href: "/blog",
		homeHref: "#blog",
		page: "blog" as const,
		sectionId: "blog",
		num: "03",
	},
	{
		label: "Contact",
		href: "/#contact",
		homeHref: "#contact",
		page: "contact" as const,
		sectionId: "contact",
		num: "04",
	},
];

/** Tracks which section is currently in view so the nav can mark it. */
function useActiveSection(enabled: boolean) {
	const [activeSection, setActiveSection] = useState<string | null>(null);

	useEffect(() => {
		if (!enabled) return;

		const sectionIds = navLinks.map((l) => l.sectionId).filter(Boolean) as string[];
		const elements = sectionIds
			.map((id) => document.getElementById(id))
			.filter(Boolean) as HTMLElement[];

		if (elements.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((e) => e.isIntersecting)
					.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

				if (visible.length > 0) {
					setActiveSection(visible[0].target.id);
				}
			},
			{ rootMargin: "-20% 0px -60% 0px", threshold: 0 },
		);

		for (const el of elements) observer.observe(el);
		return () => observer.disconnect();
	}, [enabled]);

	return activeSection;
}

function useScrolled(threshold = 20) {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > threshold);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [threshold]);

	return scrolled;
}

export function SiteHeader({ showAvatar = true, activePage = "home" }: SiteHeaderProps) {
	const [mobileOpen, setMobileOpen] = useState(false);
	const isHome = activePage === "home";
	const activeSection = useActiveSection(isHome);
	const scrolled = useScrolled();

	// A rule that fills as the page is read.
	const { scrollYProgress } = useScroll();
	const progress = useSpring(scrollYProgress, {
		stiffness: 180,
		damping: 32,
		restDelta: 0.001,
	});

	useEffect(() => {
		if (!mobileOpen) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setMobileOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [mobileOpen]);

	// On the home page the mark follows the section in view, and nothing is
	// marked above the first one — the hero belongs to no section.
	const getIsActive = (link: (typeof navLinks)[number]) => {
		if (isHome) return link.sectionId === activeSection;
		return activePage === link.page;
	};

	return (
		<header
			className={cn(
				"sticky top-0 z-50 w-full border-b transition-colors duration-300",
				scrolled
					? "border-[var(--rule-strong)] bg-background/90 backdrop-blur-xl"
					: "border-[var(--rule)] bg-background/70 backdrop-blur-md",
			)}
		>
			<div className="ed-shell flex items-center justify-between gap-6 py-3">
				{/* Brand — the name alone; it is the mark. */}
				<Link href="/" className="group leading-none">
					<span className="block font-heading text-[0.9375rem] font-bold tracking-[-0.03em] group-hover:text-[var(--signal)]">
						Pasindu Nadun Induwara
					</span>
					{showAvatar ? <span className="ed-label mt-1.5 block">Software Engineer</span> : null}
				</Link>

				{/* Desktop nav */}
				<div className="hidden items-center gap-1 md:flex">
					<nav aria-label="Primary">
						<ul className="flex items-center">
							{navLinks.map((link) => {
								const href = isHome && link.homeHref ? link.homeHref : link.href;
								const isActive = getIsActive(link);
								return (
									<li key={link.label}>
										<Link
											href={href}
											aria-current={isActive ? "page" : undefined}
											className={cn(
												"relative block px-3 py-2 text-sm font-medium transition-colors duration-200",
												isActive
													? "text-[var(--signal)]"
													: "text-muted-foreground hover:text-foreground",
											)}
										>
											{link.label}
											{isActive ? (
												<motion.span
													layoutId="nav-rule"
													initial={false}
													className="absolute inset-x-3 bottom-0 h-px bg-[var(--signal)]"
													transition={{ type: "spring", stiffness: 480, damping: 34 }}
												/>
											) : null}
										</Link>
									</li>
								);
							})}
						</ul>
					</nav>

					<span aria-hidden="true" className="mx-2 h-4 w-px bg-[var(--rule)]" />

					<Link
						href="/Pasindu_Induwara_CV.pdf"
						download
						className="ed-link inline-flex items-center gap-1.5 px-2 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
					>
						<Download className="size-3.5" />
						CV
					</Link>

					<ThemeToggle />
				</div>

				{/* Mobile controls */}
				<div className="flex items-center gap-1 md:hidden">
					<ThemeToggle />
					<button
						type="button"
						onClick={() => setMobileOpen((v) => !v)}
						aria-expanded={mobileOpen}
						aria-controls="mobile-nav"
						className="grid size-9 place-items-center border border-[var(--rule)] transition-colors duration-200 hover:bg-foreground hover:text-background"
					>
						{mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
						<span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
					</button>
				</div>
			</div>

			{/* Reading progress — a rule that fills. */}
			<motion.div
				aria-hidden="true"
				style={{ scaleX: progress }}
				className="absolute inset-x-0 bottom-0 h-px origin-left bg-[var(--signal)]"
			/>

			{/* Mobile nav — editorial rows, each numbered. */}
			<AnimatePresence>
				{mobileOpen ? (
					<motion.div
						id="mobile-nav"
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
						className="overflow-hidden border-t border-[var(--rule)] bg-background md:hidden"
					>
						<nav aria-label="Primary mobile" className="ed-shell py-3">
							<ul>
								{navLinks.map((link, i) => {
									const href = isHome && link.homeHref ? link.homeHref : link.href;
									const isActive = getIsActive(link);
									return (
										<motion.li
											key={link.label}
											initial={{ opacity: 0, y: -8 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
											className="border-b border-[var(--rule)] last:border-b-0"
										>
											<Link
												href={href}
												onClick={() => setMobileOpen(false)}
												className={cn(
													"flex items-baseline gap-3 py-3.5 text-base font-medium transition-colors duration-200",
													isActive ? "text-[var(--signal)]" : "text-foreground",
												)}
											>
												<span className="ed-label">{link.num}</span>
												{link.label}
											</Link>
										</motion.li>
									);
								})}
								<motion.li
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.22 }}
								>
									<Link
										href="/Pasindu_Induwara_CV.pdf"
										download
										onClick={() => setMobileOpen(false)}
										className="flex items-center gap-2 py-3.5 text-base font-medium text-muted-foreground"
									>
										<Download className="size-4" />
										Download CV
									</Link>
								</motion.li>
							</ul>
						</nav>
					</motion.div>
				) : null}
			</AnimatePresence>
		</header>
	);
}
