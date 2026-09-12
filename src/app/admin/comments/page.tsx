import Link from "next/link";
import { Query } from "node-appwrite";

import { AdminPageHead } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { COLLECTIONS, createServerClient, DATABASE_ID } from "@/lib/appwrite";
import { formatDate } from "@/lib/utils";

/** A quiet line for an empty moderation queue. */
function EmptyRow({ children }: { children: React.ReactNode }) {
	return <p className="ed-meta border-b border-[var(--rule)] py-6">{children}</p>;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
	return <h2 className="ed-label mb-1 border-b border-[var(--rule-strong)] pb-3">{children}</h2>;
}

export default async function CommentsPage() {
	const { databases } = createServerClient();

	const commentsResult = await databases.listDocuments(DATABASE_ID, COLLECTIONS.COMMENTS, [
		Query.orderDesc("$createdAt"),
		Query.limit(100),
	]);
	const comments = commentsResult.documents;

	// No joins in Appwrite, so build a lookup map for post titles.
	const postsResult = await databases.listDocuments(DATABASE_ID, COLLECTIONS.BLOG_POSTS, [
		Query.limit(100),
	]);
	const postMap = new Map<string, { title: string; slug: string }>(
		postsResult.documents.map((post) => [post.$id, { title: post.title, slug: post.slug }]),
	);

	const pendingComments = comments.filter((comment) => !comment.approved);
	const approvedComments = comments.filter((comment) => comment.approved);

	return (
		<div>
			<AdminPageHead
				eyebrow="Admin — Moderation"
				title="Comments"
				note={`${pendingComments.length} pending · ${approvedComments.length} approved`}
			/>

			<section>
				<SectionLabel>Pending approval ({pendingComments.length})</SectionLabel>

				{pendingComments.length === 0 ? (
					<EmptyRow>Nothing awaiting moderation.</EmptyRow>
				) : (
					<ul>
						{pendingComments.map((comment) => {
							const post = postMap.get(comment.post_id);
							return (
								<li key={comment.$id} className="border-b border-[var(--rule)] py-6">
									<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5">
										<p className="font-heading text-base font-semibold tracking-[-0.022em]">
											{comment.name}
											<span className="ed-meta ml-3 font-normal">{comment.email}</span>
										</p>
										<time className="ed-meta">{formatDate(comment.$createdAt)}</time>
									</div>

									<p className="mt-3 max-w-[70ch] whitespace-pre-line text-sm leading-relaxed">
										{comment.content}
									</p>

									<div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
										{post ? (
											<Link
												href={`/blog/${post.slug}`}
												target="_blank"
												className="ed-link ed-meta transition-colors duration-200 hover:text-[var(--signal)]"
											>
												On: {post.title}
											</Link>
										) : (
											<span className="ed-meta">Unknown post</span>
										)}

										<div className="flex flex-wrap gap-2.5">
											<form action={`/api/comments/${comment.$id}/approve`} method="post">
												<Button type="submit" size="sm">
													Approve
												</Button>
											</form>
											<form action={`/api/comments/${comment.$id}/delete`} method="post">
												<Button type="submit" variant="destructive" size="sm">
													Delete
												</Button>
											</form>
										</div>
									</div>
								</li>
							);
						})}
					</ul>
				)}
			</section>

			<section className="mt-14">
				<SectionLabel>Approved ({approvedComments.length})</SectionLabel>

				{approvedComments.length === 0 ? (
					<EmptyRow>No approved comments yet.</EmptyRow>
				) : (
					<ul>
						{approvedComments.map((comment) => {
							const post = postMap.get(comment.post_id);
							return (
								<li key={comment.$id} className="border-b border-[var(--rule)] py-6">
									<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5">
										<p className="font-heading text-base font-semibold tracking-[-0.022em]">
											{comment.name}
											<span className="ed-meta ml-3 font-normal">{comment.email}</span>
										</p>
										<time className="ed-meta">{formatDate(comment.$createdAt)}</time>
									</div>

									<p className="mt-3 max-w-[70ch] whitespace-pre-line text-sm leading-relaxed">
										{comment.content}
									</p>

									<div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
										{post ? (
											<Link
												href={`/blog/${post.slug}`}
												target="_blank"
												className="ed-link ed-meta transition-colors duration-200 hover:text-[var(--signal)]"
											>
												On: {post.title}
											</Link>
										) : (
											<span className="ed-meta">Unknown post</span>
										)}

										<form action={`/api/comments/${comment.$id}/delete`} method="post">
											<Button type="submit" variant="destructive" size="sm">
												Delete
											</Button>
										</form>
									</div>
								</li>
							);
						})}
					</ul>
				)}
			</section>
		</div>
	);
}
