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
			<SiteHeader showAvatar={false} activePage="none" />

			<main className="ed-shell py-16 md:py-24">
				<div className="mb-6 flex items-center gap-4">
					<span className="ed-eyebrow">Restricted</span>
					<span aria-hidden="true" className="h-px flex-1 bg-[var(--rule-strong)]" />
					<span className="ed-eyebrow">Admin</span>
				</div>

				<h1 className="ed-display-md mb-12">Sign in</h1>

				<LoginForm />
			</main>

			<SiteFooter activePage="contact" />
		</div>
	);
}
