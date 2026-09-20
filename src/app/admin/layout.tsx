import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";
import { createSessionClient, isAdmin } from "@/lib/appwrite";

export const metadata = {
	title: "Admin — Pasindu Nadun Induwara",
	robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	const cookieStore = await cookies();
	const session = cookieStore.get("appwrite-session")?.value;

	if (!session) redirect("/login");

	let user:
		| Awaited<ReturnType<ReturnType<typeof createSessionClient>["account"]["get"]>>
		| undefined;
	try {
		const { account } = createSessionClient(session);
		user = await account.get();
	} catch {
		redirect("/login");
	}

	const admin = await isAdmin(user.$id);
	if (!admin) {
		return (
			<div className="grid min-h-screen place-items-center bg-background px-6">
				<div className="w-full max-w-md border-t-2 border-[var(--signal)] pt-8">
					<p className="ed-eyebrow">Admin — Restricted</p>
					<h1 className="ed-display-md mt-5">Access denied</h1>
					<p className="mt-5 text-sm leading-relaxed text-muted-foreground">
						This account does not have permission to open the admin console. If you believe this is
						a mistake, sign in with an administrator account.
					</p>
					<div className="mt-8 flex flex-wrap gap-2.5">
						<Button asChild>
							<Link href="/">Return home</Link>
						</Button>
						<Button asChild variant="outline">
							<Link href="/login">Sign in</Link>
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="ed-shell grid grid-cols-1 gap-x-14 gap-y-10 py-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:py-12">
				{/* Sidebar — identity, index, session controls. `min-w-0` matters:
				    the index is a horizontal scroller on small screens, and
				    without it the scroller's min-content width would size the
				    whole column and push the page past the viewport. */}
				<aside className="min-w-0 lg:sticky lg:top-12 lg:h-fit">
					<Link href="/" className="group block leading-none">
						<span className="block font-heading text-[0.9375rem] font-bold tracking-[-0.03em] group-hover:text-[var(--signal)]">
							Pasindu Nadun Induwara
						</span>
						<span className="ed-label mt-1.5 block">Admin console</span>
					</Link>

					<div className="mt-8">
						<p className="ed-label mb-3">Index</p>
						<AdminNav />
					</div>

					<div className="mt-8 flex flex-col gap-3 border-t border-[var(--rule)] pt-6">
						<p className="ed-label truncate" title={user.email}>
							{user.email}
						</p>
						<form action="/api/auth/signout" method="post">
							<Button type="submit" variant="outline" size="sm" className="w-full">
								Sign out
							</Button>
						</form>
						<Link
							href="/"
							className="ed-link ed-meta w-fit transition-colors duration-200 hover:text-[var(--signal)]"
						>
							← View public site
						</Link>
					</div>
				</aside>

				{/* Content */}
				<main className="min-w-0">{children}</main>
			</div>
		</div>
	);
}
