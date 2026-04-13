import Link from "next/link";
import { Query } from "node-appwrite";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

	return (
		<div>
			<h1 className="text-3xl font-bold mb-8">Dashboard</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle>Projects</CardTitle>
						<CardDescription>Total projects in your portfolio</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">{projects.total}</div>
						<Button asChild variant="link" className="p-0 h-auto mt-2">
							<Link href="/admin/projects">Manage Projects</Link>
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle>Blog Posts</CardTitle>
						<CardDescription>Published and draft posts</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">{publishedPosts.total + draftPosts.total}</div>
						<div className="text-sm text-muted-foreground mt-1">
							{publishedPosts.total} published · {draftPosts.total} drafts
						</div>
						<Button asChild variant="link" className="p-0 h-auto mt-2">
							<Link href="/admin/blog">Manage Blog Posts</Link>
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle>Comments</CardTitle>
						<CardDescription>Pending approval</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">{pendingComments.total}</div>
						<Button asChild variant="link" className="p-0 h-auto mt-2">
							<Link href="/admin/comments">Moderate Comments</Link>
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle>Messages</CardTitle>
						<CardDescription>Unread contact messages</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">{unreadMessages.total}</div>
						<Button asChild variant="link" className="p-0 h-auto mt-2">
							<Link href="/admin/messages">View Messages</Link>
						</Button>
					</CardContent>
				</Card>
			</div>

			<div className="flex gap-4">
				<Button asChild>
					<Link href="/admin/projects/new">New Project</Link>
				</Button>
				<Button asChild>
					<Link href="/admin/blog/new">New Blog Post</Link>
				</Button>
			</div>
		</div>
	);
}
