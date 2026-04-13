import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/login-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default async function LoginPage() {
	const cookieStore = await cookies();
	const session = cookieStore.get("appwrite-session")?.value;

	if (session) {
		redirect("/admin");
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

			<SiteFooter activePage="contact" />
		</div>
	);
}
