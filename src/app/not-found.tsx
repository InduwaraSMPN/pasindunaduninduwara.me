import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<div className="flex min-h-screen flex-col bg-background">
			<SiteHeader showAvatar={false} activePage="none" />

			<main className="ed-shell flex flex-1 flex-col justify-center py-20">
				<div className="mb-6 flex items-center gap-4">
					<span className="ed-eyebrow">Error</span>
					<span aria-hidden="true" className="h-px flex-1 bg-[var(--rule-strong)]" />
					<span className="ed-eyebrow">HTTP 404</span>
				</div>

				<p className="ed-display text-[clamp(5.5rem,24vw,16rem)] leading-[0.82] tracking-[-0.06em]">
					404
				</p>

				<div className="mt-12 grid gap-8 border-t border-[var(--rule-strong)] pt-8 md:grid-cols-2 md:gap-16">
					<h1 className="ed-display-md">
						Page not <span className="ed-accent">found.</span>
					</h1>

					<div>
						<p className="max-w-[42ch] text-muted-foreground">
							The page you are looking for does not exist or has been moved. The links below should
							get you back on track.
						</p>
						<div className="mt-7 flex flex-wrap gap-2.5">
							<Button asChild>
								<Link href="/">
									<ArrowLeft className="size-4" />
									Return home
								</Link>
							</Button>
							<Button asChild variant="outline">
								<Link href="/projects">Browse projects</Link>
							</Button>
						</div>
					</div>
				</div>
			</main>

			<SiteFooter />
		</div>
	);
}
