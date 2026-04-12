import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import CommentForm from "@/components/blog/comment-form";
import CommentsList from "@/components/blog/comments-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createServerClient, DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import type { BlogPost } from "@/types/appwrite";
import MarkdownPreviewComponent from "@/components/blog/markdown-preview";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { databases } = createServerClient();

  // Fetch the blog post
  let post: BlogPost | undefined;
  try {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.BLOG_POSTS, [
      Query.equal('slug', slug),
      Query.equal('published', true),
      Query.limit(1),
    ]);
    post = result.documents[0] as unknown as BlogPost | undefined;
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
            <time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at ?? post.$createdAt)}</time>
            <div className="flex flex-wrap gap-2">
              {post.categories.map((category: string, index: number) => (
                <Badge key={index} variant="outline">
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {post.thumbnail && (
            <div className="relative w-full h-[600px] mb-8 rounded-lg overflow-hidden">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none mb-12">
            <MarkdownPreviewComponent
              content={post.content}
              className="prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-blockquote:border-l-primary"
            />
          </div>

          {/* Comments Section */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <CommentsList postId={post.$id} />
              <CommentForm postId={post.$id} />
            </CardContent>
          </Card>
        </div>
      </main>

      <div className="mt-12">
        <SiteFooter activePage="blog" />
      </div>
    </div>
  );
}
