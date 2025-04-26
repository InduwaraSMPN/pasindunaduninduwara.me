import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { formatDate } from '@/lib/utils'

export default async function MessagesPage() {
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

  // Get all messages
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })

  // Group messages by read status
  const unreadMessages = messages?.filter(message => !message.read) || []
  const readMessages = messages?.filter(message => message.read) || []

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Messages</h1>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          Error loading messages: {error.message}
        </div>
      )}

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Unread Messages ({unreadMessages.length})</h2>

          {unreadMessages.length === 0 ? (
            <p className="text-muted-foreground">No unread messages.</p>
          ) : (
            <div className="border rounded-md divide-y">
              {unreadMessages.map((message) => (
                <div key={message.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-medium">{message.name}</span>
                      <span className="text-muted-foreground ml-2">{message.email}</span>
                    </div>
                    <time className="text-sm text-muted-foreground">
                      {formatDate(message.created_at)}
                    </time>
                  </div>

                  <h3 className="text-lg font-medium mb-2">{message.subject}</h3>
                  <p className="mb-4 whitespace-pre-line">{message.message}</p>

                  <div className="flex justify-end gap-2">
                    <form action={`/api/messages/${message.id}/mark-read`} method="post">
                      <button
                        type="submit"
                        className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90"
                      >
                        Mark as Read
                      </button>
                    </form>

                    <form action={`/api/messages/${message.id}/delete`} method="post">
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

        <div>
          <h2 className="text-xl font-semibold mb-4">Read Messages ({readMessages.length})</h2>

          {readMessages.length === 0 ? (
            <p className="text-muted-foreground">No read messages.</p>
          ) : (
            <div className="border rounded-md divide-y">
              {readMessages.map((message) => (
                <div key={message.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-medium">{message.name}</span>
                      <span className="text-muted-foreground ml-2">{message.email}</span>
                    </div>
                    <time className="text-sm text-muted-foreground">
                      {formatDate(message.created_at)}
                    </time>
                  </div>

                  <h3 className="text-lg font-medium mb-2">{message.subject}</h3>
                  <p className="mb-4 whitespace-pre-line">{message.message}</p>

                  <div className="flex justify-end">
                    <form action={`/api/messages/${message.id}/delete`} method="post">
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
