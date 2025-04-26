'use client'

import { useEffect, useState } from 'react'
import { formatDate } from '@/lib/utils'
import { Comment } from '@/types/supabase'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

interface CommentsListProps {
  postId: number
  refreshTrigger?: number
}

export default function CommentsList({ postId, refreshTrigger = 0 }: CommentsListProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true)
      setError(null)

      try {
        const supabase = createBrowserClient<Database>(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const { data, error } = await supabase
          .from('comments')
          .select('*')
          .eq('post_id', postId)
          .eq('approved', true)
          .order('created_at', { ascending: false })

        if (error) throw error

        setComments(data || [])
      } catch (error: any) {
        setError(error.message || 'An error occurred while fetching comments.')
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [postId, refreshTrigger])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (comments.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No comments yet. Be the first to comment!
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="border-b pb-6">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">{comment.name}</h4>
            <time className="text-sm text-muted-foreground">
              {formatDate(comment.created_at)}
            </time>
          </div>
          <p className="text-sm whitespace-pre-line">{comment.content}</p>
        </div>
      ))}
    </div>
  )
}
