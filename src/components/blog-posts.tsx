'use client'

import { useBlogPosts } from '@/lib/blog-service';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StaggerContainer, StaggerItem } from '@/components/ui/scroll-reveal';

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^>\s+/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/\n\s*\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function BlogPosts() {
  const { data: posts, isLoading, isError } = useBlogPosts();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-muted/60 rounded-t-xl" />
            <CardHeader>
              <div className="h-5 bg-muted/60 rounded-lg w-3/4 mb-2"></div>
              <div className="h-4 bg-muted/40 rounded-lg w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3.5 bg-muted/40 rounded-lg w-full mb-2.5"></div>
              <div className="h-3.5 bg-muted/30 rounded-lg w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Blog Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Unable to load blog posts. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted/60 mb-5">
          <FileText className="h-7 w-7 text-muted-foreground/60" />
        </div>
        <p className="text-muted-foreground text-sm">No blog posts published yet. Stay tuned!</p>
      </div>
    );
  }

  return (
    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6" staggerDelay={0.12}>
      {posts?.slice(0, 4).map((post) => (
        <StaggerItem key={post.$id} className="h-full">
          <Link href={`/blog/${post.slug}`} className="block h-full">
            <Card className="group overflow-hidden flex flex-col h-full cursor-pointer">
              {post.thumbnail && (
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              )}
              <CardHeader>
                <CardTitle className="font-heading text-lg leading-snug group-hover:text-accent-warm transition-colors duration-300">{post.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 flex-wrap">
                  <time className="text-[11px] text-muted-foreground/70">
                    {new Date(post.published_at ?? post.$createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </time>
                  <span className="text-border/60">|</span>
                  <div className="flex gap-1.5">
                    {post.categories.slice(0, 2).map((cat, i) => (
                      <Badge key={i} variant="default" className="text-[10px] px-2 py-0">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground/80 line-clamp-3 leading-relaxed">
                  {post.excerpt
                    ? stripMarkdown(post.excerpt).substring(0, 150)
                    : stripMarkdown(post.content).substring(0, 150)
                  }...
                </p>
              </CardContent>
              <CardFooter>
                <span className="text-accent-warm text-sm font-heading font-medium inline-flex items-center gap-1">
                  Read More
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </CardFooter>
            </Card>
          </Link>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
