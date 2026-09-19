import { ArrowRight, ArrowUpRight, Download, Globe, Mail, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";

import { PageMasthead } from "@/components/page-masthead";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Rule, ScrollReveal, SectionHead } from "@/components/ui/scroll-reveal";

export const metadata: Metadata = {
	title: "Curriculum Vitae — Pasindu Nadun Induwara",
	description:
		"Curriculum vitae: software engineer at Marketrix, formerly WSO2 — experience, research, open source contributions, education and projects.",
};

/* ---------------------------------------------------------------------------
   Content — mirrors the PDF CV (August 2026), section for section.
   -------------------------------------------------------------------------- */

const contact = [
	{
		label: "Email",
		value: "pasindunaduninduwara@gmail.com",
		href: "mailto:pasindunaduninduwara@gmail.com",
	},
	{ label: "Phone", value: "(+94) 703 477 582", href: "tel:+94703477582" },
	{ label: "Web", value: "pasindunaduninduwara.me", href: "https://pasindunaduninduwara.me" },
	{ label: "GitHub", value: "InduwaraSMPN", href: "https://github.com/InduwaraSMPN" },
	{ label: "LinkedIn", value: "induwarasmpn", href: "https://linkedin.com/in/induwarasmpn" },
	{ label: "Location", value: "Kelaniya, Sri Lanka", href: null },
];

/** The document's running index, mirrored in the sticky sidebar. */
const contents = [
	{ id: "profile", num: "01", title: "Profile" },
	{ id: "experience", num: "02", title: "Experience" },
	{ id: "research", num: "03", title: "Research" },
	{ id: "open-source", num: "04", title: "Open source" },
	{ id: "education", num: "05", title: "Education" },
	{ id: "qualifications", num: "06", title: "Qualifications" },
	{ id: "projects", num: "07", title: "Projects" },
	{ id: "recognition", num: "08", title: "Recognition" },
	{ id: "affiliations", num: "09", title: "Affiliations" },
	{ id: "skills", num: "10", title: "Skills" },
	{ id: "languages", num: "11", title: "Languages" },
	{ id: "references", num: "12", title: "References" },
];

/**
 * Masthead headline, split into lines for the masked reveal. Keyed because
 * the array crosses the server→client boundary as a prop, where the RSC
 * serializer validates element arrays like children.
 */
const mastheadLines = [
	<Fragment key="given">Pasindu Nadun</Fragment>,
	<span key="family" className="ed-accent">
		Induwara
	</span>,
];

interface Point {
	/** A short lead-in, set in the ink colour before the rest of the line. */
	label?: string;
	text: string;
}

const experience: {
	period: string;
	role: string;
	org: string;
	place: string;
	intro?: string;
	bullets: Point[];
}[] = [
	{
		period: "Jan 2026 — present",
		role: "Software Engineer",
		org: "Marketrix Inc.",
		place: "San Francisco (remote)",
		intro:
			"Marketrix builds an AI user-research and QA platform that runs web products through simulated users. I own features end to end, from architectural alignment through implementation and testing to production rollout.",
		bullets: [
			{
				label: "Persona simulation",
				text: "Study engines for survey, user-research, and A/B runs, covering automated page parsing, persona-driven form filling, and aggregation of responses into reportable themes.",
			},
			{
				label: "Analytics and reporting",
				text: "Conversion pipeline reporting lift with 95% confidence intervals and projections onto partner traffic volumes, and a vector charting layer that replaced screenshot capture in reports.",
			},
			{
				label: "Autonomous QA",
				text: "Self-improving test loop that generates, runs, judges, and rewrites tests until they verify, repairing them against retrieved product knowledge, with each stage traced and scored offline.",
			},
			{
				label: "Workflow automation",
				text: "Recurring and event-driven automation with cron scheduling, a standalone worker, and run history, triggered from team chat commands and pull request events, with multi-channel alerting.",
			},
			{
				label: "Platform and security",
				text: "Tenant isolation across customer data access, credentials encrypted and write-only at the service boundary, and full-table scans replaced with targeted partial indexes.",
			},
		],
	},
	{
		period: "Jul — Dec 2025",
		role: "Software Engineer Intern",
		org: "WSO2",
		place: "Internal Developer Portals",
		bullets: [
			{
				text: "Designed the architecture for the Choreo Backstage plugin and scaffolded the full-stack project structure, after deploying a connected application on Choreo and integrating the runner plugin into Backstage.",
			},
			{
				text: "Built the Choreo and OpenChoreo Incremental Entity Provider, mapping platform resources onto catalogue entities with mark-and-sweep cleanup and delta updates that apply only changed resources per sync.",
			},
			{
				text: "Authored the design proposal for and implemented cursor pagination across the OpenChoreo APIs, returning bounded pages with opaque continuation tokens and explicit expiry handling.",
			},
			{
				text: "Extended the choreoctl command line tool and catalogue clients to paginate automatically, with integration testing against the new response structures and the supporting documentation.",
			},
		],
	},
];

