import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import LoginForm from "@/components/auth/login-form";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { CookieOptions } from "@/types/common";

export default async function LoginPage() {
  // Check if user is already logged in
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

  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader showAvatar={false} />

      <main className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-4xl font-bold mb-8 text-center">Admin Login</h1>
          <LoginForm />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
