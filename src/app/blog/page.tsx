import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import BlogPosts from "@/components/blog-posts";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader showAvatar={false} activePage="blog" />

      <main>
        <section className="py-16 md:py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <ScrollReveal>
              <p className="text-accent-warm font-heading font-semibold text-sm tracking-widest uppercase mb-3">Insights & Ideas</p>
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 tracking-tight">My Blog</h1>
              <p className="text-lg text-muted-foreground mb-16 max-w-lg">
                Thoughts, ideas, and insights on design, development, and technology.
              </p>
            </ScrollReveal>

            <BlogPosts />
          </div>
        </section>
      </main>

      <SiteFooter activePage="blog" />
    </div>
  );
}
