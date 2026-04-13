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
		<div className="space-y-4">
			<h3 className="text-lg font-heading font-semibold">Leave a Comment</h3>

			{error && (
				<Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{success && (
				<Alert className="border-accent-warm/30 bg-accent-warm/5">
					<CheckCircle2 className="h-4 w-4 text-accent-warm" />
					<AlertDescription className="text-accent-warm">{success}</AlertDescription>
				</Alert>
			)}

			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="comment-name" className="text-sm font-medium">
							Name
						</Label>
						<Input
							id="comment-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Your name"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="comment-email" className="text-sm font-medium">
							Email
						</Label>
						<Input
							id="comment-email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@example.com"
							required
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="comment-content" className="text-sm font-medium">
						Comment
					</Label>
					<Textarea
						id="comment-content"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder="Share your thoughts..."
						rows={4}
						required
						className="resize-none"
					/>
				</div>

				<Button
					type="submit"
					disabled={loading}
					className="bg-accent-warm text-accent-warm-foreground hover:bg-accent-warm/90 font-heading font-semibold"
				>
					{loading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Submitting...
						</>
					) : (
						<>
							<Send className="mr-2 h-4 w-4" />
							Submit Comment
						</>
					)}
				</Button>
			</form>
		</div>
	);
}