const research = {
	period: "2026 — present",
	title:
		"Towards Autonomous Cloud Security: Evaluating a Hierarchical LLM-Based Multi-Agent Framework for Incident Response in Cloud-Native Environments",
	org: "Final-year research project — University of Kelaniya",
	body: "Designing and evaluating a hierarchical framework in which LLM-based agents coordinate across the incident response lifecycle, from detection and triage through to remediation.",
};

const openSource = [
	{
		name: "OpenChoreo",
		tag: "Contributor",
		body: "Contributor to the open source Internal Developer Platform. Designed and implemented cursor-based pagination across the public interface, internal clients, and the choreoctl command line tool, replacing a return-everything strategy with resumable continuation tokens, explicit handling of expired and invalid cursors, transparent automatic paging for callers, and a result-size cap. Also contributed the changes backing the Backstage incremental entity module.",
	},
	{
		name: "SST (Serverless Stack)",
		tag: null,
		body: "Integrated additional AI providers and model configurations into the models.dev catalogue.",
	},
	{
		name: "KiloCode",
		tag: null,
		body: "Documentation on model-initiated slash commands and editor interactions.",
	},
];

const education = [
	{
		period: "2023 — present",
		org: "University of Kelaniya",
		qualification: "B.Sc. Honours in Information Technology",
		note: "Current GPA 3.7 · Expected graduation October 2026",
	},
];

const qualifications = [
	{
		period: "University of Moratuwa",
		org: "Centre for Open & Distance Learning",
		qualification: "Trainee Full Stack Developer",
		body: "Completed full-stack developer training covering Python programming, web design, and server-side development.",
	},
];

const projects = [
	{
		title: "Guidia — Full-Stack Career Guidance Platform",
		type: "Individual",
		desc: "Platform digitising the University of Kelaniya’s recruitment and counselling processes. React, TypeScript, and Zod frontend over an Express and MySQL backend with Socket.IO messaging, on Azure Container Apps and Blob Storage.",
	},
	{
		title: "Browtrix — MCP Browser Automation Ecosystem",
		type: "Individual",
		desc: "Real-time ecosystem bridging AI assistants and web browsers over the Model Context Protocol. Python FastMCP, FastAPI, and WebSockets backend in a Turbo monorepo; Next.js 15 and React 19 frontend with HTML snapshotting, confirmation modals, and connection pooling for human-in-the-loop workflows.",
	},
	{
		title: "Quota.app — Fuel Quota Management System",
		type: "Group",
		desc: "Microservices fuel system for vehicle owners, stations, and administrators. Spring Boot backend with JWT and JPA, three Next.js frontends and an Expo/React Native app, QR transaction processing, Twilio SMS, and PostgreSQL reporting.",
	},
];

