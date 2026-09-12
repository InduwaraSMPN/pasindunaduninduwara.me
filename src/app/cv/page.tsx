import { ArrowUpRight, Download, Globe, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { PageMasthead } from "@/components/page-masthead";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Rule, ScrollReveal, SectionHead } from "@/components/ui/scroll-reveal";

export const metadata: Metadata = {
	title: "Curriculum Vitae — Pasindu Nadun Induwara",
	description:
		"Full curriculum vitae: experience at WSO2, open source contributions, education, projects and references.",
};

/* ---------------------------------------------------------------------------
   Content
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
	{ label: "Location", value: "Colombo, Sri Lanka", href: null },
];

/** The document's running index, mirrored in the sticky sidebar. */
const contents = [
	{ id: "profile", num: "01", title: "Profile" },
	{ id: "experience", num: "02", title: "Experience" },
	{ id: "open-source", num: "03", title: "Open source" },
	{ id: "education", num: "04", title: "Education" },
	{ id: "qualifications", num: "05", title: "Qualifications" },
	{ id: "skills", num: "06", title: "Skills" },
	{ id: "projects", num: "07", title: "Projects" },
	{ id: "recognition", num: "08", title: "Recognition" },
	{ id: "affiliations", num: "09", title: "Affiliations" },
	{ id: "languages", num: "10", title: "Languages" },
	{ id: "references", num: "11", title: "References" },
];

/** Masthead headline, split into lines for the masked reveal. */
// biome-ignore-start lint/correctness/useJsxKeyInIterable: prop value, not a rendered child — MaskedLines assigns keys when it maps over it
const mastheadLines = [<>Pasindu Nadun</>, <span className="ed-accent">Induwara</span>];
// biome-ignore-end lint/correctness/useJsxKeyInIterable: end of suppression range

const experience = [
	{
		period: "Jul — Dec 2025",
		role: "Software Engineer Intern",
		org: "WSO2",
		place: "Internal Developer Portals",
		bullets: [
			"Engineered a full-stack plugin for Backstage that integrated WSO2 Choreo's deployment workflows, significantly streamlining application provisioning via the Software Catalog.",
			"As a core contributor to the open source Internal Developer Portal Platform OpenChoreo, developed a scalable Incremental Entity Ingestion module to optimize Kubernetes resource synchronization for enterprise-scale systems.",
			"Eliminated critical API bottlenecks by implementing cursor-based pagination, which successfully resolved timeout issues during high-volume data processing and ingestion cycles.",
		],
	},
];

const openSource = [
	{
		name: "SRT (Serverless Stack)",
		tag: "Active contributor",
		body: "Active contributor to the models.dev repository. Integrated multiple AI providers and configured high-demand models, optimizing both backend configurations and frontend UI consistency.",
	},
	{
		name: "KiloCode",
		tag: null,
		body: "Contributed to documentation improvements regarding model-initiated slash commands and editor interactions.",
	},
];

const education = [
	{
		period: "2023 — present",
		org: "University of Kelaniya",
		qualification: "B.Sc. Honours in Information Technology",
		note: "Current GPA 3.7 · Expected graduation October 2026",
	},
	{
		period: "2012 — 2019",
		org: "Niwaththakachethiya National College",
		qualification: "GCE Advanced Level & Ordinary Level",
		note: null,
	},
];

const qualifications = [
	{
		period: "University of Moratuwa",
		org: "Centre for Open & Distance Learning",
		qualification: "Trainee Full Stack Developer",
		body: "Completed a full-stack developer training program covering Python programming, web development, and professional practice. Gained hands-on experience in frontend and backend technologies through Python Programming, Web Design, and Server-Side Development courses. Emphasized real-world problem-solving, modern software tools, and soft skills including communication, teamwork, and project management.",
	},
];

