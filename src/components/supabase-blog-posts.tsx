'use client'

import { useBlogPosts } from '@/lib/blog-service-supabase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default function SupabaseBlogPosts() {
  const { data: posts, isLoading, isError } = useBlogPosts();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardContent>
            <CardFooter>
              <div className="h-9 bg-muted rounded w-24"></div>
            </CardFooter>
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {posts?.slice(0, 4).map((post) => (
        <Card key={post.id}>
          {post.thumbnail && (
            <div className="relative h-48 w-full">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
            <CardDescription>
              {new Date(post.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} • {post.categories.join(', ')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-3">
              {post.excerpt || post.content.substring(0, 150)}...
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/blog/${post.slug}`}>
                Read More
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
