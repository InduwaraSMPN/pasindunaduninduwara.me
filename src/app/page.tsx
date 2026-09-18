import { ArrowDown, ArrowRight, ArrowUpRight, Download } from "lucide-react";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import BlogPosts from "@/components/blog-posts";
import ContactForm from "@/components/contact-form";
import { HalftonePortrait } from "@/components/halftone-portrait";
import { LocalTime } from "@/components/local-time";
import ProjectsList from "@/components/projects-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import {
	CountUp,
	MaskedLines,
	Rule,
	ScrollReveal,
	SectionHead,
} from "@/components/ui/scroll-reveal";

/**
 * Home — Editorial Brutalism, printed edition.
 *
 * The page reads like the front section of a publication: a masthead of
 * metadata, one oversized headline framed by crop marks, a contents index,
 * then numbered sections. Chapters change paper stock — paper, salmon
 * newsprint, paper, black — rather than adding colours, and each stock is
 * printed onto the one before it as a halftone ramp.
 */

const masthead: { label: string; value: ReactNode; signal?: boolean }[] = [
	{ label: "Discipline", value: "Software Engineering" },
	{ label: "Base", value: "Anuradhapura, Sri Lanka" },
	{ label: "Local time", value: <LocalTime /> },
	{ label: "Status", value: "Open to work", signal: true },
];

/** One source for the contents index and the section heads it points to. */
const sections = {
	work: { id: "projects", num: "01", title: "Selected work", note: "Three of many" },
	background: { id: "about", num: "02", title: "Background", note: "Anuradhapura → Colombo" },
	writing: { id: "blog", num: "03", title: "Latest writing", note: "Notes on building things" },
	contact: { id: "contact", num: "04", title: "Get in touch", note: "Response within 24 h" },
};

const stats = [
	{ value: 3.7, decimals: 1, suffix: "", label: "GPA — B.Sc. Hons IT" },
	{ value: 6, decimals: 0, suffix: " mo", label: "Industry internship" },
	{ value: 2, decimals: 0, suffix: "", label: "Competition placements" },
];

const skills = [
	{
		group: "Languages",
		items: ["TypeScript", "JavaScript", "Python", "Java", "C/C++", "SQL", "HTML", "CSS"],
	},
	{
		group: "Frameworks",
		items: ["Next.js", "React", "Node.js", "Spring Boot", "Flutter", "Angular"],
	},
	{
		group: "Platforms",
		items: ["Docker", "Kubernetes", "Azure", "PostgreSQL", "MongoDB", "MySQL", "Git"],
	},
	{
		group: "Practice",
		items: ["RESTful APIs", "OAuth / JWT", "Real-time messaging", "UX / UI", "Responsive design"],
	},
];

const experience = [
	{
		period: "Jul — Dec 2025",
		company: "WSO2",
		role: "Software Engineer Intern — Internal Developer Portals",
	},
	{
		period: "2023 — present",
		company: "University of Kelaniya",
		role: "B.Sc. Honours in Information Technology · GPA 3.7",
	},
	{
		period: "2024",
		company: "University of Moratuwa — CODL",
		role: "Trainee Full Stack Developer",
	},
];

const achievements = [
	{
		mark: "1st Runners-Up",
		title: "J'PURA EXPO 2023",
		note: "Inter-University Export-Oriented Innovation Competition",
	},
	{
		mark: "Semi-Finalist",
		title: "Venture Verse Startup Challenge",
		note: "Ceylon Treasure project",
	},
];

const socials = [
	{
		label: "GitHub",
		href: "https://github.com/InduwaraSMPN",
		path: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z",
	},
	{
		label: "LinkedIn",
		href: "https://linkedin.com/in/induwarasmpn",
		path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
	},
];

/**
 * Hero headline, split into lines. Declared outside the component so the array
 * is a stable module-level value rather than a fresh literal on every render.
 *
 * The keys are needed even though MaskedLines assigns its own: this array
 * crosses the server→client boundary as a prop, and the RSC serializer
 * validates element arrays in props the same way it validates children.
 */
const heroLines = [
	<Fragment key="crafting">Crafting digital</Fragment>,
	<Fragment key="experiences">experiences with</Fragment>,
	<span key="purpose" className="ed-accent">
		purpose.
	</span>,
];

