import Link from "next/link";
import { Query } from "node-appwrite";

import { AdminEmpty, AdminPageHead, AdminThumb, StatusMark } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { COLLECTIONS, createServerClient, DATABASE_ID } from "@/lib/appwrite";
import { formatDate } from "@/lib/utils";

export default async function BlogPostsPage() {
	const { databases } = createServerClient();

	const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.BLOG_POSTS, [
		Query.orderDesc("$createdAt"),
		Query.limit(100),
	]);
	const posts = result.documents;

	const publishedCount = posts.filter((post) => post.published).length;

	return (
		<div>
			<AdminPageHead
				eyebrow="Admin — Content"
				title="Blog"
				note={`${publishedCount} live · ${posts.length - publishedCount} draft`}
				action={
					<Button asChild>
						<Link href="/admin/blog/new">Add post</Link>
					</Button>
				}
			/>

			{posts.length === 0 ? (
				<AdminEmpty
					title="No posts yet"
					body="Drafts stay hidden until you publish them. Write the first post to get started."
					action={
						<Button asChild>
							<Link href="/admin/blog/new">Add post</Link>
						</Button>
					}
				/>
			) : (
				<ol className="border-t border-[var(--rule-strong)]">
					{posts.map((post, i) => (
						<li key={post.$id} className="border-b border-[var(--rule)] py-6">
							<div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-[8.5rem_minmax(0,1fr)]">
								<AdminThumb src={post.thumbnail} alt={post.title} />

								<div className="flex min-w-0 flex-col gap-3">
									<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
										<h2 className="font-heading text-lg font-semibold tracking-[-0.024em]">
											<span className="ed-sec-num mr-3 align-middle">
												{String(i + 1).padStart(2, "0")}
											</span>
											{post.title}
										</h2>
										<StatusMark tone={post.published ? "ink" : "muted"}>
											{post.published ? "Published" : "Draft"}
										</StatusMark>
									</div>

									<p className="line-clamp-2 max-w-[72ch] text-sm leading-relaxed text-muted-foreground">
										{post.excerpt || `${post.content.substring(0, 150)}…`}
									</p>

									{post.categories?.length ? (
										<ul className="flex flex-wrap gap-1.5">
											{post.categories.map((category: string) => (
												<li
													key={category}
													className="ed-label border border-[var(--rule-strong)] px-2 py-1"
												>
													{category}
												</li>
											))}
										</ul>
									) : null}

									<div className="flex flex-wrap items-center gap-2.5 pt-1">
										<Button asChild variant="outline" size="sm">
											<Link href={`/admin/blog/${post.$id}/edit`}>Edit</Link>
										</Button>

										{post.published ? (
											<form action={`/api/blog/${post.$id}/unpublish`} method="post">
												<Button type="submit" variant="outline" size="sm">
													Unpublish
												</Button>
											</form>
										) : (
											<form action={`/api/blog/${post.$id}/publish`} method="post">
												<Button type="submit" variant="outline" size="sm">
													Publish
												</Button>
											</form>
										)}

										{post.published ? (
											<Button asChild variant="ghost" size="sm">
												<Link href={`/blog/${post.slug}`} target="_blank">
													View
												</Link>
											</Button>
										) : null}

										<form action={`/api/blog/${post.$id}/delete`} method="post">
											<Button type="submit" variant="destructive" size="sm">
												Delete
											</Button>
										</form>
									</div>

									<p className="ed-meta">
										Created {formatDate(post.$createdAt)}
										{post.published
											? ` · Published ${formatDate(post.published_at)}`
											: " · Not published"}
									</p>
								</div>
							</div>
						</li>
					))}
				</ol>
			)}
		</div>
	);
}
