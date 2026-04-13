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
			<div className="space-y-4">
				{[1, 2].map((i) => (
					<div key={i} className="animate-pulse p-4 rounded-xl bg-muted/50">
						<div className="flex justify-between items-center mb-3">
							<div className="h-4 bg-muted rounded w-24" />
							<div className="h-3 bg-muted rounded w-20" />
						</div>
						<div className="space-y-2">
							<div className="h-3 bg-muted rounded w-full" />
							<div className="h-3 bg-muted rounded w-3/4" />
						</div>
					</div>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
				<AlertDescription>{error}</AlertDescription>
			</Alert>
		);
	}

	if (comments.length === 0) {
		return (
			<div className="py-10 text-center">
				<div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
					<MessageCircle className="h-5 w-5 text-muted-foreground" />
				</div>
				<p className="text-sm text-muted-foreground">
					No comments yet. Be the first to share your thoughts!
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{comments.map((comment) => (
				<div key={comment.$id} className="p-4 rounded-xl bg-muted/30 border border-border/50">
					<div className="flex justify-between items-center mb-2">
						<h4 className="font-heading font-medium text-sm">{comment.name}</h4>
						<time className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</time>
					</div>
					<p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
						{comment.content}
					</p>
				</div>
			))}
		</div>
	);
}