const skillGroups = [
	{
		label: "Languages",
		items: "HTML, CSS, JavaScript, TypeScript, Python, Java, C/C++, SQL, XML",
	},
	{
		label: "Frameworks",
		items:
			"React, Next.js, Tailwind CSS, Node.js, Express.js, TS-Rest, Angular, Spring Boot, Flutter, React Native, Expo, Java Servlets, JSP, jQuery, shadcn/ui, React Hook Form, Zod, Recharts, Socket.IO, FastMCP, FastAPI, WebSockets",
	},
	{
		label: "Tools & platforms",
		items:
			"MySQL, PostgreSQL, MongoDB, Docker, Kubernetes, Azure, Firebase, Git, Maven, Apache Tomcat, Vite, Sentry, Axios, Figma, Supabase, Twilio, Faker, Hoppscotch, Eclipse, Backstage.io, WSO2 Choreo, OpenChoreo",
	},
	{
		label: "Testing & QA",
		items:
			"Selenium, TestNG, Postman, API testing, Automation testing, CI/CD test integration, Cross-browser testing",
	},
	{
		label: "AI / ML",
		items:
			"LangChain, FAISS, Transformers, PyTorch, spaCy, Pandas, Sentence Transformers, Azure AI Services",
	},
	{
		label: "Web practice",
		items:
			"Responsive design, UX/UI, Cross-browser compatibility, RESTful APIs, WebSocket services, Authentication (JWT, OAuth, OTP), Real-time messaging, Cloud deployment (Azure)",
	},
];

const softSkills = [
	"Adaptability",
	"Creativity",
	"Critical thinking",
	"Effective communication",
	"Emotional intelligence",
	"Lifelong learning",
	"Problem solving",
	"Team collaboration",
	"Time management",
];

const projects = [
	{
		title: "Guidia — Full-Stack Career Guidance Platform",
		type: "Individual",
		desc: "Comprehensive career guidance platform to digitize the University of Kelaniya's recruitment and counseling processes. Built a robust full-stack solution using React, TypeScript, and Zod for the frontend, backed by an Express and MySQL architecture with Socket.IO for real-time messaging. Deployed the application on Azure Container Apps with Azure Blob Storage, integrating multi-AI services to connect students, counselors, and companies effectively.",
	},
	{
		title: "Browtrix — MCP Browser Automation Ecosystem",
		type: "Individual",
		desc: "Real-time AI automation ecosystem using the Model Context Protocol (MCP) to bridge AI assistants with web browsers. Engineered a high-performance backend using Python FastMCP, FastAPI, and WebSockets within a Turbo monorepo to enable complex human-in-the-loop workflows. Built a cutting-edge frontend with Next.js 15, React 19, and Tailwind CSS 4, featuring HTML5 manufacturing, interactive configuration modals, and connections pooling for seamless automation.",
	},
	{
		title: "Quota.app — Fuel Quota Management System",
		type: "Group",
		desc: "Microservice-based fuel management system connecting vehicle owners, stations, and administrators. Developed a Spring Boot backend with JWT authentication and JPA, integrated with three Next.js frontends and an Expo/React Native mobile app. Implemented QR-based transaction processing, SMS notifications via Twilio, and PostgreSQL reporting to handle real-time quota tracking and fuel distribution.",
	},
	{
		title: "Personalized Ad-Copy Generation",
		type: "AI / NLP",
		desc: "RAG-based ad generator using T5, FAISS, and LangChain deployed on Azure AI. Optimized NLP pipelines with FP16, gradient accumulation, and dynamic GPU memory for high-performance inference.",
	},
	{
		title: "Multi-Link Sharing Platform (Linky)",
		type: "Group",
		desc: "Cloud-native platform for personalized landing pages with multiple external links. Deployed on Azure using Kubernetes and Docker with MongoDB Atlas. Ensured high availability, load balancing, and TLS encryption.",
	},
	{
		title: "Hela Rasa Recipe Android Application",
		type: "Group",
		desc: "Android app for managing and sharing recipes with user login, multimedia-supported recipe creation/editing, and social sharing. Designed UI/UX with wireframes, used Firebase for cloud storage with thorough testing.",
	},
	{
		title: "Automated QA Testing Framework",
		type: "Group",
		desc: "Developed automated testing framework using Selenium, TestNG, and Eclipse for cross-browser testing. Implemented testing techniques including Equivalence Partitioning, Boundary Value Analysis, and Decision Table Testing. Executed automated test suites via Azure DevOps CI/CD pipelines with Postman for API testing and generated comprehensive test reports.",
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
		title: "Venture Verse Startup Challenge",
		note: "Ceylon Treasure project — Sabaragamuwa University",
	},
];

const affiliations = [
	"Assistant Media Director, Industrial Management Science Students' Association (IMSSA), 2024–2025",
	"Member, AIESEC Colombo North Local Committee, 2023–2025",
	"Member, Gavel Club — University of Kelaniya, 2023–2025",
	"Volunteer, Sasnaka Sansada Foundation, 2022–2024",
];

const languages = [
	{ name: "English", level: "Fluent" },
	{ name: "Sinhala", level: "Native speaker" },
];

