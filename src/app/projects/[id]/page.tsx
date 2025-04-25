import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// Sample project data (in a real app, this would come from a database or CMS)
const projects = [
  {
    id: "1",
    title: "E-commerce Website Redesign",
    description: "A complete redesign of an e-commerce platform focusing on user experience and conversion optimization.",
    fullDescription: `
      This project involved a comprehensive redesign of an e-commerce platform to improve user experience and increase conversion rates. The client was experiencing high bounce rates and low conversion despite having quality products.

      My approach included:

      1. Conducting user research to understand pain points
      2. Creating user personas and journey maps
      3. Redesigning the information architecture
      4. Developing wireframes and high-fidelity prototypes
      5. Conducting usability testing
      6. Implementing the final design

      The redesign resulted in a 35% increase in conversion rate and a 25% decrease in bounce rate within the first three months after launch.
    `,
    image: "/placeholder-project-1.jpg",
    additionalImages: ["/placeholder-project-2.jpg", "/placeholder-project-3.jpg"],
    tags: ["UI/UX", "Web Design", "E-commerce"],
    technologies: ["Figma", "Adobe XD", "HTML/CSS", "JavaScript"],
    client: "RetailCo Inc.",
    year: "2024",
    link: "https://example.com"
  },
  {
    id: "2",
    title: "Mobile Banking App",
    description: "A modern mobile banking application with a focus on security and ease of use.",
    fullDescription: `
      This mobile banking app was designed to provide users with a secure and intuitive way to manage their finances on the go. The client wanted to modernize their digital presence and provide better service to their customers.

      Key features included:

      1. Biometric authentication
      2. Real-time transaction monitoring
      3. Expense categorization and budgeting tools
      4. Bill payment and transfers
      5. Investment portfolio management
      6. Customer support integration

      The app was designed with a focus on accessibility and security, ensuring that all users could easily navigate and manage their finances while maintaining the highest level of data protection.
    `,
    image: "/placeholder-project-2.jpg",
    additionalImages: ["/placeholder-project-1.jpg", "/placeholder-project-3.jpg"],
    tags: ["Mobile Design", "UI/UX", "Fintech"],
    technologies: ["Sketch", "Principle", "Swift", "Kotlin"],
    client: "SecureBank",
    year: "2023",
    link: "https://example.com"
  },
  {
    id: "3",
    title: "Healthcare Dashboard",
    description: "An intuitive dashboard for healthcare professionals to monitor patient data.",
    fullDescription: `
      This healthcare dashboard was designed to help medical professionals monitor patient data efficiently. The goal was to create an interface that would allow doctors and nurses to quickly access critical information and make informed decisions.

      The dashboard features:

      1. Real-time patient vital monitoring
      2. Medication tracking and alerts
      3. Lab results visualization
      4. Patient history and notes
      5. Appointment scheduling
      6. Integration with electronic health records

      The design process involved close collaboration with healthcare professionals to ensure that the dashboard met their specific needs and workflow requirements. The final product significantly reduced the time spent on administrative tasks, allowing medical staff to focus more on patient care.
    `,
    image: "/placeholder-project-3.jpg",
    additionalImages: ["/placeholder-project-1.jpg", "/placeholder-project-2.jpg"],
    tags: ["Dashboard", "Healthcare", "Data Visualization"],
    technologies: ["Figma", "D3.js", "React", "TypeScript"],
    client: "MediCare Systems",
    year: "2024",
    link: "https://example.com"
  }
];

export default function ProjectPage({ params }: { params: { id: string } }) {
  const project = projects.find(p => p.id === params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader showAvatar={false} activePage="projects" />

      <main className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <Link href="/projects" className="text-primary hover:underline flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
              Back to Projects
            </Link>
          </div>

          <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <h1 className="text-4xl font-bold mb-4">{project.title}</h1>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag, index) => (
              <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div>
              <h3 className="text-lg font-medium mb-2">Client</h3>
              <p className="text-muted-foreground">{project.client}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Year</h3>
              <p className="text-muted-foreground">{project.year}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Technologies</h3>
              <p className="text-muted-foreground">{project.technologies.join(', ')}</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none mb-12">
            {project.fullDescription.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {project.additionalImages && project.additionalImages.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Project Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.additionalImages.map((img, index) => (
                  <div key={index} className="relative h-64 rounded-lg overflow-hidden">
                    <Image
                      src={img}
                      alt={`${project.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.link && (
            <div className="text-center">
              <Button size="lg" asChild>
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  Visit Project
                </a>
              </Button>
            </div>
          )}
        </div>
      </main>

      <div className="mt-12">
        <SiteFooter />
      </div>
    </div>
  );
}
