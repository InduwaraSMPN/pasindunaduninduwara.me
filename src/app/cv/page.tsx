import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Download, Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";

export default function CVPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader showAvatar={false} activePage="cv" />

      <main>
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">PASINDU INDUWARA</h1>
              <p className="text-xl text-muted-foreground mb-6">IT UNDERGRADUATE</p>
              
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:pasindunaduninduwara@gmail.com" className="text-sm hover:text-primary">
                    pasindunaduninduwara@gmail.com
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4" />
                  <a href="tel:+94703477582" className="text-sm hover:text-primary">
                    (+94) 703 477 582
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Github className="h-4 w-4" />
                  <a href="https://github.com/InduwaraSMPN" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary">
                    github.com/InduwaraSMPN
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Linkedin className="h-4 w-4" />
                  <a href="https://linkedin.com/in/induwarasmpn" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary">
                    linkedin.com/in/induwarasmpn
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mb-8">
                <MapPin className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">
                  No 72, Thissa Mawatha, Old Town, Anuradhapura
                </span>
              </div>

              <Button asChild>
                <Link href="/Pasindu_Induwara_CV.pdf" download>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF Version
                </Link>
              </Button>
            </div>

            {/* Profile */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">PROFILE</h2>
              <p className="text-muted-foreground leading-relaxed">
                Motivated and dynamic IT undergraduate with a strong passion for web development and a keen interest in UX/UI 
                engineering. Experienced in designing and developing full-stack web applications, with a solid understanding of both frontend 
                and backend technologies. Skilled in translating user needs into functional, visually engaging interfaces, while adhering to 
                modern software development practices. Proficient in code writing, testing, and debugging, with a commitment to continuous 
                learning and staying current with the latest tools, frameworks, and industry trends.
              </p>
            </section>

            {/* Education */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">EDUCATION</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">UNIVERSITY OF KELANIYA | 2023 - PRESENT</h3>
                  <p className="text-muted-foreground">• B.Sc. Honours in Information Technology</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">NIWATHTHAKACHETHIYA NATIONAL COLLEGE | 2012 - 2019</h3>
                  <p className="text-muted-foreground">• GCE Advanced Level</p>
                  <p className="text-muted-foreground">• GCE Ordinary Level</p>
                </div>
              </div>
            </section>

            {/* Professional Qualifications */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">PROFESSIONAL QUALIFICATIONS</h2>
              <div>
                <h3 className="text-lg font-semibold mb-2">Trainee Full Stack Developer</h3>
                <p className="font-medium text-muted-foreground mb-3">University of Moratuwa | Centre for Open & Distance Learning</p>
                <p className="text-muted-foreground leading-relaxed">
                  Completed a Full Stack Developer training program at the University of Moratuwa&apos;s Centre for Open & Distance Learning,
                  covering Python programming, web development, and professional practice. Gained hands-on experience in both frontend 
                  and backend technologies through courses like Python Programming, Web Design, and Server-Side Development. The 
                  program emphasized real-world problem solving, modern software tools, and soft skills such as communication, teamwork, 
                  and project management. A final capstone project reinforced technical and analytical abilities, while promoting a mindset for 
                  lifelong learning in the fast-changing ICT field.
                </p>
              </div>
            </section>

            {/* Skills */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">SKILLS</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Tech Skills</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Programming Languages:</h4>
                      <p className="text-sm text-muted-foreground">HTML, CSS, JavaScript, TypeScript, Python, Java, C/C++, SQL</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Frameworks & Libraries:</h4>
                      <p className="text-sm text-muted-foreground">React, Node.js, Angular, Spring Boot, Flutter</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Tools & Platforms:</h4>
                      <p className="text-sm text-muted-foreground">MySQL, MongoDB Atlas, Docker, Kubernetes, Azure, Firebase, Git, Maven, Apache Tomcat, Vite, Sentry, Axios, FAISS</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Web Development:</h4>
                      <p className="text-sm text-muted-foreground">Responsive Design, UX/UI, Cross-Browser Compatibility, RESTful APIs, Authentication (JWT, OAuth, OTP), Real-Time Messaging</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Other Technologies:</h4>
                      <p className="text-sm text-muted-foreground">SFML, spaCy, Transformers, SentenceTransformers, PyTorch, Pandas, MS Office</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Soft Skills</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-sm text-muted-foreground">• Effective Communication</p>
                    <p className="text-sm text-muted-foreground">• Critical Thinking</p>
                    <p className="text-sm text-muted-foreground">• Problem Solving</p>
                    <p className="text-sm text-muted-foreground">• Team Collaboration</p>
                    <p className="text-sm text-muted-foreground">• Project Management</p>
                    <p className="text-sm text-muted-foreground">• Time Management</p>
                    <p className="text-sm text-muted-foreground">• Adaptability</p>
                    <p className="text-sm text-muted-foreground">• Creativity</p>
                    <p className="text-sm text-muted-foreground">• Self-Motivation</p>
                    <p className="text-sm text-muted-foreground">• Lifelong Learning</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Personal Projects */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">PERSONAL PROJECTS</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Guidia - Full-Stack Career Guidance Platform (Individual Project)</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Currently developing a web application to digitize the University of Kelaniya&apos;s manual career guidance process. The platform
                    connects students, counselors, and employers with features like secure role-based authentication (JWT, bcrypt), email OTP
                    verification, profile management with Azure Blob Storage, a job board, appointment scheduling, and real-time messaging with
                    notifications. Built using React (TypeScript, Vite, Tailwind CSS), Node.js (Express, TypeScript), and MySQL, with Axios,
                    React Router, and Sentry for enhanced functionality.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Personalized Ad-Copy Generation – AI/NLP Project (Group Project)</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Developed an AI system to generate personalized ad copy using user profiles and product data. Used a RAG approach by
                    integrating FAISS for similarity search and T5 for text generation, with Sentence Transformers for added context. Created
                    synthetic data with Faker, applied NLP techniques for segmentation, and optimized performance using FP16, gradient
                    accumulation, and dynamic GPU memory management. Built with Python, PyTorch, Transformers, spaCy, and Pandas.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Multi-Link Sharing Platform (&quot;Linky&quot;) (Group Project)</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Created a cloud-native platform for personalized landing pages with multiple external links. Deployed on Azure using
                    Kubernetes for scalability and Docker for containerization, with MongoDB Atlas for cloud storage. Focused on high availability,
                    load balancing, and TLS encryption. Technologies include React, Node.js, Docker, Kubernetes, Azure, and MongoDB.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Employee Management Web Application (Group Project)</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Built a Spring Boot-based web app for managing employee data via RESTful APIs. Features include CRUD operations, search,
                    input validation, and security against SQL injection/XSS. Enhanced performance with caching and deployed on Azure.
                    Contributed to architecture, development, and documentation.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Employee Management System (Individual Project)</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Developed a web-based system using Java Servlets, JSP, and XML to manage employee records. Features include create, edit,
                    delete, search, and sort functionality. The responsive UI uses Bootstrap and jQuery, with deployment on Apache Tomcat and
                    dependencies managed via Maven.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Hela Rasa Recipe Android Mobile Application (Group Project)</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Created an Android app for managing and sharing recipes with features like user login, multimedia-supported recipe creation/
                    editing, and social sharing. Designed an intuitive UI/UX with wireframes, used Firebase for cloud data storage, and conducted
                    thorough testing to ensure quality.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Calky - Cross-Platform Calculator Mobile Application (Individual Project)</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Developed a cross-platform calculator app in Flutter with a clean, responsive UI for Android and iOS. Supports core arithmetic
                    operations with input validation, error handling (e.g., divide by zero), and clear/reset functionality for smooth usage across
                    devices.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Zombie Jumper – 2D Platformer Game (Group Project)</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Created a 2D game using C++ and SFML with features like player movement, platform generation, collision detection,
                    scoring, and menus. Utilized a state-managed game loop and SFML for graphics and input handling. Provided complete
                    documentation and build instructions.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">BLOOD DONATION Management System (&quot;BLOOD LINK&quot;) (Group Project)</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Built a Java-MySQL system for managing donor registrations, inventory, and donation tracking. Applied OOP principles for
                    efficient backend development and strong database design to streamline operations.
                  </p>
                </div>
              </div>
            </section>

            {/* Achievements */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">ACHIEVEMENTS</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">First Runners-Up</h3>
                  <p className="text-muted-foreground">• J&apos;PURA EXPO 2023, Inter University Export-Oriented Innovation Competition.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Semi-Finalist</h3>
                  <p className="text-muted-foreground">• Achieved Semifinalist status for the project Ceylon Treasure in the Venture Verse Startup Challenge conducted by Sabaragamuwa University.</p>
                </div>
              </div>
            </section>

            {/* Volunteer Work */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">VOLUNTEER WORK AND AFFILIATIONS</h2>
              <div className="space-y-2">
                <p className="text-muted-foreground">• Assistant Media Director, Industrial Management Science Students&apos; Association (IMSSA), 2024 - 2025</p>
                <p className="text-muted-foreground">• Member, AIESEC Colombo North Local Committee, 2023 - 2025</p>
                <p className="text-muted-foreground">• Member, Gavel Club - University of Kelaniya, 2023 - 2025</p>
                <p className="text-muted-foreground">• Volunteer, Sasnaka Sansada Foundation, 2022 - 2024</p>
              </div>
            </section>

            {/* Languages */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">LANGUAGES</h2>
              <div className="grid grid-cols-2 gap-4">
                <p className="text-muted-foreground">• English (Fluent)</p>
                <p className="text-muted-foreground">• Sinhala (Native Speaker)</p>
              </div>
            </section>

            {/* References */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">REFERENCE</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold">Chathumini Nandadewa</h3>
                  <p className="text-muted-foreground">Project Manager | Spire Solutions DMCC</p>
                  <p className="text-muted-foreground">Dubai, United Arab Emirates.</p>
                  <p className="text-muted-foreground">Phone: (+971) 581 086 505</p>
                  <p className="text-muted-foreground">Email: chathumini@spiresolutions.com</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Dr. Ruwan Wickramarachchi</h3>
                  <p className="text-muted-foreground">Senior Lecturer | Department of Industrial Management</p>
                  <p className="text-muted-foreground">University of Kelaniya, Sri Lanka.</p>
                  <p className="text-muted-foreground">Phone: (+94) 11 291 4482</p>
                  <p className="text-muted-foreground">Email: ruwan@kln.ac.lk</p>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>

      <SiteFooter activePage="cv" />
    </div>
  );
}
