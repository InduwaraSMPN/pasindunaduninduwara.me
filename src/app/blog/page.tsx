import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import SupabaseBlogPosts from "@/components/supabase-blog-posts";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader showAvatar={false} activePage="blog" />

      <main>
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-5xl">
            <h1 className="text-4xl font-bold mb-4">My Blog</h1>
            <p className="text-xl text-muted-foreground mb-12">
              Thoughts, ideas, and insights on design, development, and technology.
            </p>

            <SupabaseBlogPosts />
          </div>
        </section>
      </main>

      <SiteFooter activePage="blog" />
    </div>
  );
}
