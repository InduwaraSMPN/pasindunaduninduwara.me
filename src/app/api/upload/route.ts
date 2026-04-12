import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSessionClient, createServerClient, isAdmin, BUCKET_ID, getFileUrl } from '@/lib/appwrite'
import { ID } from 'node-appwrite'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('appwrite-session')?.value

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { account } = createSessionClient(session)
    const user = await account.get()
    const admin = await isAdmin(user.$id)

    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }

    const { storage } = createServerClient()

    const result = await storage.createFile(BUCKET_ID, ID.unique(), file)
    const publicUrl = getFileUrl(result.$id)

    return NextResponse.json({ success: true, publicUrl })
  } catch (error: unknown) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
