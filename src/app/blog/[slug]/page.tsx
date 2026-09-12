import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Query } from "node-appwrite";
import CommentForm from "@/components/blog/comment-form";
import CommentsList from "@/components/blog/comments-list";
import MarkdownPreviewComponent from "@/components/blog/markdown-preview";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { MaskedLines, Rule } from "@/components/ui/scroll-reveal";
import { COLLECTIONS, createServerClient, DATABASE_ID } from "@/lib/appwrite";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types/appwrite";

async function getPost(slug: string): Promise<BlogPost | undefined> {
	try {
		const { databases } = createServerClient();
		const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.BLOG_POSTS, [
			Query.equal("slug", slug),
			Query.equal("published", true),
			Query.limit(1),
		]);
		return result.documents[0] as unknown as BlogPost | undefined;
	} catch (error) {
		console.error("Error fetching blog post:", error);
		return undefined;
	}
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const post = await getPost(slug);

	if (!post) return { title: "Post not found" };

	return {
		title: `${post.title} — Pasindu Nadun Induwara`,
		description: post.excerpt,
	};
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const post = await getPost(slug);

	if (!post) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-background">
			<SiteHeader showAvatar={false} activePage="blog" />

			<main>
				<header className="ed-shell pt-8 md:pt-12">
					<Link
						href="/blog"
						className="ed-meta ed-link inline-flex items-center gap-2 transition-colors duration-200 hover:text-foreground"
					>
						<ArrowLeft className="size-3.5" />
						Back to writing
					</Link>

					<div className="mt-8 mb-6 flex items-center gap-4">
						<span className="ed-eyebrow">{post.categories[0] ?? "Note"}</span>
						<span aria-hidden="true" className="h-px flex-1 bg-[var(--rule-strong)]" />
						<time
							dateTime={post.published_at ?? undefined}
							className="ed-eyebrow whitespace-nowrap"
						>
							{formatDate(post.published_at ?? post.$createdAt)}
						</time>
					</div>

					<h1 className="ed-display max-w-[20ch]">
						<MaskedLines lines={[post.title]} />
					</h1>

					{post.categories.length > 0 ? (
						<div className="mt-8 flex flex-wrap gap-1.5 border-t border-[var(--rule-strong)] pt-6">
							{post.categories.map((category) => (
								<Badge key={category} variant="secondary">
									{category}
								</Badge>
							))}
						</div>
					) : null}
				</header>

				{post.thumbnail ? (
					<div className="ed-shell mt-12">
						<figure className="ed-figure group">
							<div className="relative aspect-[16/9] overflow-hidden border border-[var(--rule)]">
								<Image
									src={post.thumbnail}
									alt={post.title}
									fill
									sizes="(max-width: 1240px) 100vw, 1240px"
									className="object-cover grayscale transition-[filter] duration-700 ease-out-expo group-hover:grayscale-0"
									priority
								/>
							</div>
							<figcaption className="mt-3.5 flex items-baseline justify-between gap-3">
								<span className="ed-label">Fig. 01 — {post.title}</span>
								<span className="ed-label">Cover</span>
							</figcaption>
						</figure>
					</div>
				) : null}

				<div className="ed-shell mt-12">
					<Rule />
				</div>

				<section className="ed-shell py-12 md:py-16">
					<div className="max-w-[68ch]">
						<MarkdownPreviewComponent content={post.content} />
					</div>
				</section>

				<section className="ed-shell pb-16">
					<div className="max-w-[68ch]">
						<h2 className="ed-display-md mb-8 border-t border-[var(--rule-strong)] pt-8">
							Comments
						</h2>
						<CommentsList postId={post.$id} />
						<div className="mt-10">
							<CommentForm postId={post.$id} />
						</div>
					</div>
				</section>
			</main>

			<SiteFooter activePage="blog" />
		</div>
	);
}
