import { NextResponse } from 'next/server';
import { Client, Account, Users } from 'node-appwrite';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // First verify credentials using a plain client (no API key)
    const authClient = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

    const authAccount = new Account(authClient);
    const authSession = await authAccount.createEmailPasswordSession(email, password);

    // Now create a session via server SDK (with API key) to get the secret
    const serverClient = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setKey(process.env.APPWRITE_API_KEY!);

    // Delete the auth session since we only used it to verify credentials
    const users = new Users(serverClient);
    await users.deleteSession(authSession.userId, authSession.$id);

    // Create a new session that returns the secret
    const session = await users.createSession(authSession.userId);

    const response = NextResponse.json({ success: true });
    response.cookies.set('appwrite-session', session.secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error: unknown) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Login failed' },
      { status: 401 }
    );
  }
}
