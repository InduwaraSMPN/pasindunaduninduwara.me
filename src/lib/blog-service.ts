import { useQuery } from '@tanstack/react-query';
import { Query } from 'appwrite';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { BlogPost } from '@/types/appwrite';

// Fetch all published blog posts
export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.BLOG_POSTS,
    [
      Query.equal('published', true),
      Query.orderDesc('published_at'),
      Query.limit(100),
    ]
  );
  return response.documents as unknown as BlogPost[];
}

// Fetch a single blog post by slug
export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.BLOG_POSTS,
    [
      Query.equal('slug', slug),
      Query.equal('published', true),
      Query.limit(1),
    ]
  );
  return (response.documents[0] as unknown as BlogPost) ?? null;
}

// Custom hook to use blog posts
export function useBlogPosts() {
  return useQuery({
    queryKey: ['blog-posts'],
    queryFn: fetchBlogPosts,
    staleTime: 1000 * 60 * 5,
  });
}

// Custom hook to use a single blog post
export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => fetchBlogPostBySlug(slug),
    staleTime: 1000 * 60 * 5,
    enabled: !!slug,
  });
}
