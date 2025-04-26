import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';

export interface Project {
  id: number;
  title: string;
  description: string;
  full_description?: string;
  image: string;
  tags: string[];
  created_at?: string;
  updated_at?: string;
}

// Fetch all projects
export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching projects:', error);
    throw new Error(error.message);
  }
  
  return data || [];
}

// Fetch a single project by ID
export async function fetchProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching project with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return data;
}

// Custom hook to use projects
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Custom hook to use a single project
export function useProject(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProjectById(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id, // Only run the query if we have an ID
  });
}
