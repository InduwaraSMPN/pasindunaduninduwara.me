"use client";

import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CommentFormProps {
	postId: string;
	onCommentSubmitted?: () => void;
}

export default function CommentForm({ postId, onCommentSubmitted }: CommentFormProps) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [content, setContent] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccess(null);
		setLoading(true);

		try {
			const response = await fetch("/api/comments/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ post_id: postId, name, email, content }),
			});
			if (!response.ok) throw new Error("Failed to submit comment");

			setSuccess("Your comment has been submitted and is awaiting approval.");
			setName("");
			setEmail("");
			setContent("");

			if (onCommentSubmitted) {
				onCommentSubmitted();
			}
		} catch (error: unknown) {
			setError((error as Error).message || "An error occurred while submitting your comment.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col gap-6 border-t border-[var(--rule-strong)] pt-8">
			<h3 className="ed-label">Leave a comment</h3>

			{error ? (
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			) : null}

			{success ? (
				<Alert className="border-[var(--signal)]/50 bg-[var(--signal)]/[0.06]">
					<CheckCircle2 className="size-4" />
					<AlertDescription>{success}</AlertDescription>
				</Alert>
			) : null}

			<form onSubmit={handleSubmit} className="flex flex-col gap-7">
				<div className="grid gap-7 sm:grid-cols-2">
					<div className="flex flex-col gap-2.5">
						<Label htmlFor="comment-name">Name</Label>
						<Input
							id="comment-name"
							name="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Your name"
							autoComplete="name"
							required
						/>
					</div>

					<div className="flex flex-col gap-2.5">
						<Label htmlFor="comment-email">Email</Label>
						<Input
							id="comment-email"
							name="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@example.com"
							autoComplete="email"
							required
						/>
					</div>
				</div>

				<div className="flex flex-col gap-2.5">
					<Label htmlFor="comment-content">Comment</Label>
					<Textarea
						id="comment-content"
						name="content"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder="Share your thoughts…"
						rows={4}
						required
					/>
				</div>

				<Button type="submit" disabled={loading} className="self-start">
					{loading ? (
						<>
							<Loader2 className="size-4 animate-spin" />
							Submitting
						</>
					) : (
						<>
							<Send className="size-4" />
							Submit comment
						</>
					)}
				</Button>
			</form>
		</div>
	);
}
