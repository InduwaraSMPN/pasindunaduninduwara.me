import { NextResponse } from 'next/server'
import { ID } from 'node-appwrite'
import { createServerClient, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { databases } = createServerClient()
    await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.MESSAGES,
      ID.unique(),
      {
        name: body.name,
        email: body.email,
        subject: body.subject,
        message: body.message,
        read: false,
        created_at: new Date().toISOString(),
      }
    )
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
