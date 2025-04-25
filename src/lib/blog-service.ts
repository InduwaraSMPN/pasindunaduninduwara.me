import { useQuery } from '@tanstack/react-query';

interface BlogPost {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  thumbnail: string;
  categories: string[];
}

// Function to fetch Medium RSS feed
async function fetchMediumPosts(username: string): Promise<BlogPost[]> {
  // Medium RSS feed URL with CORS proxy
  const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${username}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch Medium posts');
  }
  
  const data = await response.json();
  
  // Transform the data into our BlogPost format
  return data.items.map((item: any) => ({
    title: item.title,
    link: item.link,
    pubDate: new Date(item.pubDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    content: item.content,
    thumbnail: item.thumbnail,
    categories: item.categories
  }));
}

// Custom hook to use the Medium posts
export function useMediumPosts(username: string) {
  return useQuery({
    queryKey: ['medium-posts', username],
    queryFn: () => fetchMediumPosts(username),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
