import { createServerClient, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite'
import { Query } from 'node-appwrite'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default async function CommentsPage() {
  const { databases } = createServerClient()

  // Fetch all comments
  const commentsResult = await databases.listDocuments(DATABASE_ID, COLLECTIONS.COMMENTS, [
    Query.orderDesc('$createdAt'),
    Query.limit(100),
  ])
  const comments = commentsResult.documents

  // Fetch all blog posts to build a lookup map (no joins in Appwrite)
  const postsResult = await databases.listDocuments(DATABASE_ID, COLLECTIONS.BLOG_POSTS, [
    Query.limit(100),
  ])
  const postMap = new Map<string, { title: string; slug: string }>(
    postsResult.documents.map((post) => [post.$id, { title: post.title, slug: post.slug }])
  )

  // Group comments by approval status
  const pendingComments = comments.filter(comment => !comment.approved)
  const approvedComments = comments.filter(comment => comment.approved)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Comments</h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Pending Approval ({pendingComments.length})</h2>

          {pendingComments.length === 0 ? (
            <p className="text-muted-foreground">No comments pending approval.</p>
          ) : (
            <div className="border rounded-md divide-y">
              {pendingComments.map((comment) => {
                const post = postMap.get(comment.post_id)
                return (
                  <div key={comment.$id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-medium">{comment.name}</span>
                        <span className="text-muted-foreground ml-2">{comment.email}</span>
                      </div>
                      <time className="text-sm text-muted-foreground">
                        {formatDate(comment.$createdAt)}
                      </time>
                    </div>

                    <p className="mb-2 whitespace-pre-line">{comment.content}</p>

                    <div className="flex justify-between items-center mt-4">
                      {post ? (
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-sm text-primary hover:underline"
                          target="_blank"
                        >
                          On: {post.title}
                        </Link>
                      ) : (
                        <span className="text-sm text-muted-foreground">Unknown post</span>
                      )}

                      <div className="flex gap-2">
                        <form action={`/api/comments/${comment.$id}/approve`} method="post">
                          <button
                            type="submit"
                            className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90"
                          >
                            Approve
                          </button>
                        </form>

                        <form action={`/api/comments/${comment.$id}/delete`} method="post">
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
                )
              })}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Approved Comments ({approvedComments.length})</h2>

          {approvedComments.length === 0 ? (
            <p className="text-muted-foreground">No approved comments.</p>
          ) : (
            <div className="border rounded-md divide-y">
              {approvedComments.map((comment) => {
                const post = postMap.get(comment.post_id)
                return (
                  <div key={comment.$id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-medium">{comment.name}</span>
                        <span className="text-muted-foreground ml-2">{comment.email}</span>
                      </div>
                      <time className="text-sm text-muted-foreground">
                        {formatDate(comment.$createdAt)}
                      </time>
                    </div>

                    <p className="mb-2 whitespace-pre-line">{comment.content}</p>

                    <div className="flex justify-between items-center mt-4">
                      {post ? (
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-sm text-primary hover:underline"
                          target="_blank"
                        >
                          On: {post.title}
                        </Link>
                      ) : (
                        <span className="text-sm text-muted-foreground">Unknown post</span>
                      )}

                      <form action={`/api/comments/${comment.$id}/delete`} method="post">
                        <button
                          type="submit"
                          className="px-3 py-1 bg-destructive text-destructive-foreground text-sm rounded-md hover:bg-destructive/90"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
