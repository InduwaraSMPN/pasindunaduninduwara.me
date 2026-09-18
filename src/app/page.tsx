import { ArrowDown, ArrowRight, ArrowUpRight, Download } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import BlogPosts from "@/components/blog-posts";
import ContactForm from "@/components/contact-form";
import { HalftonePortrait } from "@/components/halftone-portrait";
import { LocalTime } from "@/components/local-time";
import { MosaicField } from "@/components/mosaic-field";
import ProjectsList from "@/components/projects-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { CountUp, MaskedLines, ScrollReveal, SectionHead } from "@/components/ui/scroll-reveal";

/**
 * Home — Editorial Brutalism, printed edition.
 *
 * Opens on a photograph rebuilt as a tile mosaic — a forest trail in its own
 * colours, its tiles glinting — with the headline set on the paper it comes
 * apart into. Then the work as full plates,
 * a chapter printed on a solid of the signal, the writing, and a black-stock
 * close. Each chapter is printed onto the one before it as a halftone ramp.
 */

/** One source for the contents index and the section heads it points to. */
const sections = {
	work: { id: "projects", num: "01", title: "Selected work", note: "Three of many" },
	background: { id: "about", num: "02", title: "Background", note: "Anuradhapura → Colombo" },
	writing: { id: "blog", num: "03", title: "Latest writing", note: "Notes on building things" },
	contact: { id: "contact", num: "04", title: "Get in touch", note: "Response within 24 h" },
};

const stats = [
	{ value: 3.7, decimals: 1, suffix: "", label: "GPA, B.Sc. Hons IT — University of Kelaniya" },
	{ value: 6, decimals: 0, suffix: " mo", label: "Software engineering internship at WSO2" },
	{ value: 2, decimals: 0, suffix: "", label: "Competition placements, 2023" },
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
	<Fragment key="software">Software that</Fragment>,
	<Fragment key="holds">holds up under</Fragment>,
	<span key="inspection" className="ed-accent">
		inspection.
	</span>,
];

