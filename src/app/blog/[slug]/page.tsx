import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { fetchBlogPostBySlug } from "@/lib/blog-service-supabase";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  let post;
  
  try {
    post = await fetchBlogPostBySlug(params.slug);
  } catch (error) {
    console.error("Error fetching blog post:", error);
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader showAvatar={false} activePage="blog" />

      <main className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <Link href="/blog" className="text-primary hover:underline flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
              Back to Blog
            </Link>
          </div>

          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center gap-4 text-muted-foreground mb-8">
            <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
            <div className="flex flex-wrap gap-2">
              {post.categories.map((category: string, index: number) => (
                <Badge key={index} variant="outline">
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {post.thumbnail && (
            <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </main>

      <div className="mt-12">
        <SiteFooter />
      </div>
    </div>
  );
}
