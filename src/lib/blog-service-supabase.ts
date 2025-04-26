import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  thumbnail: string;
  categories: string[];
  published_at: string;
  created_at?: string;
  updated_at?: string;
}

// Create a Supabase client for the browser
const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// Fetch all blog posts
export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    throw new Error(error.message || 'Error fetching blog posts');
  }

  return data || [];
}

// Fetch a single blog post by slug
export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    throw new Error(error.message || `Error fetching blog post with slug ${slug}`);
  }

  return data;
}

// Custom hook to use blog posts
export function useBlogPosts() {
  return useQuery({
    queryKey: ['blog-posts'],
    queryFn: fetchBlogPosts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Custom hook to use a single blog post
export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => fetchBlogPostBySlug(slug),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!slug, // Only run the query if we have a slug
  });
}
