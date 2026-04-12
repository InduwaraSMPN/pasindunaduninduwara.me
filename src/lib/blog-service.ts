import { useQuery } from '@tanstack/react-query';
import { BlogPost } from '@/types/appwrite';

// Fetch all published blog posts via server-side API route (avoids CORS)
export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const response = await fetch('/api/blog');
  if (!response.ok) throw new Error('Failed to fetch blog posts');
  return response.json();
}

// Fetch a single blog post by slug
export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const response = await fetch(`/api/blog/by-slug/${slug}`);
  if (!response.ok) return null;
  return response.json();
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
