import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export default async function BlogPostsPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  // Get all blog posts
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Button asChild>
          <Link href="/admin/blog/new">Add New Post</Link>
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          Error loading blog posts: {error.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="bg-card rounded-lg shadow-sm border p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative w-full md:w-48 h-32 rounded-md overflow-hidden">
                  <Image
                    src={post.thumbnail || '/placeholder-image.jpg'}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-semibold">{post.title}</h2>
                    {post.published ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Published</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Draft</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                    {post.excerpt || post.content.substring(0, 150)}...
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.categories && post.categories.map((category, index) => (
                      <span key={index} className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                        {category}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground mb-4">
                    Created: {formatDate(post.created_at)} • 
                    {post.published ? ` Published: ${formatDate(post.published_at)}` : ' Not published yet'}
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/blog/${post.id}/edit`}>Edit</Link>
                    </Button>
                    {post.published ? (
                      <form action={`/api/blog/${post.id}/unpublish`} method="post">
                        <Button type="submit" variant="outline" size="sm">
                          Unpublish
                        </Button>
                      </form>
                    ) : (
                      <form action={`/api/blog/${post.id}/publish`} method="post">
                        <Button type="submit" variant="outline" size="sm">
                          Publish
                        </Button>
                      </form>
                    )}
                    <form action={`/api/blog/${post.id}/delete`} method="post">
                      <Button type="submit" variant="destructive" size="sm">
                        Delete
                      </Button>
                    </form>
                    {post.published && (
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/blog/${post.slug}`} target="_blank">View</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <h3 className="text-lg font-medium mb-2">No blog posts found</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first blog post.
            </p>
            <Button asChild>
              <Link href="/admin/blog/new">Add New Post</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
