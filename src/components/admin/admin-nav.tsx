"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
	{ num: "01", label: "Dashboard", href: "/admin" },
	{ num: "02", label: "Projects", href: "/admin/projects" },
	{ num: "03", label: "Blog", href: "/admin/blog" },
	{ num: "04", label: "Comments", href: "/admin/comments" },
	{ num: "05", label: "Messages", href: "/admin/messages" },
	{ num: "06", label: "Storage", href: "/admin/storage" },
];

/**
 * The console index. Numbered rows on a hairline rule — the same rhythm the
 * public site uses, minus the hover-invert, which would fight with the data.
 */
export function AdminNav() {
	const pathname = usePathname();

	return (
		<nav aria-label="Admin sections">
			{/* `data-bleed` on the scroller: below lg the index is a horizontal
			    scroll list, so its items deliberately exceed the box. */}
			<ul
				data-bleed
				className="flex gap-0 overflow-x-auto border-y border-[var(--rule-strong)] lg:flex-col lg:overflow-visible lg:border-b-0"
			>
				{links.map((link) => {
					// Exact match for the dashboard, prefix match for the rest, so
					// /admin/projects/new still lights up "Projects".
					const isActive =
						link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);

					return (
						<li key={link.href} className="shrink-0 lg:shrink lg:border-b lg:border-[var(--rule)]">
							<Link
								href={link.href}
								aria-current={isActive ? "page" : undefined}
								className={cn(
									"relative flex items-baseline gap-3 py-3 pr-6 text-sm whitespace-nowrap transition-colors duration-200 lg:pr-2",
									isActive ? "text-[var(--signal)]" : "text-muted-foreground hover:text-foreground",
								)}
							>
								<span
									className={cn(
										"ed-sec-num transition-opacity duration-200",
										isActive ? "opacity-100" : "opacity-50",
									)}
								>
									{link.num}
								</span>
								<span className="font-medium">{link.label}</span>
								{isActive ? (
									<motion.span
										layoutId="admin-nav-mark"
										initial={false}
										transition={{ type: "spring", stiffness: 480, damping: 34 }}
										aria-hidden="true"
										className="absolute inset-y-0 left-[-1px] w-[2px] bg-[var(--signal)] max-lg:inset-x-0 max-lg:top-auto max-lg:h-[2px] max-lg:w-auto"
									/>
								) : null}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
