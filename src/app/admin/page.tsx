import Link from "next/link";
import { Query } from "node-appwrite";

import { AdminPageHead, AdminStat } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { COLLECTIONS, createServerClient, DATABASE_ID } from "@/lib/appwrite";

export default async function AdminDashboard() {
	const { databases } = createServerClient();

	const projects = await databases.listDocuments(DATABASE_ID, COLLECTIONS.PROJECTS, [
		Query.limit(1),
	]);
	const publishedPosts = await databases.listDocuments(DATABASE_ID, COLLECTIONS.BLOG_POSTS, [
		Query.equal("published", true),
		Query.limit(1),
	]);
	const draftPosts = await databases.listDocuments(DATABASE_ID, COLLECTIONS.BLOG_POSTS, [
		Query.equal("published", false),
		Query.limit(1),
	]);
	const pendingComments = await databases.listDocuments(DATABASE_ID, COLLECTIONS.COMMENTS, [
		Query.equal("approved", false),
		Query.limit(1),
	]);
	const unreadMessages = await databases.listDocuments(DATABASE_ID, COLLECTIONS.MESSAGES, [
		Query.equal("read", false),
		Query.limit(1),
	]);

	const stats = [
		{
			num: "01",
			label: "Projects",
			value: projects.total,
			note: "In the portfolio index",
			href: "/admin/projects",
			alert: false,
		},
		{
			num: "02",
			label: "Blog posts",
			value: publishedPosts.total + draftPosts.total,
			note: `${publishedPosts.total} published · ${draftPosts.total} draft`,
			href: "/admin/blog",
			alert: false,
		},
		{
			num: "03",
			label: "Comments",
			value: pendingComments.total,
			note: pendingComments.total > 0 ? "Awaiting moderation" : "Nothing awaiting approval",
			href: "/admin/comments",
			alert: pendingComments.total > 0,
		},
		{
			num: "04",
			label: "Messages",
			value: unreadMessages.total,
			note: unreadMessages.total > 0 ? "Unread enquiries" : "Inbox clear",
			href: "/admin/messages",
			alert: unreadMessages.total > 0,
		},
	];

	return (
		<div>
			<AdminPageHead
				eyebrow="Admin — Overview"
				title="Dashboard"
				note="Live counts"
				action={
					<>
						<Button asChild variant="outline">
							<Link href="/admin/blog/new">New post</Link>
						</Button>
						<Button asChild>
							<Link href="/admin/projects/new">New project</Link>
						</Button>
					</>
				}
			/>

			<div className="grid gap-px border border-[var(--rule-strong)] bg-[var(--rule)] sm:grid-cols-2 xl:grid-cols-4">
				{stats.map((stat) => (
					<AdminStat
						key={stat.num}
						num={stat.num}
						label={stat.label}
						value={stat.value}
						note={stat.note}
						href={stat.href}
						alert={stat.alert}
					/>
				))}
			</div>

			{/* Session note — a quiet reminder of what this console governs. */}
			<div className="mt-10 border-t border-[var(--rule)] pt-6">
				<p className="ed-meta max-w-[70ch] leading-relaxed">
					Everything here writes straight to the live Appwrite database and storage bucket. Project
					and post changes are visible on the public site the moment they are saved.
				</p>
			</div>
		</div>
	);
}
