import { Download, Globe, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

function SectionTitle({ children }: { children: React.ReactNode }) {
	return (
		<h2 className="text-2xl font-heading font-bold mb-6 tracking-tight flex items-center gap-3">
			<span className="w-8 h-0.5 bg-accent-warm rounded-full" />
			{children}
		</h2>
	);
}

function TimelineItem({
	title,
	subtitle,
	children,
}: {
	title: string;
	subtitle?: string;
	children?: React.ReactNode;
}) {
	return (
		<div className="relative pl-6 before:absolute before:-left-[5px] before:top-2.5 before:w-2 before:h-2 before:rounded-full before:bg-accent-warm before:ring-4 before:ring-accent-warm/10">
			<h3 className="text-lg font-heading font-semibold">{title}</h3>
			{subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
			{children && (
				<div className="mt-2 text-muted-foreground leading-relaxed text-sm">{children}</div>
			)}
		</div>
	);
}

export default function CVPage() {
	return (
		<div className="min-h-screen bg-background">
			<SiteHeader showAvatar={false} activePage="cv" />

			<main>
				<section className="py-16 md:py-20 px-4">
					<div className="container mx-auto max-w-4xl">
						{/* Header */}
						<ScrollReveal>
							<div className="text-center mb-16">
								<p className="text-accent-warm font-heading font-semibold text-sm tracking-widest uppercase mb-3">
									Curriculum Vitae
								</p>
								<h1 className="text-4xl md:text-5xl font-heading font-bold mb-2 tracking-tight">
									PASINDU INDUWARA
								</h1>
								<p className="text-lg text-muted-foreground mb-8">Software Engineer</p>

								<div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-sm text-muted-foreground">
									<a
										href="mailto:pasindunaduninduwara@gmail.com"
										className="inline-flex items-center gap-1.5 hover:text-accent-warm transition-colors"
									>
										<Mail className="h-3.5 w-3.5" />
										pasindunaduninduwara@gmail.com
									</a>
									<a
										href="tel:+94703477582"
										className="inline-flex items-center gap-1.5 hover:text-accent-warm transition-colors"
									>
										<Phone className="h-3.5 w-3.5" />
										(+94) 703 477 582
									</a>
									<a
										href="https://pasindunaduninduwara.me"
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1.5 hover:text-accent-warm transition-colors"
									>
										<Globe className="h-3.5 w-3.5" />
										pasindunaduninduwara.me
									</a>
									<a
										href="https://github.com/InduwaraSMPN"
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1.5 hover:text-accent-warm transition-colors"
									>
										<svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
											<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
										</svg>
										InduwaraSMPN
									</a>
									<a
										href="https://linkedin.com/in/induwarasmpn"
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1.5 hover:text-accent-warm transition-colors"
									>
										<svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
											<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
										</svg>
										induwarasmpn
									</a>
								</div>

								<div className="flex items-center justify-center gap-1.5 mb-8 text-sm text-muted-foreground">
									<MapPin className="h-3.5 w-3.5" />
									No 185/7D Lumbini Lane, Colombo, Sri Lanka
								</div>

								<Button
									asChild
									className="bg-accent-warm text-accent-warm-foreground hover:bg-accent-warm/90 font-heading"
								>
									<Link href="/Pasindu_Induwara_CV.pdf" download>
										<Download className="h-4 w-4 mr-2" />
										Download PDF Version
									</Link>
								</Button>
							</div>
						</ScrollReveal>

						<div className="space-y-14">
							{/* Profile */}
							<ScrollReveal>
								<section>
									<SectionTitle>Profile</SectionTitle>
									<p className="text-muted-foreground leading-relaxed">
										Software Engineer and active open source contributor with a passion for web
										development and building scalable solutions. Industry experience as a Software
										Engineer Intern at WSO2, where I specialized in building Internal Developer
										Portals (IDP) using Backstage and OpenChoreo. Experienced in designing
										full-stack applications, cloud deployments, and modern DevOps practices. Skilled
										in translating user needs into functional interfaces while adhering to clean
										code standards. Proficient in multiple technology stacks and committed to
										continuous learning and open source collaboration.
									</p>
								</section>
							</ScrollReveal>

							{/* Work Experience */}
							<ScrollReveal>
								<section>
									<SectionTitle>Work Experience</SectionTitle>
									<div className="space-y-6 border-l-2 border-accent-warm/15 ml-1">
										<TimelineItem
											title="Software Engineer Intern"
											subtitle="WSO2 | July 2025 - December 2025"
										>
											<ul className="list-disc list-inside space-y-1.5 mt-2">
												<li>
													Engineered a full-stack plugin for Backstage that integrated WSO2
													Choreo&apos;s deployment workflows, significantly streamlining application
													provisioning via the Software Catalog.
												</li>
												<li>
													As a core contributor to the open source Internal Developer Portal
													Platform OpenChoreo, developed a scalable Incremental Entity Ingestion
													module to optimize Kubernetes resource synchronization for
													enterprise-scale systems.
												</li>
												<li>
													Eliminated critical API bottlenecks by implementing cursor-based
													pagination, which successfully resolved timeout issues during high-volume
													data processing and ingestion cycles.
												</li>
											</ul>
										</TimelineItem>
									</div>
								</section>
							</ScrollReveal>

							{/* Open Source Contributions */}
							<ScrollReveal>
								<section>
									<SectionTitle>Open Source Contributions</SectionTitle>
									<div className="space-y-4">
										<div className="p-5 rounded-xl bg-card border border-border/50 hover:border-accent-warm/20 transition-colors">
											<div className="flex items-start justify-between gap-4 mb-2">
												<h3 className="text-base font-heading font-semibold">
													SRT (Serverless Stack)
												</h3>
												<span className="text-[10px] font-medium text-accent-warm bg-accent-warm/10 px-2 py-0.5 rounded-full whitespace-nowrap">
													Active Contributor
												</span>
											</div>
											<p className="text-sm text-muted-foreground leading-relaxed">
												Active contributor to the models.dev repository. Integrated multiple AI
												providers and configured high-demand models, optimizing both backend
												configurations and frontend UI consistency.
											</p>
										</div>
										<div className="p-5 rounded-xl bg-card border border-border/50 hover:border-accent-warm/20 transition-colors">
											<div className="flex items-start justify-between gap-4 mb-2">
												<h3 className="text-base font-heading font-semibold">KiloCode</h3>
											</div>
											<p className="text-sm text-muted-foreground leading-relaxed">
												Contributed to documentation improvements regarding model-initiated slash
												commands and editor interactions.
											</p>
										</div>
									</div>
								</section>
							</ScrollReveal>

							{/* Education */}
							<ScrollReveal>
								<section>
									<SectionTitle>Education</SectionTitle>
									<div className="space-y-6 border-l-2 border-accent-warm/15 ml-1">
										<TimelineItem
											title="University of Kelaniya | 2023 - Present"
											subtitle="B.Sc. Honours in Information Technology"
										>
											<p>Current GPA: 3.7 | Expected Graduation: October 2026</p>
										</TimelineItem>
										<TimelineItem
											title="Niwaththakachethiya National College | 2012 - 2019"
											subtitle="GCE Advanced Level & Ordinary Level"
										/>
									</div>
								</section>
							</ScrollReveal>

							{/* Professional Qualifications */}
							<ScrollReveal>
								<section>
									<SectionTitle>Professional Qualifications</SectionTitle>
									<div className="border-l-2 border-accent-warm/15 ml-1">
										<TimelineItem
											title="Trainee Full Stack Developer"
											subtitle="University of Moratuwa | Centre for Open & Distance Learning"
										>
											<p>
												Completed a full-stack developer training program covering Python
												programming, web development, and professional practice. Gained hands-on
												experience in frontend and backend technologies through Python Programming,
												Web Design, and Server-Side Development courses. Emphasized real-world
												problem-solving, modern software tools, and soft skills including
												communication, teamwork, and project management.
											</p>
										</TimelineItem>
									</div>
								</section>
							</ScrollReveal>

							{/* Skills */}
							<ScrollReveal>
								<section>
									<SectionTitle>Skills</SectionTitle>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
										<div>
											<h3 className="text-lg font-heading font-semibold mb-5">Tech Skills</h3>
											<div className="space-y-4">
												{[
													{
														label: "Programming Languages",
														items:
															"HTML, CSS, JavaScript, TypeScript, Python, Java, C/C++, SQL, XML",
													},
													{
														label: "Frameworks & Libraries",
														items:
															"React, Next.js, Tailwind CSS, Node.js, Express.js, TS-Rest, Angular, Spring Boot, Flutter, React Native, Expo, Java Servlets, JSP, jQuery, shadcn/ui, React Hook Form, Zod, Recharts, Socket.IO, FastMCP, FastAPI, WebSockets",
													},
													{
														label: "Tools & Platforms",
														items:
															"MySQL, PostgreSQL, MongoDB, Docker, Kubernetes, Azure, Firebase, Git, Maven, Apache Tomcat, Vite, Sentry, Axios, Figma, Supabase, Twilio, Faker, Hoppscotch, Eclipse, Backstage.io, WSO2 Choreo, OpenChoreo",
													},
													{
														label: "Testing & QA",
														items:
															"Selenium, TestNG, Postman, API Testing, Automation Testing, CI/CD Test Integration, Cross-browser Testing",
													},
													{
														label: "AI/ML Technologies",
														items:
															"LangChain, FAISS, Transformers, PyTorch, spaCy, Pandas, Sentence Transformers, Azure AI Services",
													},
													{
														label: "Web Development",
														items:
															"Responsive Design, UX/UI, Cross-Browser Compatibility, RESTful APIs, WebSocket Services, Authentication (JWT, OAuth, OTP), Real-Time Messaging, Cloud Deployment (Azure)",
													},
												].map((group) => (
													<div key={group.label}>
														<h4 className="text-sm font-heading font-medium text-accent-warm uppercase tracking-wider mb-1.5">
															{group.label}
														</h4>
														<p className="text-sm text-muted-foreground">{group.items}</p>
													</div>
												))}
											</div>
										</div>
										<div>
											<h3 className="text-lg font-heading font-semibold mb-5">Soft Skills</h3>
											<div className="flex flex-wrap gap-2">
												{[
													"Adaptability",
													"Creativity",
													"Critical Thinking",
													"Effective Communication",
													"Emotional Intelligence",
													"Lifelong Learning",
													"Problem Solving",
													"Team Collaboration",
													"Time Management",
												].map((skill) => (
													<span
														key={skill}
														className="px-3 py-1.5 text-xs font-medium rounded-full bg-secondary text-secondary-foreground border border-border"
													>
														{skill}
													</span>
												))}
											</div>
										</div>
									</div>
								</section>
							</ScrollReveal>

							{/* Personal Projects */}
							<ScrollReveal>
								<section>
									<SectionTitle>Personal Projects</SectionTitle>
									<div className="space-y-6">
										{[
											{
												title: "Guidia - Full-Stack Career Guidance Platform",
												type: "Individual Project",
												desc: "Comprehensive career guidance platform to digitize the University of Kelaniya's recruitment and counseling processes. Built a robust full-stack solution using React, TypeScript, and Zod for the frontend, backed by an Express and MySQL architecture with Socket.IO for real-time messaging. Deployed the application on Azure Container Apps with Azure Blob Storage, integrating multi-AI services to connect students, counselors, and companies effectively.",
											},
											{
												title: "Browtrix - MCP Browser Automation Ecosystem",
												type: "Individual Project",
												desc: "Real-time AI automation ecosystem using the Model Context Protocol (MCP) to bridge AI assistants with web browsers. Engineered a high-performance backend using Python FastMCP, FastAPI, and WebSockets within a Turbo monorepo to enable complex human-in-the-loop workflows. Built a cutting-edge frontend with Next.js 15, React 19, and Tailwind CSS 4, featuring HTML5 manufacturing, interactive configuration modals, and connections pooling for seamless automation.",
											},
											{
												title: "Quota.app - Fuel Quota Management System",
												type: "Group Project",
												desc: "Microservice-based fuel management system connecting vehicle owners, stations, and administrators. Developed a Spring Boot backend with JWT authentication and JPA, integrated with three Next.js frontends and an Expo/React Native mobile app. Implemented QR-based transaction processing, SMS notifications via Twilio, and PostgreSQL reporting to handle real-time quota tracking and fuel distribution.",
											},
											{
												title: "Personalized Ad-Copy Generation",
												type: "AI/NLP Group Project",
												desc: "RAG-based ad generator using T5, FAISS, and LangChain deployed on Azure AI. Optimized NLP pipelines with FP16, gradient accumulation, and dynamic GPU memory for high-performance inference.",
											},
											{
												title: 'Multi-Link Sharing Platform ("Linky")',
												type: "Group Project",
												desc: "Cloud-native platform for personalized landing pages with multiple external links. Deployed on Azure using Kubernetes and Docker with MongoDB Atlas. Ensured high availability, load balancing, and TLS encryption.",
											},
											{
												title: "Hela Rasa Recipe Android Mobile Application",
												type: "Group Project",
												desc: "Android app for managing and sharing recipes with user login, multimedia-supported recipe creation/editing, and social sharing. Designed UI/UX with wireframes, used Firebase for cloud storage with thorough testing.",
											},
											{
												title: "Automated QA Testing Framework",
												type: "Group Project",
												desc: "Developed automated testing framework using Selenium, TestNG, and Eclipse for cross-browser testing. Implemented testing techniques including Equivalence Partitioning, Boundary Value Analysis, and Decision Table Testing. Executed automated test suites via Azure DevOps CI/CD pipelines with Postman for API testing and generated comprehensive test reports.",
											},
										].map((project) => (
											<div
												key={project.title}
												className="p-5 rounded-xl bg-card border border-border/50 hover:border-accent-warm/20 transition-colors"
											>
												<div className="flex items-start justify-between gap-4 mb-2">
													<h3 className="text-base font-heading font-semibold">{project.title}</h3>
													<span className="text-[10px] font-medium text-accent-warm bg-accent-warm/10 px-2 py-0.5 rounded-full whitespace-nowrap">
														{project.type}
													</span>
												</div>
												<p className="text-sm text-muted-foreground leading-relaxed">
													{project.desc}
												</p>
											</div>
										))}
									</div>
								</section>
							</ScrollReveal>

							{/* Achievements */}
							<ScrollReveal>
								<section>
									<SectionTitle>Achievements</SectionTitle>
									<div className="space-y-4">
										<div className="p-5 rounded-xl bg-accent-warm/5 border border-accent-warm/15">
											<h3 className="font-heading font-semibold">
												<span className="text-accent-warm">First Runner-Up</span> — J&apos;PURA EXPO
												2023
											</h3>
											<p className="text-sm text-muted-foreground mt-1">
												Inter University Export-Oriented Innovation Competition
											</p>
										</div>
										<div className="p-5 rounded-xl bg-accent-warm/5 border border-accent-warm/15">
											<h3 className="font-heading font-semibold">
												<span className="text-accent-warm">Semi-Finalist</span> — Venture Verse
												Startup Challenge
											</h3>
											<p className="text-sm text-muted-foreground mt-1">
												Ceylon Treasure project, Sabaragamuwa University
											</p>
										</div>
									</div>
								</section>
							</ScrollReveal>

							{/* Volunteer Work */}
							<ScrollReveal>
								<section>
									<SectionTitle>Volunteer Work & Affiliations</SectionTitle>
									<div className="space-y-2">
										{[
											"Assistant Media Director, Industrial Management Science Students' Association (IMSSA), 2024-2025",
											"Member, AIESEC Colombo North Local Committee, 2023-2025",
											"Member, Gavel Club - University of Kelaniya, 2023-2025",
											"Volunteer, Sasnaka Sansada Foundation, 2022-2024",
										].map((item) => (
											<p
												key={item}
												className="text-sm text-muted-foreground pl-4 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-accent-warm/40"
											>
												{item}
											</p>
										))}
									</div>
								</section>
							</ScrollReveal>

							{/* Languages */}
							<ScrollReveal>
								<section>
									<SectionTitle>Languages</SectionTitle>
									<div className="flex gap-4">
										<span className="px-4 py-2 rounded-xl bg-card border border-border text-sm font-medium">
											English <span className="text-muted-foreground">(Fluent)</span>
										</span>
										<span className="px-4 py-2 rounded-xl bg-card border border-border text-sm font-medium">
											Sinhala <span className="text-muted-foreground">(Native Speaker)</span>
										</span>
									</div>
								</section>
							</ScrollReveal>

							{/* References */}
							<ScrollReveal>
								<section>
									<SectionTitle>References</SectionTitle>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="p-5 rounded-xl bg-card border border-border/50">
											<h3 className="font-heading font-semibold">Chathumini Nandadewa</h3>
											<p className="text-sm text-muted-foreground mt-1">
												Project Manager | Spire Solutions DMCC
											</p>
											<p className="text-sm text-muted-foreground">Dubai, United Arab Emirates</p>
											<div className="mt-3 space-y-1 text-sm text-muted-foreground">
												<p className="flex items-center gap-1.5">
													<Phone className="h-3 w-3 text-accent-warm" /> (+971) 581 086 505
												</p>
												<p className="flex items-center gap-1.5">
													<Mail className="h-3 w-3 text-accent-warm" />{" "}
													chathumini@spiresolutions.com
												</p>
											</div>
										</div>
										<div className="p-5 rounded-xl bg-card border border-border/50">
											<h3 className="font-heading font-semibold">Dr. Ruwan Wickramarachchi</h3>
											<p className="text-sm text-muted-foreground mt-1">
												Senior Lecturer | Department of Industrial Management
											</p>
											<p className="text-sm text-muted-foreground">
												University of Kelaniya, Sri Lanka
											</p>
											<div className="mt-3 space-y-1 text-sm text-muted-foreground">
												<p className="flex items-center gap-1.5">
													<Phone className="h-3 w-3 text-accent-warm" /> (+94) 11 291 4482
												</p>
												<p className="flex items-center gap-1.5">
													<Mail className="h-3 w-3 text-accent-warm" /> ruwan@kln.ac.lk
												</p>
											</div>
										</div>
									</div>
								</section>
							</ScrollReveal>
						</div>
					</div>
				</section>
			</main>

			<SiteFooter activePage="cv" />
		</div>
	);
}
