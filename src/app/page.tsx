import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Download } from "lucide-react";
import SupabaseProjects from "@/components/supabase-projects";
import SupabaseBlogPosts from "@/components/supabase-blog-posts";
import ContactForm from "@/components/contact-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader activePage="home" />

      <main>
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Full Stack Developer & IT Undergraduate</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Creating functional, visually engaging web applications with a focus on user experience.
              </p>
              <div className="flex gap-4">
                <Button asChild>
                  <Link href="#projects">View Projects</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="#contact">Contact Me</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary">
                <Image
                  src="/placeholder-profile.jpg"
                  alt="Pasindu Nadun Induwara"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-4 bg-muted/20">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold mb-12 text-center">About Me</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-semibold mb-4">My Background</h3>
                <p className="mb-4">
                  I am a motivated and dynamic IT undergraduate with a strong passion for web development and a keen interest in UX/UI engineering. I&apos;m currently pursuing my B.Sc. Honours in Information Technology at the University of Kelaniya (2023 - Present).
                </p>
                <p className="mb-4">
                  I&apos;m experienced in designing and developing full-stack web applications, with a solid understanding of both frontend and backend technologies. Skilled in translating user needs into functional, visually engaging interfaces, while adhering to modern software development practices.
                </p>
                <p className="mb-4">
                  Proficient in code writing, testing, and debugging, with a commitment to continuous learning and staying current with the latest tools, frameworks, and industry trends.
                </p>
                <div className="mt-6">
                  <Button variant="outline" asChild>
                    <Link href="/Pasindu_Induwara_CV.pdf" download>
                      <Download className="h-4 w-4 mr-2" />
                      Download Full CV
                    </Link>
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Skills & Expertise</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Programming Languages</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span>HTML, CSS, JavaScript</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span>TypeScript</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span>Python</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span>Java, C/C++</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span>SQL</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Frameworks & Libraries</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span>React, Node.js</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span>Angular, Spring Boot</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span>Flutter</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span>PyTorch, Transformers</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Tools & Platforms</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span>MySQL, MongoDB</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span>Docker, Kubernetes</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span>Azure, Firebase</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span>Git, Maven</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Web Development</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span>Responsive Design</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span>UX/UI Design</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span>RESTful APIs</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span>Authentication (JWT, OAuth)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold mb-12 text-center">Featured Projects</h2>
            <SupabaseProjects limit={3} isHomePage={true} />
            <div className="mt-12 text-center">
              <Button variant="outline" asChild>
                <Link href="/projects">View All Projects</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="py-20 px-4 bg-muted/20">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold mb-12 text-center">Latest from My Blog</h2>
            <SupabaseBlogPosts />
            <div className="mt-12 text-center">
              <Button variant="outline" asChild>
                <Link href="/blog">View All Posts</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold mb-4 text-center">Get In Touch</h2>
            <p className="text-muted-foreground mb-8 text-center">
              Have a project in mind or want to collaborate? Feel free to reach out!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <ContactForm />
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                      <div>
                        <p className="font-medium">Phone</p>
                        <a href="tel:+94703477582" className="text-muted-foreground hover:text-primary">+94 70 347 7582</a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                      <div>
                        <p className="font-medium">Email</p>
                        <a href="mailto:pasindunaduninduwara@gmail.com" className="text-muted-foreground hover:text-primary">pasindunaduninduwara@gmail.com</a>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Connect</h3>
                  <div className="flex gap-4">
                    <Button variant="outline" size="icon" asChild>
                      <a href="https://github.com/InduwaraSMPN" target="_blank" rel="noopener noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                      </a>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <a href="https://linkedin.com/in/induwarasmpn" target="_blank" rel="noopener noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
