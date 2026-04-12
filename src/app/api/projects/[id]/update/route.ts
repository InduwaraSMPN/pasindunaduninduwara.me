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
      description: body.description,
      full_description: body.full_description || null,
      image: body.image || '',
      tags: body.tags || [],
      updated_at: new Date().toISOString(),
    }
    const { databases } = createServerClient()
    await databases.updateDocument(DATABASE_ID, COLLECTIONS.PROJECTS, id, data)
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
