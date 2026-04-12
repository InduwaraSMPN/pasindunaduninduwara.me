import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createSessionClient, createServerClient, isAdmin, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const cookieStore = await cookies()
    const session = cookieStore.get('appwrite-session')?.value
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { account } = createSessionClient(session)
    const user = await account.get()
    const admin = await isAdmin(user.$id)
    if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const data = {
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt || null,
      thumbnail: body.thumbnail || null,
      categories: body.categories || [],
      published: body.published || false,
      published_at: body.published_at || null,
      updated_at: new Date().toISOString(),
    }
    const { databases } = createServerClient()
    await databases.updateDocument(DATABASE_ID, COLLECTIONS.BLOG_POSTS, id, data)
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
