import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { createServerClient, DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import type { Project } from "@/types/appwrite";
import MarkdownPreviewComponent from "@/components/blog/markdown-preview";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { databases } = createServerClient();

  // Fetch the project
  let project: Project | undefined;
  try {
    project = await databases.getDocument(DATABASE_ID, COLLECTIONS.PROJECTS, id) as unknown as Project;
  } catch (error) {
    console.error("Error fetching project:", error);
  }

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

          <div className="relative w-full h-[600px] mb-8 rounded-lg overflow-hidden">
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
            {project.tags.map((tag: string, index: number) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-lg font-medium mb-2">Created</h3>
              <p className="text-muted-foreground">
                {new Date(project.$createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Last Updated</h3>
              <p className="text-muted-foreground">
                {new Date(project.$updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none mb-12">
            <MarkdownPreviewComponent
              content={project.full_description || project.description}
              className="prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-blockquote:border-l-primary"
            />
          </div>
        </div>
      </main>

      <div className="mt-12">
        <SiteFooter activePage="projects" />
      </div>
    </div>
  );
}
