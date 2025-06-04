import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { CookieOptions } from '@/types/common'

export default async function CommentsPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Get all comments with blog post info
  const { data: comments, error } = await supabase
    .from('comments')
    .select(`
      *,
      blog_posts (
        id,
        title,
        slug
      )
    `)
    .order('created_at', { ascending: false })

  // Group comments by approval status
  const pendingComments = comments?.filter(comment => !comment.approved) || []
  const approvedComments = comments?.filter(comment => comment.approved) || []

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Comments</h1>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          Error loading comments: {error.message}
        </div>
      )}

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Pending Approval ({pendingComments.length})</h2>

          {pendingComments.length === 0 ? (
            <p className="text-muted-foreground">No comments pending approval.</p>
          ) : (
            <div className="border rounded-md divide-y">
              {pendingComments.map((comment) => (
                <div key={comment.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-medium">{comment.name}</span>
                      <span className="text-muted-foreground ml-2">{comment.email}</span>
                    </div>
                    <time className="text-sm text-muted-foreground">
                      {formatDate(comment.created_at)}
                    </time>
                  </div>

                  <p className="mb-2 whitespace-pre-line">{comment.content}</p>

                  <div className="flex justify-between items-center mt-4">
                    <Link
                      href={`/blog/${comment.blog_posts.slug}`}
                      className="text-sm text-primary hover:underline"
                      target="_blank"
                    >
                      On: {comment.blog_posts.title}
                    </Link>

                    <div className="flex gap-2">
                      <form action={`/api/comments/${comment.id}/approve`} method="post">
                        <button
                          type="submit"
                          className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90"
                        >
                          Approve
                        </button>
                      </form>

                      <form action={`/api/comments/${comment.id}/delete`} method="post">
                        <button
                          type="submit"
                          className="px-3 py-1 bg-destructive text-destructive-foreground text-sm rounded-md hover:bg-destructive/90"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Approved Comments ({approvedComments.length})</h2>

          {approvedComments.length === 0 ? (
            <p className="text-muted-foreground">No approved comments.</p>
          ) : (
            <div className="border rounded-md divide-y">
              {approvedComments.map((comment) => (
                <div key={comment.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-medium">{comment.name}</span>
                      <span className="text-muted-foreground ml-2">{comment.email}</span>
                    </div>
                    <time className="text-sm text-muted-foreground">
                      {formatDate(comment.created_at)}
                    </time>
                  </div>

                  <p className="mb-2 whitespace-pre-line">{comment.content}</p>

                  <div className="flex justify-between items-center mt-4">
                    <Link
                      href={`/blog/${comment.blog_posts.slug}`}
                      className="text-sm text-primary hover:underline"
                      target="_blank"
                    >
                      On: {comment.blog_posts.title}
                    </Link>

                    <form action={`/api/comments/${comment.id}/delete`} method="post">
                      <button
                        type="submit"
                        className="px-3 py-1 bg-destructive text-destructive-foreground text-sm rounded-md hover:bg-destructive/90"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
