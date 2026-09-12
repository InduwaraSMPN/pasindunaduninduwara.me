"use client";

import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/**
 * The form is set as a printed questionnaire: mono labels, fields that are
 * rules rather than boxes, and a single primary action.
 */
export default function ContactForm() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccess(null);
		setLoading(true);

		try {
			const response = await fetch("/api/messages", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, subject, message }),
			});
			if (!response.ok) throw new Error("Failed to send message");

			setSuccess("Your message has been sent. I will get back to you as soon as possible.");
			setName("");
			setEmail("");
			setSubject("");
			setMessage("");
		} catch (error: unknown) {
			setError((error as Error).message || "An error occurred while sending your message.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col gap-6">
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
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							name="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Your name"
							autoComplete="name"
							required
						/>
					</div>

					<div className="flex flex-col gap-2.5">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
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
					<Label htmlFor="subject">Subject</Label>
					<Input
						id="subject"
						name="subject"
						value={subject}
						onChange={(e) => setSubject(e.target.value)}
						placeholder="What is this about?"
						required
					/>
				</div>

				<div className="flex flex-col gap-2.5">
					<Label htmlFor="message">Message</Label>
					<Textarea
						id="message"
						name="message"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder="Tell me about your project or idea…"
						rows={5}
						required
					/>
				</div>

				<Button type="submit" size="lg" disabled={loading} className="self-start">
					{loading ? (
						<>
							<Loader2 className="size-4 animate-spin" />
							Sending
						</>
					) : (
						<>
							<Send className="size-4" />
							Send message
						</>
					)}
				</Button>
			</form>
		</div>
	);
}
