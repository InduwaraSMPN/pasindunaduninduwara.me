import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AdminDashboard() {
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

  // Get counts for dashboard
  const { count: projectCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })

  const { count: publishedPostCount } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true })
    .eq('published', true)

  const { count: draftPostCount } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true })
    .eq('published', false)

  const { count: pendingCommentCount } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('approved', false)

  const { count: unreadMessageCount } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('read', false)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Projects</CardTitle>
            <CardDescription>Total projects in your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{projectCount || 0}</div>
            <Button asChild variant="link" className="p-0 h-auto mt-2">
              <Link href="/admin/projects">Manage Projects</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Blog Posts</CardTitle>
            <CardDescription>Published and draft posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{(publishedPostCount || 0) + (draftPostCount || 0)}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {publishedPostCount || 0} published · {draftPostCount || 0} drafts
            </div>
            <Button asChild variant="link" className="p-0 h-auto mt-2">
              <Link href="/admin/blog">Manage Blog Posts</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Comments</CardTitle>
            <CardDescription>Pending approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingCommentCount || 0}</div>
            <Button asChild variant="link" className="p-0 h-auto mt-2">
              <Link href="/admin/comments">Moderate Comments</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Messages</CardTitle>
            <CardDescription>Unread contact messages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{unreadMessageCount || 0}</div>
            <Button asChild variant="link" className="p-0 h-auto mt-2">
              <Link href="/admin/messages">View Messages</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button asChild>
          <Link href="/admin/projects/new">New Project</Link>
        </Button>
        <Button asChild>
          <Link href="/admin/blog/new">New Blog Post</Link>
        </Button>
      </div>
    </div>
  )
}
