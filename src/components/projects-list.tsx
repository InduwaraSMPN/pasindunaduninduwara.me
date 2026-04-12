'use client'

import { useProjects } from '@/lib/project-service';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, FolderOpen } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/ui/scroll-reveal';

export default function ProjectsList({ limit = 3, isHomePage = false }: { limit?: number; isHomePage?: boolean }) {
  const { data: projects, isLoading, isError } = useProjects();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: limit }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-muted rounded-t-xl"></div>
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
          <CardTitle>Error Loading Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Unable to load projects. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted mb-4">
          <FolderOpen className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">No projects to show yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.1}>
      {projects?.slice(0, limit).map((project) => (
        <StaggerItem key={project.$id}>
          <Card className="overflow-hidden flex flex-col group">
            {project.image && (
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            )}
            <CardHeader>
              <CardTitle className="font-heading text-lg">{project.title}</CardTitle>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {isHomePage && project.tags.length > 5 ? (
                  <>
                    {project.tags.slice(0, 5).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-[10px] px-2 py-0">
                        {tag}
                      </Badge>
                    ))}
                    <Badge variant="outline" className="text-[10px] px-2 py-0 text-muted-foreground">
                      +{project.tags.length - 5}
                    </Badge>
                  </>
                ) : (
                  project.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-[10px] px-2 py-0">
                      {tag}
                    </Badge>
                  ))
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" asChild className="text-accent-warm hover:text-accent-warm hover:bg-accent-warm/10 -ml-2 font-heading">
                <Link href={`/projects/${project.$id}`}>
                  View Project
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
