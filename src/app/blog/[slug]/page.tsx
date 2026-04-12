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
import { ArrowLeft } from "lucide-react";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { databases } = createServerClient();

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

      <main className="py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-8">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-warm transition-colors font-medium">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </div>

          <header className="mb-10">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((category: string, index: number) => (
                <Badge key={index} variant="default">
                  {category}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 tracking-tight leading-[1.15]">{post.title}</h1>
            <time dateTime={post.published_at ?? undefined} className="text-sm text-muted-foreground">
              {formatDate(post.published_at ?? post.$createdAt)}
            </time>
          </header>

          {post.thumbnail && (
            <div className="relative w-full aspect-[16/9] mb-10 rounded-2xl overflow-hidden ring-1 ring-border">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <article className="prose prose-lg max-w-none mb-16 prose-headings:font-heading prose-headings:tracking-tight">
            <MarkdownPreviewComponent
              content={post.content}
              className="prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-blockquote:border-l-accent-warm"
            />
          </article>

          <Card className="mt-16">
            <CardHeader>
              <CardTitle className="font-heading">Comments</CardTitle>
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
