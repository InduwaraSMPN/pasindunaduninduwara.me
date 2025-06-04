
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import SupabaseProjects from "@/components/supabase-projects";

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

            <SupabaseProjects limit={9} />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
