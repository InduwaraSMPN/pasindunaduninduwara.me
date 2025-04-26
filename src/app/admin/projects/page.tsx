import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

export default async function ProjectsPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Get all projects
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button asChild>
          <Link href="/admin/projects/new">Add New Project</Link>
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          Error loading projects: {error.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {projects && projects.length > 0 ? (
          projects.map((project) => (
            <div key={project.id} className="bg-card rounded-lg shadow-sm border p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative w-full md:w-48 h-32 rounded-md overflow-hidden">
                  <Image
                    src={project.image || '/placeholder-image.jpg'}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
                  <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags && project.tags.map((tag, index) => (
                      <span key={index} className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground mb-4">
                    Created: {formatDate(project.created_at)} • Updated: {formatDate(project.updated_at)}
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/projects/${project.id}/edit`}>Edit</Link>
                    </Button>
                    <form action={`/api/projects/${project.id}/delete`} method="post">
                      <Button type="submit" variant="destructive" size="sm">
                        Delete
                      </Button>
                    </form>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/projects/${project.id}`} target="_blank">View</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <h3 className="text-lg font-medium mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first project.
            </p>
            <Button asChild>
              <Link href="/admin/projects/new">Add New Project</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
