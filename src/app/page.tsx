import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Download, ArrowRight } from "lucide-react";
import ProjectsList from "@/components/projects-list";
import BlogPosts from "@/components/blog-posts";
import ContactForm from "@/components/contact-form";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader activePage="home" />

      <main>
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 px-4 overflow-hidden">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-accent-warm/5 blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent-warm/3 blur-[100px]" />
          </div>

          <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center gap-12 md:gap-16">
            <ScrollReveal variant="slide-left" className="flex-1">
              <p className="text-accent-warm font-heading font-semibold text-sm tracking-widest uppercase mb-4">
                Software Engineer
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 leading-[1.1] tracking-tight">
                Crafting Digital
                <br />
                Experiences with
                <br />
                <span className="text-accent-warm">Purpose</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                Software Engineer and open source contributor building scalable full-stack
                applications with clean code and thoughtful, engaging interfaces.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-accent-warm text-accent-warm-foreground hover:bg-accent-warm/90 font-heading font-semibold">
                  <Link href="#projects">
                    View Projects
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="#contact">Contact Me</Link>
                </Button>
              </div>
              {/* Social links */}
              <div className="flex items-center gap-3 mt-8 pt-8 border-t border-border/50">
                <a
                  href="https://github.com/InduwaraSMPN"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  className="p-2 rounded-lg text-muted-foreground hover:text-accent-warm hover:bg-accent-warm/10 transition-all duration-200"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a
                  href="https://linkedin.com/in/induwarasmpn"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  className="p-2 rounded-lg text-muted-foreground hover:text-accent-warm hover:bg-accent-warm/10 transition-all duration-200"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <span className="text-xs text-muted-foreground/60 ml-2">Based in Sri Lanka</span>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="slide-right" delay={0.2} className="flex-1 flex justify-center">
              <div className="relative">
                {/* Decorative ring */}
                <div className="absolute -inset-3 rounded-full border-2 border-dashed border-accent-warm/20 animate-[spin_30s_linear_infinite]" />
                <div className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden">
                  <Image
                    src="/placeholder-profile.jpg"
                    alt="Pasindu Nadun Induwara"
                    fill
                    sizes="(max-width: 768px) 256px, 320px"
                    className="object-cover"
                    priority
                  />
                </div>
                {/* Floating accent dot */}
                <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-accent-warm shadow-lg shadow-accent-warm/30" />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 px-4 relative">
          <div className="absolute inset-0 bg-muted/40 -z-10" />
          <div className="container mx-auto max-w-5xl">
            <ScrollReveal>
              <p className="text-accent-warm font-heading font-semibold text-sm tracking-widest uppercase mb-3 text-center">Get to Know Me</p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-16 text-center tracking-tight">About Me</h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <ScrollReveal variant="slide-left" delay={0.1}>
                <h3 className="text-xl font-heading font-semibold mb-4">My Background</h3>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Software Engineer and active open source contributor with a passion for web development and building scalable solutions. Industry experience as a Software Engineer Intern at WSO2, specializing in Internal Developer Portals using Backstage and OpenChoreo.
                  </p>
                  <p>
                    Experienced in designing full-stack applications, cloud deployments, and modern DevOps practices. Skilled in translating user needs into functional interfaces while adhering to clean code standards.
                  </p>
                  <p>
                    Proficient in multiple technology stacks and committed to continuous learning and open source collaboration.
                  </p>
                </div>

                <div className="mt-8">
                  <h4 className="text-lg font-heading font-semibold mb-4">Experience & Education</h4>
                  <div className="space-y-4">
                    <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:rounded-full before:bg-accent-warm">
                      <p className="font-medium">WSO2 (July 2025 - December 2025)</p>
                      <p className="text-sm text-muted-foreground">Software Engineer Intern</p>
                    </div>
                    <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:rounded-full before:bg-accent-warm/60">
                      <p className="font-medium">University of Kelaniya (2023 - Present)</p>
                      <p className="text-sm text-muted-foreground">B.Sc. Honours in Information Technology | GPA: 3.7</p>
                    </div>
                    <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:rounded-full before:bg-accent-warm/30">
                      <p className="font-medium">University of Moratuwa - CODL</p>
                      <p className="text-sm text-muted-foreground">Trainee Full Stack Developer</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <Button variant="outline" asChild>
                    <Link href="/Pasindu_Induwara_CV.pdf" download>
                      <Download className="h-4 w-4 mr-2" />
                      Download CV
                    </Link>
                  </Button>
                  <Button asChild className="bg-accent-warm text-accent-warm-foreground hover:bg-accent-warm/90">
                    <Link href="/cv">View Full CV</Link>
                  </Button>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="slide-right" delay={0.2}>
                <h3 className="text-xl font-heading font-semibold mb-4">Skills & Expertise</h3>

                <StaggerContainer className="space-y-6" staggerDelay={0.05}>
                  <StaggerItem>
                    <h4 className="font-heading font-medium text-sm text-accent-warm uppercase tracking-wider mb-3">Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C/C++', 'SQL'].map(s => (
                        <span key={s} className="px-3 py-1.5 text-xs font-medium rounded-full bg-accent-warm/10 text-accent-warm border border-accent-warm/20">
                          {s}
                        </span>
                      ))}
                    </div>
                  </StaggerItem>

                  <StaggerItem>
                    <h4 className="font-heading font-medium text-sm text-accent-warm uppercase tracking-wider mb-3">Frameworks</h4>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'Next.js', 'Node.js', 'Angular', 'Spring Boot', 'Flutter'].map(s => (
                        <span key={s} className="px-3 py-1.5 text-xs font-medium rounded-full bg-secondary text-secondary-foreground border border-border">
                          {s}
                        </span>
                      ))}
                    </div>
                  </StaggerItem>

                  <StaggerItem>
                    <h4 className="font-heading font-medium text-sm text-accent-warm uppercase tracking-wider mb-3">Tools & Platforms</h4>
                    <div className="flex flex-wrap gap-2">
                      {['MySQL', 'PostgreSQL', 'MongoDB', 'Docker', 'Kubernetes', 'Azure', 'Git'].map(s => (
                        <span key={s} className="px-3 py-1.5 text-xs font-medium rounded-full bg-secondary text-secondary-foreground border border-border">
                          {s}
                        </span>
                      ))}
                    </div>
                  </StaggerItem>

                  <StaggerItem>
                    <h4 className="font-heading font-medium text-sm text-accent-warm uppercase tracking-wider mb-3">Web Development</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Responsive Design', 'UX/UI', 'RESTful APIs', 'JWT/OAuth', 'Real-Time Messaging'].map(s => (
                        <span key={s} className="px-3 py-1.5 text-xs font-medium rounded-full bg-secondary text-secondary-foreground border border-border">
                          {s}
                        </span>
                      ))}
                    </div>
                  </StaggerItem>
                </StaggerContainer>

                <div className="mt-10">
                  <h4 className="font-heading font-medium text-sm text-accent-warm uppercase tracking-wider mb-4">Achievements</h4>
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-card border border-border/50">
                      <p className="font-medium text-sm"><span className="text-accent-warm font-heading">1st Runners-Up</span> — J&apos;PURA EXPO 2023</p>
                      <p className="text-xs text-muted-foreground mt-1">Inter University Export-Oriented Innovation Competition</p>
                    </div>
                    <div className="p-4 rounded-xl bg-card border border-border/50">
                      <p className="font-medium text-sm"><span className="text-accent-warm font-heading">Semi-Finalist</span> — Venture Verse Startup Challenge</p>
                      <p className="text-xs text-muted-foreground mt-1">Ceylon Treasure project</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-24 px-4">
          <div className="container mx-auto max-w-5xl">
            <ScrollReveal>
              <p className="text-accent-warm font-heading font-semibold text-sm tracking-widest uppercase mb-3 text-center">My Work</p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-16 text-center tracking-tight">Featured Projects</h2>
            </ScrollReveal>
            <ProjectsList limit={3} isHomePage={true} />
            <ScrollReveal delay={0.3}>
              <div className="mt-12 text-center">
                <Button variant="outline" asChild size="lg">
                  <Link href="/projects">
                    View All Projects
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="py-24 px-4 relative">
          <div className="absolute inset-0 bg-muted/40 -z-10" />
          <div className="container mx-auto max-w-5xl">
            <ScrollReveal>
              <p className="text-accent-warm font-heading font-semibold text-sm tracking-widest uppercase mb-3 text-center">Insights</p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-16 text-center tracking-tight">Latest from My Blog</h2>
            </ScrollReveal>
            <BlogPosts />
            <ScrollReveal delay={0.3}>
              <div className="mt-12 text-center">
                <Button variant="outline" asChild size="lg">
                  <Link href="/blog">
                    View All Posts
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 px-4">
          <div className="container mx-auto max-w-3xl">
            <ScrollReveal>
              <p className="text-accent-warm font-heading font-semibold text-sm tracking-widest uppercase mb-3 text-center">Let&apos;s Connect</p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-center tracking-tight">Get In Touch</h2>
              <p className="text-muted-foreground mb-12 text-center max-w-md mx-auto">
                Have a project in mind or want to collaborate? Feel free to reach out!
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <ScrollReveal variant="slide-left" delay={0.1}>
                <ContactForm />
              </ScrollReveal>

              <ScrollReveal variant="slide-right" delay={0.2}>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-heading font-semibold mb-4">Contact Information</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3 group">
                        <div className="mt-1 p-2 rounded-lg bg-accent-warm/10 text-accent-warm">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        </div>
                        <div>
                          <p className="font-medium text-sm">Phone</p>
                          <a href="tel:+94703477582" className="text-muted-foreground hover:text-accent-warm transition-colors text-sm">+94 70 347 7582</a>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 group">
                        <div className="mt-1 p-2 rounded-lg bg-accent-warm/10 text-accent-warm">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        </div>
                        <div>
                          <p className="font-medium text-sm">Email</p>
                          <a href="mailto:pasindunaduninduwara@gmail.com" className="text-muted-foreground hover:text-accent-warm transition-colors text-sm">pasindunaduninduwara@gmail.com</a>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-heading font-semibold mb-4">Connect</h3>
                    <div className="flex gap-3">
                      <a
                        href="https://github.com/InduwaraSMPN"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:border-accent-warm/50 hover:bg-accent-warm/5 transition-all duration-200 text-sm font-medium"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        GitHub
                      </a>
                      <a
                        href="https://linkedin.com/in/induwarasmpn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:border-accent-warm/50 hover:bg-accent-warm/5 transition-all duration-200 text-sm font-medium"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        LinkedIn
                      </a>
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
