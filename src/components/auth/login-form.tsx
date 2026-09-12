"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Login failed");
			}

			router.push("/admin");
			router.refresh();
		} catch (error: unknown) {
			setError((error as Error).message || "An error occurred during login");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full max-w-md border border-[var(--rule-strong)] bg-card p-8">
			<div className="mb-8">
				<h2 className="font-heading text-xl font-bold tracking-[-0.028em]">Sign in</h2>
				<p className="mt-2 text-sm text-muted-foreground">
					Enter your credentials to reach the admin dashboard.
				</p>
			</div>

			<form onSubmit={handleLogin} className="flex flex-col gap-7">
				{error ? (
					<Alert variant="destructive">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				) : null}

				<div className="flex flex-col gap-2.5">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						name="email"
						type="email"
						placeholder="you@example.com"
						autoComplete="username"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>

				<div className="flex flex-col gap-2.5">
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						name="password"
						type="password"
						autoComplete="current-password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>

				<Button type="submit" size="lg" className="w-full" disabled={loading}>
					{loading ? (
						<>
							<Loader2 className="size-4 animate-spin" />
							Signing in
						</>
					) : (
						"Sign in"
					)}
				</Button>
			</form>

			<p className="ed-meta mt-8 border-t border-[var(--rule)] pt-6">
				Admin access only. Contact the site owner if you need access.
			</p>
		</div>
	);
}
