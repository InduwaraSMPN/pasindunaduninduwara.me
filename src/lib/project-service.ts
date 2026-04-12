import { useQuery } from '@tanstack/react-query';
import { Project } from '@/types/appwrite';

// Fetch all projects via server-side API route (avoids CORS)
export async function fetchProjects(): Promise<Project[]> {
  const response = await fetch('/api/projects');
  if (!response.ok) throw new Error('Failed to fetch projects');
  return response.json();
}

// Fetch a single project by ID
export async function fetchProjectById(id: string): Promise<Project | null> {
  try {
    const response = await fetch(`/api/projects/${id}`);
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

// Custom hook to use projects
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 5,
  });
}

// Custom hook to use a single project
export function useProject(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProjectById(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
}