const recognition = [
	{
		mark: "First runner-up",
		title: "J'PURA EXPO 2023",
		note: "Inter-University Export-Oriented Innovation Competition",
	},
	{
		mark: "Semi-finalist",
		title: "VentureVerse Startup Challenge",
		note: "Sabaragamuwa University — for the project “Ceylon Treasure”",
	},
];

const affiliations = [
	"Assistant Media Director, Industrial Management Science Students' Association (IMSSA), 2024–2025",
	"Member, AIESEC Colombo North Local Committee, 2023–2025",
	"Member, Gavel Club — University of Kelaniya, 2023–2025",
	"Volunteer, Sasnaka Sansada Foundation, 2022–2024",
];

const skillGroups = [
	{
		label: "Languages",
		items: "TypeScript, JavaScript, Python, Go, Java, SQL, HTML, CSS",
	},
	{
		label: "Backend & data",
		items:
			"Node.js, Express, gRPC, FastAPI, Spring Boot, Sequelize, BullMQ, PostgreSQL, MySQL, MongoDB, Redis",
	},
	{
		label: "Frontend",
		items: "React, Next.js, Tailwind CSS, Zod, Socket.IO, Recharts, React Native, Expo",
	},
	{
		label: "AI & evaluation",
		items:
			"LiteLLM, LangChain, RAG, LLM-as-a-judge evaluation, MLflow, Model Context Protocol (MCP), FAISS, PyTorch",
	},
	{
		label: "Infrastructure",
		items:
			"Docker, Kubernetes, Terraform, Helm, Azure (Container Apps, Blob Storage, DevOps), Firebase, Supabase, Git, GitHub Actions",
	},
	{
		label: "Testing & QA",
		items:
			"Jest, Pytest, Vitest, Selenium, TestNG, Postman, cross-browser testing, CI/CD test integration",
	},
];

const languages = [
	{ name: "English", level: "Fluent" },
	{ name: "Sinhala", level: "Native speaker" },
];

/* ---------------------------------------------------------------------------
   Primitives local to this page
   -------------------------------------------------------------------------- */

/** A numbered section with a rule above it. The repeating rhythm of the page. */
function Section({
	id,
	num,
	title,
	note,
	children,
}: {
	id: string;
	num: string;
	title: string;
	note?: string;
	children: ReactNode;
}) {
	return (
		<section
			id={id}
			className="scroll-mt-24 border-t border-[var(--rule-strong)] pt-12 first:border-t-0 first:pt-0"
		>
			<ScrollReveal>
				<SectionHead num={num} title={title} note={note} />
			</ScrollReveal>
			{children}
		</section>
	);
}

/** Square signal bullet — the only ornament this page allows itself. */
function Bullet({ children }: { children: ReactNode }) {
	return (
		<li className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
			<span aria-hidden="true" className="mt-[0.5em] size-1.5 shrink-0 bg-[var(--signal)]" />
			<span>{children}</span>
		</li>
	);
}

/** A dated entry: mono period on the left, everything else on the right. */
function Entry({
	period,
	title,
	org,
	note,
	body,
	bullets,
}: {
	period: string;
	title: string;
	org?: string;
	note?: string | null;
	body?: string;
	bullets?: Point[];
}) {
	return (
		<article className="border-b border-[var(--rule)] py-7 first:pt-0 last:border-b-0">
			<div className="grid gap-x-8 gap-y-2 md:grid-cols-[9.5rem_minmax(0,1fr)]">
				<span className="ed-meta pt-1.5">{period}</span>
				<div>
					<h3 className="font-heading text-lg font-semibold tracking-[-0.024em]">{title}</h3>
					{org ? <p className="ed-label mt-1.5">{org}</p> : null}
					{note ? <p className="mt-3 text-sm text-muted-foreground">{note}</p> : null}
					{body ? (
						<p className="mt-3 max-w-[72ch] text-sm leading-relaxed text-muted-foreground">
							{body}
						</p>
					) : null}
					{bullets ? (
						<ul className="mt-4 flex flex-col gap-2.5">
							{bullets.map((b) => (
								<Bullet key={b.text}>
									{b.label ? (
										<span className="font-semibold text-foreground">{b.label}. </span>
									) : null}
									{b.text}
								</Bullet>
							))}
						</ul>
					) : null}
				</div>
			</div>
		</article>
	);
}