export default function Home() {
	return (
		<div id="top" className="min-h-screen bg-background">
			<SiteHeader activePage="home" />

			<main>
				{/* ---------------------------------------------------------------
				    HERO — the trail as a mosaic, coming apart behind the dateline
				    and settling behind the top of the headline; then the deck:
				    standfirst, contents, portrait.
				   --------------------------------------------------------------- */}
				<header className="relative isolate [--hero-art:clamp(18rem,44vh,26rem)] md:[--hero-art:clamp(24rem,58vh,40rem)]">
					{/* The artwork spans this block — the picture plus the dateline and
					    the gap under it — and runs a little past it, so its last
					    scattered tiles settle behind the top of the headline, whatever
					    the dateline wraps to. */}
					<div className="relative">
						<MosaicField
							src="/trail.webp"
							focusY={0.55}
							dissolveFrom="calc(var(--hero-art) * 0.72)"
							className="absolute inset-x-0 top-0 -bottom-12 -z-10 md:-bottom-20"
						/>

						{/* The dateline is the only metadata above the headline. */}
						<div className="ed-shell flex flex-wrap items-center gap-x-4 gap-y-3 pt-[calc(var(--hero-art)+1.75rem)] pb-12 md:pb-14">
							<span className="ed-eyebrow ed-knockout">Software Engineer — Full Stack</span>
							<span aria-hidden="true" className="h-px min-w-8 flex-1 bg-[var(--rule-strong)]" />
							<p className="ed-eyebrow flex flex-wrap items-center gap-x-3.5 gap-y-2 max-sm:w-full">
								<span className="ed-knockout">Anuradhapura, LK</span>
								<span aria-hidden="true" className="h-3 w-px bg-[var(--rule-strong)]" />
								<LocalTime className="ed-knockout" />
								<span
									aria-hidden="true"
									className="h-3 w-px bg-[var(--rule-strong)] max-sm:hidden"
								/>
								<span className="ed-knockout inline-flex items-center gap-2 text-[var(--signal)]">
									<span aria-hidden="true" className="size-1.5 bg-[var(--signal)]" />
									Open to work
								</span>
							</p>
						</div>
					</div>

					<div className="ed-shell">
						<div className="ed-crop">
							<h1 className="ed-display">
								<MaskedLines lines={heroLines} />
							</h1>
						</div>

						<div className="mt-14 grid grid-cols-1 border-t border-[var(--rule-strong)] md:mt-16 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_13rem]">
							{/* Standfirst */}
							<div className="flex flex-col gap-7 pt-7 md:col-start-1 md:row-start-1 md:pr-8">
								<p className="max-w-[44ch] text-base leading-relaxed text-muted-foreground md:text-lg">
									Full-stack engineer and open source contributor. Most recently an intern on
									WSO2&apos;s Choreo team, rebuilding catalog ingestion for OpenChoreo&apos;s
									Backstage portal.
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
									<Link
										href="/Pasindu_Induwara_CV.pdf"
										download
										className="ed-link inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
									>
										<Download className="size-3.5" />
										Download CV
									</Link>
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
												className="ed-index-row group flex items-baseline gap-3 py-3"
											>
												<span className="ed-index-mark font-mono text-xs font-semibold tracking-[0.14em]">
													{s.num}
												</span>
												<span className="whitespace-nowrap font-heading text-lg font-semibold tracking-[-0.028em]">
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

							{/* Portrait — the column is sized so the 4:5 plate is exactly as
							    tall as the contents list beside it, with its caption level
							    with the "Contents" label. */}
							<div className="mt-8 border-t border-[var(--rule)] pt-6 md:col-start-2 md:row-span-2 md:row-start-1 md:mt-0 md:border-t-0 md:border-l md:pt-7 md:pl-8 lg:col-start-3 lg:row-span-1">
								<ScrollReveal variant="fade-in" delay={0.35}>
									<HalftonePortrait
										className="max-md:max-w-[17rem]"
										src="/placeholder-profile.jpg"
										alt="Pasindu Nadun Induwara"
										caption={
											<>
												Fig. 01<span className="lg:hidden"> — Kelaniya</span>
											</>
										}
										sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 176px"
										priority
									/>
								</ScrollReveal>
							</div>
						</div>
					</div>
				</header>

				{/* ---------------------------------------------------------------
				    01 — SELECTED WORK · plates
				   --------------------------------------------------------------- */}
				<section
					id={sections.work.id}
					className="ed-shell scroll-mt-24 pt-24 pb-20 md:pt-36 md:pb-28"
				>
					<ScrollReveal>
						<SectionHead
							num={sections.work.num}
							title={sections.work.title}
							note={sections.work.note}
						/>
					</ScrollReveal>

					<ProjectsList limit={3} isHomePage={true} />

					<ScrollReveal delay={0.2}>
						<div className="mt-14">
							<Link href="/projects" className="ed-cta">
								View all projects
								<ArrowRight aria-hidden="true" />
							</Link>
						</div>
					</ScrollReveal>
				</section>

				{/* ---------------------------------------------------------------
				    02 — BACKGROUND · printed on a solid of the signal
				   --------------------------------------------------------------- */}
				<section id={sections.background.id} className="ed-stock ed-stock-signal scroll-mt-24">
					<div className="ed-shell py-20 md:py-32">
						<ScrollReveal>
							<SectionHead
								num={sections.background.num}
								title={sections.background.title}
								note={sections.background.note}
							/>
						</ScrollReveal>

						<ScrollReveal>
							<p className="ed-crop ed-statement mt-16 max-w-[17ch] md:mt-24">
								I care about the seam between systems and the{" "}
								<span className="ed-accent">people</span> using them.
							</p>
						</ScrollReveal>

						<dl className="mt-20 grid grid-cols-1 border-t border-[var(--rule-strong)] sm:grid-cols-3 md:mt-28">
							{stats.map((stat, i) => (
								<div
									key={stat.label}
									className={
										i === 0
											? "border-b border-[var(--rule)] py-7 sm:border-b-0 sm:pr-6"
											: "border-b border-[var(--rule)] py-7 sm:border-b-0 sm:border-l sm:px-6"
									}
								>
									<dt className="sr-only">{stat.label}</dt>
									<dd>
										<b className="block font-heading text-[clamp(3.25rem,8vw,7rem)] font-[560] leading-[0.9] tracking-[-0.055em] tabular-nums">
											<CountUp value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
										</b>
										<span className="mt-4 block max-w-[24ch] text-sm font-medium leading-snug">
											{stat.label}
										</span>
									</dd>
								</div>
							))}
						</dl>
					</div>
				</section>

				{/* The rest of the background, back on paper. */}
				<section className="ed-stock" aria-label="Experience, skills and recognition">
					<div className="ed-shell py-20 md:py-28">
						<div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-0">
							{/* Left: narrative and chronology */}
							<div className="flex flex-col gap-12 lg:pr-14">
								<ScrollReveal>
									<p className="max-w-[46ch] text-lg leading-relaxed md:text-xl">
										Most of my work is full-stack — designing the data model, building the API, then
										sweating the interface until it feels inevitable.
									</p>
								</ScrollReveal>

								<ScrollReveal delay={0.1}>
									<div>
										<h3 className="ed-label mb-4">Experience &amp; Education</h3>
										<ol className="border-t border-[var(--rule-strong)]">
											{experience.map((job) => (
												<li
													key={job.company}
													className="grid grid-cols-1 gap-x-6 gap-y-1 border-b border-[var(--rule)] py-5 sm:grid-cols-[8.5rem_1fr]"
												>
													<span className="ed-meta pt-1">{job.period}</span>
													<div>
														<p className="font-heading text-lg font-semibold tracking-[-0.024em]">
															{job.company}
														</p>
														<p className="mt-1 text-sm text-muted-foreground">{job.role}</p>
													</div>
												</li>
											))}
										</ol>
									</div>
								</ScrollReveal>

								<ScrollReveal delay={0.15}>
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

							{/* Right: skills, then recognition */}
							<div className="flex flex-col gap-12 lg:border-l lg:border-[var(--rule)] lg:pl-14">
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
												<li key={item.title} className="border-b border-[var(--rule)] py-5">
													<p className="font-heading text-lg font-semibold tracking-[-0.024em]">
														<span className="ed-accent">{item.mark}</span>
														<span className="px-2 text-[var(--rule-strong)]">—</span>
														{item.title}
													</p>
													<p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
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
				    03 — WRITING
				   --------------------------------------------------------------- */}
				<section
					id={sections.writing.id}
					className="ed-shell scroll-mt-24 pt-12 pb-24 md:pt-16 md:pb-32"
				>
					<ScrollReveal>
						<SectionHead
							num={sections.writing.num}
							title={sections.writing.title}
							note={sections.writing.note}
						/>
					</ScrollReveal>

					<BlogPosts />

					<ScrollReveal delay={0.2}>
						<div className="mt-14">
							<Link href="/blog" className="ed-cta">
								View all posts
								<ArrowRight aria-hidden="true" />
							</Link>
						</div>
					</ScrollReveal>
				</section>

				{/* ---------------------------------------------------------------
				    04 — CONTACT · black stock, continuous with the footer
				   --------------------------------------------------------------- */}
				<section id={sections.contact.id} className="dark ed-stock ed-stock-black scroll-mt-24">
					<div className="ed-shell py-20 md:py-32">
						<ScrollReveal>
							<SectionHead
								num={sections.contact.num}
								title={sections.contact.title}
								note={sections.contact.note}
							/>
						</ScrollReveal>

						<ScrollReveal>
							<div className="mt-16 md:mt-24">
								<p className="ed-statement max-w-[15ch]">Have something worth building?</p>
								<a
									href="mailto:pasindunaduninduwara@gmail.com"
									className="ed-cta mt-10 text-[clamp(1.25rem,3.4vw,2.75rem)] md:mt-14"
								>
									<span>
										pasindunaduninduwara
										<wbr />
										@gmail.com
									</span>
									<ArrowUpRight aria-hidden="true" />
								</a>
							</div>
						</ScrollReveal>

						<div className="mt-20 grid grid-cols-1 gap-14 border-t border-[var(--rule-strong)] pt-14 md:mt-28 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-0">
							<ScrollReveal className="lg:pr-14">
								<h3 className="ed-label mb-8">Or leave a message</h3>
								<ContactForm />
							</ScrollReveal>

							<ScrollReveal
								variant="fade-in"
								delay={0.12}
								className="lg:border-l lg:border-[var(--rule)] lg:pl-14"
							>
								<ul className="border-t border-[var(--rule-strong)]">
									<li className="border-b border-[var(--rule)] py-5">
										<p className="ed-label mb-1.5">Phone</p>
										<a
											href="tel:+94703477582"
											className="ed-link text-base transition-colors duration-200 hover:text-[var(--signal)]"
										>
											+94 70 347 7582
										</a>
									</li>
									<li className="border-b border-[var(--rule)] py-5">
										<p className="ed-label mb-1.5">Based in</p>
										<p className="text-base">Anuradhapura, Sri Lanka</p>
									</li>
									<li className="border-b border-[var(--rule)] py-5">
										<p className="ed-label mb-3">Elsewhere</p>
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
									</li>
								</ul>
							</ScrollReveal>
						</div>
					</div>
				</section>
			</main>

			<SiteFooter activePage="home" />
		</div>
	);
}
