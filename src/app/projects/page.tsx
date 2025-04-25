import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// Sample project data (in a real app, this would come from a database or CMS)
const projects = [
  {
    id: 1,
    title: "E-commerce Website Redesign",
    description: "A complete redesign of an e-commerce platform focusing on user experience and conversion optimization.",
    image: "/placeholder-project-1.jpg",
    tags: ["UI/UX", "Web Design", "E-commerce"],
    link: "/projects/1"
  },
  {
    id: 2,
    title: "Mobile Banking App",
    description: "A modern mobile banking application with a focus on security and ease of use.",
    image: "/placeholder-project-2.jpg",
    tags: ["Mobile Design", "UI/UX", "Fintech"],
    link: "/projects/2"
  },
  {
    id: 3,
    title: "Healthcare Dashboard",
    description: "An intuitive dashboard for healthcare professionals to monitor patient data.",
    image: "/placeholder-project-3.jpg",
    tags: ["Dashboard", "Healthcare", "Data Visualization"],
    link: "/projects/3"
  },
  {
    id: 4,
    title: "Travel Booking Platform",
    description: "A comprehensive travel booking platform with a modern and intuitive interface.",
    image: "/placeholder-project-1.jpg",
    tags: ["Web Design", "Travel", "Booking"],
    link: "/projects/4"
  },
  {
    id: 5,
    title: "Food Delivery App",
    description: "A food delivery application with a focus on quick ordering and real-time tracking.",
    image: "/placeholder-project-2.jpg",
    tags: ["Mobile Design", "Food & Beverage", "UI/UX"],
    link: "/projects/5"
  },
  {
    id: 6,
    title: "Educational Platform",
    description: "An educational platform designed to enhance learning experiences for students.",
    image: "/placeholder-project-3.jpg",
    tags: ["EdTech", "Web Design", "UI/UX"],
    link: "/projects/6"
  }
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader showAvatar={false} activePage="projects" />

      <main>
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-5xl">
            <h1 className="text-4xl font-bold mb-4">My Projects</h1>
            <p className="text-xl text-muted-foreground mb-12">
              A collection of my digital design work and projects.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>
                      {project.tags.join(' • ')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{project.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={project.link}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
