import { useQuery } from '@tanstack/react-query';
import { Query } from 'appwrite';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { Project } from '@/types/appwrite';

// Fetch all projects
export async function fetchProjects(): Promise<Project[]> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.PROJECTS,
    [
      Query.orderDesc('created_at'),
      Query.limit(100),
    ]
  );
  return response.documents as unknown as Project[];
}

// Fetch a single project by ID
export async function fetchProjectById(id: string): Promise<Project | null> {
  try {
    const doc = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.PROJECTS,
      id
    );
    return doc as unknown as Project;
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
