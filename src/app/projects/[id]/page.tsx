import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { createServerClient, DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import type { Project } from "@/types/appwrite";
import MarkdownPreviewComponent from "@/components/blog/markdown-preview";
import { ArrowLeft, Calendar, RefreshCw } from "lucide-react";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { databases } = createServerClient();

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

      <main className="py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-warm transition-colors font-medium">
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Link>
          </div>

          <div className="relative w-full aspect-[16/9] mb-10 rounded-2xl overflow-hidden ring-1 ring-border">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 tracking-tight">{project.title}</h1>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag: string, index: number) => (
              <Badge key={index} variant="default">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-6 mb-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-accent-warm" />
              <span>Created {new Date(project.$createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-accent-warm" />
              <span>Updated {new Date(project.$updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          </div>

          <article className="prose prose-lg max-w-none mb-12 prose-headings:font-heading prose-headings:tracking-tight">
            <MarkdownPreviewComponent
              content={project.full_description || project.description}
              className="prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-blockquote:border-l-accent-warm"
            />
          </article>
        </div>
      </main>

      <div className="mt-12">
        <SiteFooter activePage="projects" />
      </div>
    </div>
  );
}
