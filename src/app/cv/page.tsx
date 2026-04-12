import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Download, Mail, Phone, MapPin } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-heading font-bold mb-6 tracking-tight flex items-center gap-3">
      <span className="w-8 h-0.5 bg-accent-warm rounded-full" />
      {children}
    </h2>
  );
}

function TimelineItem({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="relative pl-6 before:absolute before:-left-[5px] before:top-2.5 before:w-2 before:h-2 before:rounded-full before:bg-accent-warm before:ring-4 before:ring-accent-warm/10">
      <h3 className="text-lg font-heading font-semibold">{title}</h3>
      {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      {children && <div className="mt-2 text-muted-foreground leading-relaxed text-sm">{children}</div>}
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
                <p className="text-accent-warm font-heading font-semibold text-sm tracking-widest uppercase mb-3">Curriculum Vitae</p>
                <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2 tracking-tight">PASINDU INDUWARA</h1>
                <p className="text-lg text-muted-foreground mb-8">IT Undergraduate</p>

                <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-sm text-muted-foreground">
                  <a href="mailto:pasindunaduninduwara@gmail.com" className="inline-flex items-center gap-1.5 hover:text-accent-warm transition-colors">
                    <Mail className="h-3.5 w-3.5" />
                    pasindunaduninduwara@gmail.com
                  </a>
                  <a href="tel:+94703477582" className="inline-flex items-center gap-1.5 hover:text-accent-warm transition-colors">
                    <Phone className="h-3.5 w-3.5" />
                    (+94) 703 477 582
                  </a>
                  <a href="https://github.com/InduwaraSMPN" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-accent-warm transition-colors">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    InduwaraSMPN
                  </a>
                  <a href="https://linkedin.com/in/induwarasmpn" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-accent-warm transition-colors">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    induwarasmpn
                  </a>
                </div>

                <div className="flex items-center justify-center gap-1.5 mb-8 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  No 72, Thissa Mawatha, Old Town, Anuradhapura
                </div>

                <Button asChild className="bg-accent-warm text-accent-warm-foreground hover:bg-accent-warm/90 font-heading">
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
                    Motivated and dynamic IT undergraduate with a strong passion for web development and a keen interest in UX/UI
                    engineering. Experienced in designing and developing full-stack web applications, with a solid understanding of both frontend
                    and backend technologies. Skilled in translating user needs into functional, visually engaging interfaces, while adhering to
                    modern software development practices. Proficient in code writing, testing, and debugging, with a commitment to continuous
                    learning and staying current with the latest tools, frameworks, and industry trends.
                  </p>
                </section>
              </ScrollReveal>

              {/* Education */}
              <ScrollReveal>
                <section>
                  <SectionTitle>Education</SectionTitle>
                  <div className="space-y-6 border-l-2 border-accent-warm/15 ml-1">
                    <TimelineItem title="University of Kelaniya | 2023 - Present" subtitle="B.Sc. Honours in Information Technology" />
                    <TimelineItem title="Niwaththakachethiya National College | 2012 - 2019" subtitle="GCE Advanced Level & Ordinary Level" />
                  </div>
                </section>
              </ScrollReveal>

              {/* Professional Qualifications */}
              <ScrollReveal>
                <section>
                  <SectionTitle>Professional Qualifications</SectionTitle>
                  <TimelineItem
                    title="Trainee Full Stack Developer"
                    subtitle="University of Moratuwa | Centre for Open & Distance Learning"
                  >
                    <p>
                      Completed a Full Stack Developer training program covering Python programming, web development, and professional practice.
                      Gained hands-on experience in both frontend and backend technologies. The program emphasized real-world problem solving,
                      modern software tools, and soft skills such as communication, teamwork, and project management.
                    </p>
                  </TimelineItem>
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
                          { label: 'Programming Languages', items: 'HTML, CSS, JavaScript, TypeScript, Python, Java, C/C++, SQL' },
                          { label: 'Frameworks & Libraries', items: 'React, Node.js, Angular, Spring Boot, Flutter' },
                          { label: 'Tools & Platforms', items: 'MySQL, MongoDB Atlas, Docker, Kubernetes, Azure, Firebase, Git, Maven, Apache Tomcat, Vite, Sentry' },
                          { label: 'Web Development', items: 'Responsive Design, UX/UI, RESTful APIs, JWT/OAuth, Real-Time Messaging' },
                          { label: 'Other', items: 'SFML, spaCy, Transformers, SentenceTransformers, PyTorch, Pandas' },
                        ].map((group) => (
                          <div key={group.label}>
                            <h4 className="text-sm font-heading font-medium text-accent-warm uppercase tracking-wider mb-1.5">{group.label}</h4>
                            <p className="text-sm text-muted-foreground">{group.items}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-heading font-semibold mb-5">Soft Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {['Effective Communication', 'Critical Thinking', 'Problem Solving', 'Team Collaboration', 'Project Management', 'Time Management', 'Adaptability', 'Creativity', 'Self-Motivation', 'Lifelong Learning'].map((skill) => (
                          <span key={skill} className="px-3 py-1.5 text-xs font-medium rounded-full bg-secondary text-secondary-foreground border border-border">
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
                        title: 'Guidia - Full-Stack Career Guidance Platform',
                        type: 'Individual Project',
                        desc: 'Web application to digitize career guidance connecting students, counselors, and employers. Features secure role-based authentication (JWT, bcrypt), email OTP verification, profile management with Azure Blob Storage, job board, appointment scheduling, and real-time messaging. Built with React, Node.js, MySQL.',
                      },
                      {
                        title: 'Personalized Ad-Copy Generation',
                        type: 'AI/NLP Group Project',
                        desc: 'AI system generating personalized ad copy using RAG approach with FAISS for similarity search and T5 for text generation. Built with Python, PyTorch, Transformers, spaCy, and Pandas.',
                      },
                      {
                        title: 'Multi-Link Sharing Platform ("Linky")',
                        type: 'Group Project',
                        desc: 'Cloud-native platform for personalized landing pages. Deployed on Azure with Kubernetes, Docker, and MongoDB Atlas. Focused on high availability, load balancing, and TLS encryption.',
                      },
                      {
                        title: 'Employee Management Web Application',
                        type: 'Group Project',
                        desc: 'Spring Boot-based web app with RESTful APIs, CRUD operations, input validation, and security against SQL injection/XSS. Deployed on Azure with caching for performance.',
                      },
                      {
                        title: 'Hela Rasa Recipe Android App',
                        type: 'Group Project',
                        desc: 'Android app for managing and sharing recipes with multimedia support, social sharing, Firebase cloud storage, and intuitive UI/UX.',
                      },
                      {
                        title: 'Calky - Calculator Mobile App',
                        type: 'Individual Project',
                        desc: 'Cross-platform Flutter calculator with clean responsive UI for Android and iOS, input validation, and error handling.',
                      },
                      {
                        title: 'Zombie Jumper - 2D Platformer Game',
                        type: 'Group Project',
                        desc: '2D game built with C++ and SFML featuring player movement, platform generation, collision detection, scoring, and state-managed game loop.',
                      },
                      {
                        title: 'BLOOD LINK - Donation Management System',
                        type: 'Group Project',
                        desc: 'Java-MySQL system for managing donor registrations, inventory, and donation tracking with OOP principles and strong database design.',
                      },
                    ].map((project) => (
                      <div key={project.title} className="p-5 rounded-xl bg-card border border-border/50 hover:border-accent-warm/20 transition-colors">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="text-base font-heading font-semibold">{project.title}</h3>
                          <span className="text-[10px] font-medium text-accent-warm bg-accent-warm/10 px-2 py-0.5 rounded-full whitespace-nowrap">{project.type}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{project.desc}</p>
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
                      <h3 className="font-heading font-semibold"><span className="text-accent-warm">First Runners-Up</span> — J&apos;PURA EXPO 2023</h3>
                      <p className="text-sm text-muted-foreground mt-1">Inter University Export-Oriented Innovation Competition</p>
                    </div>
                    <div className="p-5 rounded-xl bg-accent-warm/5 border border-accent-warm/15">
                      <h3 className="font-heading font-semibold"><span className="text-accent-warm">Semi-Finalist</span> — Venture Verse Startup Challenge</h3>
                      <p className="text-sm text-muted-foreground mt-1">Ceylon Treasure project, Sabaragamuwa University</p>
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
                      'Assistant Media Director, IMSSA (2024-2025)',
                      'Member, AIESEC Colombo North Local Committee (2023-2025)',
                      'Member, Gavel Club - University of Kelaniya (2023-2025)',
                      'Volunteer, Sasnaka Sansada Foundation (2022-2024)',
                    ].map((item) => (
                      <p key={item} className="text-sm text-muted-foreground pl-4 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-accent-warm/40">
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
                    <span className="px-4 py-2 rounded-xl bg-card border border-border text-sm font-medium">English <span className="text-muted-foreground">(Fluent)</span></span>
                    <span className="px-4 py-2 rounded-xl bg-card border border-border text-sm font-medium">Sinhala <span className="text-muted-foreground">(Native)</span></span>
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
                      <p className="text-sm text-muted-foreground mt-1">Project Manager | Spire Solutions DMCC</p>
                      <p className="text-sm text-muted-foreground">Dubai, UAE</p>
                      <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                        <p className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-accent-warm" /> (+971) 581 086 505</p>
                        <p className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-accent-warm" /> chathumini@spiresolutions.com</p>
                      </div>
                    </div>
                    <div className="p-5 rounded-xl bg-card border border-border/50">
                      <h3 className="font-heading font-semibold">Dr. Ruwan Wickramarachchi</h3>
                      <p className="text-sm text-muted-foreground mt-1">Senior Lecturer | Dept. of Industrial Management</p>
                      <p className="text-sm text-muted-foreground">University of Kelaniya, Sri Lanka</p>
                      <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                        <p className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-accent-warm" /> (+94) 11 291 4482</p>
                        <p className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-accent-warm" /> ruwan@kln.ac.lk</p>
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
