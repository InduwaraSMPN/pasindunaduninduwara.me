'use client'

import { useBlogPosts } from '@/lib/blog-service';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
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
            <div className="h-48 bg-muted rounded-t-xl" />
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
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

  return (
    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6" staggerDelay={0.12}>
      {posts?.slice(0, 4).map((post) => (
        <StaggerItem key={post.$id}>
          <Card className="group overflow-hidden">
            {post.thumbnail && (
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            )}
            <CardHeader>
              <CardTitle className="font-heading text-lg leading-snug">{post.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 flex-wrap">
                <time className="text-xs">
                  {new Date(post.published_at ?? post.$createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </time>
                <span className="text-border">|</span>
                <div className="flex gap-1.5">
                  {post.categories.slice(0, 2).map((cat, i) => (
                    <Badge key={i} variant="default" className="text-[10px] px-2 py-0">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {post.excerpt
                  ? stripMarkdown(post.excerpt).substring(0, 150)
                  : stripMarkdown(post.content).substring(0, 150)
                }...
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" asChild className="text-accent-warm hover:text-accent-warm hover:bg-accent-warm/10 -ml-2 font-heading">
                <Link href={`/blog/${post.slug}`}>
                  Read More
                  <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