export default function Home() {
	return (
		<div id="top" className="min-h-screen bg-background">
			<SiteHeader activePage="home" />

			<main>
				{/* ---------------------------------------------------------------
				    MASTHEAD — the publication strip
				   --------------------------------------------------------------- */}
				<div className="ed-shell pt-8">
					<dl className="grid grid-cols-2 gap-px border-y border-[var(--rule-strong)] bg-[var(--rule)] md:grid-cols-4">
						{masthead.map((cell) => (
							<div key={cell.label} className="bg-background py-3.5 pr-4">
								<dt className="ed-label">{cell.label}</dt>
								<dd
									className={
										cell.signal
											? "mt-1.5 text-[0.8125rem] font-semibold text-[var(--signal)]"
											: "mt-1.5 text-[0.8125rem] font-semibold"
									}
								>
									{cell.value}
								</dd>
							</div>
						))}
					</dl>
				</div>

				{/* ---------------------------------------------------------------
				    HERO — headline in crop marks, then a three-column deck:
				    standfirst, contents, portrait.
				   --------------------------------------------------------------- */}
				<header className="ed-shell pt-10 md:pt-14">
					<div className="flex flex-wrap items-center gap-x-4 gap-y-2">
						<span className="ed-eyebrow">Software Engineer — Full Stack</span>
						<span aria-hidden="true" className="h-px min-w-8 flex-1 bg-[var(--rule-strong)]" />
						<span className="ed-eyebrow max-sm:w-full">Portfolio — Vol. 01</span>
					</div>

					<div className="ed-crop mt-12 md:mt-16">
						<h1 className="ed-display">
							<MaskedLines lines={heroLines} />
						</h1>
					</div>

					<div className="mt-12 grid grid-cols-1 border-t border-[var(--rule-strong)] md:mt-16 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)_minmax(0,1fr)]">
						{/* Standfirst */}
						<div className="flex flex-col gap-7 pt-7 md:col-start-1 md:row-start-1 md:pr-8">
							<p className="max-w-[46ch] text-base leading-relaxed text-muted-foreground md:text-lg">
								Software engineer and open source contributor building scalable full-stack
								applications — with clean code and interfaces that hold up under inspection.
							</p>

							<div className="flex flex-wrap items-center gap-x-5 gap-y-3">
								<div className="-ml-2.5 flex items-center gap-1">
									{socials.map((s) => (
										<a
											key={s.label}
											href={s.href}
											target="_blank"
											rel="noopener noreferrer"
											className="grid size-9 place-items-center border border-transparent text-muted-foreground transition-colors duration-200 hover:border-[var(--rule-strong)] hover:text-[var(--signal)]"
										>
											<svg
												className="size-4"
												viewBox="0 0 24 24"
												fill="currentColor"
												aria-hidden="true"
											>
												<path d={s.path} />
											</svg>
											<span className="sr-only">{s.label} profile</span>
										</a>
									))}
								</div>
								<span className="ed-meta">Currently: Internal Developer Portals @ WSO2</span>
							</div>
						</div>

						{/* Contents — the section index, set the way a periodical sets it. */}
						<nav
							aria-labelledby="contents-label"
							className="mt-8 border-t border-[var(--rule)] pt-6 md:col-start-1 md:row-start-2 md:pr-8 lg:col-start-2 lg:row-start-1 lg:mt-0 lg:border-t-0 lg:border-l lg:px-8 lg:pt-7"
						>
							<p id="contents-label" className="ed-label mb-3">
								Contents
							</p>
							<ol className="ed-index">
								{Object.values(sections).map((s) => (
									<li key={s.id}>
										<a
											href={`#${s.id}`}
											className="ed-index-row group flex items-baseline gap-3 px-1 py-3"
										>
											<span className="ed-index-mark font-mono text-xs font-semibold tracking-[0.14em]">
												{s.num}
											</span>
											<span className="whitespace-nowrap font-heading text-lg font-bold tracking-[-0.028em]">
												{s.title}
											</span>
											<span aria-hidden="true" className="ed-leader ed-index-dim" />
											<ArrowDown
												aria-hidden="true"
												className="ed-index-dim size-3.5 shrink-0 self-center transition-transform duration-300 ease-out-expo group-hover:translate-y-0.5"
											/>
										</a>
									</li>
								))}
							</ol>
						</nav>

						{/* Portrait — screened as a halftone, the photograph on request. */}
						<div className="mt-8 border-t border-[var(--rule)] pt-6 md:col-start-2 md:row-span-2 md:row-start-1 md:mt-0 md:border-t-0 md:border-l md:pt-7 md:pl-8 lg:col-start-3 lg:row-span-1">
							<ScrollReveal variant="fade-in" delay={0.35}>
								<HalftonePortrait
									src="/placeholder-profile.jpg"
									alt="Pasindu Nadun Induwara"
									caption="Fig. 01 — Kelaniya"
									sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 320px"
									priority
								/>
							</ScrollReveal>
						</div>
					</div>
				</header>

				<div className="ed-shell mt-16">
					<Rule />
				</div>

				{/* ---------------------------------------------------------------
				    01 — SELECTED WORK
				   --------------------------------------------------------------- */}
				<section id={sections.work.id} className="ed-shell scroll-mt-24 py-16 md:py-24">
					<ScrollReveal>
						<SectionHead
							num={sections.work.num}
							title={sections.work.title}
							note={sections.work.note}
						/>
					</ScrollReveal>

					<ProjectsList limit={3} isHomePage={true} />

					<ScrollReveal delay={0.2}>
						<div className="mt-12">
							<Link href="/projects" className="ed-cta">
								View all projects
								<ArrowRight aria-hidden="true" />
							</Link>
						</div>
					</ScrollReveal>
				</section>

				{/* ---------------------------------------------------------------
				    02 — BACKGROUND · salmon stock
				   --------------------------------------------------------------- */}
				<section id={sections.background.id} className="ed-stock ed-stock-salmon scroll-mt-24">
					<div className="ed-shell py-16 md:py-24">
						<ScrollReveal>
							<SectionHead
								num={sections.background.num}
								title={sections.background.title}
								note={sections.background.note}
							/>
						</ScrollReveal>

						<ScrollReveal>
							<p className="ed-crop ed-statement mt-16 mb-16 max-w-[19ch] md:mt-20 md:mb-24">
								I care about the seam between systems and the{" "}
								<span className="ed-accent">people</span> using them.
							</p>
						</ScrollReveal>

						<div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-0">
							{/* Left: narrative, numbers, chronology */}
							<div className="flex flex-col gap-10 lg:pr-12">
								<ScrollReveal>
									<p className="max-w-[52ch] text-base leading-relaxed md:text-lg">
										Most of my work is full-stack — designing the data model, building the API, then
										sweating the interface until it feels inevitable.
									</p>
								</ScrollReveal>

								<ScrollReveal delay={0.1}>
									<dl className="grid grid-cols-3 border-y border-[var(--rule-strong)]">
										{stats.map((stat) => (
											<div key={stat.label} className="ed-stat">
												<dt className="sr-only">{stat.label}</dt>
												<dd>
													<b>
														<CountUp
															value={stat.value}
															decimals={stat.decimals}
															suffix={stat.suffix}
														/>
													</b>
													<span className="ed-label mt-2.5 block">{stat.label}</span>
												</dd>
											</div>
										))}
									</dl>
								</ScrollReveal>

								<ScrollReveal delay={0.15}>
									<div>
										<h3 className="ed-label mb-4">Experience &amp; Education</h3>
										<ol className="border-t border-[var(--rule-strong)]">
											{experience.map((job) => (
												<li
													key={job.company}
													className="grid grid-cols-1 gap-x-6 gap-y-1 border-b border-[var(--rule)] py-4 sm:grid-cols-[8rem_1fr]"
												>
													<span className="ed-meta pt-0.5">{job.period}</span>
													<div>
														<p className="font-heading text-base font-semibold tracking-[-0.022em]">
															{job.company}
														</p>
														<p className="mt-0.5 text-sm text-muted-foreground">{job.role}</p>
													</div>
												</li>
											))}
										</ol>
									</div>
								</ScrollReveal>

								<ScrollReveal delay={0.2}>
									<div className="flex flex-wrap gap-2.5">
										<Button asChild variant="outline">
											<Link href="/Pasindu_Induwara_CV.pdf" download>
												<Download className="size-4" />
												Download CV
											</Link>
										</Button>
										<Button asChild>
											<Link href="/cv">View full CV</Link>
										</Button>
									</div>
								</ScrollReveal>
							</div>

							{/* Right: skills as definition rows, then recognition */}
							<div className="flex flex-col gap-10 lg:border-l lg:border-[var(--rule)] lg:pl-12">
								<ScrollReveal variant="fade-in" delay={0.1}>
									<div>
										<h3 className="ed-label mb-4">Skills &amp; Expertise</h3>
										<dl className="border-t border-[var(--rule-strong)]">
											{skills.map((group) => (
												<div key={group.group} className="ed-defrow">
													<dt className="ed-label pt-0.5">{group.group}</dt>
													<dd className="text-muted-foreground">
														{group.items.map((item, i) => (
															<span key={item}>
																{i > 0 ? (
																	<>
																		<span className="px-1.5 text-[var(--rule-strong)]">/</span>
																		{/* Adjacent inline spans offer no break opportunity, so the
																		    whole list would be one unbreakable run and force a
																		    ~450px min-content on the row. */}
																		<wbr />
																	</>
																) : null}
																<span className="text-foreground">{item}</span>
															</span>
														))}
													</dd>
												</div>
											))}
										</dl>
									</div>
								</ScrollReveal>

								<ScrollReveal variant="fade-in" delay={0.15}>
									<div>
										<h3 className="ed-label mb-4">Recognition</h3>
										<ul className="border-t border-[var(--rule-strong)]">
											{achievements.map((item) => (
												<li key={item.title} className="border-b border-[var(--rule)] py-4">
													<p className="font-heading text-base font-semibold tracking-[-0.022em]">
														<span className="ed-accent">{item.mark}</span>
														<span className="px-2 text-[var(--rule-strong)]">—</span>
														{item.title}
													</p>
													<p className="mt-0.5 text-sm text-muted-foreground">{item.note}</p>
												</li>
											))}
										</ul>
									</div>
								</ScrollReveal>
							</div>
						</div>
					</div>
				</section>

				{/* ---------------------------------------------------------------
				    03 — WRITING · back to paper
				   --------------------------------------------------------------- */}
				<section id={sections.writing.id} className="ed-stock scroll-mt-24">
					<div className="ed-shell py-16 md:py-24">
						<ScrollReveal>
							<SectionHead
								num={sections.writing.num}
								title={sections.writing.title}
								note={sections.writing.note}
							/>
						</ScrollReveal>

						<BlogPosts />

						<ScrollReveal delay={0.2}>
							<div className="mt-12">
								<Link href="/blog" className="ed-cta">
									View all posts
									<ArrowRight aria-hidden="true" />
								</Link>
							</div>
						</ScrollReveal>
					</div>
				</section>

				{/* ---------------------------------------------------------------
				    04 — CONTACT · black stock, continuous with the footer
				   --------------------------------------------------------------- */}
				<section id={sections.contact.id} className="dark ed-stock ed-stock-black scroll-mt-24">
					<div className="ed-shell py-16 md:py-24">
						<ScrollReveal>
							<SectionHead
								num={sections.contact.num}
								title={sections.contact.title}
								note={sections.contact.note}
							/>
						</ScrollReveal>

						<div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-0">
							<ScrollReveal className="lg:pr-12">
								<ContactForm />
							</ScrollReveal>

							<ScrollReveal
								variant="fade-in"
								delay={0.12}
								className="lg:border-l lg:border-[var(--rule)] lg:pl-12"
							>
								<div className="flex flex-col gap-10">
									<div>
										<h3 className="ed-label mb-4">Write directly</h3>
										<a
											href="mailto:pasindunaduninduwara@gmail.com"
											className="ed-cta text-[clamp(1.125rem,1.9vw,1.5rem)]"
										>
											<span>
												pasindunaduninduwara
												<wbr />
												@gmail.com
											</span>
											<ArrowUpRight aria-hidden="true" />
										</a>
									</div>

									<ul className="border-t border-[var(--rule-strong)]">
										<li className="border-b border-[var(--rule)] py-4">
											<p className="ed-label mb-1">Phone</p>
											<a
												href="tel:+94703477582"
												className="ed-link text-sm transition-colors duration-200 hover:text-[var(--signal)]"
											>
												+94 70 347 7582
											</a>
										</li>
										<li className="border-b border-[var(--rule)] py-4">
											<p className="ed-label mb-1">Based in</p>
											<p className="text-sm">Anuradhapura, Sri Lanka</p>
										</li>
									</ul>

									<div>
										<h3 className="ed-label mb-4">Elsewhere</h3>
										<div className="flex flex-wrap gap-2.5">
											{socials.map((s) => (
												<a
													key={s.label}
													href={s.href}
													target="_blank"
													rel="noopener noreferrer"
													className="group inline-flex items-center gap-2 border border-[var(--rule-strong)] px-4 py-2.5 text-sm font-medium transition-colors duration-200 hover:bg-foreground hover:text-background"
												>
													<svg
														className="size-4"
														viewBox="0 0 24 24"
														fill="currentColor"
														aria-hidden="true"
													>
														<path d={s.path} />
													</svg>
													{s.label}
													<ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
												</a>
											))}
										</div>
									</div>
								</div>
							</ScrollReveal>
						</div>
					</div>
				</section>
			</main>

			<SiteFooter activePage="home" />
		</div>
	);
}