const references = [
	{
		name: "Chathumini Nandadewa",
		role: "Project Manager · Spire Solutions DMCC",
		place: "Dubai, United Arab Emirates",
		phone: "(+971) 581 086 505",
		email: "chathumini@spiresolutions.com",
	},
	{
		name: "Dr. Ruwan Wickramarachchi",
		role: "Senior Lecturer · Department of Industrial Management",
		place: "University of Kelaniya, Sri Lanka",
		phone: "(+94) 11 291 4482",
		email: "ruwan@kln.ac.lk",
	},
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
	bullets?: string[];
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
								<Bullet key={b}>{b}</Bullet>
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
					note="Updated September 2026"
					lines={mastheadLines}
					lede={
						<>
							Software engineer and open source contributor. Six months building Internal Developer
							Portals at WSO2, a scalable ingestion module for OpenChoreo, and a habit of shipping
							full-stack work end to end.
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
							Colombo, Sri Lanka — open to relocation
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
									Software Engineer and active open source contributor with a passion for web
									development and building scalable solutions. Industry experience as a Software
									Engineer Intern at WSO2, where I specialized in building Internal Developer
									Portals (IDP) using Backstage and OpenChoreo. Experienced in designing full-stack
									applications, cloud deployments, and modern DevOps practices. Skilled in
									translating user needs into functional interfaces while adhering to clean code
									standards. Proficient in multiple technology stacks and committed to continuous
									learning and open source collaboration.
								</p>
							</ScrollReveal>
						</Section>

						{/* 02 — EXPERIENCE */}
						<Section id="experience" num="02" title="Experience" note="Industry">
							<div className="border-t border-[var(--rule-strong)]">
								{experience.map((job) => (
									<Entry
										key={job.role}
										period={job.period}
										title={job.role}
										org={`${job.org} — ${job.place}`}
										bullets={job.bullets}
									/>
								))}
							</div>
						</Section>

						{/* 03 — OPEN SOURCE */}
						<Section id="open-source" num="03" title="Open source" note="Public repositories">
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

						{/* 04 — EDUCATION */}
						<Section id="education" num="04" title="Education" note="Academic">
							<div className="border-t border-[var(--rule-strong)]">
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

						{/* 05 — QUALIFICATIONS */}
						<Section id="qualifications" num="05" title="Qualifications" note="Professional">
							<div className="border-t border-[var(--rule-strong)]">
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

						{/* 06 — SKILLS */}
						<Section id="skills" num="06" title="Skills" note="Technical & interpersonal">
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

							<ScrollReveal delay={0.12}>
								<div className="mt-12">
									<h3 className="ed-label mb-4">Interpersonal</h3>
									<ul className="flex flex-wrap gap-2">
										{softSkills.map((skill) => (
											<li
												key={skill}
												className="border border-[var(--rule-strong)] px-3 py-1.5 text-xs font-medium transition-colors duration-200 hover:border-foreground"
											>
												{skill}
											</li>
										))}
									</ul>
								</div>
							</ScrollReveal>
						</Section>

						{/* 07 — PROJECTS */}
						<Section id="projects" num="07" title="Projects" note="Seven of many">
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

						{/* 10 — LANGUAGES */}
						<Section id="languages" num="10" title="Languages" note="Spoken">
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

						{/* 11 — REFERENCES */}
						<Section id="references" num="11" title="References" note="Available on request">
							<div className="grid gap-px border border-[var(--rule-strong)] bg-[var(--rule)] sm:grid-cols-2">
								{references.map((ref) => (
									<div key={ref.name} className="flex flex-col gap-3 bg-background p-6">
										<div>
											<h3 className="font-heading text-base font-semibold tracking-[-0.022em]">
												{ref.name}
											</h3>
											<p className="mt-1 text-sm text-muted-foreground">{ref.role}</p>
											<p className="mt-0.5 text-sm text-muted-foreground">{ref.place}</p>
										</div>
										<div className="flex flex-col gap-1.5 border-t border-[var(--rule)] pt-3">
											<a
												href={`tel:${ref.phone.replace(/[^+\d]/g, "")}`}
												className="ed-meta ed-link inline-flex w-fit items-center gap-2 transition-colors duration-200 hover:text-[var(--signal)]"
											>
												<Phone className="size-3" aria-hidden="true" />
												{ref.phone}
											</a>
											<a
												href={`mailto:${ref.email}`}
												className="ed-meta ed-link inline-flex w-fit items-center gap-2 transition-colors duration-200 hover:text-[var(--signal)]"
											>
												<Mail className="size-3" aria-hidden="true" />
												{ref.email}
											</a>
										</div>
									</div>
								))}
							</div>
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
