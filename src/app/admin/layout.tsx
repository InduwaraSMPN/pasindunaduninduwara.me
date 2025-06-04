import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CookieOptions } from '@/types/common'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Get the authenticated user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  console.log("Authenticated user:", user.id, user.email)

  // Check if the user is an admin
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  console.log("Profile data:", profile)
  console.log("Profile error:", error)

  if (!profile?.is_admin) {
    // User is logged in but not an admin
    console.log("Access denied: is_admin =", profile?.is_admin)
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          You do not have permission to access the admin dashboard.
        </p>
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-muted border-r p-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        <nav className="space-y-1">
          <Link
            href="/admin"
            className="block py-2 px-4 rounded-md hover:bg-primary/10"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/projects"
            className="block py-2 px-4 rounded-md hover:bg-primary/10"
          >
            Projects
          </Link>
          <Link
            href="/admin/blog"
            className="block py-2 px-4 rounded-md hover:bg-primary/10"
          >
            Blog Posts
          </Link>
          <Link
            href="/admin/comments"
            className="block py-2 px-4 rounded-md hover:bg-primary/10"
          >
            Comments
          </Link>
          <Link
            href="/admin/messages"
            className="block py-2 px-4 rounded-md hover:bg-primary/10"
          >
            Messages
          </Link>
          <Link
            href="/admin/storage"
            className="block py-2 px-4 rounded-md hover:bg-primary/10"
          >
            Storage
          </Link>
          <Link
            href="/admin/test-upload"
            className="block py-2 px-4 rounded-md hover:bg-primary/10 text-amber-600"
          >
            Test Upload
          </Link>
        </nav>
        <div className="mt-auto pt-8">
          <form action="/api/auth/signout" method="post">
            <Button type="submit" variant="outline" className="w-full">
              Sign Out
            </Button>
          </form>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">
        {children}
      </div>
    </div>
  )
}
