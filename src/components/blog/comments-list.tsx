"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatDate } from "@/lib/utils";
import type { Comment } from "@/types/appwrite";

interface CommentsListProps {
	postId: string;
	refreshTrigger?: number;
}

export default function CommentsList({
	postId,
	refreshTrigger: _refreshTrigger = 0,
}: CommentsListProps) {
	const [comments, setComments] = useState<Comment[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchComments = async () => {
			setLoading(true);
			setError(null);

			try {
				const response = await fetch(`/api/comments?postId=${postId}`);
				if (!response.ok) throw new Error("Failed to fetch comments");
				const data = await response.json();
				setComments(data as Comment[]);
			} catch (error: unknown) {
				setError((error as Error).message || "An error occurred while fetching comments.");
			} finally {
				setLoading(false);
			}
		};

		fetchComments();
	}, [postId]);

	if (loading) {
		return (
			<div aria-busy="true" aria-live="polite">
				{[1, 2].map((i) => (
					<div key={i} className="border-b border-[var(--rule)] py-5">
						<div className="flex items-baseline justify-between gap-4">
							<span className="h-3 w-28 animate-pulse bg-muted" />
							<span className="h-3 w-20 animate-pulse bg-muted" />
						</div>
						<span className="mt-3 block h-3 w-full animate-pulse bg-muted" />
						<span className="mt-2 block h-3 w-2/3 animate-pulse bg-muted" />
					</div>
				))}
				<span className="sr-only">Loading comments</span>
			</div>
		);
	}

	if (error) {
		return (
			<Alert variant="destructive">
				<AlertDescription>{error}</AlertDescription>
			</Alert>
		);
	}

	if (comments.length === 0) {
		return (
			<div className="border-y border-[var(--rule-strong)] py-12 text-center">
				<MessageCircle className="mx-auto mb-3.5 size-5 text-muted-foreground" />
				<p className="ed-meta">No comments yet. Be the first to share your thoughts.</p>
			</div>
		);
	}

	return (
		<ul className="border-t border-[var(--rule-strong)]">
			{comments.map((comment) => (
				<li key={comment.$id} className="border-b border-[var(--rule)] py-5">
					<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
						<h4 className="font-heading text-sm font-semibold tracking-[-0.02em]">
							{comment.name}
						</h4>
						<time dateTime={comment.created_at} className="ed-meta">
							{formatDate(comment.created_at)}
						</time>
					</div>
					<p className="mt-2.5 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
						{comment.content}
					</p>
				</li>
			))}
		</ul>
	);
}