/* ---------------------------------------------------------------------------
   Page
   -------------------------------------------------------------------------- */

export default function CVPage() {
	return (
		<div className="min-h-screen bg-background">
			<SiteHeader showAvatar={false} activePage="cv" />

			<main>
				<PageMasthead
					eyebrow="Curriculum Vitae"
					note="Updated August 2026"
					lines={mastheadLines}
					lede={
						<>
							Software engineer at Marketrix, building AI agents and QA automation end to end.
							Previously at WSO2, and a continuing contributor to OpenChoreo.
						</>
					}
				/>

				{/* Contact strip — the same hairline grid the home masthead uses. */}
				<div className="ed-shell pt-10">
					<dl className="grid grid-cols-1 gap-px border-y border-[var(--rule-strong)] bg-[var(--rule)] sm:grid-cols-2 lg:grid-cols-3">
						{contact.map((cell) => (
							<div key={cell.label} className="flex items-baseline gap-3 bg-background py-3.5 pr-4">
								<dt className="ed-label w-[4.5rem] shrink-0">{cell.label}</dt>
								<dd className="min-w-0 text-[0.8125rem] font-medium">
									{cell.href ? (
										<a
											href={cell.href}
											target={cell.href.startsWith("http") ? "_blank" : undefined}
											rel={cell.href.startsWith("http") ? "noopener noreferrer" : undefined}
											className="ed-link break-all transition-colors duration-200 hover:text-[var(--signal)]"
										>
											{cell.value}
										</a>
									) : (
										cell.value
									)}
								</dd>
							</div>
						))}
					</dl>

					<div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
						<Button asChild size="lg">
							<Link href="/Pasindu_Induwara_CV.pdf" download>
								<Download className="size-4" />
								Download PDF
							</Link>
						</Button>
						<span className="ed-meta inline-flex items-center gap-1.5">
							<MapPin className="size-3.5" aria-hidden="true" />
							Kelaniya, Sri Lanka — working remotely with Marketrix, San Francisco
						</span>
					</div>
				</div>

				{/* Body — sticky index on the left, sections on the right. */}
				<div className="ed-shell grid grid-cols-1 gap-x-14 gap-y-16 pt-16 pb-24 lg:grid-cols-[13rem_minmax(0,1fr)]">
					{/* Running index. Static, honest, and useful on a long document. */}
					<nav aria-label="CV sections" className="hidden lg:block">
						<div className="sticky top-28">
							<p className="ed-label mb-4 border-b border-[var(--rule-strong)] pb-3">Contents</p>
							<ol className="flex flex-col">
								{contents.map((s) => (
									<li key={s.id}>
										<a
											href={`#${s.id}`}
											className="group flex items-baseline gap-3 border-b border-[var(--rule-soft)] py-2.5 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
										>
											<span className="ed-sec-num opacity-60 transition-opacity duration-200 group-hover:opacity-100">
												{s.num}
											</span>
											<span>{s.title}</span>
										</a>
									</li>
								))}
							</ol>
						</div>
					</nav>

					<div className="flex min-w-0 flex-col gap-16">
						{/* 01 — PROFILE */}
						<Section id="profile" num="01" title="Profile" note="Summary">
							<ScrollReveal delay={0.08}>
								<p className="max-w-[68ch] text-base leading-relaxed md:text-lg">
									Software Engineer at Marketrix Inc., building AI agents and QA automation products
									end to end, from architecture through to production. Previously a Software
									Engineer Intern at WSO2, and a continuing contributor to OpenChoreo, an open
									source Internal Developer Platform. My work has moved from platform infrastructure
									into agentic systems, and my final-year research extends that line into autonomous
									incident response for cloud-native environments.
								</p>
							</ScrollReveal>
						</Section>

						{/* 02 — EXPERIENCE */}
						<Section id="experience" num="02" title="Experience" note="Industry">
							<div className="border-t border-[var(--rule-strong)] pt-7">
								{experience.map((job) => (
									<Entry
										key={job.role}
										period={job.period}
										title={job.role}
										org={`${job.org} — ${job.place}`}
										body={job.intro}
										bullets={job.bullets}
									/>
								))}
							</div>
						</Section>

						{/* 03 — RESEARCH */}
						<Section id="research" num="03" title="Research" note="Final year">
							<div className="border-t border-[var(--rule-strong)] pt-7">
								<Entry
									period={research.period}
									title={research.title}
									org={research.org}
									body={research.body}
								/>
							</div>
						</Section>

						{/* 04 — OPEN SOURCE */}
						<Section id="open-source" num="04" title="Open source" note="Contributions">
							<ul className="border-t border-[var(--rule-strong)]">
								{openSource.map((repo) => (
									<li key={repo.name} className="border-b border-[var(--rule)] py-6">
										<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
											<h3 className="font-heading text-lg font-semibold tracking-[-0.024em]">
												{repo.name}
											</h3>
											{repo.tag ? (
												<span className="ed-label border border-[var(--signal)] px-2 py-1 text-[var(--signal)]">
													{repo.tag}
												</span>
											) : null}
										</div>
										<p className="mt-3 max-w-[72ch] text-sm leading-relaxed text-muted-foreground">
											{repo.body}
										</p>
									</li>
								))}
							</ul>
						</Section>

						{/* 05 — EDUCATION */}
						<Section id="education" num="05" title="Education" note="Academic">
							<div className="border-t border-[var(--rule-strong)] pt-7">
								{education.map((school) => (
									<Entry
										key={school.org}
										period={school.period}
										title={school.org}
										org={school.qualification}
										note={school.note}
									/>
								))}
							</div>
						</Section>

						{/* 06 — QUALIFICATIONS */}
						<Section id="qualifications" num="06" title="Qualifications" note="Professional">
							<div className="border-t border-[var(--rule-strong)] pt-7">
								{qualifications.map((q) => (
									<Entry
										key={q.qualification}
										period={q.period}
										title={q.qualification}
										org={q.org}
										body={q.body}
									/>
								))}
							</div>
						</Section>

						{/* 07 — PROJECTS */}
						<Section id="projects" num="07" title="Projects" note="Three of many">
							<ol className="border-t border-[var(--rule-strong)]">
								{projects.map((project, i) => (
									<li key={project.title} className="border-b border-[var(--rule)] py-6">
										<div className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-[3rem_minmax(0,1fr)]">
											<span className="ed-sec-num pt-1.5">{String(i + 1).padStart(2, "0")}</span>
											<div>
												<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5">
													<h3 className="font-heading text-base font-semibold tracking-[-0.022em]">
														{project.title}
													</h3>
													<span className="ed-label whitespace-nowrap">{project.type}</span>
												</div>
												<p className="mt-3 max-w-[74ch] text-sm leading-relaxed text-muted-foreground">
													{project.desc}
												</p>
											</div>
										</div>
									</li>
								))}
							</ol>
							<Link
								href="/projects"
								className="ed-link mt-6 inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:text-[var(--signal)]"
							>
								Every project, with its write-up
								<ArrowRight className="size-3.5" aria-hidden="true" />
							</Link>
						</Section>

						{/* 08 — RECOGNITION */}
						<Section id="recognition" num="08" title="Recognition" note="Competitions">
							<ul className="border-t border-[var(--rule-strong)]">
								{recognition.map((item) => (
									<li key={item.title} className="border-b border-[var(--rule)] py-5">
										<p className="font-heading text-base font-semibold tracking-[-0.022em]">
											<span className="ed-accent">{item.mark}</span>
											<span aria-hidden="true" className="px-2 text-[var(--rule-strong)]">
												—
											</span>
											{item.title}
										</p>
										<p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
									</li>
								))}
							</ul>
						</Section>

						{/* 09 — AFFILIATIONS */}
						<Section id="affiliations" num="09" title="Affiliations" note="Volunteering">
							<ol className="border-t border-[var(--rule-strong)]">
								{affiliations.map((item, i) => (
									<li
										key={item}
										className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4 border-b border-[var(--rule)] py-4 text-sm"
									>
										<span className="ed-sec-num pt-0.5 opacity-60">
											{String(i + 1).padStart(2, "0")}
										</span>
										<span className="text-muted-foreground">{item}</span>
									</li>
								))}
							</ol>
						</Section>

						{/* 10 — SKILLS */}
						<Section id="skills" num="10" title="Skills" note="Technical">
							<ScrollReveal delay={0.06}>
								<dl className="border-t border-[var(--rule-strong)]">
									{skillGroups.map((group) => (
										<div key={group.label} className="ed-defrow">
											<dt className="ed-label pt-0.5">{group.label}</dt>
											<dd className="text-muted-foreground">{group.items}</dd>
										</div>
									))}
								</dl>
							</ScrollReveal>
						</Section>

						{/* 11 — LANGUAGES */}
						<Section id="languages" num="11" title="Languages" note="Spoken">
							<dl className="grid gap-px border border-[var(--rule-strong)] bg-[var(--rule)] sm:grid-cols-2">
								{languages.map((lang) => (
									<div
										key={lang.name}
										className="flex items-baseline justify-between gap-4 bg-background px-5 py-4"
									>
										<dt className="font-heading text-base font-semibold tracking-[-0.022em]">
											{lang.name}
										</dt>
										<dd className="ed-label">{lang.level}</dd>
									</div>
								))}
							</dl>
						</Section>

						{/* 12 — REFERENCES */}
						<Section id="references" num="12" title="References" note="On request">
							<p className="max-w-[60ch] border-t border-[var(--rule-strong)] pt-7 text-base leading-relaxed text-muted-foreground">
								Available on request —{" "}
								<a
									href="mailto:pasindunaduninduwara@gmail.com?subject=References"
									className="ed-link text-foreground transition-colors duration-200 hover:text-[var(--signal)]"
								>
									email me
								</a>{" "}
								and I will put you in touch.
							</p>
						</Section>
					</div>
				</div>

				<div className="ed-shell">
					<Rule />
				</div>

				{/* Closing note — the colophon of the document. */}
				<div className="ed-shell py-14">
					<div className="flex flex-wrap items-end justify-between gap-8">
						<div>
							<p className="ed-eyebrow">End of document</p>
							<p className="mt-3 max-w-[46ch] font-heading text-xl font-semibold tracking-[-0.026em]">
								Prefer the short version? The{" "}
								<Link href="/" className="ed-link text-[var(--signal)]">
									home page
								</Link>{" "}
								covers the same ground in a minute.
							</p>
						</div>
						<div className="flex flex-wrap gap-2.5">
							<Button asChild variant="outline">
								<a href="https://github.com/InduwaraSMPN" target="_blank" rel="noopener noreferrer">
									<Globe className="size-4" aria-hidden="true" />
									GitHub
									<ArrowUpRight className="size-3.5" aria-hidden="true" />
								</a>
							</Button>
							<Button asChild>
								<a href="mailto:pasindunaduninduwara@gmail.com">
									<Mail className="size-4" aria-hidden="true" />
									Email me
								</a>
							</Button>
						</div>
					</div>
				</div>
			</main>

			<SiteFooter activePage="cv" />
		</div>
	);
}
