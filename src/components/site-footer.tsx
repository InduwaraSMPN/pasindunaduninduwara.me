import { Download } from "lucide-react";
import Link from "next/link";
import { Ticker } from "@/components/ui/scroll-reveal";

interface SiteFooterProps {
	activePage?: "home" | "projects" | "blog" | "contact" | "cv";
}

const tickerItems = [
	"TypeScript",
	"Next.js",
	"React",
	"Node.js",
	"Python",
	"Java",
	"Docker",
	"Kubernetes",
	"PostgreSQL",
	"MongoDB",
	"Backstage",
	"OpenChoreo",
	"Azure",
	"Spring Boot",
	"Flutter",
];

const indexLinks = [
	{ label: "Projects", href: "/projects" },
	{ label: "About", href: "/#about" },
	{ label: "Blog", href: "/blog" },
	{ label: "Contact", href: "/#contact" },
	{ label: "Full CV", href: "/cv" },
];

/**
 * The footer is printed on black stock on every page — the closing chapter.
 * On the home page it runs on from the contact section, which uses the same
 * stock, so the two read as one spread.
 */
export function SiteFooter({ activePage: _activePage = "home" }: SiteFooterProps) {
	return (
		<footer className="dark ed-stock ed-stock-black mt-auto">
			<Ticker items={tickerItems} />

			<div className="ed-shell py-14">
				<div className="grid gap-10 md:grid-cols-3">
					{/* Contact */}
					<div>
						<h3 className="ed-label mb-5">Contact</h3>
						<ul className="space-y-3">
							<li>
								<a
									href="mailto:pasindunaduninduwara@gmail.com"
									className="ed-link text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
								>
									pasindunaduninduwara@gmail.com
								</a>
							</li>
							<li>
								<a
									href="tel:+94703477582"
									className="ed-link text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
								>
									(+94) 70 347 7582
								</a>
							</li>
							<li className="ed-meta">Anuradhapura, Sri Lanka</li>
						</ul>
					</div>

					{/* Index */}
					<div>
						<h3 className="ed-label mb-5">Index</h3>
						<ul className="space-y-3">
							{indexLinks.map((link) => (
								<li key={link.label}>
									<Link
										href={link.href}
										className="ed-link text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
									>
										{link.label}
									</Link>
								</li>
							))}
							<li>
								<Link
									href="/Pasindu_Induwara_CV.pdf"
									download
									className="ed-link inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
								>
									<Download className="size-3.5" />
									Download CV
								</Link>
							</li>
						</ul>
					</div>

					{/* Elsewhere */}
					<div>
						<h3 className="ed-label mb-5">Elsewhere</h3>
						<ul className="space-y-3">
							<li>
								<a
									href="https://github.com/InduwaraSMPN"
									target="_blank"
									rel="noopener noreferrer"
									className="ed-link text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
								>
									GitHub ↗
								</a>
							</li>
							<li>
								<a
									href="https://linkedin.com/in/induwarasmpn"
									target="_blank"
									rel="noopener noreferrer"
									className="ed-link text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
								>
									LinkedIn ↗
								</a>
							</li>
						</ul>
					</div>
				</div>

				{/* Colophon — the name, set large. */}
				<p className="ed-display mt-14 border-t border-[var(--rule-strong)] pt-8 text-[clamp(1.75rem,7.4vw,5.25rem)] leading-[0.92] tracking-[-0.05em]">
					Pasindu
					<br />
					Nadun <span className="ed-accent">Induwara</span>
				</p>

				<div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
					<p className="ed-meta">
						© {new Date().getFullYear()} Pasindu Nadun Induwara. All rights reserved.
					</p>
					<p className="ed-meta">Set in Archivo &amp; Instrument Serif</p>
					<a
						href="#top"
						className="ed-meta ed-link transition-colors duration-200 hover:text-foreground"
					>
						Back to top ↑
					</a>
				</div>
			</div>
		</footer>
	);
}
