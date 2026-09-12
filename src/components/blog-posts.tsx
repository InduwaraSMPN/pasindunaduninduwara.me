"use client";

import { ArrowUpRight, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { useBlogPosts } from "@/lib/blog-service";

function stripMarkdown(markdown: string): string {
	return markdown
		.replace(/^#{1,6}\s+/gm, "")
		.replace(/\*\*(.*?)\*\*/g, "$1")
		.replace(/\*(.*?)\*/g, "$1")
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
		.replace(/```[\s\S]*?```/g, "")
		.replace(/`([^`]+)`/g, "$1")
		.replace(/^>\s+/gm, "")
		.replace(/^[-*+]\s+/gm, "")
		.replace(/^\d+\.\s+/gm, "")
		.replace(/\n\s*\n/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function formatDate(value: string): string {
	return new Date(value).toLocaleDateString("en-GB", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

/**
 * Posts read as a magazine article index: hairline rules instead of cards,
 * the date and category set in mono above the headline.
 */
export default function BlogPosts() {
	const { data: posts, isLoading, isError } = useBlogPosts();

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 gap-x-12 md:grid-cols-2" aria-busy="true" aria-live="polite">
				{[1, 2].map((i) => (
					<div key={i} className="border-t border-[var(--rule-strong)] py-7">
						<span className="block h-3 w-24 animate-pulse bg-muted" />
						<span className="mt-4 block h-5 w-3/4 animate-pulse bg-muted" />
						<span className="mt-3 block h-3 w-full animate-pulse bg-muted" />
						<span className="mt-2 block h-3 w-2/3 animate-pulse bg-muted" />
					</div>
				))}
				<span className="sr-only">Loading posts</span>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="border border-destructive/60 bg-destructive/[0.06] p-6">
				<p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.18em] text-destructive">
					Error loading posts
				</p>
				<p className="mt-2 text-sm text-muted-foreground">
					Unable to load blog posts right now. Please try again later.
				</p>
			</div>
		);
	}

	if (!posts || posts.length === 0) {
		return (
			<div className="border-y border-[var(--rule-strong)] py-16 text-center">
				<FileText className="mx-auto mb-4 size-6 text-muted-foreground" />
				<p className="ed-meta">No posts published yet. Stay tuned.</p>
			</div>
		);
	}

	return (
		<StaggerContainer className="grid grid-cols-1 gap-x-12 md:grid-cols-2" staggerDelay={0.1}>
			{posts.slice(0, 4).map((post) => {
				const body = post.excerpt ? stripMarkdown(post.excerpt) : stripMarkdown(post.content);

				return (
					<StaggerItem key={post.$id} className="min-w-0">
						<Link
							href={`/blog/${post.slug}`}
							className="group flex h-full flex-col border-t border-[var(--rule-strong)] py-7"
						>
							{post.thumbnail ? (
								<div className="relative mb-5 aspect-[16/9] overflow-hidden border border-[var(--rule)]">
									<Image
										src={post.thumbnail}
										alt=""
										fill
										sizes="(max-width: 768px) 100vw, 50vw"
										className="object-cover grayscale transition-[transform,filter] duration-700 ease-out-expo group-hover:scale-[1.03] group-hover:grayscale-0"
									/>
								</div>
							) : null}

							<div className="flex items-baseline justify-between gap-4">
								<time dateTime={post.published_at ?? post.$createdAt} className="ed-meta">
									{formatDate(post.published_at ?? post.$createdAt)}
								</time>
								{post.categories[0] ? (
									<span className="ed-label shrink-0 text-[var(--signal)]">
										{post.categories[0]}
									</span>
								) : null}
							</div>

							<h3 className="mt-3 font-heading text-xl font-bold leading-snug tracking-[-0.028em] transition-colors duration-200 group-hover:text-[var(--signal)]">
								{post.title}
							</h3>

							<p className="mt-3 line-clamp-3 flex-grow text-sm leading-relaxed text-muted-foreground">
								{body.slice(0, 160)}
								{body.length > 160 ? "…" : ""}
							</p>

							<span className="ed-label mt-5 inline-flex items-center gap-1.5 text-[var(--signal)]">
								Read
								<ArrowUpRight className="size-3.5 transition-transform duration-300 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
							</span>
						</Link>
					</StaggerItem>
				);
			})}
		</StaggerContainer>
	);
}
